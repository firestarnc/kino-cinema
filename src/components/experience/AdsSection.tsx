"use client";

import { FormEvent, useState } from "react";
import { Megaphone, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ApiError {
  error?: string;
}

export default function AdsSection() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      fullName: String(form.get("fullName") ?? "").trim(),
      companyName: String(form.get("companyName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phoneNumber: String(form.get("phoneNumber") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/ads-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as ApiError;
        setStatus("error");
        const message = data.error ?? "Unable to send your message right now.";
        setErrorMessage(message);
        toast.error("Could not send request", {
          description: message,
        });
        return;
      }

      formElement.reset();
      setStatus("success");
      toast.success("Request sent", {
        description: "We would reach out immediately via contact@kinoscreens.com.",
      });
    } catch {
      setStatus("error");
      setErrorMessage("Unable to send your message right now.");
      toast.error("Could not send request", {
        description: "Unable to send your message right now.",
      });
    }
  }

  return (
    <section id="advertise" className="relative overflow-hidden py-20 md:py-28 scroll-mt-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center md:mb-16">
          <p className="font-outfit text-xs tracking-[0.3em] uppercase text-gold">Exclusive Access</p>
          <div className="mt-5 inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-primary">
            <Megaphone className="mr-2 h-4 w-4" />
            <span className="font-outfit text-[11px] tracking-[0.22em] uppercase">Brand Promotion</span>
          </div>
          <h2 className="mt-5 font-playfair text-3xl font-semibold italic text-foreground md:text-4xl lg:text-5xl">
            Advertise on Our Screen
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-outfit text-base leading-relaxed text-muted-foreground md:text-lg">
            Be seen with your video ads and put your business in front of our audience of premium viewers. We offer
            continuous playback for as long as it is pleasing to you, delivered in a cinematic environment that keeps
            your message unforgettable.
          </p>
        </div>

        <div className="grid gap-8 rounded-2xl border border-border/30 bg-cinema-surface p-6 md:grid-cols-5 md:p-8">
          <div className="space-y-5 md:col-span-2">
            <h3 className="font-playfair text-2xl italic text-foreground">Start Your Campaign</h3>
            <p className="font-outfit text-sm leading-relaxed text-muted-foreground">
              Tell us about your brand, campaign idea, and duration. Our team will tailor a placement package that fits
              your goals.
            </p>
            <div className="rounded-xl border border-primary/25 bg-primary/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="font-outfit text-xs tracking-[0.24em] uppercase">Fast Response</span>
              </div>
              <p className="font-outfit text-sm leading-relaxed text-muted-foreground">
                We would reach out immediately via contact@kinoscreens.com once your request is received.
              </p>
            </div>
          </div>

          <form className="space-y-4 md:col-span-3" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="font-outfit text-xs tracking-[0.2em] uppercase text-muted-foreground">Full Name</span>
                <input
                  name="fullName"
                  required
                  className="h-11 w-full rounded-md border border-border/50 bg-background/60 px-3 font-outfit text-sm text-foreground outline-none transition-colors focus:border-primary/40"
                  placeholder="Your full name"
                />
              </label>
              <label className="space-y-2">
                <span className="font-outfit text-xs tracking-[0.2em] uppercase text-muted-foreground">Company Name</span>
                <input
                  name="companyName"
                  required
                  className="h-11 w-full rounded-md border border-border/50 bg-background/60 px-3 font-outfit text-sm text-foreground outline-none transition-colors focus:border-primary/40"
                  placeholder="Your business name"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="font-outfit text-xs tracking-[0.2em] uppercase text-muted-foreground">Email Address</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="h-11 w-full rounded-md border border-border/50 bg-background/60 px-3 font-outfit text-sm text-foreground outline-none transition-colors focus:border-primary/40"
                  placeholder="name@company.com"
                />
              </label>
              <label className="space-y-2">
                <span className="font-outfit text-xs tracking-[0.2em] uppercase text-muted-foreground">Phone Number</span>
                <input
                  name="phoneNumber"
                  className="h-11 w-full rounded-md border border-border/50 bg-background/60 px-3 font-outfit text-sm text-foreground outline-none transition-colors focus:border-primary/40"
                  placeholder="+234 800 000 0000"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="font-outfit text-xs tracking-[0.2em] uppercase text-muted-foreground">Campaign Brief</span>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full rounded-md border border-border/50 bg-background/60 px-3 py-2.5 font-outfit text-sm text-foreground outline-none transition-colors focus:border-primary/40"
                placeholder="Tell us about your ad content, goals, and preferred playback duration."
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                disabled={status === "submitting"}
                className="velvet-glow font-outfit text-xs uppercase tracking-[0.22em]"
              >
                <Send className="mr-2 h-4 w-4" />
                {status === "submitting" ? "Sending Request..." : "Send Advertising Request"}
              </Button>

              {status === "success" ? (
                <p className="font-outfit text-sm text-cinema-gold">Request sent successfully. We would reach out immediately.</p>
              ) : null}
              {status === "error" ? (
                <p className="font-outfit text-sm text-red-300">{errorMessage}</p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
