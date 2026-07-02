import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import PrivateBookingPanel from "@/components/film-detail/PrivateBookingPanel";
import FilmHero from "@/components/film-detail/FilmHero";
import { Separator } from "@/components/ui/separator";
import { getMoviePackageFilmById } from "@/lib/cinema-data";

interface MoviePackageDetailClientProps {
  filmId: string;
}

export default function MoviePackageDetailClient({ filmId }: MoviePackageDetailClientProps) {
  const film = getMoviePackageFilmById(filmId);

  if (!film) {
    notFound();
  }

  return (
    <>
      <div className="max-w-7xl px-4 pt-20 sm:px-6 md:pt-24 lg:px-8">
        <Link href="/movie-package/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Movie Package
        </Link>
      </div>

      {/* Reuse FilmHero for consistent layout */}
      <FilmHero
        // Cast an object to match Film type shape used by FilmHero
        film={{
          id: film.id,
          title: film.title,
          tagline: film.tagline,
          genre: film.genre,
          duration: film.duration,
          rating: film.rating as any,
          year: film.year,
          director: film.director,
          cast: film.cast,
          synopsis: film.synopsis,
          posterUrl: film.posterUrl,
          backdropUrl: film.posterUrl,
          trailerUrl: "",
          imdbRating: film.imdbRating ?? 0,
        }}
      />

      <Separator className="mx-auto max-w-7xl opacity-20" />

      <PrivateBookingPanel filmId={film.id} filmTitle={film.title} bookingType="movie-package" />

      <div className="h-16" />
    </>
  );
}
