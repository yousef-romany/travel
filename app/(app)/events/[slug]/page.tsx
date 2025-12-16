import { Metadata } from "next";
import { fetchEventBySlug } from "@/fetch/events";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import EventDetailContent from "./EventDetailContent";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
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

    return {
      title: `${event.title} - Egypt Event | ZoeHoliday`,
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
        url: `/events/${slug}`,
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
        canonical: `/events/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating event metadata:", error);
    return {
      title: "Egypt Event",
      description: "Discover exciting events in Egypt with ZoeHoliday.",
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

      <EventDetailContent event={event} initialData={data} />
    </div>
  );
}
