import type { Metadata } from "next";
import PageContent from "./components/PageContent";

export const metadata: Metadata = {
  title: "Egypt Travel Programs & Tour Packages",
  description: "Explore our curated Egypt travel programs and tour packages. From pyramids to Nile cruises, find the perfect Egyptian adventure with expert guides, luxury accommodations, and unforgettable experiences.",
  keywords: ["Egypt tour packages", "Egypt travel programs", "pyramids tour", "Nile cruise packages", "Cairo tours", "Luxor Aswan tours", "Egypt vacation packages", "Egyptian holiday packages"],
  openGraph: {
    title: "Egypt Travel Programs & Tour Packages | ZoeHoliday",
    description: "Explore our curated Egypt travel programs and tour packages. From pyramids to Nile cruises, find the perfect Egyptian adventure.",
    type: "website",
    url: "/programs",
    images: [
      {
        url: "/og-programs.jpg",
        width: 1200,
        height: 630,
        alt: "Egypt Travel Programs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Travel Programs & Tour Packages | ZoeHoliday",
    description: "Explore our curated Egypt travel programs and tour packages. From pyramids to Nile cruises, find the perfect Egyptian adventure.",
    images: ["/og-programs.jpg"],
  },
};

const Programs = () => {
  return <PageContent />;
};

export default Programs;
