import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminCredentials,
  isAdminConfigured,
  isValidAdminSessionToken,
} from "@/lib/admin-auth";
import {
  createManualSlotBlock,
  deleteManualSlotBlockById,
  getActiveSlotBlocks,
  hasPaidBookingForSlot,
} from "@/lib/private-booking-db";
import {
  isPastBookingDate,
  isValidISOBookingDate,
  PRIVATE_TIME_SLOTS,
  type TimeSlotId,
} from "@/lib/private-booking";

interface CreateSlotBlockPayload {
  bookingDate?: string;
  timeSlot?: TimeSlotId;
  reason?: string;
}

interface DeleteSlotBlockPayload {
  id?: string;
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

function isValidPayload(payload: CreateSlotBlockPayload): payload is Required<Pick<CreateSlotBlockPayload, "bookingDate" | "timeSlot">> & Pick<CreateSlotBlockPayload, "reason"> {
  if (!payload.bookingDate || !isValidISOBookingDate(payload.bookingDate) || isPastBookingDate(payload.bookingDate)) {
    return false;
  }

  if (!payload.timeSlot || !PRIVATE_TIME_SLOTS.some((slot) => slot.id === payload.timeSlot)) {
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  const date = request.nextUrl.searchParams.get("date")?.trim();
  const allBlocks = await getActiveSlotBlocks(300);

  const blocks = date
    ? allBlocks.filter((block) => block.booking_date === date)
    : allBlocks;

  return NextResponse.json({ blocks });
}

export async function POST(request: NextRequest) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  const body = (await request.json()) as CreateSlotBlockPayload;

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid slot block payload" }, { status: 400 });
  }

  const hasPaidBooking = await hasPaidBookingForSlot(body.bookingDate, body.timeSlot);
  if (hasPaidBooking) {
    return NextResponse.json({ error: "Slot is already paid and cannot be blocked." }, { status: 409 });
  }

  const adminUsername = getAdminCredentials().username ?? "admin";
  const { block, error } = await createManualSlotBlock({
    booking_date: body.bookingDate,
    time_slot: body.timeSlot,
    reason: body.reason?.trim() || null,
    created_by_admin: adminUsername,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slot is already blocked." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to block slot" }, { status: 500 });
  }

  return NextResponse.json({ success: true, block });
}

export async function DELETE(request: NextRequest) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  const body = (await request.json()) as DeleteSlotBlockPayload;
  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const error = await deleteManualSlotBlockById(body.id);
  if (error) {
    return NextResponse.json({ error: "Unable to remove slot block" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
