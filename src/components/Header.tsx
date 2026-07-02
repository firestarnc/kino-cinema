"use client";

import Link from "next/link"; // Next.js Link
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import this for active states
import { Menu, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from 'next/image';
import { cn } from "@/lib/utils";


const navLinks = [
  { href: "/", label: "Homepage" },
  { href: "/now-showing/", label: "Now Showing" },
  { href: "/experience/", label: "Experience" },
  { href: "/membership/", label: "Membership" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-none md:backdrop-blur-xl border-b border-border/30"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo - Use href instead of to */}
            <Link
            href="/"
            className="group relative block h-8 w-[120px] sm:h-9 sm:w-[140px] md:h-10 md:w-[170px]"
            aria-label="Kino Screens Home"
          >
            <Image
              src="/logo.svg"
              alt="Kino Screens Logo Benin City"
              fill
              sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 170px"
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-outfit text-sm tracking-widest uppercase transition-colors duration-300",
                    isActive
                      ? "text-gold"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

          {/* Desktop Book Now */}
          <div className="hidden md:block">
            <Button
              asChild
              className="velvet-glow font-outfit text-xs tracking-widest uppercase transition-all duration-300 hover:velvet-glow-strong"
            >
              <Link href="/now-showing/">
                <Ticket className="mr-1.5 h-4 w-4" />
                Book Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:text-gold"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-border/30 bg-background/95 backdrop-blur-sm transition-transform duration-200 ease-out"
                style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", willChange: "transform, opacity" }}
              >
                <SheetHeader className="mb-8">
                  <SheetTitle className="text-left">
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="relative block h-8 w-[130px]"
                      aria-label="Kino Screens Home"
                    >
                      <Image
                        src="/logo.svg"
                        alt="Kino Screens Logo Benin City"
                        fill
                        sizes="130px"
                        className="object-contain object-left"
                        priority
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "font-outfit text-base tracking-widest uppercase transition-colors duration-300",
                          isActive
                            ? "text-gold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-10">
                  <Button
                    asChild
                    className="velvet-glow w-full font-outfit text-xs tracking-widest uppercase"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/now-showing/">
                      <Ticket className="mr-1.5 h-4 w-4" />
                      Book Now
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}