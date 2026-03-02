import ServiceFeaturesDemo from "../components/ServiceFeaturesDemo";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com';

export const metadata: Metadata = {
  title: "Place-to-Go Blog Services Demo | ZoeHoliday",
  description: "Demo of custom service features for place-to-go blogs including nearby search, featured blogs, statistics, and more.",
  openGraph: {
    title: "Place-to-Go Blog Services Demo | ZoeHoliday",
    description: "Demo of custom service features for place-to-go blogs",
    url: `${SITE_URL}/placesTogo/services-demo`,
    siteName: "ZoeHoliday",
  },
};

export default function ServicesDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceFeaturesDemo />
    </div>
  );
}
