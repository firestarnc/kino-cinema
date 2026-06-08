export type PrivatePackageId = "couple" | "standard" | "premium";

export interface PrivatePackage {
  id: PrivatePackageId;
  name: string;
  capacity: string;
  priceNaira: number;
  perks: string[];
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

export const PRIVATE_PACKAGES: PrivatePackage[] = [
  {
    id: "couple",
    name: "Couple Package",
    capacity: "1-2 persons",
    priceNaira: 120000,
    perks: [
      "One bottle of wine",
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

export const PRIVATE_TIME_SLOTS: TimeSlot[] = [
  { id: "09:00-12:00", label: "9:00 AM - 12:00 PM" },
  { id: "12:00-15:00", label: "12:00 PM - 3:00 PM" },
  { id: "15:00-18:00", label: "3:00 PM - 6:00 PM" },
  { id: "18:00-21:00", label: "6:00 PM - 9:00 PM" },
];

export const PRIVATE_MENU_NOTE =
  "Anything outside the menu is available upon request.";

export const LAGOS_TIMEZONE = "Africa/Lagos";

export function getPackageById(packageId: PrivatePackageId): PrivatePackage {
  const found = PRIVATE_PACKAGES.find((pkg) => pkg.id === packageId);
  if (!found) {
    throw new Error(`Unknown package: ${packageId}`);
  }
  return found;
}

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
