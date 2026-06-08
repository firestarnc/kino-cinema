"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formatNaira,
  isPastBookingDate,
  isValidISOBookingDate,
  lagosTodayISODate,
  PRIVATE_MENU_NOTE,
  PRIVATE_PACKAGES,
  PRIVATE_TIME_SLOTS,
  type PrivatePackage,
  type PrivatePackageId,
  type TimeSlotId,
} from "@/lib/private-booking";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

interface PrivateBookingPanelProps {
  filmId?: string;
  filmTitle?: string;
  bookingMode?: "film" | "package-only";
}

interface BookingDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  notes: string;
}

export default function PrivateBookingPanel({
  filmId,
  filmTitle,
  bookingMode = "film",
}: PrivateBookingPanelProps) {
  const router = useRouter();
  const [selectedPackageId, setSelectedPackageId] = useState<PrivatePackageId | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(lagosTodayISODate());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotId | null>(null);
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set());
  const [details, setDetails] = useState<BookingDetails>({
    fullName: "",
    email: "",
    phoneNumber: "",
    notes: "",
  });
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaystackReady, setIsPaystackReady] = useState(false);

  const selectedPackage = useMemo<PrivatePackage | null>(() => {
    if (!selectedPackageId) {
      return null;
    }
    return PRIVATE_PACKAGES.find((pkg) => pkg.id === selectedPackageId) ?? null;
  }, [selectedPackageId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setIsPaystackReady(true);
    script.onerror = () => {
      toast.error("Unable to load payment gateway. Refresh and try again.");
      setIsPaystackReady(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    if (!isValidISOBookingDate(selectedDate) || isPastBookingDate(selectedDate)) {
      setTakenSlots(new Set());
      setSelectedSlot(null);
      return;
    }

    let isCancelled = false;

    async function loadAvailability() {
      setIsLoadingAvailability(true);
      setSelectedSlot(null);

      try {
        const query = new URLSearchParams({ date: selectedDate });
        if (filmId) {
          query.set("filmId", filmId);
        }

        const response = await fetch(`/api/bookings/availability?${query.toString()}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load availability");
        }

        const body = (await response.json()) as { takenSlots?: string[] };
        if (!isCancelled) {
          setTakenSlots(new Set(body.takenSlots ?? []));
        }
      } catch {
        if (!isCancelled) {
          toast.error("Could not refresh slot availability.");
          setTakenSlots(new Set());
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingAvailability(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      isCancelled = true;
    };
  }, [filmId, selectedDate]);

  function updateDetails(field: keyof BookingDetails, value: string) {
    setDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateForm(): string | null {
    if (!selectedPackage) return "Select a package first.";
    if (!selectedDate) return "Select a booking date.";
    if (!selectedSlot) return "Select a time slot.";
    if (details.fullName.trim().length < 2) return "Enter a valid full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) return "Enter a valid email address.";
    if (details.phoneNumber.trim().length < 8) return "Enter a valid phone number.";
    return null;
  }

  async function handlePayAndBook() {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (!window.PaystackPop || !isPaystackReady || !selectedPackage || !selectedSlot) {
      toast.error("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const initiateResponse = await fetch("/api/bookings/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filmId,
          filmTitle,
          bookingMode,
          packageId: selectedPackage.id,
          bookingDate: selectedDate,
          timeSlot: selectedSlot,
          fullName: details.fullName,
          email: details.email,
          phoneNumber: details.phoneNumber,
          notes: details.notes,
        }),
      });

      const initiateBody = (await initiateResponse.json()) as {
        error?: string;
        reference?: string;
        amountNaira?: number;
        email?: string;
        publicKey?: string;
      };

      if (!initiateResponse.ok || !initiateBody.reference || !initiateBody.amountNaira || !initiateBody.email || !initiateBody.publicKey) {
        throw new Error(initiateBody.error ?? "Could not start booking");
      }

      const paystackHandler = window.PaystackPop.setup({
        key: initiateBody.publicKey,
        email: initiateBody.email,
        amount: initiateBody.amountNaira * 100,
        ref: initiateBody.reference,
        callback: ({ reference }) => {
          void (async () => {
            try {
              const verifyResponse = await fetch("/api/bookings/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ reference }),
              });

              const verifyBody = (await verifyResponse.json()) as { success?: boolean; error?: string };

              if (!verifyResponse.ok || !verifyBody.success) {
                const errorMessage = verifyBody.error ?? "Payment verification failed";
                router.push(`/book/failed?message=${encodeURIComponent(errorMessage)}`);
                return;
              }

              setTakenSlots((prev) => new Set([...prev, selectedSlot]));
              setSelectedSlot(null);
              router.push(`/book/success?ref=${encodeURIComponent(reference)}`);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : "Could not complete booking verification.";
              router.push(`/book/failed?message=${encodeURIComponent(errorMessage)}`);
            } finally {
              setIsSubmitting(false);
            }
          })();
        },
        onClose: () => {
          setIsSubmitting(false);
          router.push(
            "/book/failed?message=" +
              encodeURIComponent("Payment not completed. Your slot is still available until successful payment.")
          );
        },
      });

      paystackHandler.openIframe();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not start booking payment.";
      toast.error(message);
      setIsSubmitting(false);
    }
  }

  return (
    <section id="booking" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mb-8">
        <h2 className="font-playfair text-3xl font-bold text-foreground md:text-4xl">
          {bookingMode === "package-only" ? "Reserve The Cinema First" : "Reserve This Private Screening"}
        </h2>
        <p className="mt-2 max-w-3xl font-outfit text-sm text-muted-foreground">
          {bookingMode === "package-only"
            ? "Choose a package, lock a date and slot, then decide what to watch when you arrive at the cinema."
            : "Choose a package, select a date and slot, then pay securely with Paystack to lock your reservation."}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-playfair text-xl font-semibold text-foreground">01. Select Package</h3>
              <Badge variant="outline" className="font-outfit text-xs">Private Cinema</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {PRIVATE_PACKAGES.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all duration-300",
                      isSelected
                        ? "border-primary bg-primary/10 velvet-glow"
                        : "border-border/40 bg-background/40 hover:border-primary/40 hover:bg-card/70"
                    )}
                  >
                    <p className="font-playfair text-lg font-semibold text-foreground">{pkg.name}</p>
                    <p className="mt-1 font-outfit text-xs text-muted-foreground">{pkg.capacity}</p>
                    <p className="mt-3 font-playfair text-2xl font-bold text-gold">{formatNaira(pkg.priceNaira)}</p>
                    <ul className="mt-3 space-y-1">
                      {pkg.perks.map((perk) => (
                        <li key={perk} className="font-outfit text-xs text-muted-foreground">
                          • {perk}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 rounded-lg border border-cinema-gold/60 bg-cinema-gold/20 px-3 py-2 font-outfit text-xs text-gold">
              {PRIVATE_MENU_NOTE}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm md:p-6">
              <h3 className="font-playfair text-xl font-semibold text-foreground">02. Select Date</h3>
              <p className="mt-1 font-outfit text-xs text-muted-foreground">Timezone: Africa/Lagos (WAT)</p>
              {bookingMode === "package-only" ? (
                <p className="mt-2 font-outfit text-xs text-gold">
                  Movie selection happens in person after the cinema is booked.
                </p>
              ) : null}

              <div className="mt-4">
                <label htmlFor="booking-date" className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Booking Date
                </label>
                <input
                  id="booking-date"
                  type="date"
                  value={selectedDate}
                  min={lagosTodayISODate()}
                  onChange={(event) => {
                    const nextDate = event.target.value;
                    if (!nextDate) {
                      return;
                    }
                    if (isValidISOBookingDate(nextDate) && !isPastBookingDate(nextDate)) {
                      setSelectedDate(nextDate);
                    }
                  }}
                  className="mt-2 w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm md:p-6">
              <h3 className="font-playfair text-xl font-semibold text-foreground">03. Select Time Slot</h3>
              <p className="mt-1 font-outfit text-xs text-muted-foreground">
                {isLoadingAvailability ? "Loading slot availability..." : "Slots stay visible even when currently unavailable."}
              </p>

              <div className="mt-4 grid gap-3">
                {PRIVATE_TIME_SLOTS.map((slot) => {
                  const isTaken = takenSlots.has(slot.id);
                  const isSelected = selectedSlot === slot.id;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isTaken || isLoadingAvailability}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left transition-all duration-300",
                        isTaken
                          ? "booking-slot-unavailable cursor-not-allowed border-cinema-gold/60 bg-cinema-gold/20 text-muted-foreground"
                          : isSelected
                            ? "border-primary bg-primary/10 velvet-glow"
                            : "border-border/40 bg-background/40 hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-outfit text-sm">{slot.label}</span>
                        {isTaken ? (
                          <span className="font-outfit text-[10px] uppercase tracking-wider text-gold">
                            Currently Unavailable
                          </span>
                        ) : (
                          <span className="font-outfit text-[10px] uppercase tracking-wider text-gold">
                            Available
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm md:p-6">
            <h3 className="font-playfair text-xl font-semibold text-foreground">04. Your Details</h3>
            <p className="mt-1 font-outfit text-xs text-muted-foreground">We use this to confirm your booking and contact you if needed.</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Full name</label>
                <input
                  value={details.fullName}
                  onChange={(event) => updateDetails("fullName", event.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-1">
                <label className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={details.email}
                  onChange={(event) => updateDetails("email", event.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone number</label>
                <input
                  value={details.phoneNumber}
                  onChange={(event) => updateDetails("phoneNumber", event.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
                  placeholder="+234..."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-outfit text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes</label>
                <textarea
                  value={details.notes}
                  onChange={(event) => updateDetails("notes", event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-border/50 bg-background/70 px-3 py-2 font-outfit text-sm text-foreground outline-none transition focus:border-primary"
                  placeholder="Requests, celebrations, dietary notes..."
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-border/40 bg-card/60 p-6 backdrop-blur-sm xl:sticky xl:top-24 xl:h-fit">
          <h3 className="font-playfair text-xl font-semibold text-foreground">Booking Summary</h3>
          <Separator className="my-4 opacity-30" />

          <dl className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <dt className="font-outfit text-xs uppercase tracking-wider text-muted-foreground">
                {bookingMode === "package-only" ? "Movie Selection" : "Film"}
              </dt>
              <dd className="text-right font-outfit text-sm text-foreground">
                {bookingMode === "package-only" ? "Chosen in person at the cinema" : (filmTitle ?? "-")}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-outfit text-xs uppercase tracking-wider text-muted-foreground">Package</dt>
              <dd className="text-right font-outfit text-sm text-foreground">{selectedPackage?.name ?? "-"}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-outfit text-xs uppercase tracking-wider text-muted-foreground">Date</dt>
              <dd className="text-right font-outfit text-sm text-foreground">{selectedDate || "-"}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-outfit text-xs uppercase tracking-wider text-muted-foreground">Slot</dt>
              <dd className="text-right font-outfit text-sm text-foreground">
                {selectedSlot
                  ? (PRIVATE_TIME_SLOTS.find((slot) => slot.id === selectedSlot)?.label ?? selectedSlot)
                  : "-"}
              </dd>
            </div>
          </dl>

          <Separator className="my-4 opacity-30" />

          <div className="flex items-center justify-between">
            <span className="font-outfit text-sm text-muted-foreground">Total</span>
            <span className="font-playfair text-2xl font-bold text-gold">
              {selectedPackage ? formatNaira(selectedPackage.priceNaira) : "₦0"}
            </span>
          </div>

          <Button
            onClick={handlePayAndBook}
            disabled={isSubmitting || !isPaystackReady}
            className="velvet-glow-strong mt-6 w-full font-outfit text-xs uppercase tracking-widest"
            size="lg"
          >
            {isSubmitting ? "Processing..." : "Pay & Confirm Booking"}
          </Button>

          <p className="mt-3 text-center font-outfit text-xs text-muted-foreground">
            A slot is marked unavailable only after successful payment.
          </p>
        </aside>
      </div>
    </section>
  );
}
