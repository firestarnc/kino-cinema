import Link from "next/link"
import { Film, Instagram, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { businessDetails } from "@/lib/site";

const navigateLinks = [
  { href: "/now-showing/", label: "Now Showing" },
  { href: "/book/", label: "Book Tickets" },
] as const;

const experienceLinks = [
  { href: "/experience/", label: "The Experience" },
  { href: "/membership/", label: "Membership" },
  { href: "/experience/#advertise", label: "Advertise on our Screen" },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/20 bg-background">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          {/* Branding column */}
          <div className="space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2">
              <Film className="h-5 w-5 text-primary transition-colors group-hover:text-cinema-gold" />
              <span className="font-playfair text-lg italic tracking-wide text-foreground">
                KINO
                <span className="mx-1.5 inline-block text-gold opacity-60">
                  &#9670;
                </span>
                SCREENS
              </span>
            </Link>
            <p className="max-w-xs font-outfit text-sm leading-relaxed text-muted-foreground">
              Luxury private cinema in Benin City with premium rooms, curated
              screenings, and memorable experiences for every special moment.
            </p>
          </div>

          {/* Navigate column */}
          <div>
            <h4 className="mb-4 font-playfair text-sm uppercase tracking-widest text-foreground">
              Navigate
            </h4>
            <ul className="space-y-3">
              {navigateLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-outfit text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience column */}
          <div>
            <h4 className="mb-4 font-playfair text-sm uppercase tracking-widest text-foreground">
              Experience
            </h4>
            <ul className="space-y-3">
              {experienceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-outfit text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Local info column */}
          <div>
            <h4 className="mb-4 font-playfair text-sm uppercase tracking-widest text-foreground">
              Benin City
            </h4>
            <ul className="space-y-2 font-outfit text-sm text-muted-foreground">
              <li>{businessDetails.locality}, {businessDetails.region}</li>
              <li>Nigeria</li>
              <li>Hours: {businessDetails.openingHours}</li>
              {businessDetails.phone ? <li>Phone: {businessDetails.phone}</li> : null}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="opacity-20" />

      {/* Bottom bar */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-outfit text-xs text-muted-foreground">
            &copy; {currentYear} Kino Screens. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground transition-colors duration-300 hover:text-cinema-gold"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-muted-foreground transition-colors duration-300 hover:text-cinema-gold"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
