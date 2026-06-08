import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { isValidISOBookingDate, lagosTodayISODate } from "@/lib/private-booking";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date")?.trim();

  if (!date || !isValidISOBookingDate(date)) {
    return badRequest("date must be in YYYY-MM-DD format");
  }

  if (date < lagosTodayISODate()) {
    return badRequest("date cannot be in the past");
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("private_bookings")
      .select("time_slot")
      .eq("booking_date", date)
      .eq("status", "paid");

    if (error) {
      return NextResponse.json({ error: "Failed to fetch slot availability" }, { status: 500 });
    }

    const takenSlots = (data ?? []).map((booking) => booking.time_slot);
    return NextResponse.json({ takenSlots });
  } catch {
    return NextResponse.json({ error: "Unable to resolve slot availability" }, { status: 500 });
  }
}
