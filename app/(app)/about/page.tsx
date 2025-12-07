import { Metadata } from "next";
import AboutContent from "./AboutContent";
import VideoSchema from "@/components/seo/VideoSchema";

export const metadata: Metadata = {
  title: "About ZoeHoliday - Egypt Travel Experts | ZoeHoliday",
  description: "Learn about ZoeHoliday, your trusted Egypt travel experts. With a history spanning over 5000 years, we help you explore ancient wonders, breathtaking landscapes, and vibrant culture. Discover sustainable tourism and authentic Egyptian experiences.",
  keywords: [
    "about ZoeHoliday", "Egypt tourism", "Egypt travel company", "Egyptian travel experts",
    "sustainable tourism Egypt", "Egyptian culture", "travel agency Egypt", "Egypt tour operators",
    "history of Egypt tourism", "ZoeHoliday story", "Egypt travel guides"
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/about`,
  },
  openGraph: {
    title: "About ZoeHoliday - Egypt Travel Experts | ZoeHoliday",
    description: "Learn about ZoeHoliday, your trusted Egypt travel experts. Discover sustainable tourism and authentic Egyptian experiences.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/about`,
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
    creator: "@zoeholiday",
  },
};

import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "About Us", item: "/about" }
        ]}
      />
      <VideoSchema
        name="This is Egypt - Ancient Civilization and Modern Adventures"
        description="Explore Egypt's rich heritage through cinematic video showcasing 5000+ years of history, iconic monuments, vibrant culture, and stunning landscapes. Experience the wonders of ancient civilization and modern Egyptian adventures."
        thumbnailUrl="/og-about.jpg"
        contentUrl="https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922572/This_is_Egypt_x6b0oo.mp4"
        duration="PT40S"
      />
      <AboutContent />
    </>
  );
}
