import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";


export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden border border-cinema-gold/20 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
          style={{
            borderRadius: "2rem",
            backgroundImage: "linear-gradient(135deg, rgba(30,12,18,0.96), rgba(12,5,8,0.95))",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,213,138,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_32%)]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl space-y-2">
              <p className="font-outfit text-xs uppercase tracking-[0.28em] text-cinema-gold">Halloween special</p>
              <h2 className="font-playfair text-3xl font-bold text-foreground sm:text-4xl">Vote for the best dressed guest of Halloween night.</h2>
              <p className="font-outfit text-sm leading-7 text-foreground/72">
                Guests can tap to vote, verify by email, and help us crown the most stylish entrance at the cinema.
              </p>
            </div>
            <Link
              href="/halloween"
              className="inline-flex items-center justify-center rounded-full border border-cinema-gold/30 bg-cinema-gold/10 px-6 py-3 font-outfit text-xs uppercase tracking-[0.26em] text-cinema-gold transition hover:bg-cinema-gold/15"
            >
              Open Halloween vote
            </Link>
          </div>
        </div>
      </section>

      <ExperienceSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}