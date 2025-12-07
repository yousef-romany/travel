import { Metadata } from "next";
import IndexPage from "./components/IndexPage";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import HieroglyphEffect from "@/components/HieroglyphEffect";
import { fetchInspirationOneCategory } from "@/fetch/category";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

type Props = {
  params: { category: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = decodeURIComponent(resolvedParams.category);
  // Fetch data for metadata
  const data = await fetchInspirationOneCategory(category);
  const categoryData = data?.data?.at(-1);

  const title = categoryData?.categoryName
    ? `${categoryData.categoryName} - Egypt Travel Inspiration | ZoeHoliday`
    : `${category} - Egypt Travel Inspiration | ZoeHoliday`;

  const description = categoryData?.description
    ? categoryData.description.slice(0, 160)
    : `Get inspired for your trip to ${category}, Egypt. Discover stories, tips, and cultural insights with ZoeHoliday.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: categoryData?.image ? [{ url: categoryData.image.url }] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/inspiration/${resolvedParams.category}`,
    },
  };
}

const InspirationDynamic = async ({ params }: Props) => {
  const resolvedParams = await params;
  const category = decodeURIComponent(resolvedParams.category);

  return (
    <div className="flex flex-col min-h-screen">
      <HieroglyphEffect />
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Inspiration", href: "/inspiration" },
          { label: category },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Inspiration", item: "/inspiration" },
          { name: category, item: `/inspiration/${resolvedParams.category}` }
        ]}
      />

      <IndexPage slug={category} />
    </div>
  );
};
export default InspirationDynamic;
