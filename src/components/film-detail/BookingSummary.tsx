import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Users, Ticket } from "lucide-react";
import type { Screening } from "@/lib/cinema-data";
import { getRoomById } from "@/lib/cinema-data";

interface BookingSummaryProps {
  screening: Screening;
  selectedSeatCount: number;
}

export default function BookingSummary({ screening, selectedSeatCount }: BookingSummaryProps) {
  const room = getRoomById(screening.roomId);
  const total = selectedSeatCount * screening.pricePerSeat;

  const dateObj = new Date(screening.dateTime);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="rounded-xl border border-border/40 bg-card/60 p-6 backdrop-blur-sm">
      <h3 className="font-playfair text-lg font-semibold text-foreground">
        Booking Summary
      </h3>

      <Separator className="my-4 opacity-30" />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-outfit text-sm text-foreground">{dateStr}</p>
            <p className="font-outfit text-xs text-muted-foreground">{timeStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <p className="font-outfit text-sm text-foreground">
            {room?.name ?? "Unknown Room"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <p className="font-outfit text-sm text-foreground">
            {selectedSeatCount} {selectedSeatCount === 1 ? "seat" : "seats"} selected
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-muted-foreground" />
          <p className="font-outfit text-sm text-foreground">
            ${screening.pricePerSeat} per seat
          </p>
        </div>
      </div>

      <Separator className="my-4 opacity-30" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="font-outfit text-sm text-muted-foreground">Total</span>
        <span className="font-playfair text-2xl font-bold text-gold">
          ${total}
        </span>
      </div>

      {/* CTA */}
      <Button
        disabled={selectedSeatCount === 0}
        className="velvet-glow-strong mt-6 w-full font-outfit text-xs uppercase tracking-widest transition-all duration-300"
        size="lg"
      >
        Confirm Booking
      </Button>

      {selectedSeatCount === 0 ? (
        <p className="mt-2 text-center font-outfit text-xs text-muted-foreground">
          Select seats to continue
        </p>
      ) : null}
    </div>
  );
}
