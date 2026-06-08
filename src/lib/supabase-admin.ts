import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

let cachedClient: SupabaseClient<Database> | null = null;

function normalizeSupabaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim().replace(/\/+$/, "");
  return trimmed.replace(/\/rest\/v1$/i, "");
}

export function getSupabaseAdminClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const rawSupabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawSupabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

  if (!/^https:\/\//i.test(supabaseUrl)) {
    throw new Error("Invalid Supabase URL. Use your project URL, e.g. https://<project-ref>.supabase.co");
  }

  cachedClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}
