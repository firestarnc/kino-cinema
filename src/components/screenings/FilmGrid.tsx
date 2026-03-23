import type { Film } from "@/lib/cinema-data";
import FilmCard from "@/components/screenings/FilmCard";

interface FilmGridProps {
  films: Film[];
}

export default function FilmGrid({ films }: FilmGridProps) {
  if (films.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 h-16 w-16 rounded-full bg-secondary/60 flex items-center justify-center">
          <span className="font-playfair text-2xl text-muted-foreground">?</span>
        </div>
        <h3 className="font-playfair text-xl text-foreground">
          No films found
        </h3>
        <p className="mt-2 max-w-sm font-outfit text-sm text-muted-foreground">
          Try adjusting your filters to discover more screenings in our
          collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {films.map((film, index) => (
        <FilmCard key={film.id} film={film} index={index} />
      ))}
    </div>
  );
}
