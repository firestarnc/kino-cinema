import { NextRequest, NextResponse } from "next/server";
import { getBlockedSlotsForDate, getPaidSlotsForDate } from "@/lib/private-booking-db";
import {
  getValidTimeSlotsForDate,
  isElapsedTimeSlot,
  isValidISOBookingDate,
  lagosTodayISODate,
} from "@/lib/private-booking";

const AVAILABILITY_RESPONSE_CACHE_SECONDS = 15;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const date = request.nextUrl.searchParams.get("date")?.trim();

  if (!date || !isValidISOBookingDate(date)) {
    return badRequest("date must be in YYYY-MM-DD format");
  }

  if (date < lagosTodayISODate()) {
    return badRequest("date cannot be in the past");
  }

  try {
    const [takenSlots, blockedSlots] = await Promise.all([
      getPaidSlotsForDate(date),
      getBlockedSlotsForDate(date),
    ]);
    const elapsedSlots = getValidTimeSlotsForDate(date)
      .filter((slot) => isElapsedTimeSlot(date, slot.id))
      .map((slot) => slot.id);
    const unavailableSlots = Array.from(
      new Set([...takenSlots, ...blockedSlots, ...elapsedSlots])
    );

    if (process.env.NODE_ENV !== "production") {
      console.info("[availability] api response", {
        date,
        takenSlots: takenSlots.length,
        blockedSlots: blockedSlots.length,
        elapsedSlots: elapsedSlots.length,
        unavailableSlots: unavailableSlots.length,
        elapsedMs: Date.now() - startedAt,
      });
    }

    return NextResponse.json(
      { takenSlots, blockedSlots, elapsedSlots, unavailableSlots },
      {
        headers: {
          "Cache-Control": `public, max-age=0, s-maxage=${AVAILABILITY_RESPONSE_CACHE_SECONDS}, stale-while-revalidate=60`,
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Unable to resolve slot availability" }, { status: 500 });
  }
}
