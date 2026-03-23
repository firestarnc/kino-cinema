import Link from "next/link";
import { Star, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Film } from "@/lib/cinema-data";

interface FilmCardProps {
  film: Film;
  index?: number;
}

const genreGradients: Record<string, string> = {
  "Neo-Noir Thriller":
    "from-primary/60 via-primary/30 to-background",
  "Psychological Drama":
    "from-blue-900/50 via-indigo-900/30 to-background",
  "Musical Thriller":
    "from-purple-900/50 via-primary/30 to-background",
  "Gothic Mystery":
    "from-emerald-900/40 via-gray-900/40 to-background",
  "Horror Noir":
    "from-red-950/60 via-primary/40 to-background",
  "Supernatural Drama":
    "from-cyan-900/40 via-slate-900/40 to-background",
  "Art-House Romance":
    "from-rose-900/40 via-amber-900/20 to-background",
  "Surrealist Thriller":
    "from-violet-900/50 via-fuchsia-900/30 to-background",
};

export default function FilmCard({ film, index = 0 }: FilmCardProps) {
  const gradient =
    genreGradients[film.genre] ??
    "from-primary/40 via-primary/20 to-background";

  return (
    <div
      className="opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden border-border/40 bg-card transition-all duration-500",
          "hover:scale-[1.02] hover:border-primary/40 hover:velvet-glow"
        )}
      >
        {/* Poster area */}
        <div
          className={cn(
            "relative flex h-64 items-end overflow-hidden bg-gradient-to-b",
            gradient
          )}
        >
          {/* Decorative film reel lines */}
          <div className="absolute inset-0 opacity-[0.04]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-px bg-foreground"
                style={{ top: `${(i + 1) * 12}%` }}
              />
            ))}
          </div>

          {/* Film title overlay on poster */}
          <div className="relative z-10 w-full bg-gradient-to-t from-card via-card/80 to-transparent px-5 pb-4 pt-12">
            <h3 className="font-playfair text-xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-gold">
              {film.title}
            </h3>
            <p className="mt-1 font-outfit text-xs italic tracking-wide text-muted-foreground">
              {film.tagline}
            </p>
          </div>

          {/* Rating badge - top right */}
          <Badge
            variant="outline"
            className="absolute right-3 top-3 border-cinema-gold/50 bg-card/80 text-gold backdrop-blur-sm"
          >
            {film.rating}
          </Badge>
        </div>

        <CardContent className="space-y-4 p-5">
          {/* Meta row: genre, duration, IMDB */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="border border-border/40 text-xs"
            >
              {film.genre}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {film.duration} min
            </span>
            <span className="flex items-center gap-1 text-xs text-cinema-gold">
              <Star className="h-3 w-3 fill-cinema-gold" />
              {film.imdbRating}
            </span>
          </div>

          {/* Director */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="font-outfit">
              Directed by{" "}
              <span className="text-foreground/80">{film.director}</span>
            </span>
          </div>

          {/* Synopsis (truncated) */}
          <p className="line-clamp-2 font-outfit text-sm leading-relaxed text-muted-foreground/80">
            {film.synopsis}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-1">
            <Button
              asChild
              size="sm"
              className="flex-1 velvet-glow font-outfit text-xs tracking-wider uppercase transition-all duration-300 hover:velvet-glow-strong"
            >
              <Link href={`/screening/${film.id}`}>Book Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-outfit text-xs tracking-wider uppercase border-border/60 hover:border-cinema-gold/40 hover:text-gold transition-all duration-300"
            >
              <Link href={`/screening/${film.id}`}>Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
