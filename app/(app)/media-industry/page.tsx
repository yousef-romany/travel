import { Metadata } from "next";
import Content from "./MEDIAINDUSTRYContent";

export const metadata: Metadata = {
  title: "Media & Industry - ZoeHoliday Egypt",
  description: "ZoeHoliday media resources, press releases, industry partnerships, and professional travel services for media and tourism professionals.",
  keywords: ["media kit", "press releases", "tourism industry", "travel media", "Egypt tourism news", "travel partnerships"],
  openGraph: {
    title: "Media & Industry Resources | ZoeHoliday",
    description: "Resources and partnerships for media professionals and tourism industry stakeholders.",
    type: "website",
    url: "/media-industry",
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
  },
};

export default function MediaindustryPage() {
  return <Content />;
}
