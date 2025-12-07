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
import { fetchInspirationOneSubCategory } from "@/fetch/category";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

type Props = {
  params: { category: string; subCategory: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  const subCategory = decodeURIComponent(params.subCategory);

  // Fetch data for metadata
  const data = await fetchInspirationOneSubCategory(subCategory);
  const subCategoryData = data?.data?.at(-1);

  const title = subCategoryData?.categoryName
    ? `${subCategoryData.categoryName} - ${category} Inspiration | ZoeHoliday`
    : `${subCategory} - ${category} Inspiration | ZoeHoliday`;

  const description = subCategoryData?.description
    ? subCategoryData.description.slice(0, 160)
    : `Explore ${subCategory} stories in ${category}, Egypt. Get inspired for your next adventure with ZoeHoliday.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: subCategoryData?.image ? [{ url: subCategoryData.image.url }] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/inspiration/${params.category}/${params.subCategory}`,
    },
  };
}

const InspirationDynamic = ({ params }: Props) => {
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
              <BreadcrumbLink href="/inspiration" className="hover:text-white/80 transition-colors">
                Inspiration
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60" />
            <BreadcrumbItem className="text-white">
              <BreadcrumbLink
                href={`/inspiration/${params.category}`}
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
          { name: "Inspiration", item: "/inspiration" },
          { name: category, item: `/inspiration/${params.category}` },
          { name: subCategory, item: `/inspiration/${params.category}/${params.subCategory}` }
        ]}
      />

      <IndexPageInspireSubCategory
        routes={category}
        slug={subCategory}
      />
    </div>
  );
};
export default InspirationDynamic;
