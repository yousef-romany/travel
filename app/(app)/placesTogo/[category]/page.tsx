import { Metadata } from "next";
import IndexPage from "./components/IndexPage";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import HieroglyphEffect from "@/components/HieroglyphEffect";
import { fetchPlaceToGoCategoriesOneCategory } from "@/fetch/placesToGo";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

type Props = {
  params: { category: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  // Fetch data for metadata
  const data = await fetchPlaceToGoCategoriesOneCategory(category);
  const categoryData = data?.data?.at(-1);

  const title = categoryData?.categoryName
    ? `${categoryData.categoryName} - Places to Go in Egypt | ZoeHoliday`
    : `${category} - Places to Go in Egypt | ZoeHoliday`;

  const description = categoryData?.description
    ? categoryData.description.slice(0, 160)
    : `Explore the best places to visit in ${category}, Egypt. Discover top attractions, hidden gems, and travel tips with ZoeHoliday.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: categoryData?.image ? [{ url: categoryData.image.url }] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/placesTogo/${params.category}`,
    },
  };
}

const PlacesToGoDynamic = ({ params }: Props) => {
  const category = decodeURIComponent(params.category);

  return (
    <div className="flex flex-col min-h-screen">
      <HieroglyphEffect />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>

      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Places To Go", href: "/placesTogo" },
          { label: category },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Places To Go", item: "/placesTogo" },
          { name: category, item: `/placesTogo/${params.category}` }
        ]}
      />

      <IndexPage slug={category} />
    </div>
  );
};

export default PlacesToGoDynamic;
