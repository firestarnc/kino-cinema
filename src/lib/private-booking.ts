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
  // Africa/Lagos is UTC+1 year-round (no DST), so this avoids locale-specific formatting quirks.
  const lagosNow = new Date(Date.now() + 60 * 60 * 1000);
  const year = String(lagosNow.getUTCFullYear());
  const month = String(lagosNow.getUTCMonth() + 1).padStart(2, "0");
  const day = String(lagosNow.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
