import { NextResponse } from "next/server";
import { listActiveHalloweenCandidates } from "@/lib/halloween-voting-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const candidates = await listActiveHalloweenCandidates();
    return NextResponse.json({ candidates });
  } catch (error) {
    console.error("[halloween/candidates] Failed to load candidates", error);
    return NextResponse.json({ error: "Unable to load candidates right now." }, { status: 500 });
  }
}