import Link from "next/link";
import FilmHero from "@/components/film-detail/FilmHero";
import PrivateBookingPanel from "@/components/film-detail/PrivateBookingPanel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import {
  getFilmById,
} from "@/lib/cinema-data";

interface FilmDetailClientProps {
  filmId: string;
}

export default function FilmDetail({ filmId }: FilmDetailClientProps) {
  const film = getFilmById(filmId);

  // ---------------------------------------------------------------------------
  // Film not found
  // ---------------------------------------------------------------------------
  if (!film) {
    return (
      <>
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <h1 className="font-playfair text-3xl font-bold text-foreground md:text-4xl">
            Film Not Found
          </h1>
          <p className="mt-3 font-outfit text-muted-foreground">
            The film you are looking for does not exist or has been removed.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/now-showing">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Now Showing
            </Link>
          </Button>
        </div>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* Back link */}
      <div className="max-w-7xl px-4 pt-20 sm:px-6 md:pt-24 lg:px-8">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="font-outfit text-xs text-muted-foreground hover:text-foreground"
        >
          <Link href="/now-showing">
            <ChevronLeft className="mr-1 h-3.5 w-3.5" />
            Back to Now Showing
          </Link>
        </Button>
      </div>

      {/* Hero */}
      <FilmHero film={film} />

      <Separator className="mx-auto max-w-7xl opacity-20" />

      <PrivateBookingPanel filmId={film.id} filmTitle={film.title} />

      {/* Bottom spacing */}
      <div className="h-16" />
    </>
  );
}