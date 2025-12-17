import type { Metadata } from "next";
import PageContent from "./components/PageContent";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import CollectionPageSchema from "@/components/seo/CollectionPageSchema";
import { fetchProgramsList } from "@/fetch/programs";

export const metadata: Metadata = {
  title: "Egypt Travel Programs & Tour Packages | ZoeHoliday",
  description: "Explore our curated Egypt travel programs and tour packages. From pyramids to Nile cruises, find the perfect Egyptian adventure with expert guides, luxury accommodations, and unforgettable experiences.",
  keywords: [
    "Egypt tour packages", "Egypt travel programs", "pyramids tour", "Nile cruise packages",
    "Cairo tours", "Luxor Aswan tours", "Egypt vacation packages", "Egyptian holiday packages",
    "luxury Egypt tours", "family Egypt tours", "honeymoon Egypt packages", "adventure tours Egypt"
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/programs`,
  },
  openGraph: {
    title: "Egypt Travel Programs & Tour Packages | ZoeHoliday",
    description: "Explore our curated Egypt travel programs and tour packages. From pyramids to Nile cruises, find the perfect Egyptian adventure.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/programs`,
    images: [
      {
        url: "/og-programs.jpg",
        width: 1200,
        height: 630,
        alt: "Egypt Travel Programs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Travel Programs & Tour Packages | ZoeHoliday",
    description: "Explore our curated Egypt travel programs and tour packages. From pyramids to Nile cruises, find the perfect Egyptian adventure.",
    images: ["/og-programs.jpg"],
    creator: "@zoeholiday",
  },
};

export default async function Programs() {
  let data;
  try {
    data = await fetchProgramsList(100);
  } catch (error) {
    console.error("Error fetching programs:", error);
    data = { data: [], meta: { pagination: { page: 1, pageSize: 100, pageCount: 0, total: 0 } } };
  }

  // Prepare items for CollectionPageSchema
  const programItems = data.data.map((program) => ({
    name: program.title,
    url: `/programs/${program.documentId}`,
    description: program.descraption,
    image: program.images?.[0]?.url || '',
  }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Programs", item: "/programs" }
        ]}
      />
      <CollectionPageSchema
        name="Egypt Travel Programs & Tour Packages"
        description="Explore our curated collection of Egypt travel programs and tour packages. From pyramids to Nile cruises, find the perfect Egyptian adventure."
        url="/programs"
        items={programItems.slice(0, 20)}
      />
      <PageContent initialData={data} />
    </>
  );
}
