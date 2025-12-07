import { Metadata } from "next";
import Content from "./MEDIAINDUSTRYContent";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Media & Industry Resources | ZoeHoliday",
  description: "ZoeHoliday media resources, press releases, industry partnerships, and professional travel services for media and tourism professionals in Egypt.",
  keywords: ["media kit", "press releases", "tourism industry", "travel media", "Egypt tourism news", "travel partnerships", "ZoeHoliday press"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/media-industry`,
  },
  openGraph: {
    title: "Media & Industry Resources | ZoeHoliday",
    description: "Resources and partnerships for media professionals and tourism industry stakeholders.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/media-industry`,
    images: [
      {
        url: "/images/media-industry-og.jpg",
        width: 1200,
        height: 630,
        alt: "Media and Industry Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Media & Industry Resources | ZoeHoliday",
    description: "Resources and partnerships for media professionals and tourism industry stakeholders.",
    creator: "@zoeholiday",
  },
};

export default function MediaindustryPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Media & Industry", item: "/media-industry" }
        ]}
      />
      <Content />
    </>
  );
}
