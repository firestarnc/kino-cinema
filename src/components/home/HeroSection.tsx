"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full animate-glow-pulse"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary) / 0.04) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-1/4 top-1/4 h-75 w-75 rounded-full animate-glow-pulse"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--cinema-gold) / 0.04) 0%, transparent 60%)",
            animationDelay: "1.5s",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-4xl">
        {/* Eyebrow */}
        <p
          className="font-outfit text-xs md:text-sm uppercase tracking-[0.35em] text-gold mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Private Cinema Experience
        </p>

        {/* Headline */}
        <h1
          className="font-playfair italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] text-foreground opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Where Every Frame
          <br />
          Is <span className="text-primary">Private</span>
        </h1>

        {/* Subheadline */}
        <p
          className="font-outfit text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mt-6 md:mt-8 leading-relaxed opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          Experience cinema as it was meant to be. Exclusive screening rooms.
          Curated films. Uncompromising luxury.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 opacity-0 animate-fade-up"
          style={{ animationDelay: "1s" }}
        >
          <Button
            asChild
            size="lg"
            className="velvet-glow px-8 py-6 text-base font-outfit"
          >
            <Link href="/now-showing">Explore Shows</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base font-outfit border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5"
          >
            <Link href="/experience">Room Experience</Link>
          </Button>
        </div>

        {/* Decorative line with diamonds */}
        <div
          className="flex items-center gap-3 mt-16 md:mt-20 opacity-0 animate-fade-in"
          style={{ animationDelay: "1.3s" }}
        >
          <div className="h-px w-16 md:w-24 bg-gradient-cinema-gold" />
          <div className="h-1.5 w-1.5 rotate-45 bg-cinema-gold/60" />
          <div className="h-px w-8 md:w-12 bg-cinema-gold/30" />
          <div className="h-2 w-2 rotate-45 border border-cinema-gold/60" />
          <div className="h-px w-8 md:w-12 bg-cinema-gold/30" />
          <div className="h-1.5 w-1.5 rotate-45 bg-cinema-gold/60" />
          <div className="h-px w-16 md:w-24 bg-gradient-cinema-gold-left" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
        style={{ animationDelay: "1.8s" }}
      >
        <span className="font-outfit text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Scroll
        </span>
        <ChevronDown className="h-5 w-5 text-muted-foreground/40 animate-float" />
      </div>
    </section>
  );
}
