"use client";
import { memo, useEffect } from "react";
import IndexPage from "./components/IndexPage";
import { useParams } from "next/navigation";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";

const PlacesToGoDynamic = () => {
  useEffect(() => {
    applyHieroglyphEffect();
  }, []);

  const params: { category: string } = useParams();

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
          { label: decodeURIComponent(params?.category) },
        ]}
      />

      <IndexPage slug={decodeURIComponent(params?.category) as string} />
    </div>
  );
};
export default memo(PlacesToGoDynamic);
