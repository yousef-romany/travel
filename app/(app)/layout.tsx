import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chat/Chatbot";

export const metadata: Metadata = {
  title: {
    default: "ZoeHoliday - Explore Egypt | Travel & Tour Packages",
    template: "%s | ZoeHoliday"
  },
  description: "Discover the magic of Egypt with ZoeHoliday. Curated travel experiences featuring pyramids, Nile cruises, ancient temples, and Red Sea adventures. Book your Egyptian journey today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
