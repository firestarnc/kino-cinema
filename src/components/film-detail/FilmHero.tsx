import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import Image from "next/image";
import type { Film } from "@/lib/cinema-data";

interface FilmHeroProps {
  film: Film;
}

// Gradient backdrops mapped by genre keywords
function getBackdropGradient(genre: string): string {
  const g = genre.toLowerCase();
  if (g.includes("noir") || g.includes("thriller"))
    return "from-primary/40 via-[hsl(345_50%_12%)] to-background";
  if (g.includes("horror"))
    return "from-red-950/50 via-primary/30 to-background";
  if (g.includes("romance"))
    return "from-pink-950/40 via-primary/20 to-background";
  if (g.includes("drama"))
    return "from-[hsl(270_30%_12%)] via-primary/20 to-background";
  if (g.includes("musical"))
    return "from-[hsl(var(--cinema-gold)/0.2)] via-primary/25 to-background";
  if (g.includes("gothic") || g.includes("mystery"))
    return "from-[hsl(240_20%_10%)] via-primary/15 to-background";
  if (g.includes("surreal"))
    return "from-violet-950/40 via-primary/20 to-background";
  return "from-primary/30 via-secondary to-background";
}

export default function FilmHero({ film }: FilmHeroProps) {
  const gradient = getBackdropGradient(film.genre);
  const shouldBypassImageOptimization =
    film.posterUrl.includes("supabase.co/storage/v1/object/public/");

  return (
    <section className="relative overflow-hidden">
      {/* Backdrop gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 md:pb-16 md:pt-20 lg:px-8">
        <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-[240px_1fr]">
          {/* Film poster */}
          <div className="relative mx-auto w-full max-w-[260px] overflow-hidden rounded-xl border border-border/50 bg-card/50 p-2 shadow-xl shadow-black/25 lg:mx-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <Image
                src={film.posterUrl}
                alt={film.title}
                fill
                unoptimized={shouldBypassImageOptimization}
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 260px, 240px"
              />
            </div>
          </div>

          <div>
            {/* Genre & rating badges */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/50 text-primary-foreground">
                {film.genre}
              </Badge>
              <Badge variant="outline" className="border-border text-muted-foreground">
                {film.rating}
              </Badge>
              <Badge variant="outline" className="border-border text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {film.duration} min
              </Badge>
              <Badge variant="outline" className="border-border text-muted-foreground">
                {film.year}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="font-playfair text-4xl font-bold leading-tight tracking-wide text-foreground md:text-5xl lg:text-6xl xl:text-7xl">
              {film.title}
            </h1>

            {/* Tagline */}
            <p className="mt-3 font-playfair text-lg italic text-muted-foreground md:text-xl">
              {film.tagline}
            </p>

            {/* IMDB rating */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-md border border-[hsl(var(--cinema-gold)/0.3)] bg-[hsl(var(--cinema-gold)/0.08)] px-3 py-1.5">
                <Star className="h-4 w-4 fill-[hsl(var(--cinema-gold))] text-[hsl(var(--cinema-gold))]" />
                <span className="font-outfit text-sm font-semibold text-gold">
                  {film.imdbRating}
                </span>
                <span className="font-outfit text-xs text-muted-foreground">/10 IMDb</span>
              </div>
            </div>

            {/* Director & cast */}
            <div className="mt-6 space-y-2">
              <p className="font-outfit text-sm text-foreground">
                <span className="text-muted-foreground">Directed by</span>{" "}
                <span className="font-medium">{film.director}</span>
              </p>
              <p className="font-outfit text-sm text-foreground">
                <span className="text-muted-foreground">Starring</span>{" "}
                <span className="font-medium">{film.cast.join(", ")}</span>
              </p>
            </div>

            {/* Synopsis */}
            <p className="mt-6 max-w-3xl font-outfit text-sm leading-relaxed text-muted-foreground md:text-base">
              {film.synopsis}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
