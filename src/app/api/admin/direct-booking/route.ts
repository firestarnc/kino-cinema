import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminCredentials,
  isAdminConfigured,
  isValidAdminSessionToken,
} from "@/lib/admin-auth";
import { sendBookingConfirmationEmail } from "@/lib/booking-email";
import {
  createAdminDirectBooking,
  hasPaidBookingForSlot,
  isSlotBlockedByAdmin,
} from "@/lib/private-booking-db";
import {
  applyRoseDecorationCharge,
  getMoviePackageTitleById,
  getMoviePackageTotal,
  getPackageById,
  getPackagesForBookingType,
  getValidTimeSlotsForDate,
  isElapsedTimeSlot,
  isPastBookingDate,
  isValidISOBookingDate,
  MOVIE_PACKAGE_MAX_EXTRA_GUESTS,
  type BookingType,
  type PrivatePackageId,
  type TimeSlotId,
} from "@/lib/private-booking";

interface DirectBookingPayload {
  bookingType?: BookingType;
  filmId?: string;
  filmTitle?: string;
  contentTitleId?: string;
  skipTitleSelection?: boolean;
  packageId: PrivatePackageId;
  additionalGuests?: number;
  includeRoseDecoration?: boolean;
  bookingDate: string;
  timeSlot: TimeSlotId;
  fullName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
}

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function ensureAdminSession(request: NextRequest): NextResponse | null {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 500 });
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionToken(sessionToken)) {
    return unauthorizedResponse();
  }

  return null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBookingType(bookingType: unknown): bookingType is BookingType {
  return bookingType === "blockbuster" || bookingType === "movie-package";
}

function isValidPayload(payload: Partial<DirectBookingPayload>): payload is DirectBookingPayload {
  const bookingType = payload.bookingType ?? "blockbuster";

  if (!isValidBookingType(bookingType)) return false;
  if (!payload.packageId || !getPackagesForBookingType(bookingType).some((pkg) => pkg.id === payload.packageId)) return false;
  if (!payload.bookingDate || !isValidISOBookingDate(payload.bookingDate) || isPastBookingDate(payload.bookingDate)) return false;
  if (!payload.timeSlot || !getValidTimeSlotsForDate(payload.bookingDate).some((slot) => slot.id === payload.timeSlot)) return false;
  if (!payload.fullName || payload.fullName.trim().length < 2) return false;
  if (!payload.email || !isValidEmail(payload.email)) return false;
  if (!payload.phoneNumber || payload.phoneNumber.trim().length < 8) return false;
  if (typeof payload.includeRoseDecoration !== "undefined" && typeof payload.includeRoseDecoration !== "boolean") return false;

  if (bookingType === "blockbuster" && !payload.skipTitleSelection && !payload.filmTitle) return false;

  if (bookingType === "movie-package") {
    if (!payload.skipTitleSelection && (!payload.contentTitleId || !getMoviePackageTitleById(payload.contentTitleId))) return false;
    if (!Number.isInteger(payload.additionalGuests ?? 0)) return false;
    if ((payload.additionalGuests ?? 0) < 0 || (payload.additionalGuests ?? 0) > MOVIE_PACKAGE_MAX_EXTRA_GUESTS) return false;
    if (payload.packageId !== "standard" && (payload.additionalGuests ?? 0) !== 0) return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  const body = (await request.json()) as Partial<DirectBookingPayload>;

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid booking payload" }, { status: 400 });
  }

  const bookingType = body.bookingType ?? "blockbuster";
  const bookingPackage = getPackageById(body.packageId, bookingType);
  const contentTitle = bookingType === "movie-package" ? getMoviePackageTitleById(body.contentTitleId ?? "") : null;
  const additionalGuests = bookingType === "movie-package" && body.packageId === "standard"
    ? body.additionalGuests ?? 0
    : 0;
  const includeRoseDecoration = body.includeRoseDecoration ?? false;
  const baseAmountNaira = bookingType === "movie-package" && body.packageId === "standard"
    ? getMoviePackageTotal("standard", additionalGuests)
    : bookingPackage.priceNaira;
  const amountNaira = applyRoseDecorationCharge(baseAmountNaira, includeRoseDecoration);

  try {
    if (isElapsedTimeSlot(body.bookingDate, body.timeSlot)) {
      return NextResponse.json({ error: "This slot has already elapsed." }, { status: 409 });
    }

    const [hasPaidBooking, isSlotBlocked] = await Promise.all([
      hasPaidBookingForSlot(body.bookingDate, body.timeSlot),
      isSlotBlockedByAdmin(body.bookingDate, body.timeSlot),
    ]);

    if (hasPaidBooking || isSlotBlocked) {
      return NextResponse.json({ error: "This slot is no longer available." }, { status: 409 });
    }

    const reference = `admin_direct_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const adminUsername = getAdminCredentials().username ?? "admin";

    const { booking, error } = await createAdminDirectBooking({
      booking_type: bookingType,
      film_id: bookingType === "blockbuster" ? (body.filmId ?? null) : null,
      film_title: bookingType === "blockbuster" ? (body.filmTitle ?? null) : null,
      content_platform: contentTitle?.platform ?? null,
      content_title: contentTitle?.title ?? null,
      package_id: bookingPackage.id,
      package_name: bookingPackage.name,
      package_price_ngn: amountNaira,
      additional_guests: additionalGuests,
      include_rose_decoration: includeRoseDecoration,
      booking_date: body.bookingDate,
      time_slot: body.timeSlot,
      full_name: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      phone_number: body.phoneNumber.trim(),
      notes: body.notes?.trim() || null,
      status: "paid",
      payment_source: "admin_direct",
      paystack_reference: reference,
      paid_at: new Date().toISOString(),
      confirmation_email_sent_at: null,
      created_by_admin: adminUsername,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "This slot is no longer available." }, { status: 409 });
      }
      return NextResponse.json({ error: "Unable to create direct booking" }, { status: 500 });
    }

    if (booking) {
      try {
        await sendBookingConfirmationEmail(booking);
      } catch (sendError) {
        console.error("[admin-direct-booking] Failed to send confirmation email", {
          reference,
          sendError,
        });
        return NextResponse.json({ error: "Booking created but confirmation email failed" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch {
    return NextResponse.json({ error: "Unable to create direct booking" }, { status: 500 });
  }
}
