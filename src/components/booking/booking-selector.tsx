"use client";

import { useState } from "react";
import Link from "next/link";
import { Clapperboard, MoveRight, ShieldAlert, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {

  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function BookingSelector() {
  const [premiumWarningOpen, setPremiumWarningOpen] = useState(false);

  function handleSeeAffordable() {
    setPremiumWarningOpen(false);
    const affordableCard = document.getElementById("affordable-option");
    affordableCard?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 pb-32 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-112 w-md -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-gold">
            <Clapperboard className="h-5 w-5" />
            <span className="font-outfit text-xs uppercase tracking-[0.35em]">Private Cinema Selection</span>
          </div>

          <h1 className="mt-6 font-playfair text-4xl font-bold text-foreground md:text-6xl">Choose your budget path first</h1>
          <p className="mt-4 font-outfit text-base leading-relaxed text-muted-foreground md:text-lg">
            Direct-from-theaters titles are premium because of producers licensing cut. On-demand
            packages are lower-priced and budget-friendly.
          </p>

          <div className="mt-8 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            <section id="premium-option" className="rounded-2xl border border-gold/50 bg-card/50 p-5 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-gold/50 text-gold">
                  Premium
                </Badge>
              </div>
              <p className="mt-4 font-outfit text-xs uppercase tracking-[0.3em] text-gold">Direct From Theaters</p>
              <h2 className="mt-3 font-playfair text-2xl font-semibold text-foreground">Exclusive cinema releases</h2>
              <p className="mt-3 font-outfit text-sm text-muted-foreground">
                First-run titles with higher producer and studio licensing cuts.
              </p>
              <ul className="mt-4 space-y-2 font-outfit text-sm text-muted-foreground ">
                <li>• Best for brand-new exclusive movies.</li>
                <li>• Includes premium release pricing rules.</li>
              </ul>
              <Button
                type="button"
                onClick={() => setPremiumWarningOpen(true)}
                className="velvet-glow mt-5 w-full font-outfit text-xs uppercase tracking-[0.25em]"
              >
                Continue to Premium Films
                <MoveRight className="ml-1.5 h-4 w-4" />
              </Button>
            </section>

            <section
              id="affordable-option"
              className="rounded-2xl border border-primary/30 bg-primary/10 p-5 backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-primary/50 text-primary">
                  Most affordable
                </Badge>
              </div>
              <p className="mt-4 font-outfit text-xs uppercase tracking-[0.3em] text-gold">On-Demand Favorites</p>
              <h2 className="mt-3 font-playfair text-2xl font-semibold text-foreground">Lower-priced streaming</h2>
              <p className="mt-3 font-outfit text-sm text-muted-foreground">
                Book the cinema with Netflix, YouTube, Prime, or Crunchyroll titles at standard rates.
              </p>
              <ul className="mt-4 space-y-2 font-outfit text-sm text-muted-foreground">
                <li>• Best for budget-conscious private bookings.</li>
                <li>• Fast path for lower-priced experiences.</li>
              </ul>
              <Button
                asChild
                className="velvet-glow mt-5 inline-flex w-full items-center font-outfit text-xs uppercase tracking-[0.25em]"
              >
                <Link href="/movie-package/" prefetch>
                  Explore On-demand Package
                  <MoveRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </section>
          </div>

          
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/40 bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPremiumWarningOpen(true)}
            className="h-12 flex-1 font-outfit text-[11px] uppercase tracking-[0.15em]"
          >
            Premium ₦150k+
          </Button>
          <Button asChild className="h-12 flex-1 font-outfit text-[11px] uppercase tracking-[0.15em]">
            <Link href="/movie-package/" prefetch>
              Affordable ₦50k+
            </Link>
          </Button>
        </div>
      </div>

      <Sheet open={premiumWarningOpen} onOpenChange={setPremiumWarningOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl border-border/50 pb-8">
          <SheetHeader className="pr-10 text-left">
            <div className="mb-1 flex items-center gap-2 text-gold">
              <ShieldAlert className="h-4 w-4" />
              <span className="font-outfit text-xs uppercase tracking-[0.22em]">Premium pricing notice</span>
            </div>
            <SheetTitle className="font-playfair text-2xl">Direct From Theaters is a premium path</SheetTitle>
            <SheetDescription className="font-outfit text-sm leading-relaxed text-muted-foreground">
              These movies are expensive because producers and studio licensing shares are included in ticket pricing.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-5 rounded-xl border border-gold/40 bg-gold/10 p-4">
            <p className="font-outfit text-xs uppercase tracking-[0.2em] text-gold">Expected price range</p>
            <p className="mt-1 font-playfair text-2xl font-semibold text-foreground">₦150k - ₦350k</p>
            <p className="mt-2 flex items-center gap-2 font-outfit text-sm text-muted-foreground">
              <Wallet className="h-4 w-4 text-gold" />
              Choose on-demand if you prefer lower-priced options.
            </p>
          </div>

          <SheetFooter className="mt-6 grid grid-cols-1 gap-2 sm:flex sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleSeeAffordable} className="h-12 font-outfit">
              See Lower-Priced Option
            </Button>
            <Button asChild className="h-12 font-outfit uppercase tracking-[0.16em]">
              <Link href="/blockbuster/">Continue to Premium Films</Link>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
