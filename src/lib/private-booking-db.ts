import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { sendAdminNotification, type PrivateBookingRow } from "@/lib/booking-email";
import type { Database } from "@/lib/database.types";
import type { PostgrestError } from "@supabase/supabase-js";

type PrivateBookingUpdate = Database["public"]["Tables"]["private_bookings"]["Update"];
type PrivateBookingInsert = Database["public"]["Tables"]["private_bookings"]["Insert"];
type ManualSlotBlockInsert = Database["public"]["Tables"]["manual_slot_blocks"]["Insert"];

export type ManualSlotBlockRow = Database["public"]["Tables"]["manual_slot_blocks"]["Row"];

export type MarkBookingPaidResult = {
  error: PostgrestError | null;
  booking: PrivateBookingRow | null;
  statusChanged: boolean;
};

export type CreateAdminDirectBookingResult = {
  error: PostgrestError | null;
  booking: PrivateBookingRow | null;
};

export type UpsertManualSlotBlockResult = {
  error: PostgrestError | null;
  block: ManualSlotBlockRow | null;
};

function isMissingConfirmationColumnError(error: PostgrestError | null): boolean {
  if (!error) return false;
  if (error.code === "42703") return true;

  const message = `${error.message ?? ""} ${error.details ?? ""}`;
  return /confirmation_email_sent_at/i.test(message);
}

export async function markBookingFailed(reference: string) {
  const supabase = getSupabaseAdminClient();

  await supabase
    .from("private_bookings")
    .update({ status: "failed" })
    .eq("paystack_reference", reference)
    .eq("status", "pending_payment");
}

export async function markBookingPaid(reference: string): Promise<MarkBookingPaidResult> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("private_bookings")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("paystack_reference", reference)
    .eq("status", "pending_payment")
    .select("*")
    .maybeSingle();

  const statusChanged = Boolean(data) && !error;

    if (statusChanged && data) {
    try {
      await sendAdminNotification(data);
    } catch (sendError) {
      console.error("[booking] Failed to send admin notification", {
        reference,
        sendError,
      });
    }
    }

  return { error, booking: data ?? null, statusChanged };
}

export async function getBookingByReference(reference: string): Promise<PrivateBookingRow | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("private_bookings")
    .select("*")
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function claimBookingConfirmationEmail(
  reference: string,
  options?: { allowLegacyFallback?: boolean }
): Promise<PrivateBookingRow | null> {
  const supabase = getSupabaseAdminClient();

  const updatePayload: PrivateBookingUpdate = {
    confirmation_email_sent_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("private_bookings")
    .update(updatePayload)
    .eq("paystack_reference", reference)
    .eq("status", "paid")
    .is("confirmation_email_sent_at", null)
    .select("*")
    .maybeSingle();

  if (!error) {
    return data;
  }

  if (!isMissingConfirmationColumnError(error)) {
    console.error("[booking] Failed to claim booking confirmation email", {
      reference,
      error,
    });
    return null;
  }

  if (options?.allowLegacyFallback !== true) {
    console.warn("[booking] confirmation_email_sent_at column missing, legacy fallback disabled", {
      reference,
    });
    return null;
  }

  console.warn("[booking] confirmation_email_sent_at column missing, using legacy fallback", {
    reference,
  });
  return getBookingByReference(reference);
}

export async function getRecentBookings(limit: number = 100): Promise<PrivateBookingRow[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("private_bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getPaidSlotsForDate(dateISO: string): Promise<string[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("private_bookings")
    .select("time_slot")
    .eq("booking_date", dateISO)
    .eq("status", "paid");

  if (error || !data) {
    return [];
  }

  return data.map((row) => row.time_slot);
}

export async function hasPaidBookingForSlot(dateISO: string, timeSlot: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("private_bookings")
    .select("id")
    .eq("booking_date", dateISO)
    .eq("time_slot", timeSlot)
    .eq("status", "paid")
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    return false;
  }

  return Boolean(data);
}

export async function createAdminDirectBooking(payload: PrivateBookingInsert): Promise<CreateAdminDirectBookingResult> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("private_bookings")
    .insert(payload)
    .select("*")
    .maybeSingle();

  return {
    error,
    booking: data ?? null,
  };
}

export async function getActiveSlotBlocks(limit: number = 120): Promise<ManualSlotBlockRow[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("manual_slot_blocks")
    .select("*")
    .order("booking_date", { ascending: true })
    .order("time_slot", { ascending: true })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getBlockedSlotsForDate(dateISO: string): Promise<string[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("manual_slot_blocks")
    .select("time_slot")
    .eq("booking_date", dateISO);

  if (error || !data) {
    return [];
  }

  return data.map((row) => row.time_slot);
}

export async function isSlotBlockedByAdmin(dateISO: string, timeSlot: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("manual_slot_blocks")
    .select("id")
    .eq("booking_date", dateISO)
    .eq("time_slot", timeSlot)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    return false;
  }

  return Boolean(data);
}

export async function createManualSlotBlock(payload: ManualSlotBlockInsert): Promise<UpsertManualSlotBlockResult> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("manual_slot_blocks")
    .insert(payload)
    .select("*")
    .maybeSingle();

  return {
    error,
    block: data ?? null,
  };
}

export async function deleteManualSlotBlockById(id: string): Promise<PostgrestError | null> {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("manual_slot_blocks")
    .delete()
    .eq("id", id);

  return error;
}
