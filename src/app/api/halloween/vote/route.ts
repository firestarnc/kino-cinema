import { NextRequest, NextResponse } from "next/server";
import {
  generateVerificationToken,
  getRequestIp,
  getRequestUserAgent,
  HALLOWEEN_GENERIC_ERROR_MESSAGE,
  HALLOWEEN_SUCCESS_MESSAGE,
  isDisposableEmail,
  isValidHalloweenVotePayload,
  normalizeEmail,
  sanitizeText,
} from "@/lib/halloween-voting";
import {
  countRecentAttemptsByEmail,
  countRecentAttemptsByIp,
  createPendingHalloweenVote,
  getHalloweenCandidateById,
  recordHalloweenAttempt,
} from "@/lib/halloween-voting-db";
import { HalloweenVoteEmailError, sendHalloweenVerificationEmail } from "@/lib/halloween-vote-email";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS_PER_WINDOW = 3;
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const HALLOWEEN_EMAIL_RETRY_MESSAGE = "We could not send your verification email right now. Please try again in a few minutes.";

function genericResponse(status = 200) {
  return NextResponse.json({ message: HALLOWEEN_SUCCESS_MESSAGE }, { status });
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: HALLOWEEN_GENERIC_ERROR_MESSAGE }, { status: 400 });
  }

  const candidateId = sanitizeText(payload.candidateId);
  const fullName = sanitizeText(payload.fullName);
  const email = normalizeEmail(sanitizeText(payload.email));
  const phoneNumber = sanitizeText(payload.phoneNumber);
  const honeypot = sanitizeText(payload.honeypot);
  const formStartedAt = payload.formStartedAt as string | number | null | undefined;
  const token = generateVerificationToken();
  const ipAddress = getRequestIp(request.headers);
  const userAgent = getRequestUserAgent(request.headers);
  const sinceISO = new Date(Date.now() - ATTEMPT_WINDOW_MS).toISOString();

  if (!isValidHalloweenVotePayload({ fullName, email, phoneNumber, candidateId, honeypot, formStartedAt })) {
    return NextResponse.json({ error: "Please complete the form with valid details." }, { status: 400 });
  }

  if (isDisposableEmail(email)) {
    try {
      await recordHalloweenAttempt({ emailNormalized: email, ipAddress, outcome: "blocked", reason: "disposable-email" });
    } catch (error) {
      console.error("[halloween/vote] failed to record disposable-email attempt", error);
    }
    return NextResponse.json({ error: HALLOWEEN_GENERIC_ERROR_MESSAGE }, { status: 400 });
  }

  try {
    const candidate = await getHalloweenCandidateById(candidateId);
    if (!candidate || !candidate.is_active) {
      return NextResponse.json({ error: "Please select a valid contestant." }, { status: 400 });
    }

    const [emailAttempts, ipAttempts] = await Promise.all([
      countRecentAttemptsByEmail(email, sinceISO),
      ipAddress ? countRecentAttemptsByIp(ipAddress, sinceISO) : Promise.resolve(0),
    ]);

    if (emailAttempts >= MAX_ATTEMPTS_PER_WINDOW || ipAttempts >= MAX_ATTEMPTS_PER_WINDOW) {
      try {
        await recordHalloweenAttempt({
          emailNormalized: email,
          ipAddress,
          outcome: "blocked",
          reason: "rate-limit",
        });
      } catch (error) {
        console.error("[halloween/vote] failed to record rate-limit attempt", error);
      }

      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    let vote;
    try {
      vote = await createPendingHalloweenVote({
        candidateId,
        fullName,
        email,
        emailNormalized: email,
        phoneNumber,
        verificationTokenHash: token.tokenHash,
        tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        ipAddress,
        userAgent,
      });
    } catch (error) {
      const dbError = error as { code?: string };
      if (dbError.code === "23505") {
        try {
          await recordHalloweenAttempt({
            emailNormalized: email,
            ipAddress,
            outcome: "duplicate",
            reason: "verified-email-exists",
          });
        } catch (attemptError) {
          console.error("[halloween/vote] failed to record duplicate attempt", attemptError);
        }

        return genericResponse();
      }

      throw error;
    }

    const verificationUrl = new URL("/halloween/verify", process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin);
    verificationUrl.searchParams.set("token", token.token);

    try {
      await sendHalloweenVerificationEmail({
        recipientEmail: vote.email,
        recipientName: vote.full_name,
        verificationUrl: verificationUrl.toString(),
        candidateName: candidate.display_name,
      });
    } catch (error) {
      const emailError = error as HalloweenVoteEmailError;

      try {
        await recordHalloweenAttempt({
          emailNormalized: email,
          ipAddress,
          outcome: "blocked",
          reason: "verification-email-failed",
        });
      } catch (attemptError) {
        console.error("[halloween/vote] failed to record email-failed attempt", attemptError);
      }

      console.error("[halloween/vote] verification email failed", {
        code: emailError.code,
        message: emailError.message,
      });

      return NextResponse.json({ error: HALLOWEEN_EMAIL_RETRY_MESSAGE }, { status: 503 });
    }

    try {
      await recordHalloweenAttempt({
        emailNormalized: email,
        ipAddress,
        outcome: "sent",
        reason: null,
      });
    } catch (error) {
      console.error("[halloween/vote] failed to record success attempt", error);
    }

    return genericResponse();
  } catch (error) {
    console.error("[halloween/vote] vote submission failed", error);
    return NextResponse.json({ error: HALLOWEEN_GENERIC_ERROR_MESSAGE }, { status: 500 });
  }
}