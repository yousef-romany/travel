import { Metadata } from "next";
import IndexPageInspireBlog from "./components/IndexPageInspireBlog";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import HieroglyphEffect from "@/components/HieroglyphEffect";
import { fetchInspirationOneBlog } from "@/fetch/category";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

type Props = {
  params: Promise<{
    category: string;
    subCategory: string;
    "inspire-blog": string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = decodeURIComponent(resolvedParams.category);
  const subCategory = decodeURIComponent(resolvedParams.subCategory);
  const blogTitle = decodeURIComponent(resolvedParams["inspire-blog"]);

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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/inspiration/${resolvedParams.category}/${resolvedParams.subCategory}/${resolvedParams["inspire-blog"]}`,
    },
  };
}

const InspirationDynamic = async ({ params }: Props) => {
  const resolvedParams = await params;
  const category = decodeURIComponent(resolvedParams.category);
  const subCategory = decodeURIComponent(resolvedParams.subCategory);
  const blogTitle = decodeURIComponent(resolvedParams["inspire-blog"]);
  const data = await fetchInspirationOneBlog(blogTitle);

  return (
    <div className="flex flex-col min-h-screen">
      <HieroglyphEffect />
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Inspiration", href: "/inspiration" },
          {
            label: category,
            href: `/inspiration/${resolvedParams.category}`,
          },
          {
            label: subCategory,
            href: `/inspiration/${resolvedParams.category}/${resolvedParams.subCategory}`,
          },
          { label: blogTitle },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Inspiration", item: "/inspiration" },
          { name: category, item: `/inspiration/${resolvedParams.category}` },
          { name: subCategory, item: `/inspiration/${resolvedParams.category}/${resolvedParams.subCategory}` },
          { name: blogTitle, item: `/inspiration/${resolvedParams.category}/${resolvedParams.subCategory}/${resolvedParams["inspire-blog"]}` }
        ]}
      />

      <IndexPageInspireBlog
        slug={blogTitle}
        category={category}
        subCategory={subCategory}
        data={data}
      />
    </div>
  );
};
export default InspirationDynamic;
