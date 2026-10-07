import { Metadata } from "next";
import WishlistPageContent from "./WishlistPageContent";
import { DEFAULT_OG_IMAGE } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "My Wishlist - Saved Egypt Travel Programs",
  description: "View and manage your saved Egypt travel programs and tours. Keep track of your favorite pyramids tours, Nile cruises, and Egyptian adventures. Book your dream vacation with zoeholidays.",
  keywords: ["wishlist", "saved programs", "Egypt tours wishlist", "favorite tours", "travel wishlist", "Egypt travel planner", "saved trips"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholidays.com'}/wishlist`,
  },
  openGraph: {
    title: "My Wishlist - Saved Egypt Travel Programs | ZoeHoliday",
    description: "View and manage your saved Egypt travel programs and tours. Keep track of your favorite Egyptian adventures.",
    type: "website",
    url: "/wishlist",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "My Travel Wishlist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Wishlist - Saved Egypt Travel Programs | ZoeHoliday",
    description: "View and manage your saved Egypt travel programs and tours.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: false, // Don't index personal wishlist pages
    follow: true,
  },
};

export default function WishlistPage() {
  return <WishlistPageContent />;
}
