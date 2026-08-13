import { moviePackageFilms } from "@/lib/cinema-data";

export type BookingType = "blockbuster" | "movie-package";

export type BlockbusterPackageId = "couple" | "standard" | "premium";

export type MoviePackageId = "couple" | "standard";

export type PrivatePackageId = BlockbusterPackageId | MoviePackageId;

export interface PrivatePackage {
  id: PrivatePackageId;
  name: string;
  capacity: string;
  priceNaira: number;
  perks: string[];
}

export interface MoviePackageTitle {
  id: string;
  filmId: string;
  title: string;
  platform: string;
  description: string;
}

export type TimeSlotId =
  | "09:00-12:00"
  | "12:00-15:00"
  | "15:00-18:00"
  | "18:00-21:00";

export interface TimeSlot {
  id: TimeSlotId;
  label: string;
}

export const BLOCKBUSTER_PACKAGES: PrivatePackage[] = [
  {
    id: "couple",
    name: "Couple Package",
    capacity: "1-2 persons",
    priceNaira: 150000,
    perks: [
      "A bottle of wine",
      "Unlimited popcorn",
      "Water",
      "Small chops",
    ],
  },
  {
    id: "standard",
    name: "Standard Package",
    capacity: "3-5 persons",
    priceNaira: 250000,
    perks: [
      "Unlimited popcorn",
      "Two bottles of wine",
      "Small chops",
      "Chicken and chips",
      "Water",
      "Tacos",
    ],
  },
  {
    id: "premium",
    name: "Premium Package",
    capacity: "1-8 persons",
    priceNaira: 350000,
    perks: [
      "Unlimited popcorn",
      "Two bottles of wine",
      "One champagne",
      "Small chops",
      "Chicken and chips",
      "Water",
      "Main course meal",
      "Banana bread",
    ],
  },
];

export const MOVIE_PACKAGES: PrivatePackage[] = [
  {
    id: "couple",
    name: "Couple Package",
    capacity: "1-2 persons",
    priceNaira: 50000,
    perks: [
      "One bottle of wine",
      "Unlimited velvet popcorn",
      "Water",
    ],
  },
  {
    id: "standard",
    name: "Standard Package",
    capacity: "3-5 persons",
    priceNaira: 120000,
    perks: [
      "Two bottles of wine",
      "Water",
      "Unlimited velvet popcorn",
      "Spiced pastry pockets",
      "Asian crispy rolls",
      "Sweet & spicy chicken bites",
      "Mini corn dog sticks",
    ],
  },
];

export const MOVIE_PACKAGE_TITLES: MoviePackageTitle[] = moviePackageFilms.map((film) => ({
  id: film.id,
  filmId: film.id,
  title: film.title,
  platform: "Movie Package",
  description: `${film.genre} • ${film.duration} min • ${film.rating}`,
}));

export const MOVIE_PACKAGE_MAX_EXTRA_GUESTS = 3;
export const MOVIE_PACKAGE_EXTRA_GUEST_PRICE_NAIRA = 15000;

export const PRIVATE_TIME_SLOTS: TimeSlot[] = [
  { id: "09:00-12:00", label: "9:00 AM - 12:00 PM" },
  { id: "12:00-15:00", label: "12:00 PM - 3:00 PM" },
  { id: "15:00-18:00", label: "3:00 PM - 6:00 PM" },
  { id: "18:00-21:00", label: "6:00 PM - 9:00 PM" },
];

export const PRIVATE_MENU_NOTE =
  "Anything outside the menu is available upon request.";

export const MOVIE_PACKAGE_MENU_NOTE =
  "Movie package extras beyond the listed menu are available on request and billed separately.";

export const LAGOS_TIMEZONE = "Africa/Lagos";

type LagosDateTimeParts = {
  dateISO: string;
  hour: number;
  minute: number;
};

function getLagosDateTimeParts(at: Date = new Date()): LagosDateTimeParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: LAGOS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(at);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;

  if (!year || !month || !day || !hour || !minute) {
    throw new Error("Could not resolve Africa/Lagos date and time parts");
  }

  return {
    dateISO: `${year}-${month}-${day}`,
    hour: Number(hour),
    minute: Number(minute),
  };
}

export function getPackagesForBookingType(bookingType: BookingType): PrivatePackage[] {
  return bookingType === "movie-package" ? MOVIE_PACKAGES : BLOCKBUSTER_PACKAGES;
}

export function getPackageById(packageId: PrivatePackageId, bookingType: BookingType): PrivatePackage {
  const found = getPackagesForBookingType(bookingType).find((pkg) => pkg.id === packageId);
  if (!found) {
    throw new Error(`Unknown package for ${bookingType}: ${packageId}`);
  }
  return found;
}

export function getMoviePackageTitleById(titleId: string): MoviePackageTitle | null {
  return MOVIE_PACKAGE_TITLES.find((title) => title.id === titleId) ?? null;
}

export function getMoviePackageTitleByFilmId(filmId: string): MoviePackageTitle | null {
  return MOVIE_PACKAGE_TITLES.find((title) => title.filmId === filmId) ?? null;
}

export function getMoviePackageTotal(packageId: MoviePackageId, additionalGuests: number): number {
  const basePackage = getPackageById(packageId, "movie-package");
  if (packageId !== "standard") {
    return basePackage.priceNaira;
  }

  const clampedAdditionalGuests = Math.max(
    0,
    Math.min(MOVIE_PACKAGE_MAX_EXTRA_GUESTS, additionalGuests)
  );

  return basePackage.priceNaira + clampedAdditionalGuests * MOVIE_PACKAGE_EXTRA_GUEST_PRICE_NAIRA;
}

export function isMoviePackageEligibleForExtraGuests(packageId: PrivatePackageId | null): packageId is MoviePackageId {
  return packageId === "standard";
}

export const PRIVATE_PACKAGES = BLOCKBUSTER_PACKAGES;

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function lagosTodayISODate(): string {
  return getLagosDateTimeParts().dateISO;
}

export function isValidISOBookingDate(dateISO: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function isPastBookingDate(dateISO: string): boolean {
  return dateISO < lagosTodayISODate();
}

export function isElapsedTimeSlot(dateISO: string, slotId: TimeSlotId, at: Date = new Date()): boolean {
  if (!isValidISOBookingDate(dateISO)) {
    return false;
  }

  const lagosNow = getLagosDateTimeParts(at);

  if (dateISO < lagosNow.dateISO) {
    return true;
  }

  if (dateISO > lagosNow.dateISO) {
    return false;
  }

  const [slotStart] = slotId.split("-");
  const [hourText, minuteText] = slotStart.split(":");
  const slotHour = Number(hourText);
  const slotMinute = Number(minuteText);

  if (
    !Number.isInteger(slotHour) ||
    !Number.isInteger(slotMinute) ||
    slotHour < 0 ||
    slotHour > 23 ||
    slotMinute < 0 ||
    slotMinute > 59
  ) {
    return false;
  }

  const currentMinutes = lagosNow.hour * 60 + lagosNow.minute;
  const slotStartMinutes = slotHour * 60 + slotMinute;

  // Policy: same-day slots become unavailable at slot start time.
  return currentMinutes >= slotStartMinutes;
}
