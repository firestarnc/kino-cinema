"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  applyRoseDecorationCharge,
  getPackagesForBookingType,
  getMoviePackageTotal,
  getValidTimeSlotsForDate,
  MOVIE_PACKAGE_TITLES,
  MOVIE_PACKAGE_MAX_EXTRA_GUESTS,
  PRIVATE_TIME_SLOTS,
  ROSE_DECORATION_PRICE_NAIRA,
  formatNaira,
  lagosTodayISODate,
  type BookingType,
  type PrivatePackageId,
  type TimeSlotId,
} from "@/lib/private-booking";
import type { Database } from "@/lib/database.types";

type ManualSlotBlockRow = Database["public"]["Tables"]["manual_slot_blocks"]["Row"];

interface AdminBookingsManagerProps {
  initialSlotBlocks: ManualSlotBlockRow[];
}

interface DirectBookingFormState {
  bookingType: BookingType;
  packageId: PrivatePackageId;
  filmTitle: string;
  contentTitleId: string;
  bookingDate: string;
  timeSlot: TimeSlotId;
  additionalGuests: number;
  includeRoseDecoration: boolean;
  fullName: string;
  email: string;
  phoneNumber: string;
  notes: string;
}

interface SlotBlockFormState {
  bookingDate: string;
  timeSlot: TimeSlotId;
  reason: string;
}

const DEFAULT_BOOKING_DATE = lagosTodayISODate();
const DEFAULT_DATE_TIME_SLOT: TimeSlotId =
  getValidTimeSlotsForDate(DEFAULT_BOOKING_DATE)[0]?.id ?? PRIVATE_TIME_SLOTS[0].id;

export default function AdminBookingsManager({ initialSlotBlocks }: AdminBookingsManagerProps) {
  const router = useRouter();
  const [isSubmittingDirectBooking, setIsSubmittingDirectBooking] = useState(false);
  const [isSubmittingSlotBlock, setIsSubmittingSlotBlock] = useState(false);
  const [isRemovingBlockId, setIsRemovingBlockId] = useState<string | null>(null);
  const [slotBlocks, setSlotBlocks] = useState<ManualSlotBlockRow[]>(initialSlotBlocks);

  const [directForm, setDirectForm] = useState<DirectBookingFormState>({
    bookingType: "blockbuster",
    packageId: "couple",
    filmTitle: "",
    contentTitleId: MOVIE_PACKAGE_TITLES[0]?.id ?? "",
    bookingDate: DEFAULT_BOOKING_DATE,
    timeSlot: DEFAULT_DATE_TIME_SLOT,
    additionalGuests: 0,
    includeRoseDecoration: false,
    fullName: "",
    email: "",
    phoneNumber: "",
    notes: "",
  });

  const [slotBlockForm, setSlotBlockForm] = useState<SlotBlockFormState>({
    bookingDate: DEFAULT_BOOKING_DATE,
    timeSlot: DEFAULT_DATE_TIME_SLOT,
    reason: "",
  });

  const availablePackages = useMemo(
    () => getPackagesForBookingType(directForm.bookingType),
    [directForm.bookingType]
  );

  const canAddExtraGuests = directForm.bookingType === "movie-package" && directForm.packageId === "standard";
  const validDirectTimeSlots = useMemo(
    () => getValidTimeSlotsForDate(directForm.bookingDate),
    [directForm.bookingDate]
  );
  const validBlockTimeSlots = useMemo(
    () => getValidTimeSlotsForDate(slotBlockForm.bookingDate),
    [slotBlockForm.bookingDate]
  );

  useEffect(() => {
    if (!validDirectTimeSlots.some((slot) => slot.id === directForm.timeSlot)) {
      updateDirectForm("timeSlot", validDirectTimeSlots[0]?.id ?? PRIVATE_TIME_SLOTS[0].id);
    }
  }, [directForm.timeSlot, validDirectTimeSlots]);

  useEffect(() => {
    if (!validBlockTimeSlots.some((slot) => slot.id === slotBlockForm.timeSlot)) {
      updateSlotBlockForm("timeSlot", validBlockTimeSlots[0]?.id ?? PRIVATE_TIME_SLOTS[0].id);
    }
  }, [slotBlockForm.timeSlot, validBlockTimeSlots]);

  const totalAmount = useMemo(() => {
    const baseAmountNaira =
      directForm.bookingType === "movie-package" && directForm.packageId === "standard"
        ? getMoviePackageTotal("standard", directForm.additionalGuests)
        : (availablePackages.find((pkg) => pkg.id === directForm.packageId)?.priceNaira ?? 0);

    return applyRoseDecorationCharge(baseAmountNaira, directForm.includeRoseDecoration);
  }, [availablePackages, directForm.additionalGuests, directForm.bookingType, directForm.includeRoseDecoration, directForm.packageId]);

  function updateDirectForm<K extends keyof DirectBookingFormState>(key: K, value: DirectBookingFormState[K]) {
    setDirectForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateSlotBlockForm<K extends keyof SlotBlockFormState>(key: K, value: SlotBlockFormState[K]) {
    setSlotBlockForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitDirectBooking() {
    if (!directForm.fullName.trim() || !directForm.email.trim() || !directForm.phoneNumber.trim()) {
      toast.error("Full name, email and phone are required.");
      return;
    }

    if (directForm.bookingType === "blockbuster" && !directForm.filmTitle.trim()) {
      toast.error("Film title is required for blockbuster direct booking.");
      return;
    }

    setIsSubmittingDirectBooking(true);
    try {
      const response = await fetch("/api/admin/direct-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingType: directForm.bookingType,
          packageId: directForm.packageId,
          filmTitle: directForm.bookingType === "blockbuster" ? directForm.filmTitle : undefined,
          contentTitleId: directForm.bookingType === "movie-package" ? directForm.contentTitleId : undefined,
          bookingDate: directForm.bookingDate,
          timeSlot: directForm.timeSlot,
          additionalGuests: canAddExtraGuests ? directForm.additionalGuests : 0,
          includeRoseDecoration: directForm.includeRoseDecoration,
          fullName: directForm.fullName,
          email: directForm.email,
          phoneNumber: directForm.phoneNumber,
          notes: directForm.notes,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create direct booking.");
      }

      toast.success("Direct paid booking created successfully.");
      setDirectForm((prev) => ({
        ...prev,
        fullName: "",
        email: "",
        phoneNumber: "",
        notes: "",
      }));
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create direct booking.";
      toast.error(message);
    } finally {
      setIsSubmittingDirectBooking(false);
    }
  }

  async function submitSlotBlock() {
    setIsSubmittingSlotBlock(true);
    try {
      const response = await fetch("/api/admin/slot-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotBlockForm),
      });

      const payload = (await response.json()) as {
        error?: string;
        block?: ManualSlotBlockRow;
      };

      if (!response.ok || !payload.block) {
        throw new Error(payload.error ?? "Unable to block slot.");
      }

      setSlotBlocks((prev) => {
        const merged = [...prev, payload.block!];
        return merged.sort((a, b) => {
          if (a.booking_date !== b.booking_date) {
            return a.booking_date.localeCompare(b.booking_date);
          }
          return a.time_slot.localeCompare(b.time_slot);
        });
      });

      toast.success("Slot blocked successfully.");
      updateSlotBlockForm("reason", "");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to block slot.";
      toast.error(message);
    } finally {
      setIsSubmittingSlotBlock(false);
    }
  }

  async function removeSlotBlock(id: string) {
    setIsRemovingBlockId(id);
    try {
      const response = await fetch("/api/admin/slot-blocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to remove block.");
      }

      setSlotBlocks((prev) => prev.filter((block) => block.id !== id));
      toast.success("Slot block removed.");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to remove block.";
      toast.error(message);
    } finally {
      setIsRemovingBlockId(null);
    }
  }

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm">
        <h2 className="font-playfair text-2xl font-semibold text-foreground">Create Direct Paid Booking</h2>
        <p className="mt-1 font-outfit text-xs text-muted-foreground">
          Use this for phone or walk-in customers who already paid directly.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Booking Type</span>
            <select
              value={directForm.bookingType}
              onChange={(event) => {
                const bookingType = event.target.value as BookingType;
                const packageId = getPackagesForBookingType(bookingType)[0]?.id ?? "couple";
                updateDirectForm("bookingType", bookingType);
                updateDirectForm("packageId", packageId);
                if (bookingType === "blockbuster") {
                  updateDirectForm("additionalGuests", 0);
                }
              }}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            >
              <option value="blockbuster">Blockbuster</option>
              <option value="movie-package">Movie Package</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Package</span>
            <select
              value={directForm.packageId}
              onChange={(event) => {
                const packageId = event.target.value as PrivatePackageId;
                updateDirectForm("packageId", packageId);
                if (packageId !== "standard") {
                  updateDirectForm("additionalGuests", 0);
                }
              }}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            >
              {availablePackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
              ))}
            </select>
          </label>

          {directForm.bookingType === "blockbuster" ? (
            <label className="space-y-1 sm:col-span-2">
              <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Film Title</span>
              <input
                value={directForm.filmTitle}
                onChange={(event) => updateDirectForm("filmTitle", event.target.value)}
                placeholder="Movie title selected by customer"
                className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
              />
            </label>
          ) : (
            <label className="space-y-1 sm:col-span-2">
              <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Select Movie (In-Cinema)</span>
              <select
                value={directForm.contentTitleId}
                onChange={(event) => updateDirectForm("contentTitleId", event.target.value)}
                className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
              >
                {MOVIE_PACKAGE_TITLES.map((title) => (
                  <option key={title.id} value={title.id}>{title.title}</option>
                ))}
              </select>
              <p className="font-outfit text-xs text-muted-foreground">
                This is the movie title chosen for the in-cinema movie package session.
              </p>
            </label>
          )}

          <label className="space-y-1">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Booking Date</span>
            <input
              type="date"
              min={lagosTodayISODate()}
              value={directForm.bookingDate}
              onChange={(event) => updateDirectForm("bookingDate", event.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-1">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Time Slot</span>
            <select
              value={directForm.timeSlot}
              onChange={(event) => updateDirectForm("timeSlot", event.target.value as TimeSlotId)}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            >
              {validDirectTimeSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>{slot.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Full Name</span>
            <input
              value={directForm.fullName}
              onChange={(event) => updateDirectForm("fullName", event.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-1">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</span>
            <input
              type="email"
              value={directForm.email}
              onChange={(event) => updateDirectForm("email", event.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-1">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone Number</span>
            <input
              value={directForm.phoneNumber}
              onChange={(event) => updateDirectForm("phoneNumber", event.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          {canAddExtraGuests ? (
            <label className="space-y-1">
              <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Extra Guests</span>
              <input
                type="number"
                min={0}
                max={MOVIE_PACKAGE_MAX_EXTRA_GUESTS}
                value={directForm.additionalGuests}
                onChange={(event) => {
                  const parsed = Number(event.target.value);
                  updateDirectForm(
                    "additionalGuests",
                    Number.isFinite(parsed) ? Math.max(0, Math.min(MOVIE_PACKAGE_MAX_EXTRA_GUESTS, parsed)) : 0
                  );
                }}
                className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
              />
            </label>
          ) : null}

          <label className="space-y-2 sm:col-span-2">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Rose Decoration</span>
            <span className="inline-flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 px-3 py-3">
              <input
                type="checkbox"
                checked={directForm.includeRoseDecoration}
                onChange={(event) => updateDirectForm("includeRoseDecoration", event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border/70"
              />
              <span className="font-outfit text-sm text-foreground">
                Yes, include roses floor and table decoration design (+{formatNaira(ROSE_DECORATION_PRICE_NAIRA)}).
              </span>
            </span>
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes</span>
            <textarea
              rows={3}
              value={directForm.notes}
              onChange={(event) => updateDirectForm("notes", event.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="font-outfit text-sm text-muted-foreground">
            Total: <span className="font-semibold text-gold">{formatNaira(totalAmount)}</span>
          </p>
          <Button
            type="button"
            onClick={submitDirectBooking}
            disabled={isSubmittingDirectBooking}
            className="font-outfit text-xs uppercase tracking-widest"
          >
            {isSubmittingDirectBooking ? "Saving..." : "Create Paid Booking"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm">
        <h2 className="font-playfair text-2xl font-semibold text-foreground">Manual Slot Block</h2>
        <p className="mt-1 font-outfit text-xs text-muted-foreground">
          Use this when you need to reserve a slot without creating a customer booking.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Date</span>
            <input
              type="date"
              min={lagosTodayISODate()}
              value={slotBlockForm.bookingDate}
              onChange={(event) => updateSlotBlockForm("bookingDate", event.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-1">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Time Slot</span>
            <select
              value={slotBlockForm.timeSlot}
              onChange={(event) => updateSlotBlockForm("timeSlot", event.target.value as TimeSlotId)}
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            >
              {validBlockTimeSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>{slot.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Reason (Optional)</span>
            <input
              value={slotBlockForm.reason}
              onChange={(event) => updateSlotBlockForm("reason", event.target.value)}
              placeholder="Maintenance, private event, offline reservation..."
              className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={submitSlotBlock}
            disabled={isSubmittingSlotBlock}
            variant="outline"
            className="font-outfit text-xs uppercase tracking-widest"
          >
            {isSubmittingSlotBlock ? "Blocking..." : "Block Slot"}
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-border/30">
          <table className="min-w-full">
            <thead className="border-b border-border/30 bg-background/30">
              <tr className="text-left">
                <th className="px-3 py-2 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-3 py-2 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Slot</th>
                <th className="px-3 py-2 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Reason</th>
                <th className="px-3 py-2 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {slotBlocks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center font-outfit text-sm text-muted-foreground">
                    No active slot blocks.
                  </td>
                </tr>
              ) : (
                slotBlocks.map((block) => (
                  <tr key={block.id} className="border-b border-border/20 last:border-0">
                    <td className="px-3 py-2 font-outfit text-sm text-foreground">{block.booking_date}</td>
                    <td className="px-3 py-2 font-outfit text-sm text-foreground">{block.time_slot}</td>
                    <td className="px-3 py-2 font-outfit text-xs text-muted-foreground">{block.reason ?? "-"}</td>
                    <td className="px-3 py-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={isRemovingBlockId === block.id}
                        onClick={() => removeSlotBlock(block.id)}
                        className="font-outfit text-xs uppercase tracking-wider text-red-400 hover:text-red-300"
                      >
                        {isRemovingBlockId === block.id ? "Removing..." : "Remove"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
