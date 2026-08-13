import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/booking-email";
import { getPaystackSecretKey } from "@/lib/paystack-config";
import {
  claimBookingConfirmationEmail,
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

  const paystackSecretKey = getPaystackSecretKey();
  if (!paystackSecretKey) {
    const existingBooking = await getBookingByReference(reference);
    if (existingBooking?.status === "paid") {
      return NextResponse.json({ success: true, fallback: true });
    }

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

    const paidResult = await markBookingPaid(reference);

    if (paidResult.error) {
      if (paidResult.error.code === "23505") {
        return NextResponse.json({ error: "Slot has already been booked by another paid transaction" }, { status: 409 });
      }
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
      void sendBookingConfirmationEmail(bookingForEmail).catch((error) => {
        console.error("[booking] Failed to send booking confirmation from verify route", {
          reference,
          error,
        });
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/string did not match the expected pattern/i.test(message)) {
      return NextResponse.json(
        {
          error:
            "Paystack secret key format is invalid in server configuration. Update PAYSTACK_SECRET_KEY on production and retry.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Unable to verify booking payment" }, { status: 500 });
  }
}
