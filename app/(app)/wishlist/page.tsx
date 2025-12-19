import { Metadata } from "next";
import WishlistPageContent from "./WishlistPageContent";

export const metadata: Metadata = {
  title: "My Wishlist - Saved Egypt Travel Programs",
  description: "View and manage your saved Egypt travel programs and tours. Keep track of your favorite pyramids tours, Nile cruises, and Egyptian adventures. Book your dream vacation with ZoeHoliday.",
  keywords: ["wishlist", "saved programs", "Egypt tours wishlist", "favorite tours", "travel wishlist", "Egypt travel planner", "saved trips"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/wishlist`,
  },
  openGraph: {
    title: "My Wishlist - Saved Egypt Travel Programs | ZoeHoliday",
    description: "View and manage your saved Egypt travel programs and tours. Keep track of your favorite Egyptian adventures.",
    type: "website",
    url: "/wishlist",
    images: [
      {
        url: "/og-wishlist.jpg",
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
    images: ["/og-wishlist.jpg"],
  },
  robots: {
    index: false, // Don't index personal wishlist pages
    follow: true,
  },
};

export default function WishlistPage() {
  return <WishlistPageContent />;
}