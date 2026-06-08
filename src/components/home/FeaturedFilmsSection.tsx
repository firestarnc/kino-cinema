import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFeaturedFilms } from "@/lib/cinema-data";
import type { Film } from "@/lib/cinema-data";

const genreGradients: Record<string, string> = {
  "Action Thriller":
    "from-red-950/90 via-slate-900/80 to-neutral-950/90",
  "Thriller Drama":
    "from-indigo-950/90 via-slate-900/80 to-neutral-950/90",
  "Romantic Drama":
    "from-purple-950/90 via-rose-950/80 to-neutral-950/90",
  "Romantic Comedy":
    "from-emerald-950/90 via-slate-900/80 to-neutral-950/90",
};

function FilmCard({ film, index }: { film: Film; index: number }) {
  const gradient =
    genreGradients[film.genre] ??
    "from-slate-900/90 via-slate-800/80 to-neutral-950/90";

  return (
    <Link
      href={`/screening/${film.id}/`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-500 hover:scale-[1.02] hover:velvet-glow hover:border-primary/30 opacity-0 animate-fade-up"
      style={{ animationDelay: `${0.2 + index * 0.15}s` }}
    >
      {/* Poster placeholder with gradient */}
      <div
        className={`relative aspect-[2/3] w-full bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        {/* Film title overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <p className="font-outfit text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3">
            {film.genre}
          </p>
          <h3 className="font-playfair italic text-xl md:text-2xl text-white/80 leading-tight">
            {film.title}
          </h3>
          <p className="font-outfit text-xs text-white/30 mt-3 max-w-[80%] line-clamp-2">
            {film.tagline}
          </p>
        </div>

        {/* Decorative film frame lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Card info */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-playfair text-sm font-semibold text-foreground truncate">
            {film.title}
          </h4>
          <div className="flex items-center gap-1 text-cinema-gold">
            <Star className="h-3 w-3 fill-cinema-gold" />
            <span className="font-outfit text-xs">{film.imdbRating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px] px-2 py-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
          >
            {film.genre}
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="font-outfit text-xs">{film.duration} min</span>
          </div>
          <span className="font-outfit text-xs">{film.rating}</span>
          <span className="font-outfit text-xs">{film.year}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedFilmsSection() {
  const featured = getFeaturedFilms();

  return (
    <section className="relative py-20 md:py-24">
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-14">
          <h2
            className="font-playfair italic text-3xl md:text-4xl lg:text-5xl text-foreground opacity-0 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Now Showing
          </h2>
          <div
            className="mt-4 h-px w-16 bg-gradient-cinema-gold opacity-0 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          />
        </div>

        {/* Film grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((film, i) => (
            <FilmCard key={film.id} film={film} index={i} />
          ))}
        </div>

        {/* View all link */}
        <div
          className="flex justify-center mt-12 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.9s" }}
        >
          <Link
            href="/now-showing"
            className="font-outfit text-sm text-muted-foreground hover:text-gold transition-colors duration-300 flex items-center gap-2 group"
          >
            View All Films
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
