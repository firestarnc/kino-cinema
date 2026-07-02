import Link from "next/link";
import { Check, ChevronRight, Star } from "lucide-react";
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

export default function MembershipPage() {
  return (
    <div className="relative overflow-hidden pt-20">
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-outfit text-xs tracking-[0.35em] uppercase text-gold md:text-sm">Exclusive Access</p>
          <h1 className="mt-6 font-playfair text-5xl font-bold italic leading-[1.1] text-foreground sm:text-6xl md:text-7xl">
            Membership
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-outfit text-base leading-relaxed text-muted-foreground md:text-lg">
            Choose the tier that suits your lifestyle. Every membership opens the door to a world of private cinema,
            refined hospitality, and unforgettable evenings.
          </p>
          <div className="mt-9 flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-cinema-gold text-cinema-gold" />
            ))}
            <span className="ml-2 font-outfit text-xs tracking-wider text-muted-foreground">PREMIUM MEMBER EXPERIENCE</span>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl opacity-10" />

      <section className="relative py-20 md:py-28">
        <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[400px] rounded-full bg-primary/4 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {membershipTiers.map((tier, index) => (
              <Card
                key={tier.name}
                className={cn(
                  "animate-fade-up relative flex flex-col border-border/30 bg-cinema-surface opacity-0 transition-all duration-500 hover:border-primary/30",
                  tier.highlighted && "border-primary/40 velvet-glow-strong md:-mt-4 md:mb-4",
                  tier.goldBorder && "border-cinema-gold/30 shadow-[0_0_40px_hsl(38_75%_55%/0.08)]"
                )}
                style={{ animationDelay: `${0.1 + index * 0.15}s` }}
              >
                {tier.badge ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="border-0 bg-primary px-4 py-1 font-outfit text-[10px] tracking-widest uppercase text-primary-foreground">
                      {tier.badge}
                    </Badge>
                  </div>
                ) : null}

                <CardHeader className="items-center pb-2 pt-8 text-center">
                  <p className={cn("font-outfit text-xs tracking-[0.4em] uppercase", tier.goldBorder ? "text-gold" : "text-muted-foreground")}>
                    {tier.name}
                  </p>
                  <CardTitle className="mt-3 flex items-baseline justify-center gap-1">
                    <span className="font-playfair text-4xl font-bold text-foreground md:text-5xl">₦{tier.price}</span>
                    <span className="font-outfit text-sm text-muted-foreground">/month</span>
                  </CardTitle>
                </CardHeader>

                <Separator className="mx-6 my-2 bg-border/40" />

                <CardContent className="flex-1 pt-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className={cn("mt-0.5 h-4 w-4 shrink-0", tier.goldBorder ? "text-cinema-gold" : "text-primary")} />
                        <span className="font-outfit text-sm text-muted-foreground">{feature}</span>
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
                    <Link href="/now-showing/">
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
    </div>
  );
}
