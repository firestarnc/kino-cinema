import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/booking-email";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim();

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  try {
    await sendBookingConfirmationEmail({
      id: "test-booking",
      booking_type: "blockbuster",
      film_id: null,
      film_title: null,
      content_platform: null,
      content_title: null,
      package_id: "premium",
      package_name: "Premium Package",
      package_price_ngn: 350000,
      additional_guests: 0,
      booking_date: new Date().toISOString().slice(0, 10),
      time_slot: "18:00-21:00",
      full_name: "Kino Guest",
      email,
      phone_number: "+2340000000000",
      notes: "Resend integration test",
      status: "paid",
      paystack_reference: "test_reference",
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send test email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
