"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type VerifyStatus = "idle" | "loading" | "success" | "error";

export default function HalloweenVerifyClient() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState<string>("Checking your vote verification link...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token was found in this link.");
      return;
    }

    let mounted = true;

    async function verifyVote() {
      setStatus("loading");

      try {
        const response = await fetch("/api/halloween/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const body = (await response.json()) as { success?: boolean; alreadyVerified?: boolean; error?: string };

        if (!mounted) {
          return;
        }

        if (!response.ok) {
          throw new Error(body.error ?? "Unable to verify vote");
        }

        setStatus("success");
        setMessage(body.alreadyVerified ? "Your vote was already verified earlier." : "Your vote has been verified successfully.");
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(error);
        setStatus("error");
        setMessage("We could not verify this link. It may have expired or already been used.");
      }
    }

    void verifyVote();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, rgba(243,213,138,0.16), transparent 26%), linear-gradient(180deg, #13070d 0%, #080305 44%, #050205 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-10 h-72 w-72 rounded-full bg-cinema-gold/12 blur-[120px]" />
        <div className="absolute right-[12%] top-24 h-80 w-80 rounded-full bg-primary/18 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cinema-gold/30 bg-cinema-gold/10 text-cinema-gold">
          {status === "loading" ? <Loader2 className="h-7 w-7 animate-spin" /> : status === "success" ? <CheckCircle2 className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7" />}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-cinema-gold">
          <Sparkles className="h-4 w-4" />
          Halloween vote verification
        </div>

        <h1 className="mt-4 font-playfair text-4xl font-bold text-foreground sm:text-5xl">
          {status === "success" ? "Your ballot is verified" : status === "error" ? "Verification needs attention" : "Verifying your vote"}
        </h1>

        <p className={cn("mx-auto mt-4 max-w-2xl font-outfit text-base leading-8 sm:text-lg", status === "success" ? "text-emerald-100/90" : status === "error" ? "text-red-100/90" : "text-foreground/75")}>{message}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/halloween/" className="rounded-full border border-cinema-gold/25 bg-cinema-gold/10 px-5 py-3 font-outfit text-xs uppercase tracking-[0.26em] text-cinema-gold transition hover:bg-cinema-gold/15">
            Back to voting page
          </Link>
          <Link href="/" className="rounded-full border border-white/10 bg-black/20 px-5 py-3 font-outfit text-xs uppercase tracking-[0.26em] text-foreground/80 transition hover:border-cinema-gold/30 hover:text-cinema-gold">
            Visit homepage
          </Link>
        </div>
      </div>
    </section>
  );
}