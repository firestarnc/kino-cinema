import Link from "next/link";
import {
  Volume2,
  Monitor,
  Thermometer,
  ShieldCheck,
  UserCheck,
  UtensilsCrossed,
  Film,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AdsSection from "@/components/experience/AdsSection";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface TechFeature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const techFeatures: TechFeature[] = [
  {
    icon: Volume2,
    title: "Dolby Atmos Surround",
    description:
      "Immersive 3D audio with 128 discrete channels that place sound anywhere in the room, enveloping you in a sphere of crystal-clear fidelity.",
  },
  {
    icon: Monitor,
    title: "4K Laser Projection",
    description:
      "Ultra-bright laser projection with HDR10+ delivers staggering contrast, vivid colour accuracy, and razor-sharp detail on our 8-metre screens.",
  },
  {
    icon: Thermometer,
    title: "Climate-Controlled Rooms",
    description:
      "Each screening room maintains the ideal temperature and humidity, ensuring absolute comfort throughout your private viewing.",
  },
  {
    icon: ShieldCheck,
    title: "Acoustic Isolation",
    description:
      "Triple-wall construction and floating floor design eliminate every outside disturbance, so nothing competes with your film.",
  },
];

interface ServiceFeature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const serviceFeatures: ServiceFeature[] = [
  {
    icon: UserCheck,
    title: "Personal Concierge",
    description:
      "A dedicated concierge is assigned to every booking, handling every detail from arrival to departure.",
  },
  {
    icon: UtensilsCrossed,
    title: "Gourmet Dining",
    description:
      "Food and beverages curated by award-winning chefs, served silently at your seat without interruption.",
  },
  {
    icon: Film,
    title: "Custom Programming",
    description:
      "Request any title from any era. Our film library spans over curated titles, available on demand.",
  },
  {
    icon: Sparkles,
    title: "Special Events",
    description:
      "From intimate birthday celebrations to unforgettable proposals and premiere screenings, we craft the moment.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[300px] w-[400px] rounded-full bg-primary/5 blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-[200px] w-[300px] rounded-full bg-primary/8 blur-[60px]" />
      </div>

      {/* Decorative lines */}
      <div className="pointer-events-none absolute inset-0 cinema-curtain" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p
          className="animate-fade-in font-outfit text-xs tracking-[0.35em] uppercase text-gold opacity-0 md:text-sm"
          style={{ animationDelay: "0.1s" }}
        >
          A Private Cinema Like No Other
        </p>

        <h1
          className="animate-fade-up mt-6 font-playfair text-5xl font-bold italic leading-[1.1] text-foreground opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.3s" }}
        >
          The{" "}
          <span className="text-gold-gradient">KINO</span>{" "}
          Experience
        </h1>

        <p
          className="animate-fade-up mx-auto mt-8 max-w-2xl font-outfit text-base leading-relaxed text-muted-foreground opacity-0 md:text-lg"
          style={{ animationDelay: "0.5s" }}
        >
          Where cinema transcends the screen. Every detail has been considered,
          every moment curated, so you can lose yourself completely in the art of
          film.
        </p>

        <div
          className="animate-fade-up mt-10 flex items-center justify-center gap-1.5 opacity-0"
          style={{ animationDelay: "0.7s" }}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-cinema-gold text-cinema-gold"
            />
          ))}
          <span className="ml-2 font-outfit text-xs tracking-wider text-muted-foreground">
            FIVE-STAR RATED EXPERIENCE
          </span>
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Text */}
          <div className="animate-fade-up text-center opacity-0 md:text-left" style={{ animationDelay: "0.1s" }}>
            <p className="font-outfit text-xs tracking-[0.3em] uppercase text-gold">
              Our Philosophy
            </p>
            <h2 className="mt-4 font-playfair text-3xl font-semibold italic leading-snug text-foreground md:text-4xl lg:text-5xl">
              Cinema Is Not Watched.{" "}
              <span className="text-primary">It Is Felt.</span>
            </h2>
            <Separator className="mx-auto my-6 w-16 bg-primary/40 md:mx-0" />
            <p className="font-outfit text-base leading-relaxed text-muted-foreground md:text-lg">
              KINO was founded on a singular belief: that cinema deserves more
              than a crowded auditorium and a sticky floor. It deserves reverence.
              Every screening at KINO is an occasion -- a confluence of
              world-class projection, impeccable acoustics, and an atmosphere so
              deliberate you feel it the moment you cross our threshold.
            </p>
            <p className="mt-4 font-outfit text-base leading-relaxed text-muted-foreground md:text-lg">
              We do not simply show films. We create the conditions for
              transcendence. The softest velvet, the purest sound, the most
              attentive service -- all orchestrated so you can surrender entirely
              to the story unfolding before you.
            </p>
          </div>

          {/* Decorative element */}
          <div
            className="animate-fade-up relative flex items-center justify-center opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative h-80 w-full max-w-sm md:h-96">
              {/* Outer frame */}
              <div className="absolute inset-0 rounded-sm border border-primary/20" />
              {/* Inner frame offset */}
              <div className="absolute inset-4 rounded-sm border border-cinema-gold/20" />
              {/* Center content */}
              <div className="absolute inset-8 flex flex-col items-center justify-center rounded-sm bg-cinema-surface/60 backdrop-blur-sm">
                <Film className="mb-4 h-10 w-10 text-primary/60" />
                <p className="font-playfair text-2xl italic text-foreground/80 md:text-3xl">
                  Est. 2026
                </p>
                <p className="mt-2 font-outfit text-xs tracking-[0.3em] uppercase text-muted-foreground">
                  The Art of Private Cinema
                </p>
                <div className="mt-4 flex gap-1">
                  <span className="h-px w-6 bg-cinema-gold/40" />
                  <span className="h-px w-3 bg-cinema-gold/20" />
                </div>
              </div>
              {/* Corner accents */}
              <div className="absolute -left-1 -top-1 h-4 w-4 border-l border-t border-cinema-gold/40" />
              <div className="absolute -right-1 -top-1 h-4 w-4 border-r border-t border-cinema-gold/40" />
              <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b border-l border-cinema-gold/40" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b border-r border-cinema-gold/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnologySection() {
  return (
    <section className="relative py-20 md:py-28">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center md:mb-16">
          <p className="font-outfit text-xs tracking-[0.3em] uppercase text-gold">
            Engineering Excellence
          </p>
          <h2 className="mt-4 font-playfair text-3xl font-semibold italic text-foreground md:text-4xl lg:text-5xl">
            State of the Art Technology
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-outfit text-base text-muted-foreground">
            Every room is built to reference-grade standards, delivering an
            experience that rivals the finest post-production studios in Benin City.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {techFeatures.map((feature, index) => (
            <Card
              key={feature.title}
              className={cn(
                "animate-fade-up group border-border/30 bg-cinema-surface opacity-0 transition-all duration-500 hover:border-primary/30 hover:bg-cinema-surface-hover hover:velvet-glow"
              )}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <CardHeader className="items-center pb-3 text-center sm:items-start sm:text-left">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20 group-hover:text-cinema-gold">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="font-playfair text-lg font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center sm:text-left">
                <p className="font-outfit text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center md:mb-16">
          <p className="font-outfit text-xs tracking-[0.3em] uppercase text-gold">
            Beyond Expectation
          </p>
          <h2 className="mt-4 font-playfair text-3xl font-semibold italic text-foreground md:text-4xl lg:text-5xl">
            White Glove Service
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-outfit text-base text-muted-foreground">
            From the moment you arrive until long after the credits roll, our
            team anticipates your every need with quiet precision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {serviceFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-up group flex flex-col items-center gap-4 text-center opacity-0 md:flex-row md:items-start md:gap-5 md:text-left"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border/30 bg-cinema-surface text-primary transition-all duration-300 group-hover:border-primary/30 group-hover:text-cinema-gold group-hover:velvet-glow">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-playfair text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 font-outfit text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 cinema-curtain" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-outfit text-xs tracking-[0.3em] uppercase text-gold">
          Your Story Awaits
        </p>
        <h2 className="mt-4 font-playfair text-3xl font-bold italic text-foreground md:text-4xl lg:text-5xl">
          Begin Your Journey
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-outfit text-base leading-relaxed text-muted-foreground md:text-lg">
          Step beyond the ordinary. Reserve your private screening and discover
          what cinema was always meant to be.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="velvet-glow min-w-[220px] font-outfit text-xs tracking-widest uppercase transition-all duration-300 hover:velvet-glow-strong"
          >
            <Link href="/book/">Book Your First Screening</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[220px] border-border/40 font-outfit text-xs tracking-widest uppercase text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground"
          >
            <Link href="/private-rooms">Explore Our Rooms</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Experience() {
  return (
    <>
      <HeroSection />
      <Separator className="mx-auto max-w-7xl opacity-10" />
      <PhilosophySection />
      <Separator className="mx-auto max-w-7xl opacity-10" />
      <TechnologySection />
      <Separator className="mx-auto max-w-7xl opacity-10" />
      <ServiceSection />
      <Separator className="mx-auto max-w-7xl opacity-10" />
      <AdsSection />
      <Separator className="mx-auto max-w-7xl opacity-10" />
      <CtaSection />
    </>
  );
}
