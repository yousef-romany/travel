import { Metadata } from "next";
import IndexPagePlaceToGoBlog from "./components/IndexPagePlaceToGoBlog";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";
import HieroglyphEffect from "@/components/HieroglyphEffect";
import { fetchPlaceToGoOneBlog } from "@/fetch/placesToGo";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ArticleSchema from "@/components/seo/ArticleSchema";

type Props = {
  params: Promise<{
    category: string;
    subCategory: string;
    "place-blog": string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = decodeURIComponent(resolvedParams.category);
  const subCategory = decodeURIComponent(resolvedParams.subCategory);
  const blogTitle = decodeURIComponent(resolvedParams["place-blog"]);

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
    keywords: [
      blogData?.title || blogTitle,
      subCategory,
      category,
      "Egypt travel",
      "travel guide",
      "places to visit",
      "tourism Egypt",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: blogData?.image ? [{ url: blogData.image.url }] : [],
      publishedTime: blogData?.createdAt,
      modifiedTime: blogData?.updatedAt,
      authors: ["ZoeHoliday"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blogData?.image ? [blogData.image.url] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholiday.com'}/placesToGo/${resolvedParams.category}/${resolvedParams.subCategory}/${resolvedParams["place-blog"]}`,
    },
  };
}

const PlaceToGoBlogDynamic = async ({ params }: Props) => {
  const resolvedParams = await params;
  const category = decodeURIComponent(resolvedParams.category);
  const subCategory = decodeURIComponent(resolvedParams.subCategory);
  const blogTitle = decodeURIComponent(resolvedParams["place-blog"]);

  // Fetch data for schema and component
  const data = await fetchPlaceToGoOneBlog(blogTitle);
  const blogData = data?.data?.at(0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Article Schema for SEO */}
      {blogData && (
        <ArticleSchema
          headline={blogData.title || blogTitle}
          description={blogData.description || `Discover ${blogTitle} in ${subCategory}, ${category}`}
          image={blogData.image?.url || ""}
          datePublished={blogData.createdAt || new Date().toISOString()}
          dateModified={blogData.updatedAt || blogData.createdAt || new Date().toISOString()}
          authorName="ZoeHoliday Editorial Team"
          url={`/placesTogo/${resolvedParams.category}/${resolvedParams.subCategory}/${resolvedParams["place-blog"]}`}
          keywords={[
            blogData.title || blogTitle,
            subCategory,
            category,
            "Egypt",
            "travel guide",
          ]}
        />
      )}

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
            href: `/placesTogo/${resolvedParams.category}`,
          },
          {
            label: subCategory,
            href: `/placesTogo/${resolvedParams.category}/${resolvedParams.subCategory}`,
          },
          { label: blogTitle },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "Places To Go", item: "/placesTogo" },
          { name: category, item: `/placesToGo/${resolvedParams.category}` },
          { name: subCategory, item: `/placesTogo/${resolvedParams.category}/${resolvedParams.subCategory}` },
          { name: blogTitle, item: `/placesTogo/${resolvedParams.category}/${resolvedParams.subCategory}/${resolvedParams["place-blog"]}` }
        ]}
      />

      <IndexPagePlaceToGoBlog
        slug={blogTitle}
        category={category}
        subCategory={subCategory}
        data={data}
      />
    </div>
  );
};
export default PlaceToGoBlogDynamic;
