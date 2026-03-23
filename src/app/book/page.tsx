"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        <Film className="mx-auto mb-6 h-12 w-12 text-primary/40" />

        <h1 className="font-playfair text-7xl font-bold italic text-primary">
          404
        </h1>

        <p className="mt-4 font-playfair text-2xl text-foreground">
          The Reel Has Run Out
        </p>

        <p className="mt-2 font-outfit text-muted-foreground">
          This screening doesn't exist. The projector has gone dark.
        </p>

        <Button
          asChild
          className="velvet-glow mt-8 font-outfit text-xs tracking-widest uppercase"
        >
          <Link href="/">Return to Lobby</Link>
        </Button>
      </div>
    </div>
  );
}