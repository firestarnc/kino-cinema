import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getPackageById,
  isValidISOBookingDate,
  isPastBookingDate,
  PRIVATE_TIME_SLOTS,
  type PrivatePackageId,
  type TimeSlotId,
} from "@/lib/private-booking";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

interface InitiateBookingPayload {
  filmId?: string;
  filmTitle?: string;
  bookingMode?: "film" | "package-only";
  packageId: PrivatePackageId;
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

function isValidPayload(payload: Partial<InitiateBookingPayload>): payload is InitiateBookingPayload {
  if (!payload.packageId || !["couple", "standard", "premium"].includes(payload.packageId)) return false;
  if (!payload.bookingDate || !isValidISOBookingDate(payload.bookingDate) || isPastBookingDate(payload.bookingDate)) return false;
  if (!payload.timeSlot || !PRIVATE_TIME_SLOTS.some((slot) => slot.id === payload.timeSlot)) return false;
  if (!payload.fullName || payload.fullName.trim().length < 2) return false;
  if (!payload.email || !isValidEmail(payload.email)) return false;
  if (!payload.phoneNumber || payload.phoneNumber.trim().length < 8) return false;
  if (payload.bookingMode === "film" && (!payload.filmId || !payload.filmTitle)) return false;
  return true;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<InitiateBookingPayload>;

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid booking payload" }, { status: 400 });
  }

  const bookingPackage = getPackageById(body.packageId);
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!paystackPublicKey) {
    return NextResponse.json({ error: "Missing Paystack public key" }, { status: 500 });
  }

  const reference = `kino_${Date.now()}_${randomUUID().slice(0, 8)}`;

  try {
    const supabase = getSupabaseAdminClient();

    const { data: existingPaidBooking, error: existingPaidBookingError } = await supabase
      .from("private_bookings")
      .select("id")
      .eq("booking_date", body.bookingDate)
      .eq("time_slot", body.timeSlot)
      .eq("status", "paid")
      .maybeSingle();

    if (existingPaidBookingError && existingPaidBookingError.code !== "PGRST116") {
      return NextResponse.json({ error: "Failed to validate slot availability" }, { status: 500 });
    }

    if (existingPaidBooking) {
      return NextResponse.json({ error: "This slot is no longer available." }, { status: 409 });
    }

    const { error } = await supabase.from("private_bookings").insert({
      film_id: body.filmId ?? null,
      film_title: body.filmTitle ?? null,
      package_id: bookingPackage.id,
      package_name: bookingPackage.name,
      package_price_ngn: bookingPackage.priceNaira,
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

    return NextResponse.json({
      reference,
      amountNaira: bookingPackage.priceNaira,
      email: body.email.trim().toLowerCase(),
      publicKey: paystackPublicKey,
    });
  } catch {
    return NextResponse.json({ error: "Unable to start booking" }, { status: 500 });
  }
}
