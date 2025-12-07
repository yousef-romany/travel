import { Metadata } from "next";
import Content from "./PRIVACYPOLICYContent";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Privacy Policy - ZoeHoliday Egypt",
  description: "Learn how ZoeHoliday collects, uses, and protects your personal information. Read our comprehensive privacy policy for transparency and security.",
  keywords: ["privacy policy", "data protection", "user privacy", "ZoeHoliday privacy", "GDPR compliance", "data security"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy | ZoeHoliday",
    description: "Learn how ZoeHoliday collects, uses, and protects your personal information.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/privacy-policy`,
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | ZoeHoliday",
    description: "Learn how ZoeHoliday collects, uses, and protects your personal information.",
  },
};

export default function PrivacypolicyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Privacy Policy", item: "/privacy-policy" }
        ]}
      />
      <Content />
    </>
  );
}
