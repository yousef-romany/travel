import MainContentInpiration from "./components/MainContentInpiration";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Egypt Destinations & Places to Visit",
  description: "Explore the most iconic destinations across Egypt. From the ancient pyramids of Giza to the temples of Luxor, discover the best places to visit in Egypt with ZoeHoliday travel guides.",
  keywords: ["Egypt destinations", "places to visit in Egypt", "Cairo attractions", "Luxor temples", "Aswan landmarks", "Alexandria Egypt", "Red Sea resorts", "Egyptian monuments", "Egypt tourist spots"],
  openGraph: {
    title: "Egypt Destinations & Places to Visit | ZoeHoliday",
    description: "Explore the most iconic destinations across Egypt. From the ancient pyramids to beautiful beaches, discover the best places to visit.",
    type: "website",
    url: "/placesTogo",
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
  },
};

const InspirationPage = () => {
  return <MainContentInpiration />;
};

export default InspirationPage;
