import type { Metadata } from "next";
import BookingSelector from "@/components/booking/booking-selector";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Now Showing",
  description:
    "See movies currently showing at Kino Screens in Benin City and book your private cinema experience.",
  alternates: {
    canonical: "/now-showing/",
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/now-showing/`,
    title: "Now Showing | Kino Screens Benin City",
    description:
      "Browse currently showing films and reserve your private cinema package in Benin City.",
  },
};

export default function NowShowingPage() {
  return <BookingSelector />;
}
