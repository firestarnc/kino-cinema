import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/booking-email";
import { getPaystackSecretKey } from "@/lib/paystack-config";
import {
  claimBookingConfirmationEmail,
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
  const paystackSecretKey = getPaystackSecretKey();
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

  const paidResult = await markBookingPaid(reference);

  if (paidResult.error?.code === "23505") {
    return NextResponse.json({ received: true, conflict: true });
  }

  if (paidResult.error) {
    return NextResponse.json({ error: "Failed to finalize booking" }, { status: 500 });
  }

  let bookingForEmail = await claimBookingConfirmationEmail(reference);

  if (!bookingForEmail && paidResult.statusChanged) {
    bookingForEmail = await claimBookingConfirmationEmail(reference, { allowLegacyFallback: true });
  }

  if (!bookingForEmail && paidResult.statusChanged && paidResult.booking) {
    bookingForEmail = paidResult.booking;
  }

  if (bookingForEmail) {
    sendBookingConfirmationEmail(bookingForEmail).catch((error) => {
      console.error("[booking] Failed to send booking confirmation from webhook route", {
        reference,
        error,
        smtpResponse: (error as any)?.response,
        code: (error as any)?.code,
      });
    });
  }

  return NextResponse.json({ received: true });
}
