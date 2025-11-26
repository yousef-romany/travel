import { Metadata } from "next";
import Content from "./TOURISMINVESTMENTContent";

export const metadata: Metadata = {
  title: "Tourism Investment - ZoeHoliday Egypt",
  description: "Explore tourism investment opportunities in Egypt with ZoeHoliday. Partner with us for sustainable tourism development and profitable ventures.",
  keywords: ["tourism investment Egypt", "hospitality investment", "travel industry partnerships", "Egypt tourism opportunities", "hotel investment", "tourism development"],
  openGraph: {
    title: "Tourism Investment Opportunities | ZoeHoliday",
    description: "Partner with ZoeHoliday to tap into Egypt's booming tourism sector and create sustainable, profitable ventures.",
    type: "website",
    url: "/tourism-investment",
    images: [
      {
        url: "/images/tourism-investment-og.jpg",
        width: 1200,
        height: 630,
        alt: "Tourism Investment Opportunities in Egypt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tourism Investment Opportunities | ZoeHoliday",
    description: "Partner with ZoeHoliday to tap into Egypt's booming tourism sector.",
  },
};

export default function TourisminvestmentPage() {
  return <Content />;
}
