"use client";
import { memo } from "react";
import IndexPage from "./components/IndexPage";
import { useParams } from "next/navigation";
import { UnifiedBreadcrumb } from "@/components/unified-breadcrumb";

const InspirationDynamic = () => {
  const params: { category: string } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <UnifiedBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Inspiration", href: "/inspiration" },
          { label: decodeURIComponent(params?.category) },
        ]}
      />

      <IndexPage slug={decodeURIComponent(params?.category) as string} />
    </div>
  );
};
export default memo(InspirationDynamic);
