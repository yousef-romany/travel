import { Metadata } from "next";
import HomeContent from "./HomeContent";
import WebPageSchema from "@/components/seo/WebPageSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import VideoSchema from "@/components/seo/VideoSchema";

export const metadata: Metadata = {
  title: "ZoeHoliday - Explore the Beauty of Egypt | Travel & Tour Packages",
  description: "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure. Book your Egyptian journey today with our curated travel packages and tours. Explore pyramids, Nile cruises, and ancient temples.",
  keywords: [
    "Egypt travel", "Egypt tours", "Egyptian vacation", "pyramids tour", "Nile cruise",
    "Cairo tours", "Luxor travel", "Egyptian holidays", "travel packages Egypt", "Egypt tourism",
    "Giza pyramids", "Valley of Kings", "Red Sea diving", "Aswan tours", "Alexandria travel",
    "Egypt tour operator", "Egyptian adventure", "ancient Egypt tours", "Karnak Temple",
    "Abu Simbel", "Egypt cultural tours", "Egypt family vacation", "Egypt honeymoon packages",
    "luxury Egypt tours", "Egypt vacation packages 2025", "best Egypt travel agency",
    "ZoeHoliday"
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com',
  },
  openGraph: {
    title: "ZoeHoliday - Explore the Beauty of Egypt",
    description: "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com",
    siteName: "ZoeHoliday",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZoeHoliday - Egypt Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZoeHoliday - Explore the Beauty of Egypt",
    description: "Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure.",
    images: ["/og-image.jpg"],
    creator: "@zoeholiday",
  },
};

// Common FAQs for Egypt travel
const faqs = [
  {
    question: "What is the best time to visit Egypt?",
    answer: "The best time to visit Egypt is from October to April when temperatures are cooler and more comfortable for sightseeing. December and January are peak tourist months with ideal weather for exploring pyramids, temples, and other attractions."
  },
  {
    question: "Do I need a visa to visit Egypt?",
    answer: "Most visitors need a visa to enter Egypt. You can obtain a visa on arrival at Egyptian airports or apply for an e-visa before your trip. Check with your local Egyptian embassy for specific requirements based on your nationality."
  },
  {
    question: "What should I wear when visiting Egypt?",
    answer: "Egypt is a conservative country. It's recommended to dress modestly, especially when visiting religious sites. Light, breathable clothing is ideal due to the warm climate. Women should cover shoulders and knees, and men should avoid shorts in religious areas."
  },
  {
    question: "Is Egypt safe for tourists?",
    answer: "Egypt is generally safe for tourists, especially in major tourist areas like Cairo, Luxor, Aswan, and the Red Sea resorts. Always follow local advice, stay in well-known tourist areas, and book tours with reputable companies like ZoeHoliday."
  },
  {
    question: "What are the must-see attractions in Egypt?",
    answer: "Top attractions include the Pyramids of Giza and Sphinx, Egyptian Museum in Cairo, Luxor Temple and Karnak Temple, Valley of the Kings, Abu Simbel temples, and a Nile River cruise. The Red Sea resorts also offer excellent diving and beach activities."
  }
];

import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { fetchHomePageData } from "@/fetch/homepage";
import { fetchApprovedTestimonials } from "@/fetch/testimonials";

export default async function Home() {
  // Fetch data server-side for SEO
  const [homepageData, testimonialsData] = await Promise.allSettled([
    fetchHomePageData(),
    fetchApprovedTestimonials(6),
  ]);

  const data = homepageData.status === 'fulfilled' ? homepageData.value : {
    inspireBlogs: [],
    placeCategories: [],
    programs: [],
    instagramPosts: [],
  };

  const testimonials = testimonialsData.status === 'fulfilled' ? testimonialsData.value : [];

  return (
    <>
      <WebPageSchema
        name="ZoeHoliday - Egypt Travel & Tours"
        description="Discover the magic of Egypt with ZoeHoliday. Experience 7,000 years of history, culture, and adventure with our curated travel packages."
        url="/"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" }
        ]}
      />
      <FAQSchema faqs={faqs} />
      <VideoSchema
        name="Discover Egypt - Immersive Travel Experience"
        description="Experience the breathtaking beauty of Egypt through immersive video showcasing ancient pyramids, Nile River cruises, historic temples, and vibrant culture. Watch stunning footage of Egypt's unmatched diversity and rich heritage."
        thumbnailUrl="/og-image.jpg"
        contentUrl="https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922614/Egypt_Unmatched_Diversity_fbtjmf.mp4"
        duration="PT45S"
      />
      <HomeContent initialData={data} initialTestimonials={testimonials} />
    </>
  );
}