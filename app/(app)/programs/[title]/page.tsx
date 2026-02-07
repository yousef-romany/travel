import { Metadata } from "next";
import { fetchProgramOne, fetchProgramsList } from "@/fetch/programs";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Clock, MapPin, Check, X, HelpCircle } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import TourPackageSchema from "@/components/seo/TourPackageSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ProgramFAQGenerator from "@/components/seo/ProgramFAQGenerator";
import ImageObjectSchema from "@/components/seo/ImageObjectSchema";
import ReviewSchema from "@/components/seo/ReviewSchema";
import { fetchProgramTestimonials } from "@/fetch/testimonials";
import { ContentStep } from "@/type/programs";
import { ProgramImageCarousel } from "./components/ProgramImageCarousel";
import { ProgramBookingCard } from "./components/ProgramBookingCard";
import { ProgramReviewsSection } from "./components/ProgramReviewsSection";
import { ProgramTracking } from "./components/ProgramTracking";
import { ProgramMobileAction } from "./components/ProgramMobileAction";
import { ProgramItinerary } from "./components/ProgramItinerary";
import RelatedProgramsClient from "@/components/programs/RelatedProgramsClient";

type Props = {
  params: Promise<{ title: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const titleOrId = decodeURIComponent(resolvedParams.title);
    const data = await fetchProgramOne(titleOrId);
    const program = data?.data?.at(0);

    if (!program) {
      return {
        title: "Program Not Found",
        description: "The requested program could not be found.",
      };
    }

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

// Generate static params for popular programs (improves SEO and performance)
export async function generateStaticParams() {
  try {
    const { data } = await fetchProgramsList(50);

    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((program) => ({
      title: program.documentId || encodeURIComponent(program.title || ""),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Revalidate program details page every 30 minutes
export const revalidate = 1800; // 30 minutes in seconds

export default async function ProgramPage({ params }: Props) {
  const resolvedParams = await params;
  const titleOrId = decodeURIComponent(resolvedParams.title);

  const [programData, testimonialsData] = await Promise.allSettled([
    fetchProgramOne(titleOrId),
    fetchProgramTestimonials(titleOrId).catch(() => ({ data: [], meta: { pagination: { total: 0 } } })),
  ]);

  const data = programData.status === 'fulfilled' ? programData.value : null;
  const testimonials = testimonialsData.status === 'fulfilled' ? testimonialsData.value : { data: [], meta: { pagination: { total: 0 } } };

  const program = data?.data?.at(0);

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Program Not Found</h1>
          <p className="text-muted-foreground">The requested program could not be found.</p>
        </div>
      </div>
    );
  }

  const firstImageObj = program.images?.[0];
  const imageUrl = firstImageObj?.imageUrl
    ? getImageUrl(firstImageObj.imageUrl)
    : (firstImageObj ? getImageUrl(firstImageObj as any) : "/placeholder.svg");


  return (
    <>
      {/* Client-only tracking component */}
      <ProgramTracking program={program} />

      {/* Server-rendered structured data */}
      <TourPackageSchema
        name={program.title || "Egypt Tour"}
        description={program.descraption || program.overView || "Discover Egypt"}
        image={imageUrl}
        price={Number(program.price) || 0}
        duration={Number(program.duration) || 1}
        location={program.Location || "Egypt"}
        rating={Number(program.rating) || 5}
        reviewCount={testimonials?.data?.length || 0}
        url={`/programs/${program.documentId}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Programs", item: "/programs" },
          { name: program.title || "Egypt Tour", item: `/programs/${program.documentId}` },
        ]}
      />
      {/* Image SEO */}
      {imageUrl && imageUrl !== "/placeholder.svg" && (
        <ImageObjectSchema
          url={imageUrl}
          name={program.title || "Egypt Tour"}
          caption={`${program.title} - ${program.duration} Days Tour in ${program.Location}`}
          description={program.descraption || program.overView}
          width={1200}
          height={630}
        />
      )}
      {/* Review Schema */}
      {testimonials?.data && testimonials.data.length > 0 && (
        <ReviewSchema
          itemName={program.title || "Egypt Tour"}
          itemType="TouristTrip"
          itemUrl={`/programs/${program.documentId}`}
          itemImage={imageUrl}
          reviews={testimonials.data.map((testimonial) => ({
            author: testimonial.reviewerName || testimonial.user?.profile?.firstName || testimonial.user?.username || "Anonymous",
            rating: testimonial.rating,
            reviewBody: testimonial.comment,
            datePublished: testimonial.reviewDate || testimonial.createdAt,
          }))}
          aggregateRating={{
            ratingValue: Number(program.rating) || 5,
            reviewCount: testimonials.data.length,
            bestRating: 5,
            worstRating: 1,
          }}
        />
      )}

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
        </div>

        <article className="container mx-auto px-4 py-12 max-w-6xl mb-[60px] relative z-10">
          {/* Hero Section - Server-rendered for SEO */}
          <header className="text-center mb-12 animate-slide-up">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20">
                Curated Travel Experience
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
              {program.title}
            </h1>
            <div className="inline-block">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-amber-600/10 border border-primary/20 rounded-full">
                <Clock className="w-5 h-5 text-primary" aria-label="Duration" />
                <span className="text-lg font-semibold text-foreground">
                  Total Duration: {program.tripType === "single-day" || Number(program.duration) === 1
                    ? "1 Day"
                    : `${program.duration} Days`}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 animate-slide-up animate-delay-200">
            {/* Left: Image Carousel (Client Component) */}
            <ProgramImageCarousel program={program} />

            {/* Right: Booking Card (Client Component with tracking) */}
            <div className="md:sticky md:top-24 self-start space-y-6">
              <ProgramBookingCard program={program} />
            </div>
          </div>

          {/* Itinerary Section - Server-rendered for SEO */}
          <section className="mb-12 animate-slide-up animate-delay-300">
            <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-primary to-amber-600 rounded-xl">
                  <MapPin className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Travel Itinerary
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {program.content_steps?.length} amazing destinations to explore
                  </p>
                </div>
              </div>

              <div className="relative">
                <ProgramItinerary steps={program.content_steps || []} />
              </div>

              <footer className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">
                    Total duration: <strong className="font-bold text-foreground">{program.duration} {Number(program.duration) === 1 ? 'Day' : 'Days'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">
                    <strong className="font-bold text-foreground">{program.content_steps?.length}</strong> destinations
                  </span>
                </div>
              </footer>
            </div>
          </section>

          {/* Overview Section - Server-rendered for SEO */}
          <section className="mb-12 animate-slide-up animate-delay-400">
            <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Overview
              </h2>
              <MarkdownRenderer className="text-lg leading-relaxed">
                {program.overView || program.descraption || 'No overview available'}
              </MarkdownRenderer>
            </div>
          </section>

          {/* Includes/Excludes - Server-rendered for SEO */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 animate-slide-up animate-delay-500">
            <section className="bg-gradient-to-br from-green-500/5 to-card border border-green-500/20 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Check className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  What's Included
                </span>
              </h2>
              <ul className="space-y-3" itemScope itemType="https://schema.org/ItemList">
                {program.includes?.map((item: { id: number; title: string }, index: number) => (
                  <li key={item.id} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-green-500/10" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-foreground font-medium" itemProp="name">{item.title}</span>
                    <meta itemProp="position" content={String(index + 1)} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-gradient-to-br from-red-500/5 to-card border border-red-500/20 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <X className="w-6 h-6 text-red-600" aria-hidden="true" />
                </div>
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  What's Excluded
                </span>
              </h2>
              <ul className="space-y-3">
                {program.excludes?.map((item: { id: number; title: string }) => (
                  <li key={item.id} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-red-500/10">
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-foreground font-medium">{item.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* FAQ Section - Server-rendered for SEO */}
          <section className="mb-12 animate-slide-up animate-delay-500">
            <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-primary to-amber-600 rounded-xl">
                  <HelpCircle className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Everything you need to know about this tour
                  </p>
                </div>
              </div>
              <ProgramFAQGenerator program={program} />
            </div>
          </section>

          {/* Related Programs */}
          <RelatedProgramsClient
            placeTitle={program.title}
            location={program.Location}
            query={program.title}
          />

          {/* Reviews Section - Client Component for interactivity */}
          <ProgramReviewsSection
            program={program}
            initialTestimonials={testimonials?.data || []}
          />
        </article>
      </div>
      <ProgramMobileAction program={program} />
    </>
  );
}
