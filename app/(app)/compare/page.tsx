import { Metadata } from "next";
import CompareContent from "./CompareContent";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Compare Tour Programs | ZoeHoliday",
  description: "Compare different Egypt tour packages side-by-side. Analyze prices, durations, ratings, and features to find your perfect Egyptian vacation.",
  keywords: ["compare tours Egypt", "Egypt tour comparison", "travel package comparison", "best Egypt tours", "tour price comparison"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/compare`,
  },
  openGraph: {
    title: "Compare Tour Programs | ZoeHoliday",
    description: "Compare different Egypt tour packages side-by-side to find your perfect vacation.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/compare`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Tour Programs | ZoeHoliday",
    description: "Compare different Egypt tour packages side-by-side.",
    creator: "@zoeholiday",
  },
};

export default function ComparePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Compare", item: "/compare" }
        ]}
      />
      <CompareContent />
    </>
  );
}
