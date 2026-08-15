"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter, ArrowUpDown, Clapperboard, MoveRight } from "lucide-react";
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
  "Action Thriller",
  "Thriller Drama",
  "Romantic Drama",
  "Romantic Comedy",
  "Family Drama",
] as const;

type SortOption = "date" | "rating" | "title";

export default function NowShowingClient() {
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
      <section className="relative overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 bg-primary/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 md:pb-14 md:pt-16 lg:px-8">
          <div className="mb-4 flex items-center gap-3 text-cinema-gold opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Clapperboard className="h-5 w-5" />
            <span className="font-outfit text-xs uppercase tracking-[0.3em]">
             Direct From Theaters
            </span>
          </div>

          <h1
            className="font-playfair text-4xl font-bold tracking-tight text-foreground opacity-0 animate-fade-up sm:text-5xl md:text-6xl"
            style={{ animationDelay: "200ms" }}
          >
            First-Run <span className="text-gold-gradient">Cinema Releases</span>
          </h1>

          <p
            className="mt-4 max-w-xl font-outfit text-base leading-relaxed text-muted-foreground opacity-0 animate-fade-up md:text-lg"
            style={{ animationDelay: "350ms" }}
          >
            Explore exclusive, major studio films currently playing in commercial theaters worldwide and pick a title for your next cinema experience.
          </p>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl md:top-20">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveGenre(genre)}
                    className={cn(
                      "shrink-0 whitespace-nowrap font-outfit text-xs tracking-wider transition-all duration-300",
                      activeGenre === genre
                        ? "border border-primary/40 bg-primary/20 text-gold"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    {genre === "All" ? "All Genres" : genre}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
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

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <p className="mb-6 font-outfit text-sm text-muted-foreground">
          {filteredFilms.length} {filteredFilms.length === 1 ? "film" : "films"} available
          {activeGenre !== "All" ? (
            <span>
              {" "}in <span className="text-gold">{activeGenre}</span>
            </span>
          ) : null}
        </p>

        <FilmGrid films={filteredFilms} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-sm md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-cinema-gold/20 to-primary/10" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cinema-gold/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-outfit text-xs uppercase tracking-[0.3em] text-gold animate-fade-in">
                Cut The Chase
              </p>
              <h2 className="mt-3 font-playfair text-3xl font-bold text-foreground md:text-4xl">
                Don&apos;t know what to watch yet? Book before choosing.
              </h2>
              <p className="mt-3 max-w-2xl font-outfit text-sm text-muted-foreground md:text-base">
                Reserve your private cinema package first, lock your date and slot,
                then pick any movie in person when you arrive.
              </p>
            </div>

            <Button
              asChild
              className="velvet-glow shrink-0 font-outfit text-xs uppercase tracking-[0.25em] transition-all duration-300 hover:velvet-glow-strong"
            >
              <Link href="/book/">
                Book Fast
                <MoveRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}