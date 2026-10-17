import { NextRequest, NextResponse } from "next/server";
import { hashVerificationToken, sanitizeText } from "@/lib/halloween-voting";
import { getHalloweenVoteByTokenHash, markHalloweenVoteVerified, recordHalloweenAttempt } from "@/lib/halloween-voting-db";

export const dynamic = "force-dynamic";

function getTokenFromRequest(request: NextRequest): string {
  const bodyToken = request.nextUrl.searchParams.get("token");
  return sanitizeText(bodyToken ?? "");
}

export async function POST(request: NextRequest) {
  let token = getTokenFromRequest(request);

  if (!token) {
    try {
      const body = (await request.json()) as { token?: unknown };
      token = sanitizeText(body.token);
    } catch {
      token = "";
    }
  }

  if (!token) {
    return NextResponse.json({ error: "Verification token is required." }, { status: 400 });
  }

  const tokenHash = hashVerificationToken(token);
  const verifiedIpAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || null;
  const verifiedUserAgent = request.headers.get("user-agent")?.trim() || null;

  try {
    const vote = await getHalloweenVoteByTokenHash(tokenHash);
    if (!vote) {
      return NextResponse.json({ error: "This verification link is invalid or has expired." }, { status: 404 });
    }

    if (vote.verified_at) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    if (!vote.token_expires_at || new Date(vote.token_expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "This verification link has expired." }, { status: 410 });
    }

    const verified = await markHalloweenVoteVerified({
      tokenHash,
      verifiedAt: new Date().toISOString(),
      verifiedIpAddress,
      verifiedUserAgent,
    });

    if (!verified) {
      return NextResponse.json({ error: "This verification link is invalid or has expired." }, { status: 404 });
    }

    try {
      await recordHalloweenAttempt({
        emailNormalized: verified.email_normalized,
        ipAddress: verifiedIpAddress,
        outcome: "verified",
        reason: null,
      });
    } catch (error) {
      console.error("[halloween/verify] failed to record verification attempt", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[halloween/verify] token verification failed", error);
    return NextResponse.json({ error: "Unable to verify your vote right now." }, { status: 500 });
  }
}