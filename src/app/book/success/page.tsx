import Link from "next/link";
import { CheckCircle2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const reference = params.ref ?? "-";

  return (
    <section className="relative mx-auto min-h-[70vh] max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-cinema-gold/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-border/40 bg-card/50 p-8 text-center backdrop-blur-sm md:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
        <h1 className="mt-5 font-playfair text-4xl font-bold text-foreground md:text-5xl">Booking Confirmed</h1>
        <p className="mt-4 font-outfit text-sm leading-relaxed text-muted-foreground md:text-base">
          Your private cinema slot is reserved. You can choose your movie in person when you arrive at the cinema.
        </p>

        <div className="mt-6 rounded-xl border border-cinema-gold/60 bg-cinema-gold/20 px-4 py-3">
          <p className="font-outfit text-xs uppercase tracking-[0.25em] text-muted-foreground">Reference</p>
          <p className="mt-1 font-outfit text-sm font-semibold text-gold">{reference}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="velvet-glow font-outfit text-xs uppercase tracking-[0.25em]">
            <Link href="/book/">
              <Ticket className="mr-1.5 h-4 w-4" />
              Make another booking
            </Link>
          </Button>
          <Button asChild variant="outline" className="font-outfit text-xs uppercase tracking-[0.25em]">
            <Link href="/blockbuster">Browse films</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
