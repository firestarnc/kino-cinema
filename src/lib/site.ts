export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://kinoscreens.com";

export const businessDetails = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Kino Screens",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+2347041291776",
  streetAddress: process.env.NEXT_PUBLIC_BUSINESS_STREET ?? "avenue 28, off sapele road",
  locality: process.env.NEXT_PUBLIC_BUSINESS_LOCALITY ?? "Benin City",
  region: process.env.NEXT_PUBLIC_BUSINESS_REGION ?? "Edo",
  postalCode: process.env.NEXT_PUBLIC_BUSINESS_POSTAL_CODE ?? "300102",
  country: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY ?? "NG",
  openingHours:
    process.env.NEXT_PUBLIC_BUSINESS_OPENING_HOURS ?? "Mo-Su 10:00-22:00",
};
