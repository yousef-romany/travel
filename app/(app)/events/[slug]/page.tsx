import { Metadata } from "next";
import { fetchEventBySlug } from "@/fetch/events";
import { fetchEventTestimonials } from "@/fetch/testimonials";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import EventDetailContent from "./EventDetailContent";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import EventSchema from "@/components/seo/EventSchema";
import ReviewSchema from "@/components/seo/ReviewSchema";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const slug = decodeURIComponent(resolvedParams.slug);
    const data = await fetchEventBySlug(slug);
    const event = data?.data;

    if (!event) {
      return {
        title: "Event Not Found",
        description: "The requested event could not be found.",
      };
    }

    const imageUrl = event.featuredImage?.url || "/og-events.jpg";
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholidays.com";

    return {
      title: `${event.title} - Egypt Event`,
      description: event.description || `Join us for ${event.title} in ${event.location}. ${event.eventType} event happening on ${event.startDate}.`,
      keywords: [
        event.title,
        event.eventType,
        event.location || "Egypt",
        "Egypt events",
        "Cairo events",
        "events in Egypt",
      ],
      openGraph: {
        title: `${event.title} | ZoeHoliday`,
        description: event.description,
        type: "website",
        url: `${SITE_URL}/events/${slug}`,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${event.title} | ZoeHoliday`,
        description: event.description,
        images: [fullImageUrl],
      },
      alternates: {
        canonical: `${SITE_URL}/events/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating event metadata:", error);
    return {
      title: "Egypt Event",
      description: "Discover exciting events in Egypt with zoeholidays.",
    };
  }
}

export default async function EventDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  let data;
  try {
    data = await fetchEventBySlug(slug);
  } catch (error) {
    console.error("Error fetching event:", error);
    notFound();
  }

  if (!data?.data) {
    notFound();
  }

  const event = data.data;

  const testimonials = await fetchEventTestimonials(event.documentId).catch(() => ({
    data: [],
    meta: { pagination: { total: 0 } },
  }));

  return (
    <div className="min-h-screen bg-background">
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Events", item: "/events" },
          { name: event.title, item: `/events/${slug}` }
        ]}
      />

      <EventSchema
        name={event.title}
        description={event.description || `Join us for ${event.title} in ${event.location}. ${event.eventType} event in Egypt.`}
        startDate={event.startDate}
        endDate={event.endDate}
        location={{
          name: event.venue || event.location || "Egypt",
          address: event.venue || "Egypt",
          city: event.location || "Egypt",
          country: "EG",
        }}
        image={event.featuredImage?.url
          ? event.featuredImage.url.startsWith("http")
            ? event.featuredImage.url
            : `${process.env.NEXT_PUBLIC_STRAPI_URL}${event.featuredImage.url}`
          : undefined}
        price={event.price}
        url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholidays.com"}/events/${slug}`}
        eventStatus={event.isActive === false ? "EventCancelled" : "EventScheduled"}
      />

      {testimonials?.data && testimonials.data.length > 0 && (
        <ReviewSchema
          itemName={event.title}
          itemType="Service"
          itemUrl={`${process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholidays.com"}/events/${slug}`}
          itemImage={event.featuredImage?.url
            ? event.featuredImage.url.startsWith("http")
              ? event.featuredImage.url
              : `${process.env.NEXT_PUBLIC_STRAPI_URL}${event.featuredImage.url}`
            : undefined}
          reviews={testimonials.data.map((testimonial) => ({
            author:
              testimonial.reviewerName ||
              testimonial.user?.profile?.firstName ||
              testimonial.user?.username ||
              "Anonymous",
            rating: testimonial.rating,
            reviewBody: testimonial.comment,
            datePublished: testimonial.reviewDate || testimonial.createdAt,
            sourceUrl: testimonial.externalReviewUrl,
          }))}
          aggregateRating={{
            ratingValue: Number(testimonials.data.reduce((s, t) => s + t.rating, 0) / testimonials.data.length) || 5,
            reviewCount: testimonials.data.length,
            bestRating: 5,
            worstRating: 1,
          }}
        />
      )}

      <EventDetailContent event={event} initialData={data} />
    </div>
  );
}
