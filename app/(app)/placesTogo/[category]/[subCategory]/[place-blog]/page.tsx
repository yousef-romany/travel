import { Metadata } from "next";
import IndexPagePlaceToGoBlog from "./components/IndexPagePlaceToGoBlog";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import HieroglyphEffect from "@/components/HieroglyphEffect";
import { fetchPlaceToGoOneBlog } from "@/fetch/placesToGo";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

type Props = {
  params: {
    category: string;
    subCategory: string;
    "place-blog": string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  const subCategory = decodeURIComponent(params.subCategory);
  const blogTitle = decodeURIComponent(params["place-blog"]);

  // Fetch data for metadata
  const data = await fetchPlaceToGoOneBlog(blogTitle);
  const blogData = data?.data?.at(0);

  const title = blogData?.title
    ? `${blogData.title} - ${subCategory} | ZoeHoliday`
    : `${blogTitle} - ${subCategory} | ZoeHoliday`;

  const description = blogData?.description
    ? blogData.description.slice(0, 160)
    : `Read about ${blogTitle} in ${subCategory}, ${category}. Expert travel tips and guides from ZoeHoliday.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: blogData?.image ? [{ url: blogData.image.url }] : [],
      publishedTime: blogData?.createdAt,
      modifiedTime: blogData?.updatedAt,
      authors: ["ZoeHoliday"],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/placesTogo/${params.category}/${params.subCategory}/${params["place-blog"]}`,
    },
  };
}

const PlaceToGoBlogDynamic = ({ params }: Props) => {
  const category = decodeURIComponent(params.category);
  const subCategory = decodeURIComponent(params.subCategory);
  const blogTitle = decodeURIComponent(params["place-blog"]);

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
          {
            label: category,
            href: `/placesTogo/${params.category}`,
          },
          {
            label: subCategory,
            href: `/placesTogo/${params.category}/${params.subCategory}`,
          },
          { label: blogTitle },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Places To Go", item: "/placesTogo" },
          { name: category, item: `/placesTogo/${params.category}` },
          { name: subCategory, item: `/placesTogo/${params.category}/${params.subCategory}` },
          { name: blogTitle, item: `/placesTogo/${params.category}/${params.subCategory}/${params["place-blog"]}` }
        ]}
      />

      <IndexPagePlaceToGoBlog
        slug={blogTitle}
        category={category}
      />
    </div>
  );
};
export default PlaceToGoBlogDynamic;
