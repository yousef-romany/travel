import { Metadata } from "next";
import WebPageSchema from "@/components/seo/WebPageSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import VideoSchema from "@/components/seo/VideoSchema";
import HeroSection from "./components/home/server/HeroSection";
import InspireSection from "./components/home/server/InspireSection";
import PlacesSection from "./components/home/server/PlacesSection";
import PlanTripSection from "./components/home/server/PlanTripSection";
import ProgramsSection from "./components/home/server/ProgramsSection";
import FeaturesSection from "./components/home/server/FeaturesSection";
import TestimonialsSection from "./components/home/server/TestimonialsSection";
import InstagramSection from "./components/home/server/InstagramSection";
import { PromoCodesShowcase } from "@/components/promo/PromoCodesShowcase";

export const metadata: Metadata = {
  title: "Egypt Tours & Travel Packages | ZoeHoliday - Pyramids, Nile Cruises & Ancient Temples",
  description: "Explore Egypt with ZoeHoliday! Visit Pyramids of Giza, Luxor temples, Nile cruises & Red Sea. Best time: October-April with perfect weather. Expert local guides, custom tours, best prices. Book your Egyptian adventure today!",
  keywords: [
    "Egypt travel", "Egypt tours", "Egyptian vacation", "pyramids tour", "Nile cruise",
    "Cairo tours", "Luxor travel", "Egyptian holidays", "travel packages Egypt", "Egypt tourism",
    "Giza pyramids", "Valley of Kings", "Red Sea diving", "Aswan tours", "Alexandria travel",
    "Egypt tour operator", "Egyptian adventure", "ancient Egypt tours", "Karnak Temple",
    "Abu Simbel", "Egypt cultural tours", "Egypt family vacation", "Egypt honeymoon packages",
    "luxury Egypt tours", "Egypt vacation packages 2025", "best Egypt travel agency",
    "best time to visit Egypt", "Egypt October to April", "Egypt weather", "Egypt winter travel",
    "ZoeHoliday"
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com',
  },
  openGraph: {
    title: "Egypt Tours & Packages | Pyramids, Nile Cruises & Temples | ZoeHoliday",
    description: "Visit Egypt's Pyramids, Luxor temples, Nile cruises & Red Sea. Best time: October-April. Expert guides, custom tours, 24/7 support. Book your adventure with ZoeHoliday!",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholiday.com",
    siteName: "ZoeHoliday - Egypt Travel & Tours",
    images: [
      {
        url: "https://res.cloudinary.com/dir8ao2mt/image/upload/v1764631854/__1_l2obyo.jpg",
        width: 1200,
        height: 630,
        alt: "ZoeHoliday Egypt Tours - Pyramids of Giza, Nile River Cruises, Luxor Temples and Red Sea Adventures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Tours & Travel Packages | Pyramids, Nile & Temples | ZoeHoliday",
    description: "Explore Egypt's Pyramids, Nile cruises & temples. Best time: October-April. Expert guides, custom tours. Book with ZoeHoliday!",
    images: ["https://res.cloudinary.com/dir8ao2mt/image/upload/v1764631854/__1_l2obyo.jpg"],
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
import { LazySection } from "@/components/LazySection";

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

  const testimonials = testimonialsData.status === 'fulfilled' && testimonialsData.value?.data
    ? testimonialsData.value.data
    : [];

  return (
    <div className="!w-full flex-1">
      {/* SEO Schemas */}
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

      {/* Main Content - Server-Rendered for SEO */}
      {/* Above-fold: Load immediately */}
      <HeroSection />
      <InspireSection blogs={data.inspireBlogs} />
      <PlacesSection categories={data.placeCategories} />

      {/* Below-fold: Progressive lazy loading */}
      <LazySection minHeight="500px" rootMargin="100px">
        <PlanTripSection />
      </LazySection>

      <LazySection minHeight="600px" rootMargin="100px">
        <ProgramsSection programs={data.programs} />
      </LazySection>

      <LazySection minHeight="400px" rootMargin="100px">
        <FeaturesSection />
      </LazySection>

      {/* Promo Codes Section */}
      <LazySection minHeight="400px" rootMargin="100px">
        <section className="py-16 bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="container mx-auto px-4">
            <PromoCodesShowcase limit={3} variant="grid" />
            <div className="text-center mt-8">
              <a
                href="/promo-codes"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-white rounded-full font-semibold transition-all hover:scale-105"
              >
                View All Promo Codes
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection minHeight="500px" rootMargin="100px">
        <TestimonialsSection testimonials={testimonials} />
      </LazySection>

      <LazySection minHeight="400px" rootMargin="100px">
        <InstagramSection posts={data.instagramPosts} />
      </LazySection>
    </div>
  );
}