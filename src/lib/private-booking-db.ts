import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { Database } from "@/lib/database.types";

type PrivateBookingRow = Database["public"]["Tables"]["private_bookings"]["Row"];

export async function markBookingFailed(reference: string) {
  const supabase = getSupabaseAdminClient();

  await supabase
    .from("private_bookings")
    .update({ status: "failed" })
    .eq("paystack_reference", reference)
    .eq("status", "pending_payment");
}

export async function markBookingPaid(reference: string) {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("private_bookings")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("paystack_reference", reference)
    .eq("status", "pending_payment");

  return error;
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
