"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState("/admin/bookings");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("next");
    if (value && value.startsWith("/admin")) {
      setNextPath(value);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "Unable to sign in");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative mx-auto min-h-[70vh] max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-cinema-gold/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-md rounded-2xl border border-border/40 bg-card/50 p-8 backdrop-blur-sm md:p-10">
        <div className="flex items-center gap-2 text-gold">
          <ShieldCheck className="h-5 w-5" />
          <p className="font-outfit text-xs uppercase tracking-[0.25em]">Admin Access</p>
        </div>

        <h1 className="mt-4 font-playfair text-3xl font-bold text-foreground">Sign in to dashboard</h1>
        <p className="mt-2 font-outfit text-sm text-muted-foreground">
          Enter your admin credentials to continue.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Username
            </label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <p className="font-outfit text-xs text-destructive">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="velvet-glow mt-2 w-full font-outfit text-xs uppercase tracking-[0.25em]"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/" className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            Back to homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
