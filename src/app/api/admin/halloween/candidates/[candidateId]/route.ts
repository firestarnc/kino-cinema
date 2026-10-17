import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminConfigured, isValidAdminSessionToken } from "@/lib/admin-auth";
import type { Database } from "@/lib/database.types";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

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

export async function PATCH(request: NextRequest, context: { params: Promise<{ candidateId: string }> }) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  const { candidateId } = await context.params;
  const body = (await request.json()) as Partial<{
    displayName: string;
    sortOrder: number;
    isActive: boolean;
  }>;

  const updates: Database["public"]["Tables"]["halloween_candidates"]["Update"] = {};
  if (typeof body.displayName === "string") {
    const value = body.displayName.trim();
    if (value.length < 2) {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 });
    }
    updates.display_name = value;
    updates.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  }
  if (Number.isInteger(body.sortOrder)) {
    updates.sort_order = body.sortOrder;
  }
  if (typeof body.isActive === "boolean") {
    updates.is_active = body.isActive;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("halloween_candidates")
      .update(updates)
      .eq("id", candidateId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, candidate: data });
  } catch (error) {
    const dbError = error as { code?: string };
    if (dbError.code === "23505") {
      return NextResponse.json({ error: "A candidate with that name already exists" }, { status: 409 });
    }

    console.error("[admin/halloween/candidates] failed to update candidate", error);
    return NextResponse.json({ error: "Unable to update candidate" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ candidateId: string }> }) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  const { candidateId } = await context.params;

  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("halloween_candidates")
      .update({ is_active: false })
      .eq("id", candidateId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/halloween/candidates] failed to disable candidate", error);
    return NextResponse.json({ error: "Unable to disable candidate" }, { status: 500 });
  }
}