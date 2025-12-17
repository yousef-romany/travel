import { Metadata } from "next";
import { fetchProgramOne, fetchProgramsList } from "@/fetch/programs";
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
            <ProgramBookingCard program={program} />
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
                <div className="absolute left-[19px] md:left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-amber-500 to-primary/20" aria-hidden="true" />

                <ol className="space-y-6 md:space-y-8">
                  {program.content_steps?.map((step: ContentStep, index: number) => {
                    const stepImage = step.image || step.imageUrl || null;
                    const stepImageUrl = stepImage ? getImageUrl(stepImage) : null;

                    return (
                      <li key={index} className="relative pl-12 md:pl-16 group animate-slide-up" itemScope itemType="https://schema.org/TouristAttraction">
                        <div className="absolute left-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary to-amber-600 text-white font-bold text-base md:text-lg shadow-lg z-10 group-hover:scale-110 transition-all duration-300" aria-label={`Day ${index + 1}`}>
                          {index + 1}
                        </div>

                        <div className="bg-gradient-to-br from-background via-background/90 to-primary/5 rounded-xl border border-primary/10 overflow-hidden hover:border-primary/30 hover:shadow-2xl transition-all duration-500">
                          {stepImageUrl && (
                            <div className="relative w-full h-48 md:h-64 overflow-hidden bg-gradient-to-br from-primary/5 to-amber-500/5">
                              <Image
                                src={stepImageUrl}
                                alt={step.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 600px"
                                className="object-cover"
                                loading="lazy"
                                quality={80}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" aria-hidden="true" />
                              <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                Day {index + 1}
                              </div>
                            </div>
                          )}

                          <div className="p-5 md:p-6">
                            <h3 className="text-foreground font-bold text-xl md:text-2xl mb-3 leading-tight" itemProp="name">
                              {step.title}
                            </h3>

                            {step.place_to_go_subcategories && step.place_to_go_subcategories.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 bg-muted/30 px-3 py-2 rounded-lg w-fit" itemProp="address">
                                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                                <span className="font-medium">
                                  {step.place_to_go_subcategories.at(-1)?.categoryName || "Egypt"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
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
              <div
                className="text-muted-foreground text-lg leading-relaxed prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: program.overView || program.descraption || 'No overview available' }}
                itemProp="description"
              />
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

          {/* Reviews Section - Client Component for interactivity */}
          <ProgramReviewsSection
            program={program}
            initialTestimonials={testimonials?.data || []}
          />
        </article>
      </div>
    </>
  );
}
