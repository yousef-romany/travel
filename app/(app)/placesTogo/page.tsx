import MainContentInpiration from "./components/MainContentInpiration";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Egypt Destinations & Places to Visit | ZoeHoliday",
  description: "Explore the most iconic destinations across Egypt. From the ancient pyramids of Giza to the temples of Luxor, discover the best places to visit in Egypt with ZoeHoliday travel guides.",
  keywords: [
    "Egypt destinations", "places to visit in Egypt", "Cairo attractions", "Luxor temples",
    "Aswan landmarks", "Alexandria Egypt", "Red Sea resorts", "Egyptian monuments",
    "Egypt tourist spots", "best places in Egypt", "Egypt sightseeing", "historical places Egypt"
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/placesTogo`,
  },
  openGraph: {
    title: "Egypt Destinations & Places to Visit | ZoeHoliday",
    description: "Explore the most iconic destinations across Egypt. From the ancient pyramids to beautiful beaches, discover the best places to visit.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/placesTogo`,
    images: [
      {
        url: "/og-places.jpg",
        width: 1200,
        height: 630,
        alt: "Egypt Destinations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Destinations & Places to Visit | ZoeHoliday",
    description: "Explore the most iconic destinations across Egypt. From the ancient pyramids to beautiful beaches, discover the best places to visit.",
    images: ["/og-places.jpg"],
    creator: "@zoeholiday",
  },
};

import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const InspirationPage = () => {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Places To Go", item: "/placesTogo" }
        ]}
      />
      <MainContentInpiration />
    </>
  );
};

export default InspirationPage;
