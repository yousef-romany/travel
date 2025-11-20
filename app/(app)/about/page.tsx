import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About ZoeHoliday - Egypt Travel Experts",
  description: "Learn about ZoeHoliday, your trusted Egypt travel experts. With a history spanning over 5000 years, we help you explore ancient wonders, breathtaking landscapes, and vibrant culture. Discover sustainable tourism and authentic Egyptian experiences.",
  keywords: ["about ZoeHoliday", "Egypt tourism", "Egypt travel company", "Egyptian travel experts", "sustainable tourism Egypt", "Egyptian culture", "travel agency Egypt"],
  openGraph: {
    title: "About ZoeHoliday - Egypt Travel Experts | ZoeHoliday",
    description: "Learn about ZoeHoliday, your trusted Egypt travel experts. Discover sustainable tourism and authentic Egyptian experiences.",
    type: "website",
    url: "/about",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About ZoeHoliday",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ZoeHoliday - Egypt Travel Experts | ZoeHoliday",
    description: "Learn about ZoeHoliday, your trusted Egypt travel experts. Discover sustainable tourism and authentic Egyptian experiences.",
    images: ["/og-about.jpg"],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
