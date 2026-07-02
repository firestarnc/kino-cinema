import type { Film } from "@/lib/cinema-data";
import { useEffect, useState } from "react";
import FilmCard from "@/components/screenings/FilmCard";

interface FilmGridProps {
  films: Film[];
}

export default function FilmGrid({ films }: FilmGridProps) {
  const [loadedCount, setLoadedCount] = useState(0);
  const threshold = Math.min(6, films.length);
  const showSkeleton = loadedCount < threshold;

  useEffect(() => {
    setLoadedCount(0);
  }, [films]);

  const handleImageLoad = () => setLoadedCount((c) => c + 1);

  if (films.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/60">
          <span className="font-playfair text-2xl text-muted-foreground">?</span>
        </div>
        <h3 className="font-playfair text-xl text-foreground">No films found</h3>
        <p className="mt-2 max-w-sm font-outfit text-sm text-muted-foreground">
          Try adjusting your filters to discover more screenings in our collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {films.map((film, index) => (
        <div key={film.id} className="relative">
          <FilmCard film={film} index={index} onImageLoad={handleImageLoad} />
          {showSkeleton && index < threshold ? (
            <div className="pointer-events-none absolute inset-0 animate-pulse rounded-lg border border-border/30 bg-card/30" />
          ) : null}
        </div>
      ))}
    </div>
  );
}