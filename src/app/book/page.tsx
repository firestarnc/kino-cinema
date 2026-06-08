import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrivateBookingPanel from "@/components/film-detail/PrivateBookingPanel";

export default function BookPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-6 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-gold">
            <Clapperboard className="h-5 w-5" />
            <span className="font-outfit text-xs uppercase tracking-[0.35em]">
              Cut The Chase
            </span>
          </div>

          <h1 className="mt-6 font-playfair text-4xl font-bold text-foreground md:text-6xl">
            Book the cinema before choosing the movie.
          </h1>
          <p className="mt-4 font-outfit text-base leading-relaxed text-muted-foreground md:text-lg">
            This is the fast path for guests who want to reserve the private cinema first. Choose a package,
            select your preferred date and time slot, and decide what movie to watch when you arrive in person.
          </p>

          <Button asChild className="velvet-glow mt-8 font-outfit text-xs uppercase tracking-[0.3em]">
            <Link href="#booking">Start booking</Link>
          </Button>
        </div>
      </div>

      <PrivateBookingPanel bookingMode="package-only" />
    </div>
  );
}