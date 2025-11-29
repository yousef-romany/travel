"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { memo, useEffect } from "react";
import IndexPageInspireSubCategory from "./components/IndexPageInspireSubCategory";
import { useParams } from "next/navigation";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";

const PlacesToGoDynamic = () => {
  useEffect(() => {
    applyHieroglyphEffect();
  }, []);

  const params: { category: string; subCategory: string } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
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
              <BreadcrumbLink href="/placesToGo" className="hover:text-white/80 transition-colors">
                Places To Go
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60" />
            <BreadcrumbItem className="text-white">
              <BreadcrumbLink
                href={`/placesTogo/${decodeURIComponent(params?.category)}`}
                className="hover:text-white/80 transition-colors"
              >
                {decodeURIComponent(params?.category)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60" />
            <BreadcrumbItem className="text-white">
              <BreadcrumbPage className="text-white font-semibold border-b-2 border-white/40">
                {decodeURIComponent(params?.subCategory)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <IndexPageInspireSubCategory
        routes={decodeURIComponent(params.category)}
        slug={decodeURIComponent(params.subCategory) as string}
      />
    </div>
  );
};
export default memo(PlacesToGoDynamic);
