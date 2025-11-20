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
import IndexPage from "./components/IndexPage";
import { useParams } from "next/navigation";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";

const InspirationDynamic = () => {
  useEffect(() => {
    applyHieroglyphEffect()
  }, [])
  const params: { category: string } = useParams(); // Get params dynamically

  return (
    <>
      <div className="flex flex-col h-fit">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>
        <div className="bg-primary w-full p-2 px-[2em]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-secondary">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-secondary">
                <BreadcrumbLink href="/placesTogo">Places To Go</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-secondary">
                <BreadcrumbPage className="text-secondary border-b-2">
                  {decodeURIComponent(params?.category)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <IndexPage slug={decodeURIComponent(params?.category) as string} />
      </div>
    </>
  );
};
export default memo(InspirationDynamic);
