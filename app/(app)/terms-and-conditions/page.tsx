import { Metadata } from "next";
import Content from "./TERMSANDCONDITIONSContent";

export const metadata: Metadata = {
  title: "Terms and Conditions - ZoeHoliday Egypt",
  description: "Read ZoeHoliday's terms and conditions for using our services, booking policies, cancellation rules, and legal agreements.",
  keywords: ["terms and conditions", "booking policy", "cancellation policy", "ZoeHoliday terms", "travel agreement", "refund policy"],
  openGraph: {
    title: "Terms and Conditions | ZoeHoliday",
    description: "Read ZoeHoliday's terms and conditions for using our services.",
    type: "website",
    url: "/terms-and-conditions",
  },
  twitter: {
    card: "summary",
    title: "Terms and Conditions | ZoeHoliday",
    description: "Read ZoeHoliday's terms and conditions for using our services.",
  },
};

export default function TermsandconditionsPage() {
  return <Content />;
}
