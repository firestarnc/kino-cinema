"use client";

import { useState, useMemo } from "react";
import { Filter, ArrowUpDown, Clapperboard } from "lucide-react";
import FilmGrid from "@/components/screenings/FilmGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { films } from "@/lib/cinema-data";
import { cn } from "@/lib/utils";

const genres = [
  "All",
  "Neo-Noir Thriller",
  "Psychological Drama",
  "Musical Thriller",
  "Gothic Mystery",
  "Horror Noir",
  "Supernatural Drama",
  "Art-House Romance",
  "Surrealist Thriller",
] as const;

type SortOption = "date" | "rating" | "title";

export default function Screenings() {
  const [activeGenre, setActiveGenre] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const filteredFilms = useMemo(() => {
    const result =
      activeGenre === "All"
        ? [...films]
        : films.filter((f) => f.genre === activeGenre);

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.imdbRating - a.imdbRating);
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date":
        result.sort((a, b) => b.year - a.year);
        break;
    }

    return result;
  }, [activeGenre, sortBy]);

  return (
    <>
      {/* Hero header */}
      <section className="relative overflow-hidden border-b border-border/20">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 bg-primary/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 md:pb-14 md:pt-16 lg:px-8">
          <div className="flex items-center gap-3 text-cinema-gold mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Clapperboard className="h-5 w-5" />
            <span className="font-outfit text-xs tracking-[0.3em] uppercase">
              Private Cinema Collection
            </span>
          </div>

          <h1
            className="font-playfair text-4xl font-bold tracking-tight text-foreground opacity-0 animate-fade-up sm:text-5xl md:text-6xl"
            style={{ animationDelay: "200ms" }}
          >
            Now{" "}
            <span className="text-gold-gradient">Showing</span>
          </h1>

          <p
            className="mt-4 max-w-xl font-outfit text-base leading-relaxed text-muted-foreground opacity-0 animate-fade-up md:text-lg"
            style={{ animationDelay: "350ms" }}
          >
            Curated screenings in our private theatres. Select a film to
            reserve your seats for an unforgettable evening.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-16 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl md:top-20">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Genre filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide md:pb-0">
              <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveGenre(genre)}
                    className={cn(
                      "shrink-0 font-outfit text-xs tracking-wider whitespace-nowrap transition-all duration-300",
                      activeGenre === genre
                        ? "bg-primary/20 text-gold border border-primary/40"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    )}
                  >
                    {genre === "All" ? "All Genres" : genre}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select
                value={sortBy}
                onValueChange={(val) => setSortBy(val as SortOption)}
              >
                <SelectTrigger className="w-[160px] border-border/40 bg-secondary/40 font-outfit text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="date">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Film grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        {/* Results count */}
        <p className="mb-6 font-outfit text-sm text-muted-foreground">
          {filteredFilms.length}{" "}
          {filteredFilms.length === 1 ? "film" : "films"} available
          {activeGenre !== "All" ? (
            <span>
              {" "}
              in{" "}
              <span className="text-gold">{activeGenre}</span>
            </span>
          ) : null}
        </p>

        <FilmGrid films={filteredFilms} />
      </section>
    </>
  );
}
