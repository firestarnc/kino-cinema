import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminConfigured, isValidAdminSessionToken } from "@/lib/admin-auth";
import { getHalloweenCampaignSubject, sendHalloweenCampaignEmail } from "@/lib/booking-email";
import {
  listPaidCampaignAudience,
  recordCampaignEmailSend,
  wasCampaignEmailSent,
} from "@/lib/private-booking-db";

export const dynamic = "force-dynamic";

const CAMPAIGN_SLUG = "halloween-2026-girls-night";

type CampaignMode = "dry-run" | "live";

interface CampaignPayload {
  mode?: CampaignMode;
  throttleMs?: number;
  maxRecipients?: number;
}

interface CampaignFailure {
  email: string;
  reason: string;
  code?: string;
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

function getBaseSiteUrl(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  return request.nextUrl.origin;
}

function toSafeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message.slice(0, 240);
  }
  return "Unknown send error";
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  const payload = (await request.json().catch(() => ({}))) as CampaignPayload;
  const mode: CampaignMode = payload.mode === "live" ? "live" : "dry-run";
  const throttleMs = Math.max(250, Math.min(3000, payload.throttleMs ?? 1200));
  const maxRecipients = Math.max(1, Math.min(10000, payload.maxRecipients ?? 5000));

  const bookingUrl = `${getBaseSiteUrl(request)}/book`;
  const recipients = await listPaidCampaignAudience(maxRecipients);

  if (mode === "dry-run") {
    return NextResponse.json({
      success: true,
      mode,
      campaignSlug: CAMPAIGN_SLUG,
      audienceCount: recipients.length,
      subject: getHalloweenCampaignSubject(),
      bookingUrl,
      sampleRecipients: recipients.slice(0, 20).map((recipient) => ({
        fullName: recipient.fullName,
        email: recipient.email,
        lastBookingAt: recipient.lastBookingAt,
      })),
      throttleMs,
      maxRecipients,
    });
  }

  let attempted = 0;
  let sent = 0;
  let skipped = 0;
  let failed = 0;
  const failures: CampaignFailure[] = [];

  for (const recipient of recipients) {
    attempted += 1;

    const alreadySent = await wasCampaignEmailSent(CAMPAIGN_SLUG, recipient.emailNormalized);
    if (alreadySent) {
      skipped += 1;
      await recordCampaignEmailSend({
        campaignSlug: CAMPAIGN_SLUG,
        recipientEmail: recipient.email,
        recipientEmailNormalized: recipient.emailNormalized,
        recipientName: recipient.fullName,
        bookingReference: recipient.paystackReference,
        status: "skipped",
        errorCode: "already_sent",
        errorMessage: "Recipient already sent for campaign",
        metadata: { mode },
      });
      continue;
    }

    try {
      await sendHalloweenCampaignEmail({
        recipientEmail: recipient.email,
        recipientName: recipient.fullName,
        bookingUrl,
      });

      sent += 1;
      await recordCampaignEmailSend({
        campaignSlug: CAMPAIGN_SLUG,
        recipientEmail: recipient.email,
        recipientEmailNormalized: recipient.emailNormalized,
        recipientName: recipient.fullName,
        bookingReference: recipient.paystackReference,
        status: "sent",
        metadata: { mode },
      });
    } catch (error) {
      failed += 1;
      const reason = toSafeErrorMessage(error);
      const code = error instanceof Error ? (error as Error & { code?: string }).code : undefined;

      failures.push({
        email: recipient.email,
        reason,
        code,
      });

      await recordCampaignEmailSend({
        campaignSlug: CAMPAIGN_SLUG,
        recipientEmail: recipient.email,
        recipientEmailNormalized: recipient.emailNormalized,
        recipientName: recipient.fullName,
        bookingReference: recipient.paystackReference,
        status: "failed",
        errorCode: code ?? "send_failed",
        errorMessage: reason,
        metadata: { mode },
      });
    }

    await sleep(throttleMs);
  }

  return NextResponse.json({
    success: true,
    mode,
    campaignSlug: CAMPAIGN_SLUG,
    audienceCount: recipients.length,
    attempted,
    sent,
    skipped,
    failed,
    failures: failures.slice(0, 50),
    throttleMs,
    maxRecipients,
  });
}
