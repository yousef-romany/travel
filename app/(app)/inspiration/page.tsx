import MainContentInpiration from "./components/MainContentInpiration";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Egypt Travel Inspiration & Ideas",
  description: "Get inspired for your Egypt adventure! Discover travel stories, cultural insights, historical wonders, and planning tips for exploring the land of pharaohs. Find inspiration for your perfect Egyptian journey.",
  keywords: ["Egypt travel inspiration", "Egypt travel ideas", "Egypt stories", "Egyptian culture", "travel blog Egypt", "Egypt adventures", "Egypt inspiration", "visit Egypt ideas"],
  openGraph: {
    title: "Egypt Travel Inspiration & Ideas | ZoeHoliday",
    description: "Get inspired for your Egypt adventure! Discover travel stories, cultural insights, and historical wonders.",
    type: "website",
    url: "/inspiration",
    images: [
      {
        url: "/og-inspiration.jpg",
        width: 1200,
        height: 630,
        alt: "Egypt Travel Inspiration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Travel Inspiration & Ideas | ZoeHoliday",
    description: "Get inspired for your Egypt adventure! Discover travel stories, cultural insights, and historical wonders.",
    images: ["/og-inspiration.jpg"],
  },
};

const InspirationPage = () => {
  return <MainContentInpiration />;
};

export default InspirationPage;
