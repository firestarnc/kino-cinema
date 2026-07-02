import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientMount from "./ClientMount";

export default function MoviePackageBookPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-96 w-180 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="font-outfit text-xs uppercase tracking-[0.35em] text-gold">On-Demand Favorites</p>
          <h1 className="mt-6 font-playfair text-4xl font-bold text-foreground md:text-6xl">
            Choose your title first, then book your private showtime.
          </h1>
          <p className="mt-4 font-outfit text-base leading-relaxed text-muted-foreground md:text-lg">
            Real films, premium private-room atmosphere, and movie-package pricing. Pick any title below and tap Book Now to continue into the full booking flow.
          </p>
        </div>

        <ClientMount />

        <section className="mt-12 mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-20 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-sm md:p-10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-cinema-gold/20 to-primary/10" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cinema-gold/20 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-outfit text-xs uppercase tracking-[0.3em] text-gold animate-fade-in">
                  Cut The Chase
                </p>
                <h2 className="mt-3 font-playfair text-3xl font-bold text-foreground md:text-4xl">
                  Don&apos;t know what to watch yet? Book before choosing.
                </h2>
                <p className="mt-3 max-w-2xl font-outfit text-sm text-muted-foreground md:text-base">
                  Reserve your private cinema package first, lock your date and slot,
                  then pick any movie in person when you arrive.
                </p>
              </div>

              <Button
                asChild
                className="velvet-glow shrink-0 font-outfit text-xs uppercase tracking-[0.25em] transition-all duration-300 hover:velvet-glow-strong"
              >
                  <Link href="/movie-package/book/" prefetch>
                  Book Fast
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}