"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import FilmHero from "@/components/film-detail/FilmHero";
import ScreeningList from "@/components/film-detail/ScreeningList";
import SeatMap from "@/components/film-detail/SeatMap";
import BookingSummary from "@/components/film-detail/BookingSummary";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import {
  getFilmById,
  getScreeningsByFilm,
  type Screening,
} from "@/lib/cinema-data";

export default function FilmDetail() {
  const params = useParams<{ filmId: string }>();
  const filmId = params?.filmId;
  const film = filmId ? getFilmById(filmId) : undefined;
  const filmScreenings = filmId ? getScreeningsByFilm(filmId) : [];

  // Filter to upcoming screenings only
  const now = new Date().toISOString();
  const upcomingScreenings = filmScreenings
    .filter((s) => s.dateTime > now)
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime));

  const [selectedScreeningId, setSelectedScreeningId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set<string>());

  const selectedScreening: Screening | undefined = upcomingScreenings.find(
    (s) => s.id === selectedScreeningId
  );

  const handleSelectScreening = useCallback(
    (id: string) => {
      if (id === selectedScreeningId) {
        // Deselect
        setSelectedScreeningId(null);
        setSelectedSeats(new Set<string>());
      } else {
        setSelectedScreeningId(id);
        setSelectedSeats(new Set<string>());
      }
    },
    [selectedScreeningId]
  );

  const handleToggleSeat = useCallback((seatId: string) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        next.add(seatId);
      }
      return next;
    });
  }, []);

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

      {/* Screenings section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2 className="font-playfair text-2xl font-bold text-foreground md:text-3xl">
          Available Screenings
        </h2>
        <p className="mt-2 font-outfit text-sm text-muted-foreground">
          Select a screening to choose your seats
        </p>

        <div className="mt-8">
          <ScreeningList
            screenings={upcomingScreenings}
            selectedScreeningId={selectedScreeningId}
            onSelect={handleSelectScreening}
          />
        </div>
      </section>

      {/* Seat selection & booking (shown when screening selected) */}
      {selectedScreening ? (
        <>
          <Separator className="mx-auto max-w-7xl opacity-20" />

          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <h2 className="font-playfair text-2xl font-bold text-foreground md:text-3xl">
              Select Your Seats
            </h2>
            <p className="mt-2 font-outfit text-sm text-muted-foreground">
              Click on available seats to select them
            </p>

            <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start">
              {/* Seat map */}
              <div className="flex-1 rounded-xl border border-border/40 bg-card/40 p-6 backdrop-blur-sm md:p-8">
                <SeatMap
                  screening={selectedScreening}
                  selectedSeats={selectedSeats}
                  onToggleSeat={handleToggleSeat}
                />
              </div>

              {/* Booking summary sidebar */}
              <div className="w-full shrink-0 lg:w-80">
                <BookingSummary
                  screening={selectedScreening}
                  selectedSeatCount={selectedSeats.size}
                />
              </div>
            </div>
          </section>
        </>
      ) : null}

      {/* Bottom spacing */}
      <div className="h-16" />
    </>
  );
}
