import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminConfigured, isValidAdminSessionToken } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { Database } from "@/lib/database.types";

type HalloweenCandidateRow = Database["public"]["Tables"]["halloween_candidates"]["Row"];

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

function normalizeCandidateDisplayName(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCandidateSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(request: NextRequest) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("halloween_candidates")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ candidates: data ?? [] });
  } catch (error) {
    console.error("[admin/halloween/candidates] failed to load candidates", error);
    return NextResponse.json({ error: "Unable to load candidates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  const body = (await request.json()) as Partial<{
    displayName: string;
    sortOrder: number;
    isActive: boolean;
  }>;

  const displayName = normalizeCandidateDisplayName(body.displayName);
  const sortOrder = Number.isInteger(body.sortOrder) ? Number(body.sortOrder) : 0;
  const isActive = typeof body.isActive === "boolean" ? body.isActive : true;

  if (displayName.length < 2) {
    return NextResponse.json({ error: "Display name is required" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const slug = normalizeCandidateSlug(displayName);
    const { data, error } = await supabase
      .from("halloween_candidates")
      .insert({
        display_name: displayName,
        slug,
        sort_order: sortOrder,
        is_active: isActive,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, candidate: data as HalloweenCandidateRow });
  } catch (error) {
    const dbError = error as { code?: string };
    if (dbError.code === "23505") {
      return NextResponse.json({ error: "A candidate with that name already exists" }, { status: 409 });
    }

    console.error("[admin/halloween/candidates] failed to create candidate", error);
    return NextResponse.json({ error: "Unable to create candidate" }, { status: 500 });
  }
}