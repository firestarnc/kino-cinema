"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Clock3, Mail, ShieldCheck, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HalloweenCandidate } from "@/lib/halloween-voting";

type VoteFormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  candidateId: string;
};

type CandidatesResponse = {
  candidates?: HalloweenCandidate[];
  error?: string;
};

const initialFormState: VoteFormState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  candidateId: "",
};

export default function HalloweenPage() {
  const [candidates, setCandidates] = useState<HalloweenCandidate[]>([]);
  const [formState, setFormState] = useState<VoteFormState>(initialFormState);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [formStartedAt, setFormStartedAt] = useState(0);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);

  useEffect(() => {
    let mounted = true;

    setFormStartedAt(Date.now());

    async function loadCandidates() {
      try {
        const response = await fetch("/api/halloween/candidates", { cache: "no-store" });
        const body = (await response.json()) as CandidatesResponse;

        if (!response.ok) {
          throw new Error(body.error ?? "Unable to load contestants");
        }

        if (!mounted) {
          return;
        }

        const nextCandidates = body.candidates ?? [];
        setCandidates(nextCandidates);
        setFormState((current) => ({
          ...current,
          candidateId: current.candidateId || nextCandidates[0]?.id || "",
        }));
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(error);
        setMessage("We could not load the contestant list right now.");
      } finally {
        if (mounted) {
          setIsLoadingCandidates(false);
        }
      }
    }

    void loadCandidates();

    return () => {
      mounted = false;
    };
  }, []);

  function updateField(field: keyof VoteFormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/halloween/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          honeypot,
          formStartedAt,
        }),
      });

      const body = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to submit vote");
      }

      setStatus("sent");
      setMessage(body.message ?? "Check your email to verify your vote.");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("We could not submit your vote right now. Please try again.");
    }
  }

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(243,213,138,0.18),_transparent_28%),linear-gradient(180deg,_#1a0811_0%,_#0b0407_42%,_#050205_100%)] py-16 text-foreground sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-16 h-72 w-72 rounded-full bg-cinema-gold/10 blur-[120px]" />
        <div className="absolute right-[-8%] top-24 h-80 w-80 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-[#4b1021]/30 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-cinema-gold/20 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-10 animate-fade-up">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,transparent_65%,rgba(243,213,138,0.04))]" />
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-cinema-gold">
              <span className="inline-flex items-center gap-2 rounded-full border border-cinema-gold/30 bg-black/20 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Halloween Vote
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-foreground/80">
                <ShieldCheck className="h-3.5 w-3.5" /> Email verification required
              </span>
            </div>

            <div className="max-w-2xl space-y-4">
              <p className="font-outfit text-sm uppercase tracking-[0.3em] text-muted-foreground">Kino Screens Halloween Event</p>
              <h1 className="font-playfair text-5xl font-bold leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
                Vote for the <span className="text-gold-gradient">best dressed</span>
                <br />
                Halloween guest.
              </h1>
              <p className="max-w-2xl font-outfit text-base leading-8 text-foreground/75 sm:text-lg">
                Tap to vote, verify by email, and help us crown the most stylish arrival of the night. The look stays elegant and cinematic with subtle Halloween atmosphere.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Clock3, label: "Voting window", value: "Oct 29 - Oct 31" },
                { icon: Mail, label: "Email verified", value: "One click confirm" },
                { icon: CheckCircle2, label: "Duplicate safe", value: "One vote per email" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-cinema-gold" />
                    <p className="mt-3 font-outfit text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                    <p className="mt-1 font-playfair text-xl text-foreground">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-3xl border border-cinema-gold/15 bg-[#12060b]/80 p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Star className="mt-1 h-5 w-5 shrink-0 text-cinema-gold" />
                <div>
                  <p className="font-outfit text-xs uppercase tracking-[0.25em] text-cinema-gold">How it works</p>
                  <p className="mt-2 font-outfit text-sm leading-7 text-foreground/75">
                    Choose your favorite finalist, enter your name, phone number, and email, then verify your ballot from the link we send you. Your verified email can also be used for future cinema updates and promotions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-[#13070d]/95 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl md:p-8 animate-fade-up">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-outfit text-xs uppercase tracking-[0.28em] text-cinema-gold">Tap to vote</p>
                <h2 className="mt-2 font-playfair text-3xl font-bold text-foreground">Select your finalist</h2>
              </div>
              <div className="rounded-full border border-cinema-gold/30 bg-cinema-gold/10 px-4 py-2 font-outfit text-xs uppercase tracking-[0.24em] text-cinema-gold">
                10 finalists
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {isLoadingCandidates ? (
                <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 font-outfit text-sm text-muted-foreground">
                  Loading contestants...
                </div>
              ) : candidates.length === 0 ? (
                <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 font-outfit text-sm text-muted-foreground">
                  No contestants are active yet.
                </div>
              ) : (
                candidates.map((candidate, index) => {
                  const selected = formState.candidateId === candidate.id;

                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => updateField("candidateId", candidate.id)}
                      className={cn(
                        "group rounded-2xl border p-4 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinema-gold/60",
                        selected
                          ? "border-cinema-gold/60 bg-cinema-gold/10 velvet-glow"
                          : "border-white/10 bg-white/5 hover:border-cinema-gold/30 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-outfit text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                            Finalist {index + 1}
                          </p>
                          <p className="mt-2 font-playfair text-xl text-foreground">{candidate.display_name}</p>
                        </div>
                        <span className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm transition",
                          selected
                            ? "border-cinema-gold/60 bg-cinema-gold/20 text-cinema-gold"
                            : "border-white/10 bg-black/20 text-muted-foreground"
                        )}>
                          {index + 1}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <input type="text" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 sm:col-span-2">
                  <span className="font-outfit text-xs uppercase tracking-[0.24em] text-muted-foreground">Full name</span>
                  <input
                    required
                    value={formState.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-outfit text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-cinema-gold/40 focus:bg-black/30"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </label>

                <label className="space-y-2">
                  <span className="font-outfit text-xs uppercase tracking-[0.24em] text-muted-foreground">Email</span>
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-outfit text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-cinema-gold/40 focus:bg-black/30"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>

                <label className="space-y-2">
                  <span className="font-outfit text-xs uppercase tracking-[0.24em] text-muted-foreground">Phone number</span>
                  <input
                    required
                    value={formState.phoneNumber}
                    onChange={(event) => updateField("phoneNumber", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-outfit text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-cinema-gold/40 focus:bg-black/30"
                    placeholder="08012345678"
                    autoComplete="tel"
                  />
                </label>
              </div>

              <input type="hidden" value={formState.candidateId} readOnly />

              <div className="rounded-2xl border border-cinema-gold/15 bg-black/20 px-4 py-3">
                <p className="font-outfit text-xs uppercase tracking-[0.24em] text-cinema-gold">Privacy note</p>
                <p className="mt-2 font-outfit text-sm leading-7 text-foreground/70">
                  By voting, you consent to Kino Screens contacting you about your participation and future cinema updates. We only accept verified email addresses for this voting process.
                </p>
              </div>

              {message ? (
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-3 font-outfit text-sm leading-7",
                    status === "sent" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100" : "border-red-400/40 bg-red-400/10 text-red-100"
                  )}
                >
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading" || candidates.length === 0}
                className="group relative w-full overflow-hidden rounded-full border border-cinema-gold/30 bg-gradient-to-r from-cinema-gold/95 via-[#f3d58a] to-cinema-gold/80 px-6 py-4 font-outfit text-sm font-semibold uppercase tracking-[0.28em] text-[#1b0a12] shadow-[0_0_40px_rgba(243,213,138,0.18)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">{status === "loading" ? "Sending vote..." : "Tap to vote"}</span>
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_65%)] opacity-70 transition group-hover:opacity-100" />
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8 animate-fade-up">
            <div className="flex items-center gap-3 text-cinema-gold">
              <Sparkles className="h-5 w-5" />
              <p className="font-outfit text-xs uppercase tracking-[0.28em]">Kino Screens appreciates you</p>
            </div>
            <p className="mt-3 sm:text-base font-outfit text-sm leading-7 text-foreground/70">
              Thank you for being part of the Halloween experience.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/" className="rounded-full border border-white/10 bg-black/20 px-4 py-2 font-outfit text-xs uppercase tracking-[0.24em] text-foreground/75 transition hover:border-cinema-gold/30 hover:text-cinema-gold">
                Back home
              </Link>
              <Link href="" className="rounded-full border border-cinema-gold/25 bg-cinema-gold/10 px-4 py-2 font-outfit text-xs uppercase tracking-[0.24em] text-cinema-gold transition hover:bg-cinema-gold/15">
                View Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}