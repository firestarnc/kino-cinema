import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/providers";
import { businessDetails, siteUrl } from "@/lib/site";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${businessDetails.name} Benin City | Private Screening Studio`,
    template: `%s | ${businessDetails.name} Benin City`,
  },
  description:
    "Luxury private cinema in Benin City, Nigeria. Book exclusive movie screenings, premium rooms, and curated cinematic experiences.",
  applicationName: businessDetails.name,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "private cinema Benin City",
    "cinema in Benin City",
    "movie screening Benin City",
    "luxury cinema Nigeria",
    businessDetails.name,
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: `${businessDetails.name} Benin City`,
    title: `${businessDetails.name} Benin City | Private Screening Studio`,
    description:
      "Book luxury private movie screenings in Benin City with premium rooms and unforgettable cinema experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${businessDetails.name} Benin City | Private Screening Studio`,
    description:
      "Book luxury private movie screenings in Benin City with premium rooms and unforgettable cinema experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MovieTheater",
  name: businessDetails.name,
  image: `${siteUrl}/posters/film-1.jpg`,
  url: siteUrl,
  ...(businessDetails.phone ? { telephone: businessDetails.phone } : {}),
  address: {
    "@type": "PostalAddress",
    streetAddress: businessDetails.streetAddress,
    addressLocality: businessDetails.locality,
    addressRegion: businessDetails.region,
    postalCode: businessDetails.postalCode,
    addressCountry: businessDetails.country,
  },
  areaServed: businessDetails.locality,
  openingHours: businessDetails.openingHours,
  priceRange: "NGN",
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: businessDetails.name,
  url: siteUrl,
  inLanguage: "en-NG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${playfair.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
        <Providers>
          <Header />

          <main className="flex-1 flex flex-col md:pt-20">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}