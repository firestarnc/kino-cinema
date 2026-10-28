"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CampaignMode = "dry-run" | "live" | "test";

type CampaignResponse = {
  success?: boolean;
  error?: string;
  mode?: CampaignMode;
  campaignSlug?: string;
  audienceCount?: number;
  subject?: string;
  bookingUrl?: string;
  sampleRecipients?: Array<{ fullName: string; email: string; lastBookingAt: string }>;
  attempted?: number;
  sent?: number;
  skipped?: number;
  failed?: number;
  failures?: Array<{ email: string; reason: string; code?: string }>;
  throttleMs?: number;
  maxRecipients?: number;
  testRecipient?: string;
};

export default function HalloweenCampaignManager() {
  const [isDryRunning, setIsDryRunning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testRecipient, setTestRecipient] = useState("firestar.nc@gmail.com");
  const [result, setResult] = useState<CampaignResponse | null>(null);

  async function triggerCampaign(mode: CampaignMode, options?: { testRecipient?: string }) {
    if (mode === "live") {
      const confirmed = window.confirm("Send Halloween campaign email to paid previous clients now?");
      if (!confirmed) {
        return;
      }
    }

    if (options?.testRecipient) {
      setIsTesting(true);
    } else if (mode === "dry-run") {
      setIsDryRunning(true);
    } else {
      setIsSending(true);
    }

    try {
      const response = await fetch("/api/admin/campaigns/halloween", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          throttleMs: 1200,
          maxRecipients: 5000,
          testRecipient: options?.testRecipient,
        }),
      });

      const payload = (await response.json()) as CampaignResponse;

      if (!response.ok || payload.success !== true) {
        throw new Error(payload.error ?? "Campaign request failed");
      }

      setResult(payload);
      if (options?.testRecipient) {
        toast.success("Test campaign email sent successfully");
      } else if (mode === "dry-run") {
        toast.success("Dry run generated successfully");
      } else {
        toast.success("Live campaign completed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Campaign request failed";
      toast.error(message);
    } finally {
      if (options?.testRecipient) {
        setIsTesting(false);
      } else if (mode === "dry-run") {
        setIsDryRunning(false);
      } else {
        setIsSending(false);
      }
    }
  }

  return (
    <div className="mb-8 rounded-xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm">
      <h2 className="font-playfair text-2xl font-semibold text-foreground">Halloween Campaign</h2>
      <p className="mt-1 font-outfit text-xs text-muted-foreground">
        Send the Halloween event announcement to all paid previous clients. Run preview first, then execute live.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="email"
          value={testRecipient}
          onChange={(event) => setTestRecipient(event.target.value)}
          className="min-w-[260px] rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
          placeholder="Your test email"
          disabled={isDryRunning || isSending || isTesting}
        />

        <Button
          type="button"
          onClick={() => void triggerCampaign("dry-run", { testRecipient: testRecipient.trim() })}
          disabled={isDryRunning || isSending || isTesting || !testRecipient.trim()}
          className="font-outfit text-xs uppercase tracking-[0.2em]"
          variant="secondary"
        >
          {isTesting ? "Sending Test..." : "Send Test To My Email"}
        </Button>

        <Button
          type="button"
          onClick={() => void triggerCampaign("dry-run")}
          disabled={isDryRunning || isSending || isTesting}
          className="font-outfit text-xs uppercase tracking-[0.2em]"
          variant="secondary"
        >
          {isDryRunning ? "Running Preview..." : "Run Preview (Dry Run)"}
        </Button>

        <Button
          type="button"
          onClick={() => void triggerCampaign("live")}
          disabled={isDryRunning || isSending || isTesting}
          className="font-outfit text-xs uppercase tracking-[0.2em]"
        >
          {isSending ? "Sending Campaign..." : "Send Live Campaign"}
        </Button>
      </div>

      {result ? (
        <div className="mt-4 rounded-lg border border-border/40 bg-background/40 p-4">
          <p className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Last Result</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <p className="font-outfit text-sm">Mode: <span className="text-gold">{result.mode ?? "-"}</span></p>
            <p className="font-outfit text-sm">Audience: <span className="text-gold">{result.audienceCount ?? 0}</span></p>
            <p className="font-outfit text-sm">Campaign: <span className="text-gold">{result.campaignSlug ?? "-"}</span></p>
            <p className="font-outfit text-sm">Attempted: <span className="text-gold">{result.attempted ?? 0}</span></p>
            <p className="font-outfit text-sm">Sent: <span className="text-gold">{result.sent ?? 0}</span></p>
            <p className="font-outfit text-sm">Skipped: <span className="text-gold">{result.skipped ?? 0}</span></p>
            <p className="font-outfit text-sm">Failed: <span className="text-gold">{result.failed ?? 0}</span></p>
          </div>

          {result.subject ? (
            <p className="mt-3 font-outfit text-sm text-muted-foreground">
              Subject: {result.subject}
            </p>
          ) : null}

          {result.testRecipient ? (
            <p className="mt-1 font-outfit text-sm text-muted-foreground">
              Test Recipient: {result.testRecipient}
            </p>
          ) : null}

          {result.sampleRecipients && result.sampleRecipients.length > 0 ? (
            <div className="mt-3">
              <p className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Sample Recipients</p>
              <div className="mt-2 max-h-48 overflow-auto rounded border border-border/30">
                {result.sampleRecipients.map((recipient) => (
                  <p key={recipient.email} className="border-b border-border/20 px-3 py-2 font-outfit text-xs text-foreground/90 last:border-0">
                    {recipient.fullName} • {recipient.email}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {result.failures && result.failures.length > 0 ? (
            <div className="mt-3">
              <p className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Failures (first 50)</p>
              <div className="mt-2 max-h-56 overflow-auto rounded border border-border/30">
                {result.failures.map((failure) => (
                  <p key={`${failure.email}-${failure.reason}`} className="border-b border-border/20 px-3 py-2 font-outfit text-xs text-foreground/90 last:border-0">
                    {failure.email} • {failure.code ?? "send_error"} • {failure.reason}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
