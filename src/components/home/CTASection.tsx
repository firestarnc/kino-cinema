import Link from "next/link"
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-125 w-175 rounded-full animate-glow-pulse"
          style={{
            background:
              "radial-gradient(ellipse, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.03) 50%, transparent 70%)",
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Decorative line */}
          <div
            className="flex items-center gap-2 mb-10 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="h-px w-12 bg-gradient-cinema-gold-40" />
            <div className="h-1.5 w-1.5 rotate-45 bg-cinema-gold/50" />
            <div className="h-px w-12 bg-gradient-cinema-gold-left-40" />
          </div>

          {/* Headline */}
          <h2
            className="font-playfair italic text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Ready for the Ultimate
            <br />
            Cinema Experience?
          </h2>

          {/* Subtext */}
          <p
            className="font-outfit text-base md:text-lg text-muted-foreground mt-5 max-w-lg leading-relaxed opacity-0 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Reserve your private screening room and discover a new standard
            of cinematic luxury, or place your brand on our screens to reach
            an engaged premium audience.
          </p>

          {/* CTA Button */}
          <div
            className="mt-10 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Button
              asChild
              size="lg"
              className="velvet-glow-strong px-10 py-6 text-base font-outfit"
            >
              <Link href="/now-showing">
                Book Your Private Screening
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
