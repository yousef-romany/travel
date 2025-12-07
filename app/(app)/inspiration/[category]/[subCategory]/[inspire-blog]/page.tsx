import { Metadata } from "next";
import IndexPageInspireBlog from "./components/IndexPageInspireBlog";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import HieroglyphEffect from "@/components/HieroglyphEffect";
import { fetchInspirationOneBlog } from "@/fetch/category";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

type Props = {
  params: {
    category: string;
    subCategory: string;
    "inspire-blog": string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  const subCategory = decodeURIComponent(params.subCategory);
  const blogTitle = decodeURIComponent(params["inspire-blog"]);

  // Fetch data for metadata
  const data = await fetchInspirationOneBlog(blogTitle);
  const blogData = data?.data?.at(0);

  const title = blogData?.title
    ? `${blogData.title} - ${subCategory} Inspiration | ZoeHoliday`
    : `${blogTitle} - ${subCategory} Inspiration | ZoeHoliday`;

  const description = blogData?.description
    ? blogData.description.slice(0, 160)
    : `Read ${blogTitle} in ${subCategory}, ${category}. Inspiring travel stories from Egypt by ZoeHoliday.`;

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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/inspiration/${params.category}/${params.subCategory}/${params["inspire-blog"]}`,
    },
  };
}

const InspirationDynamic = ({ params }: Props) => {
  const category = decodeURIComponent(params.category);
  const subCategory = decodeURIComponent(params.subCategory);
  const blogTitle = decodeURIComponent(params["inspire-blog"]);

  return (
    <div className="flex flex-col min-h-screen">
      <HieroglyphEffect />
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Inspiration", href: "/inspiration" },
          {
            label: category,
            href: `/inspiration/${params.category}`,
          },
          {
            label: subCategory,
            href: `/inspiration/${params.category}/${params.subCategory}`,
          },
          { label: blogTitle },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Inspiration", item: "/inspiration" },
          { name: category, item: `/inspiration/${params.category}` },
          { name: subCategory, item: `/inspiration/${params.category}/${params.subCategory}` },
          { name: blogTitle, item: `/inspiration/${params.category}/${params.subCategory}/${params["inspire-blog"]}` }
        ]}
      />

      <IndexPageInspireBlog
        slug={blogTitle}
      />
    </div>
  );
};
export default InspirationDynamic;
