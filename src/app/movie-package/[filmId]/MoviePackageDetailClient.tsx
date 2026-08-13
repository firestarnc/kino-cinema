import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import PrivateBookingPanel from "@/components/film-detail/PrivateBookingPanel";
import FilmHero from "@/components/film-detail/FilmHero";
import { Separator } from "@/components/ui/separator";
import { getMoviePackageFilmAsFilmById } from "@/lib/cinema-data";

interface MoviePackageDetailClientProps {
  filmId: string;
}

export default function MoviePackageDetailClient({ filmId }: MoviePackageDetailClientProps) {
  const film = getMoviePackageFilmAsFilmById(filmId);

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
      <FilmHero film={film} />

      <Separator className="mx-auto max-w-7xl opacity-20" />

      <PrivateBookingPanel
        filmId={film.id}
        filmTitle={film.title}
        bookingType="movie-package"
        successPath="/movie-package/book/success"
        failedPath="/movie-package/book/failed"
      />

      <div className="h-16" />
    </>
  );
}
