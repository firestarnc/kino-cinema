import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FailedPageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function MoviePackageBookingFailedPage({ searchParams }: FailedPageProps) {
  const params = await searchParams;
  const message = params.message ?? "Payment could not be completed. Your slot is still available until successful payment.";

  return (
    <section className="relative mx-auto min-h-[70vh] max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-border/40 bg-card/50 p-8 text-center backdrop-blur-sm md:p-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-gold" />
        <h1 className="mt-5 font-playfair text-4xl font-bold text-foreground md:text-5xl">Booking Not Completed</h1>
        <p className="mt-4 font-outfit text-sm leading-relaxed text-muted-foreground md:text-base">{message}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="velvet-glow font-outfit text-xs uppercase tracking-[0.25em]">
            <Link href="/movie-package/book/">Try again</Link>
          </Button>
          <Button asChild variant="outline" className="font-outfit text-xs uppercase tracking-[0.25em]">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
