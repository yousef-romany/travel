import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import IndexPageInspireSubCategory from "./components/IndexPageInspireSubCategory";
import HieroglyphEffect from "@/components/HieroglyphEffect";
import { fetchPlaceToOneSubCategory } from "@/fetch/placesToGo";
import { fetchPlaceTestimonials } from "@/fetch/testimonials";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ReviewSchema from "@/components/seo/ReviewSchema";

type Props = {
  params: Promise<{ category: string; subCategory: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = decodeURIComponent(resolvedParams.category);
  const subCategory = decodeURIComponent(resolvedParams.subCategory);

  // Fetch data for metadata
  const data = await fetchPlaceToOneSubCategory(subCategory);
  const subCategoryData = data?.data?.at(-1);

  const title = subCategoryData?.categoryName
    ? `${subCategoryData.categoryName} - ${category}`
    : `${subCategory} - ${category}`;

  const ogTitle = subCategoryData?.categoryName
    ? `${subCategoryData.categoryName} - ${category} | ZoeHoliday`
    : `${subCategory} - ${category} | ZoeHoliday`;

  const description = subCategoryData?.description
    ? subCategoryData.description.slice(0, 160)
    : `Explore ${subCategory} in ${category}, Egypt. Find the best tours, activities, and travel guides with zoeholidays.`;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      images: subCategoryData?.image ? [{ url: subCategoryData.image.url }] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholidays.com'}/placesTogo/${resolvedParams.category}/${resolvedParams.subCategory}`,
    },
  };
}

const PlacesToGoDynamic = async ({ params }: Props) => {
  const resolvedParams = await params;
  const category = decodeURIComponent(resolvedParams.category);
  const subCategory = decodeURIComponent(resolvedParams.subCategory);
  const data = await fetchPlaceToOneSubCategory(subCategory);
  const place = data?.data?.at(-1);
  const testimonials = place?.documentId
    ? await fetchPlaceTestimonials(place.documentId).catch(() => ({
        data: [],
        meta: { pagination: { total: 0 } },
      }))
    : { data: [], meta: { pagination: { total: 0 } } };

  return (
    <div className="flex flex-col min-h-screen">
      <HieroglyphEffect />
      <div className="bg-gradient-to-r from-primary to-amber-600 w-full p-3 px-[2em] shadow-lg">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-white">
              <BreadcrumbLink href="/" className="hover:text-white/80 transition-colors">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60" />
            <BreadcrumbItem className="text-white">
              <BreadcrumbLink href="/placesTogo" className="hover:text-white/80 transition-colors">
                Places To Go
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60" />
            <BreadcrumbItem className="text-white">
              <BreadcrumbLink
                href={`/placesTogo/${resolvedParams.category}`}
                className="hover:text-white/80 transition-colors"
              >
                {category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60" />
            <BreadcrumbItem className="text-white">
              <BreadcrumbPage className="text-white font-semibold border-b-2 border-white/40">
                {subCategory}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Places To Go", item: "/placesTogo" },
          { name: category, item: `/placesTogo/${resolvedParams.category}` },
          { name: subCategory, item: `/placesTogo/${resolvedParams.category}/${resolvedParams.subCategory}` }
        ]}
      />

      {testimonials?.data && testimonials.data.length > 0 && place?.documentId && (
        <ReviewSchema
          itemName={place.categoryName || subCategory}
          itemType="TouristTrip"
          itemUrl={`${process.env.NEXT_PUBLIC_SITE_URL || "https://zoeholidays.com"}/placesTogo/${resolvedParams.category}/${resolvedParams.subCategory}`}
          itemImage={place.image?.url || undefined}
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

      <IndexPageInspireSubCategory
        routes={category}
        slug={subCategory}
        data={data}
      />
    </div>
  );
};
export default PlacesToGoDynamic;
