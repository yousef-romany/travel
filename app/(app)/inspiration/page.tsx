import MainContentInpiration from "./components/MainContentInpiration";
import type { Metadata } from "next";
import { fetchInspirationCategories } from "@/fetch/category";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Egypt Travel Inspiration & Ideas | ZoeHoliday",
  description: "Get inspired for your Egypt adventure! Discover travel stories, cultural insights, historical wonders, and planning tips for exploring the land of pharaohs. Find inspiration for your perfect Egyptian journey.",
  keywords: [
    "Egypt travel inspiration", "Egypt travel ideas", "Egypt stories", "Egyptian culture",
    "travel blog Egypt", "Egypt adventures", "Egypt inspiration", "visit Egypt ideas",
    "Egypt travel tips", "best of Egypt", "Egypt hidden gems"
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/inspiration`,
  },
  openGraph: {
    title: "Egypt Travel Inspiration & Ideas | ZoeHoliday",
    description: "Get inspired for your Egypt adventure! Discover travel stories, cultural insights, and historical wonders.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/inspiration`,
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
    creator: "@zoeholiday",
  },
};

// Revalidate inspiration page every 4 hours (content changes less frequently)
// Revalidate inspiration page every 30 minutes
export const revalidate = 1800; // 30 minutes in seconds

const InspirationPage = async () => {
  let data;
  try {
    data = await fetchInspirationCategories();
  } catch (error) {
    console.error("Error fetching inspiration categories:", error);
    data = { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Inspiration", item: "/inspiration" }
        ]}
      />
      <MainContentInpiration data={data} />
    </>
  );
};

export default InspirationPage;
