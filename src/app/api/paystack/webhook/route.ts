import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/booking-email";
import {
  getBookingByReference,
  markBookingFailed,
  markBookingPaid,
} from "@/lib/private-booking-db";

interface PaystackWebhookEvent {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
  };
}

function isValidSignature(payload: string, signature: string, secret: string): boolean {
  const digest = createHmac("sha512", secret).update(payload).digest("hex");

  const expected = Buffer.from(digest, "utf8");
  const received = Buffer.from(signature, "utf8");

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}

export async function POST(request: NextRequest) {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecretKey) {
    return NextResponse.json({ error: "Missing Paystack secret key" }, { status: 500 });
  }

  const signature = request.headers.get("x-paystack-signature")?.trim();
  if (!signature) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  const payload = await request.text();

  if (!isValidSignature(payload, signature, paystackSecretKey)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  const body = JSON.parse(payload) as PaystackWebhookEvent;
  const reference = body.data?.reference?.trim();
  const paymentStatus = body.data?.status;

  if (!reference) {
    return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
  }

  if (body.event !== "charge.success" || paymentStatus !== "success") {
    await markBookingFailed(reference);
    return NextResponse.json({ received: true });
  }

  const paidUpdateError = await markBookingPaid(reference);

  if (paidUpdateError?.code === "23505") {
    return NextResponse.json({ received: true, conflict: true });
  }

  if (paidUpdateError) {
    return NextResponse.json({ error: "Failed to finalize booking" }, { status: 500 });
  }

  const booking = await getBookingByReference(reference);
  if (booking?.status === "paid") {
    void sendBookingConfirmationEmail(booking);
  }

  return NextResponse.json({ received: true });
}
