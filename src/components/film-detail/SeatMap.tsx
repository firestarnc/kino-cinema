import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Screening } from "@/lib/cinema-data";
import { getRoomById } from "@/lib/cinema-data";

interface SeatMapProps {
  screening: Screening;
  selectedSeats: Set<string>;
  onToggleSeat: (seatId: string) => void;
}

interface SeatData {
  id: string;
  row: number;
  col: number;
  label: string;
  taken: boolean;
  isVip: boolean;
}

/**
 * Generate seat layout based on room capacity.
 * Randomly marks ~30% as taken using a deterministic seed from screening id.
 */
function generateSeats(screening: Screening): SeatData[] {
  const room = getRoomById(screening.roomId);
  const totalSeats = screening.totalSeats;
  const takenCount = totalSeats - screening.availableSeats;

  // Determine grid dimensions
  let cols: number;
  if (totalSeats <= 4) cols = 2;
  else if (totalSeats <= 8) cols = 4;
  else if (totalSeats <= 12) cols = 4;
  else cols = 5;

  const rows = Math.ceil(totalSeats / cols);
  const isVipRoom = room?.tier === "vip" || room?.tier === "ultra" || room?.tier === "premium";

  // Simple seeded random from screening id
  let seed = 0;
  for (let i = 0; i < screening.id.length; i++) {
    seed = ((seed << 5) - seed + screening.id.charCodeAt(i)) | 0;
  }
  function seededRandom(): number {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed & 0x7fffffff) / 2147483647;
  }

  const seats: SeatData[] = [];
  const rowLetters = "ABCDEFGHIJKLMNOP";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seatIndex = r * cols + c;
      if (seatIndex >= totalSeats) break;

      seats.push({
        id: `${rowLetters[r]}${c + 1}`,
        row: r,
        col: c,
        label: `${rowLetters[r]}${c + 1}`,
        taken: false,
        isVip: isVipRoom && r === 0,
      });
    }
  }

  // Mark some seats as taken
  const indices = seats.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let i = 0; i < Math.min(takenCount, seats.length); i++) {
    seats[indices[i]].taken = true;
  }

  return seats;
}

export default function SeatMap({ screening, selectedSeats, onToggleSeat }: SeatMapProps) {
  const seats = useMemo(() => generateSeats(screening), [screening]);

  const room = getRoomById(screening.roomId);
  const cols = seats.length > 0 ? Math.max(...seats.map((s) => s.col)) + 1 : 4;

  return (
    <div className="flex flex-col items-center">
      {/* Screen indicator */}
      <div className="mb-8 w-full max-w-xs">
        <div className="mx-auto h-1 w-3/4 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="mx-auto mt-1 h-0.5 w-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <p className="mt-2 text-center font-outfit text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Screen
        </p>
      </div>

      {/* Seat grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {seats.map((seat) => {
          const isSelected = selectedSeats.has(seat.id);

          return (
            <button
              key={seat.id}
              disabled={seat.taken}
              onClick={() => onToggleSeat(seat.id)}
              className={cn(
                "seat flex h-8 w-10 items-center justify-center text-xs font-medium sm:h-9 sm:w-12",
                seat.taken
                  ? "seat-taken"
                  : isSelected
                    ? "seat-selected text-primary-foreground"
                    : seat.isVip
                      ? "seat seat-vip text-gold"
                      : "seat-available text-foreground/60"
              )}
              title={seat.taken ? "Taken" : (isSelected ? "Selected" : seat.label)}
            >
              {seat.label}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="seat seat-available h-5 w-6 rounded-t-md" />
          <span className="font-outfit text-xs text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat seat-selected h-5 w-6 rounded-t-md" />
          <span className="font-outfit text-xs text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat seat-taken h-5 w-6 rounded-t-md" />
          <span className="font-outfit text-xs text-muted-foreground">Taken</span>
        </div>
        {seats.some((s) => s.isVip) ? (
          <div className="flex items-center gap-2">
            <div className="seat seat-vip h-5 w-6 rounded-t-md border" />
            <span className="font-outfit text-xs text-muted-foreground">VIP</span>
          </div>
        ) : null}
      </div>

      {/* Room name */}
      <p className="mt-4 text-center font-outfit text-xs text-muted-foreground">
        {room?.name ?? "Unknown Room"}
      </p>
    </div>
  );
}
