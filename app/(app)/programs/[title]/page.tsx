import { Metadata } from "next";
import { fetchProgramOne } from "@/fetch/programs";
import ProgramContent from "./ProgramContent";

type Props = {
  params: Promise<{ title: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    // The title param is now actually documentId or title (backwards compatible)
    const titleOrId = decodeURIComponent(resolvedParams.title);
    const data = await fetchProgramOne(titleOrId);
    const program = data?.data?.at(0);

    if (!program) {
      return {
        title: "Program Not Found",
        description: "The requested program could not be found.",
      };
    }

    // Handle both old format (images[].image) and new Strapi v5 media format
    const firstImage = program.images?.[0];
    const imageUrl = firstImage?.image || firstImage?.url || "/og-programs.jpg";
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`;

    return {
      title: `${program.title} - ${program.duration} Days Egypt Tour`,
      description: program.descraption || program.overView || `Discover ${program.title} in Egypt. ${program.duration} days tour starting at $${program.price}. Visit ${program.Location} and experience authentic Egyptian culture.`,
      keywords: [
        program.title,
        `${program.Location} tour`,
        "Egypt travel",
        "Egypt tour package",
        `${program.duration} days Egypt`,
        "Egyptian vacation",
        program.Location,
      ],
      openGraph: {
        title: `${program.title} | ZoeHoliday`,
        description: program.descraption || program.overView,
        type: "website",
        url: `/programs/${program.documentId}`,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: program.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${program.title} | ZoeHoliday`,
        description: program.descraption || program.overView,
        images: [fullImageUrl],
      },
      alternates: {
        canonical: `/programs/${program.documentId}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Egypt Tour Program",
      description: "Explore amazing Egypt tour programs with ZoeHoliday.",
    };
  }
}

export default async function ProgramPage({ params }: Props) {
  const resolvedParams = await params;
  return <ProgramContent title={resolvedParams.title} />;
}
