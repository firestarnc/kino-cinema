import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Screening } from "@/lib/cinema-data";
import { getRoomById } from "@/lib/cinema-data";

interface ScreeningListProps {
  screenings: Screening[];
  selectedScreeningId: string | null;
  onSelect: (id: string) => void;
}

function formatScreeningDate(iso: string): { date: string; time: string; dayLabel: string } {
  const d = new Date(iso);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  let dayLabel: string;
  if (d.toDateString() === now.toDateString()) {
    dayLabel = "Today";
  } else if (d.toDateString() === tomorrow.toDateString()) {
    dayLabel = "Tomorrow";
  } else {
    dayLabel = d.toLocaleDateString("en-US", { weekday: "long" });
  }

  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time, dayLabel };
}

export default function ScreeningList({
  screenings,
  selectedScreeningId,
  onSelect,
}: ScreeningListProps) {
  if (screenings.length === 0) {
    return (
      <div className="rounded-lg border border-border/40 bg-card/40 p-8 text-center">
        <p className="font-outfit text-muted-foreground">
          No upcoming screenings available for this film.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {screenings.map((screening) => {
        const room = getRoomById(screening.roomId);
        const { date, time, dayLabel } = formatScreeningDate(screening.dateTime);
        const isSelected = selectedScreeningId === screening.id;
        const seatsLeft = screening.availableSeats;
        const isLow = seatsLeft <= 3;

        return (
          <button
            key={screening.id}
            onClick={() => onSelect(screening.id)}
            className={cn(
              "group relative flex flex-col rounded-lg border p-5 text-left transition-all duration-300",
              isSelected
                ? "border-primary bg-primary/10 velvet-glow"
                : "border-border/40 bg-card/40 hover:border-primary/30 hover:bg-card/60"
            )}
          >
            {/* Day & time */}
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-outfit text-xs font-medium uppercase tracking-wider text-primary">
                {dayLabel}
              </span>
            </div>

            <p className="font-playfair text-lg font-semibold text-foreground">{time}</p>
            <p className="font-outfit text-sm text-muted-foreground">{date}</p>

            {/* Room */}
            <div className="mt-3 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-outfit text-sm text-foreground">
                {room?.name ?? "Unknown Room"}
              </span>
            </div>

            {/* Seats & price */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    isLow ? "border-destructive/50 text-destructive" : "border-border text-muted-foreground"
                  )}
                >
                  {seatsLeft} {seatsLeft === 1 ? "seat" : "seats"} left
                </Badge>
              </div>
              <div className="flex items-center gap-1">
               <span className="text-gold font-semibold text-sm">₦</span>
                <span className="font-outfit text-sm font-semibold text-gold">
                  {screening.pricePerSeat}
                </span>
                <span className="font-outfit text-xs text-muted-foreground">/seat</span>
              </div>
            </div>

            {/* Selected indicator */}
            {isSelected ? (
              <div className="absolute -top-px left-0 right-0 h-0.5 rounded-t-lg bg-primary" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
