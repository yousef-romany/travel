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
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

type Props = {
  params: { category: string; subCategory: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  const subCategory = decodeURIComponent(params.subCategory);

  // Fetch data for metadata
  const data = await fetchPlaceToOneSubCategory(subCategory);
  const subCategoryData = data?.data?.at(-1);

  const title = subCategoryData?.categoryName
    ? `${subCategoryData.categoryName} - ${category} | ZoeHoliday`
    : `${subCategory} - ${category} | ZoeHoliday`;

  const description = subCategoryData?.description
    ? subCategoryData.description.slice(0, 160)
    : `Explore ${subCategory} in ${category}, Egypt. Find the best tours, activities, and travel guides with ZoeHoliday.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: subCategoryData?.image ? [{ url: subCategoryData.image.url }] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/placesTogo/${params.category}/${params.subCategory}`,
    },
  };
}

const PlacesToGoDynamic = ({ params }: Props) => {
  const category = decodeURIComponent(params.category);
  const subCategory = decodeURIComponent(params.subCategory);

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
                href={`/placesTogo/${params.category}`}
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
          { name: category, item: `/placesTogo/${params.category}` },
          { name: subCategory, item: `/placesTogo/${params.category}/${params.subCategory}` }
        ]}
      />

      <IndexPageInspireSubCategory
        routes={category}
        slug={subCategory}
      />
    </div>
  );
};
export default PlacesToGoDynamic;
