"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MoviePackageFilm } from "@/lib/cinema-data";

interface MoviePackageCardProps {
  film: MoviePackageFilm;
  index?: number;
}

export default function MoviePackageCard({ film, index = 0 }: MoviePackageCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const detailPath = `/movie-package/${film.id}/`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='10' height='15' viewBox='0 0 10 15' preserveAspectRatio='none'><rect width='100%' height='100%' fill='%23e6e6e6'/></svg>`;
  const blurDataURL = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  const shouldBypassImageOptimization =
    film.posterUrl.includes("supabase.co/storage/v1/object/public/");

  return (
    <div className="opacity-0 animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
      <Card
        className={cn(
          "group relative overflow-hidden border-border/40 bg-card transition-all duration-500",
          "hover:scale-[1.02] hover:border-primary/40 hover:velvet-glow"
        )}
      >
        <div className="relative flex h-64 items-end overflow-hidden bg-secondary/40">
          <div className="absolute inset-0 animate-pulse bg-linear-to-r from-secondary/40 via-secondary/70 to-secondary/40" />

          <Image
            src={film.posterUrl}
            alt={film.title}
            fill
            unoptimized={shouldBypassImageOptimization}
            placeholder="blur"
            blurDataURL={blurDataURL}
            className={cn(
              "object-cover p-2 transition-all duration-700 group-hover:scale-105",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={index < 2}
            onLoad={() => setIsImageLoaded(true)}
          />

          <div className="absolute inset-0 bg-linear-to-t from-card via-card/75 to-transparent" />
          <div className="absolute inset-0 bg-black/25" />

          <div className="relative z-10 w-full px-5 pb-4 pt-12">
            <h3 className="mt-2 font-playfair text-xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-gold">
              {film.title}
            </h3>
            <p className="mt-1 line-clamp-1 font-outfit text-xs italic tracking-wide text-muted-foreground">{film.tagline}</p>
          </div>

          <Badge
            variant="outline"
            className="absolute right-3 top-3 border-cinema-gold/50 bg-card/80 text-gold backdrop-blur-sm"
          >
            {film.rating}
          </Badge>
        </div>

        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="border border-border/40 text-xs">
              {film.genre}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {film.duration} min
            </span>
            <span className="font-outfit text-xs text-muted-foreground">{film.year}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="font-outfit">
              Directed by <span className="text-foreground/80">{film.director}</span>
            </span>
          </div>

          <p className="line-clamp-2 font-outfit text-sm leading-relaxed text-muted-foreground/80">{film.synopsis}</p>

          <div className="flex items-center gap-3 pt-1">
            <Button
              asChild
              size="sm"
              className="flex-1 velvet-glow font-outfit text-xs uppercase tracking-wider transition-all duration-300 hover:velvet-glow-strong"
            >
              <Link href={`${detailPath}#booking`}>Book Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-border/60 font-outfit text-xs uppercase tracking-wider transition-all duration-300 hover:border-cinema-gold/40 hover:text-gold"
            >
              <Link href={detailPath}>Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
