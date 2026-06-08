import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/booking-email";
import {
  getBookingByReference,
  markBookingFailed,
  markBookingPaid,
} from "@/lib/private-booking-db";

interface VerifyPayload {
  reference: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<VerifyPayload>;
  const reference = body.reference?.trim();

  if (!reference) {
    return NextResponse.json({ error: "reference is required" }, { status: 400 });
  }

  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecretKey) {
    return NextResponse.json({ error: "Missing Paystack secret key" }, { status: 500 });
  }

  try {
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
      cache: "no-store",
    });

    const verifyBody = (await verifyResponse.json()) as {
      status?: boolean;
      data?: {
        status?: string;
      };
    };

    if (!verifyResponse.ok || !verifyBody.status) {
      return NextResponse.json({ error: "Unable to verify payment" }, { status: 502 });
    }

    const paymentStatus = verifyBody.data?.status;

    if (paymentStatus !== "success") {
      await markBookingFailed(reference);

      return NextResponse.json({ error: "Payment was not successful" }, { status: 400 });
    }

    const paidUpdateError = await markBookingPaid(reference);

    if (paidUpdateError) {
      if (paidUpdateError.code === "23505") {
        return NextResponse.json({ error: "Slot has already been booked by another paid transaction" }, { status: 409 });
      }
      return NextResponse.json({ error: "Failed to finalize booking" }, { status: 500 });
    }

    const booking = await getBookingByReference(reference);
    if (booking?.status === "paid") {
      void sendBookingConfirmationEmail(booking);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to verify booking payment" }, { status: 500 });
  }
}
