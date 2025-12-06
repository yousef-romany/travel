"use client";
import { memo } from "react";
import IndexPagePlaceToGoBlog from "./components/IndexPagePlaceToGoBlog";
import { useParams } from "next/navigation";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";

const PlaceToGoBlogDynamic = () => {
  const params: {
    category: string;
    subCategory: string;
    "place-blog": string;
  } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>

      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Places To Go", href: "/placesTogo" },
          {
            label: decodeURIComponent(params.category),
            href: `/placesTogo/${decodeURIComponent(params.category)}`,
          },
          {
            label: decodeURIComponent(params.subCategory),
            href: `/placesTogo/${decodeURIComponent(params.category)}/${decodeURIComponent(params.subCategory)}`,
          },
          { label: decodeURIComponent(params["place-blog"]) },
        ]}
      />

      <IndexPagePlaceToGoBlog
        slug={decodeURIComponent(params["place-blog"]) as string}
        category={decodeURIComponent(params.category)}
      />
    </div>
  );
};
export default memo(PlaceToGoBlogDynamic);
