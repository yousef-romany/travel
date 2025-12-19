import { Metadata } from "next";
import UserProfileContent from "./UserProfileContent";

export const metadata: Metadata = {
  title: "My Profile | ZoeHoliday",
  description: "Manage your ZoeHoliday profile, bookings, and preferences.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/me`,
  },
  robots: {
    index: false, // User profiles should generally not be indexed
    follow: false,
  },
};

export default function UserProfilePage() {
  return <UserProfileContent />;
}
