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
  Check,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      "Request any title from any era. Our film library spans over 100,000 titles, available on demand.",
  },
  {
    icon: Sparkles,
    title: "Special Events",
    description:
      "From intimate birthday celebrations to unforgettable proposals and premiere screenings, we craft the moment.",
  },
];

interface MembershipTier {
  name: string;
  price: number;
  features: string[];
  highlighted: boolean;
  badge?: string;
  goldBorder: boolean;
}

const membershipTiers: MembershipTier[] = [
  {
    name: "SILVER",
    price: 200000,
    features: [
      "5 screenings per month",
      "Standard screening rooms",
      "Complimentary beverages",
      "Online booking portal",
      "Member newsletter",
    ],
    highlighted: false,
    goldBorder: false,
  },
  {
    name: "GOLD",
    price: 500000,
    features: [
      "10 screenings per month",
      "Premium screening rooms",
      "Priority booking access",
      "Gourmet snack pairing",
      "Guest passes (2/month)",
      "Exclusive member events",
    ],
    highlighted: true,
    badge: "Most Popular",
    goldBorder: false,
  },
  {
    name: "PLATINUM",
    price: 1000000,
    features: [
      "Unlimited screenings",
      "All rooms including VIP suites",
      "24/7 personal concierge",
      "Private event hosting",
      "Complimentary gourmet dining",
      "Priority new-release access",
      "Companion membership included",
    ],
    highlighted: false,
    goldBorder: true,
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
          <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.1s" }}>
            <p className="font-outfit text-xs tracking-[0.3em] uppercase text-gold">
              Our Philosophy
            </p>
            <h2 className="mt-4 font-playfair text-3xl font-semibold italic leading-snug text-foreground md:text-4xl lg:text-5xl">
              Cinema Is Not Watched.{" "}
              <span className="text-primary">It Is Felt.</span>
            </h2>
            <Separator className="my-6 w-16 bg-primary/40" />
            <p className="font-outfit text-base leading-relaxed text-muted-foreground md:text-lg">
              NOIR was founded on a singular belief: that cinema deserves more
              than a crowded auditorium and a sticky floor. It deserves reverence.
              Every screening at NOIR is an occasion -- a confluence of
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
                  Est. 2024
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
            experience that rivals the finest post-production studios in the
            world.
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
              <CardHeader className="pb-3">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20 group-hover:text-cinema-gold">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="font-playfair text-lg font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              className="animate-fade-up group flex gap-5 opacity-0"
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

function MembershipSection() {
  return (
    <section className="relative py-20 md:py-28">
      {/* Background accents */}
      <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[400px] rounded-full bg-primary/4 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center md:mb-16">
          <p className="font-outfit text-xs tracking-[0.3em] uppercase text-gold">
            Exclusive Access
          </p>
          <h2 className="mt-4 font-playfair text-3xl font-semibold italic text-foreground md:text-4xl lg:text-5xl">
            Membership
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-outfit text-base text-muted-foreground">
            Choose the tier that suits your lifestyle. Every membership opens the
            door to a world of private cinema, refined hospitality, and
            unforgettable evenings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {membershipTiers.map((tier, index) => (
            <Card
              key={tier.name}
              className={cn(
                "animate-fade-up relative flex flex-col border-border/30 bg-cinema-surface opacity-0 transition-all duration-500 hover:border-primary/30",
                tier.highlighted &&
                  "border-primary/40 velvet-glow-strong md:-mt-4 md:mb-4",
                tier.goldBorder &&
                  "border-cinema-gold/30 shadow-[0_0_40px_hsl(38_75%_55%/0.08)]"
              )}
              style={{ animationDelay: `${0.1 + index * 0.15}s` }}
            >
              {/* Badge for highlighted tier */}
              {tier.badge ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="border-0 bg-primary px-4 py-1 font-outfit text-[10px] tracking-widest uppercase text-primary-foreground">
                    {tier.badge}
                  </Badge>
                </div>
              ) : null}

              <CardHeader className="items-center pb-2 pt-8 text-center">
                <p
                  className={cn(
                    "font-outfit text-xs tracking-[0.4em] uppercase",
                    tier.goldBorder ? "text-gold" : "text-muted-foreground"
                  )}
                >
                  {tier.name}
                </p>
                <CardTitle className="mt-3 flex items-baseline justify-center gap-1">
                  <span className="font-playfair text-4xl font-bold text-foreground md:text-5xl">
                    ₦{tier.price}
                  </span>
                  <span className="font-outfit text-sm text-muted-foreground">
                    /month
                  </span>
                </CardTitle>
              </CardHeader>

              <Separator className="mx-6 my-2 bg-border/40" />

              <CardContent className="flex-1 pt-4">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          tier.goldBorder ? "text-cinema-gold" : "text-primary"
                        )}
                      />
                      <span className="font-outfit text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  asChild
                  className={cn(
                    "w-full font-outfit text-xs tracking-widest uppercase transition-all duration-300",
                    tier.goldBorder
                      ? "border border-cinema-gold/40 bg-cinema-gold/10 text-cinema-gold hover:bg-cinema-gold/20"
                      : tier.highlighted
                        ? "velvet-glow hover:velvet-glow-strong"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                  )}
                  size="lg"
                >
                  <Link href="/book">
                    Join Now
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
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
            <Link href="/book">Book Your First Screening</Link>
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
      <MembershipSection />
      <Separator className="mx-auto max-w-7xl opacity-10" />
      <CtaSection />
    </>
  );
}
