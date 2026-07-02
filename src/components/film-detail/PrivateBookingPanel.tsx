"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formatNaira,
  getMoviePackageTitleByFilmId,
  getMoviePackageTitleById,
  getMoviePackageTotal,
  getPackagesForBookingType,
  isMoviePackageEligibleForExtraGuests,
  isPastBookingDate,
  isValidISOBookingDate,
  lagosTodayISODate,
  MOVIE_PACKAGE_EXTRA_GUEST_PRICE_NAIRA,
  MOVIE_PACKAGE_MAX_EXTRA_GUESTS,
  MOVIE_PACKAGE_MENU_NOTE,
  MOVIE_PACKAGE_TITLES,
  PRIVATE_MENU_NOTE,
  PRIVATE_TIME_SLOTS,
  type BookingType,
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
  bookingType?: BookingType;
  // Optional redirect overrides for different booking flows
  successPath?: string; // e.g. '/book/success' or '/movie-package/book/success'
  failedPath?: string; // e.g. '/book/failed' or '/movie-package/book/failed'
  skipTitleSelection?: boolean;
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
  bookingType = "blockbuster",
  successPath,
  failedPath,
  skipTitleSelection = false,
}: PrivateBookingPanelProps) {
  const router = useRouter();
  const [selectedPackageId, setSelectedPackageId] = useState<PrivatePackageId | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(lagosTodayISODate());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotId | null>(null);
  const [selectedContentTitleId, setSelectedContentTitleId] = useState<string | null>(null);
  const [visibleMovieCount, setVisibleMovieCount] = useState(6);
  const [additionalGuests, setAdditionalGuests] = useState(0);
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

  const availablePackages = useMemo(() => getPackagesForBookingType(bookingType), [bookingType]);

  const selectedPackage = useMemo<PrivatePackage | null>(() => {
    if (!selectedPackageId) {
      return null;
    }

    return availablePackages.find((pkg) => pkg.id === selectedPackageId) ?? null;
  }, [availablePackages, selectedPackageId]);

  const selectedContentTitle = useMemo(() => {
    if (!selectedContentTitleId) {
      return null;
    }

    return getMoviePackageTitleById(selectedContentTitleId);
  }, [selectedContentTitleId]);

  const canAddExtraGuests =
    bookingType === "movie-package" && isMoviePackageEligibleForExtraGuests(selectedPackageId);

  const showMovieTitleSelector = bookingType === "movie-package" && !filmId && !skipTitleSelection;
  const packageStepNumber = bookingType === "movie-package" && showMovieTitleSelector ? "02" : "01";
  const dateStepNumber = bookingType === "movie-package" && showMovieTitleSelector ? "03" : "02";
  const slotStepNumber = bookingType === "movie-package" && showMovieTitleSelector ? "04" : "03";
  const detailsStepNumber = bookingType === "movie-package" && showMovieTitleSelector ? "05" : "04";

  const totalAmount = useMemo(() => {
    if (!selectedPackage) {
      return 0;
    }

    if (bookingType === "movie-package" && selectedPackage.id === "standard") {
      return getMoviePackageTotal("standard", additionalGuests);
    }

    return selectedPackage.priceNaira;
  }, [additionalGuests, bookingType, selectedPackage]);

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
    if (!canAddExtraGuests && additionalGuests !== 0) {
      setAdditionalGuests(0);
    }
  }, [additionalGuests, canAddExtraGuests]);

  useEffect(() => {
    if (bookingType !== "movie-package") {
      return;
    }

    if (filmId) {
      const titleForFilm = getMoviePackageTitleByFilmId(filmId);
      if (titleForFilm && selectedContentTitleId !== titleForFilm.id) {
        setSelectedContentTitleId(titleForFilm.id);
      }
      return;
    }

    if (selectedContentTitleId || MOVIE_PACKAGE_TITLES.length === 0) {
      return;
    }

    setSelectedContentTitleId(MOVIE_PACKAGE_TITLES[0].id);
  }, [bookingType, filmId, selectedContentTitleId]);

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

  function updateAdditionalGuests(nextValue: number) {
    const clampedValue = Math.max(0, Math.min(MOVIE_PACKAGE_MAX_EXTRA_GUESTS, nextValue));
    setAdditionalGuests(clampedValue);
  }

  function validateForm(): string | null {
    if (!selectedPackage) return "Select a package first.";
    if (bookingType === "movie-package" && !skipTitleSelection && !selectedContentTitle) return "Select a movie package title first.";
    if (!selectedDate) return "Select a booking date.";
    if (!selectedSlot) return "Select a time slot.";
    if (details.fullName.trim().length < 2) return "Enter a valid full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) return "Enter a valid email address.";
    if (details.phoneNumber.trim().length < 8) return "Enter a valid phone number.";
    if (bookingType === "movie-package" && !canAddExtraGuests && additionalGuests > 0) {
      return "Extra guests are only available with the Standard Package.";
    }
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
          bookingType,
          filmId,
          filmTitle,
          contentTitleId: selectedContentTitleId,
          skipTitleSelection,
          packageId: selectedPackage.id,
          bookingDate: selectedDate,
          timeSlot: selectedSlot,
          additionalGuests,
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

              const resolvedFailedPath = failedPath ?? "/book/failed";
              const resolvedSuccessPath = successPath ?? "/book/success";

              if (!verifyResponse.ok || !verifyBody.success) {
                const errorMessage = verifyBody.error ?? "Payment verification failed";
                router.push(`${resolvedFailedPath}?message=${encodeURIComponent(errorMessage)}`);
                return;
              }

              setTakenSlots((prev) => new Set([...prev, selectedSlot]));
              setSelectedSlot(null);
              router.push(`${resolvedSuccessPath}?ref=${encodeURIComponent(reference)}`);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : "Could not complete booking verification.";
              const resolvedFailedPath = failedPath ?? "/book/failed";
              router.push(`${resolvedFailedPath}?message=${encodeURIComponent(errorMessage)}`);
            } finally {
              setIsSubmitting(false);
            }
          })();
        },
        onClose: () => {
          setIsSubmitting(false);
          const resolvedFailedPath = failedPath ?? "/book/failed";
          router.push(
            `${resolvedFailedPath}?message=${encodeURIComponent(
              "Payment not completed. Your slot is still available until successful payment."
            )}`
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

  const heroTitle = bookingType === "movie-package" ? "Reserve The Movie Package" : "Reserve This Private Screening";
  const heroCopy =
    bookingType === "movie-package"
      ? skipTitleSelection
        ? "Select your package, lock your date and slot, then pay securely with Paystack to confirm your movie-package experience."
        : "Choose a streaming title, select your package, lock your date and slot, then pay securely with Paystack to confirm the experience."
      : "Choose a package, select a date and slot, then pay securely with Paystack to lock your reservation.";

  return (
    <section id="booking" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mb-8">
        <h2 className="font-playfair text-3xl font-bold text-foreground md:text-4xl">{heroTitle}</h2>
        <p className="mt-2 max-w-3xl font-outfit text-sm text-muted-foreground">{heroCopy}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {showMovieTitleSelector ? (
            <div className="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-playfair text-xl font-semibold text-foreground">01. Choose Your Title</h3>
                <Badge variant="outline" className="font-outfit text-xs">Movie Package</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {MOVIE_PACKAGE_TITLES.slice(0, visibleMovieCount).map((title) => {
                  const isSelected = selectedContentTitleId === title.id;

                  return (
                    <button
                      key={title.id}
                      type="button"
                      onClick={() => setSelectedContentTitleId(title.id)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all duration-300",
                        isSelected
                          ? "border-primary bg-primary/10 velvet-glow"
                          : "border-border/40 bg-background/40 hover:border-primary/40 hover:bg-card/70"
                      )}
                    >
                      <p className="font-outfit text-[11px] uppercase tracking-[0.25em] text-gold">{title.platform}</p>
                      <p className="mt-2 font-playfair text-lg font-semibold text-foreground">{title.title}</p>
                      <p className="mt-2 font-outfit text-xs leading-relaxed text-muted-foreground">{title.description}</p>
                    </button>
                  );
                })}
              </div>

              {MOVIE_PACKAGE_TITLES.length > visibleMovieCount ? (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 font-outfit text-xs uppercase tracking-[0.25em]"
                  onClick={() => setVisibleMovieCount((count) => count + 6)}
                >
                  Load More Titles
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-playfair text-xl font-semibold text-foreground">
                {packageStepNumber}. Select Package
              </h3>
              <Badge variant="outline" className="font-outfit text-xs">
                {bookingType === "movie-package" ? "Movie Package" : "Blockbuster"}
              </Badge>
            </div>

            <div className={cn("grid gap-4", bookingType === "movie-package" ? "md:grid-cols-2" : "md:grid-cols-3")}>
              {availablePackages.map((pkg) => {
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
                    {bookingType === "movie-package" && pkg.id === "standard" ? (
                      <p className="mt-2 font-outfit text-[11px] uppercase tracking-[0.2em] text-gold">
                        Extra person add-on up to {MOVIE_PACKAGE_MAX_EXTRA_GUESTS}
                      </p>
                    ) : null}
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

            {bookingType === "movie-package" ? (
              <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-playfair text-lg font-semibold text-foreground">Add Extra Guests</p>
                    <p className="mt-1 font-outfit text-xs text-muted-foreground">
                      Available only for Standard Package at {formatNaira(MOVIE_PACKAGE_EXTRA_GUEST_PRICE_NAIRA)} per person.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canAddExtraGuests || additionalGuests === 0}
                      onClick={() => updateAdditionalGuests(additionalGuests - 1)}
                    >
                      -
                    </Button>
                    <span className="min-w-8 text-center font-outfit text-sm text-foreground">{additionalGuests}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canAddExtraGuests || additionalGuests === MOVIE_PACKAGE_MAX_EXTRA_GUESTS}
                      onClick={() => updateAdditionalGuests(additionalGuests + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                {!canAddExtraGuests ? (
                  <p className="mt-3 font-outfit text-xs text-gold">
                    Select the Standard Package to unlock extra guest slots.
                  </p>
                ) : null}
              </div>
            ) : null}

            <p className="mt-4 rounded-lg border border-cinema-gold/60 bg-cinema-gold/20 px-3 py-2 font-outfit text-xs text-gold">
              {bookingType === "movie-package" ? MOVIE_PACKAGE_MENU_NOTE : PRIVATE_MENU_NOTE}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm md:p-6">
              <h3 className="font-playfair text-xl font-semibold text-foreground">
                {dateStepNumber}. Select Date
              </h3>
              <p className="mt-1 font-outfit text-xs text-muted-foreground">Timezone: Africa/Lagos (WAT)</p>

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
              <h3 className="font-playfair text-xl font-semibold text-foreground">
                {slotStepNumber}. Select Time Slot
              </h3>
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
            <h3 className="font-playfair text-xl font-semibold text-foreground">
              {detailsStepNumber}. Your Details
            </h3>
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
              <dt className="font-outfit text-xs uppercase tracking-wider text-muted-foreground">Type</dt>
              <dd className="text-right font-outfit text-sm text-foreground">{bookingType}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-outfit text-xs uppercase tracking-wider text-muted-foreground">
                {bookingType === "movie-package" ? "Selected Title" : "Film"}
              </dt>
              <dd className="text-right font-outfit text-sm text-foreground">
                {bookingType === "movie-package"
                  ? skipTitleSelection
                    ? "Choose in person"
                    : selectedContentTitle
                      ? `${selectedContentTitle.title} • ${selectedContentTitle.platform}`
                      : "Choose a title"
                  : (filmTitle ?? "-")}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-outfit text-xs uppercase tracking-wider text-muted-foreground">Package</dt>
              <dd className="text-right font-outfit text-sm text-foreground">{selectedPackage?.name ?? "-"}</dd>
            </div>
            {bookingType === "movie-package" ? (
              <div className="flex items-start justify-between gap-4">
                <dt className="font-outfit text-xs uppercase tracking-wider text-muted-foreground">Extra Guests</dt>
                <dd className="text-right font-outfit text-sm text-foreground">{additionalGuests}</dd>
              </div>
            ) : null}
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
              {totalAmount > 0 ? formatNaira(totalAmount) : "₦0"}
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
