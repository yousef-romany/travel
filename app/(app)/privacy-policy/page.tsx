import { Metadata } from "next";
import Content from "./PRIVACYPOLICYContent";

export const metadata: Metadata = {
  title: "Privacy Policy - ZoeHoliday Egypt",
  description: "Learn how ZoeHoliday collects, uses, and protects your personal information. Read our comprehensive privacy policy for transparency and security.",
  keywords: ["privacy policy", "data protection", "user privacy", "ZoeHoliday privacy", "GDPR compliance", "data security"],
  openGraph: {
    title: "Privacy Policy | ZoeHoliday",
    description: "Learn how ZoeHoliday collects, uses, and protects your personal information.",
    type: "website",
    url: "/privacy-policy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | ZoeHoliday",
    description: "Learn how ZoeHoliday collects, uses, and protects your personal information.",
  },
};

export default function PrivacypolicyPage() {
  return <Content />;
}
