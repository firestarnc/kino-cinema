import Link from "next/link";
import { Film, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { businessDetails } from "@/lib/site";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.73h-3.18v12.97a2.9 2.9 0 1 1-2.9-2.9c.25 0 .5.03.74.1V8.9a6.1 6.1 0 0 0-.74-.05 6.08 6.08 0 1 0 6.08 6.08V8.37a7.97 7.97 0 0 0 4.67 1.5V6.69h-.9z" />
    </svg>
  );
}

const navigateLinks = [
  { href: "/now-showing/", label: "Now Showing" },
  { href: "/movie-package/book/", label: "Book Tickets" },
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
              <li> <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessDetails.streetAddress}, ${businessDetails.locality}, ${businessDetails.region}`)}`} target="_blank" rel="noopener noreferrer">Avenue 28th, {businessDetails.locality}, {businessDetails.region}</a></li>
              <li>Nigeria</li>
              <li>Hours: {businessDetails.openingHours}</li>
              {businessDetails.phone ? <li>Phone: <a href={`tel:${businessDetails.phone}`}>{businessDetails.phone}</a></li> : null}
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
              href="https://www.instagram.com/kino_screens?igsh=MWxsdHRuMW84Z3lu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground transition-colors duration-300 hover:text-cinema-gold"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.tiktok.com/@kinoscreens?_r=1&_t=ZS-972bPX8NgbB"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-muted-foreground transition-colors duration-300 hover:text-cinema-gold"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
