"use client";
import { memo } from "react";
import IndexPageInspireBlog from "./components/IndexPageInspireBlog";
import { useParams } from "next/navigation";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";

const InspirationDynamic = () => {
  const params: {
    category: string;
    subCategory: string;
    "inspire-blog": string;
  } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Inspiration", href: "/inspiration" },
          {
            label: decodeURIComponent(params.category),
            href: `/inspiration/${decodeURIComponent(params.category)}`,
          },
          {
            label: decodeURIComponent(params.subCategory),
            href: `/inspiration/${decodeURIComponent(params.category)}/${decodeURIComponent(params.subCategory)}`,
          },
          { label: decodeURIComponent(params["inspire-blog"]) },
        ]}
      />

      <IndexPageInspireBlog
        slug={decodeURIComponent(params["inspire-blog"]) as string}
      />
    </div>
  );
};
export default memo(InspirationDynamic);
