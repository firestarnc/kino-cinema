import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  applyRoseDecorationCharge,
  getMoviePackageTitleById,
  getMoviePackageTotal,
  getPackageById,
  getPackagesForBookingType,
  getValidTimeSlotsForDate,
  isElapsedTimeSlot,
  isValidISOBookingDate,
  isPastBookingDate,
  MOVIE_PACKAGE_MAX_EXTRA_GUESTS,
  type BookingType,
  type PrivatePackageId,
  type TimeSlotId,
} from "@/lib/private-booking";
import { hasPaidBookingForSlot, isSlotBlockedByAdmin } from "@/lib/private-booking-db";
import { getPaystackPublicKey } from "@/lib/paystack-config";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

interface InitiateBookingPayload {
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBookingType(bookingType: unknown): bookingType is BookingType {
  return bookingType === "blockbuster" || bookingType === "movie-package";
}

function isValidPayload(payload: Partial<InitiateBookingPayload>): payload is InitiateBookingPayload {
  const bookingType = payload.bookingType ?? "blockbuster";

  if (!isValidBookingType(bookingType)) return false;
  if (!payload.packageId || !getPackagesForBookingType(bookingType).some((pkg) => pkg.id === payload.packageId)) return false;
  if (!payload.bookingDate || !isValidISOBookingDate(payload.bookingDate) || isPastBookingDate(payload.bookingDate)) return false;
  if (!payload.timeSlot || !getValidTimeSlotsForDate(payload.bookingDate).some((slot) => slot.id === payload.timeSlot)) return false;
  if (!payload.fullName || payload.fullName.trim().length < 2) return false;
  if (!payload.email || !isValidEmail(payload.email)) return false;
  if (!payload.phoneNumber || payload.phoneNumber.trim().length < 8) return false;
  if (typeof payload.includeRoseDecoration !== "undefined" && typeof payload.includeRoseDecoration !== "boolean") {
    return false;
  }
  if (bookingType === "blockbuster" && !payload.skipTitleSelection && (!payload.filmId || !payload.filmTitle)) return false;
  if (bookingType === "movie-package") {
    if (!payload.skipTitleSelection && (!payload.contentTitleId || !getMoviePackageTitleById(payload.contentTitleId))) return false;
    if (!Number.isInteger(payload.additionalGuests ?? 0)) return false;
    if ((payload.additionalGuests ?? 0) < 0 || (payload.additionalGuests ?? 0) > MOVIE_PACKAGE_MAX_EXTRA_GUESTS) return false;
    if (payload.packageId !== "standard" && (payload.additionalGuests ?? 0) !== 0) return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<InitiateBookingPayload>;

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid booking payload" }, { status: 400 });
  }

  const bookingType = body.bookingType ?? "blockbuster";
  const bookingPackage = getPackageById(body.packageId, bookingType);
  const shouldPersistMoviePackageTitle = bookingType === "movie-package" && !body.skipTitleSelection;
  const contentTitle = shouldPersistMoviePackageTitle ? getMoviePackageTitleById(body.contentTitleId ?? "") : null;
  const additionalGuests = bookingType === "movie-package" && body.packageId === "standard"
    ? body.additionalGuests ?? 0
    : 0;
  const includeRoseDecoration = body.includeRoseDecoration ?? false;
  const baseAmountNaira = bookingType === "movie-package" && body.packageId === "standard"
    ? getMoviePackageTotal("standard", additionalGuests)
    : bookingPackage.priceNaira;
  const amountNaira = applyRoseDecorationCharge(baseAmountNaira, includeRoseDecoration);
  const paystackPublicKey = getPaystackPublicKey();

  if (!paystackPublicKey) {
    return NextResponse.json({ error: "Missing Paystack public key" }, { status: 500 });
  }

  const reference = `kino_${Date.now()}_${randomUUID().slice(0, 8)}`;

  try {
    const supabase = getSupabaseAdminClient();

    if (isElapsedTimeSlot(body.bookingDate, body.timeSlot)) {
      return NextResponse.json({ error: "This slot has already elapsed." }, { status: 409 });
    }

    const [hasPaidBooking, isManuallyBlocked] = await Promise.all([
      hasPaidBookingForSlot(body.bookingDate, body.timeSlot),
      isSlotBlockedByAdmin(body.bookingDate, body.timeSlot),
    ]);

    if (hasPaidBooking || isManuallyBlocked) {
      return NextResponse.json({ error: "This slot is no longer available." }, { status: 409 });
    }

    const { error } = await supabase.from("private_bookings").insert({
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
      status: "pending_payment",
      paystack_reference: reference,
    });

    if (error) {
      return NextResponse.json({ error: "Unable to create pending booking" }, { status: 500 });
    }

    // Pending/failed bookings are tracked in the admin dashboard only.
    // Admin email notifications are sent only after successful payment.

    return NextResponse.json({
      reference,
      amountNaira,
      email: body.email.trim().toLowerCase(),
      publicKey: paystackPublicKey,
    });
  } catch {
    return NextResponse.json({ error: "Unable to start booking" }, { status: 500 });
  }
}
