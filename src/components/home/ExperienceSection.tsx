import { Lock, Film, Wine, Projector } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Lock,
    title: "Private Screenings",
    description:
      "Your own theatre, your own rules. Every screening is exclusively yours -- no strangers, no interruptions, no compromises.",
  },
  {
    icon: Film,
    title: "Curated Selection",
    description:
      "Hand-picked films from classic to contemporary. Our cinephile curators assemble a rotating collection you will not find anywhere else.",
  },
  {
    icon: Wine,
    title: "Luxury Service",
    description:
      "Premium refreshments, personal concierge, and bespoke dining experiences crafted to complement your chosen film.",
  },
  {
    icon: Projector,
    title: "State of the Art",
    description:
      "Dolby Atmos immersive audio, 4K laser projection, and acoustically engineered rooms built for cinematic perfection.",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <div
      className="group relative flex flex-col items-center text-center p-6 md:p-8 rounded-lg border border-border/30 bg-card/50 transition-all duration-500 hover:border-primary/20 hover:bg-card/80 opacity-0 animate-fade-up"
      style={{ animationDelay: `${0.2 + index * 0.15}s` }}
    >
      {/* Icon container */}
      <div className="relative mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/5 transition-all duration-500 group-hover:border-primary/40 group-hover:bg-primary/10">
          <Icon className="h-6 w-6 text-primary transition-transform duration-500 group-hover:scale-110" />
        </div>
        {/* Subtle glow behind icon on hover */}
        <div className="absolute inset-0 -m-2 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      </div>

      {/* Text */}
      <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
        {feature.title}
      </h3>
      <p className="font-outfit text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section className="relative py-20 md:py-24">
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-14">
          <p
            className="font-outfit text-xs uppercase tracking-[0.3em] text-gold mb-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            The Experience
          </p>
          <h2
            className="font-playfair italic text-3xl md:text-4xl lg:text-5xl text-foreground opacity-0 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            What We Offer
          </h2>
          <div
            className="mt-4 h-px w-16 bg-gradient-cinema-gold opacity-0 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          />
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
