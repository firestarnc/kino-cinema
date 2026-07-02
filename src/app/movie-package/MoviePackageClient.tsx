"use client";

import { useMemo, useState, useEffect } from "react";
import MoviePackageCard from "@/components/movie-package/MoviePackageCard";
import { moviePackageFilms } from "@/lib/cinema-data";
import { Filter, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "rating" | "title" | "year";

export default function MoviePackageClient() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(timeout);
  }, [query]);

  const filtered = useMemo(() => {
    const normalizedQuery = debouncedQuery.toLowerCase();
    const base = moviePackageFilms.filter((film) => {
      if (!normalizedQuery) return true;
      return (
        film.title.toLowerCase().includes(normalizedQuery) ||
        film.tagline.toLowerCase().includes(normalizedQuery) ||
        film.director.toLowerCase().includes(normalizedQuery) ||
        film.genre.toLowerCase().includes(normalizedQuery) ||
        film.cast.join(" ").toLowerCase().includes(normalizedQuery)
      );
    });

    switch (sortBy) {
      case "rating":
        base.sort((a, b) => (b.imdbRating ?? 0) - (a.imdbRating ?? 0));
        break;
      case "title":
        base.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "year":
        base.sort((a, b) => b.year - a.year);
        break;
    }

    return base;
  }, [debouncedQuery, sortBy]);

  return (
    <>
      <div className="mt-8 grid items-center gap-4 md:grid-cols-[1fr_300px]">
        <div>
          <label htmlFor="search" className="sr-only">
            Search titles, director, cast
          </label>
          <div className="relative">
            <input
              id="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, director, cast or genre..."
              className="w-full rounded-md border border-border/30 bg-secondary/40 px-3 py-2 font-outfit text-sm placeholder:text-muted-foreground"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Filter className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Showing <span className="text-foreground">{filtered.length}</span> results
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-40 border-border/40 bg-secondary/40 font-outfit text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((film, index) => (
          <MoviePackageCard key={film.id} film={film} index={index} />
        ))}
      </section>
    </>
  );
}