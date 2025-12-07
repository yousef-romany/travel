import { Metadata } from "next";
import Content from "./TERMSANDCONDITIONSContent";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Terms and Conditions - ZoeHoliday Egypt",
  description: "Read ZoeHoliday's terms and conditions for using our services, booking policies, cancellation rules, and legal agreements.",
  keywords: ["terms and conditions", "booking policy", "cancellation policy", "ZoeHoliday terms", "travel agreement", "refund policy"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/terms-and-conditions`,
  },
  openGraph: {
    title: "Terms and Conditions | ZoeHoliday",
    description: "Read ZoeHoliday's terms and conditions for using our services.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/terms-and-conditions`,
  },
  twitter: {
    card: "summary",
    title: "Terms and Conditions | ZoeHoliday",
    description: "Read ZoeHoliday's terms and conditions for using our services.",
  },
};

export default function TermsandconditionsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Terms and Conditions", item: "/terms-and-conditions" }
        ]}
      />
      <Content />
    </>
  );
}
