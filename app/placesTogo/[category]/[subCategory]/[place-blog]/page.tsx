"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { memo } from "react";
import IndexPageInspireBlog from "./components/IndexPageInspireBlog";
import { useParams } from "next/navigation";

const InspirationDynamic = () => {
  const params: {
    category: string;
    subCategory: string;
    "place-blog": string;
  } = useParams(); // Get params dynamically
  return (
    <div className="flex flex-col h-fit">
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
              <BreadcrumbLink
                href={`/placesTogo/${decodeURIComponent(params.category)}`}
              >
                {decodeURIComponent(params.category)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-secondary">
              <BreadcrumbLink
                href={`/placesTogo/${decodeURIComponent(
                  params.category
                )}/${decodeURIComponent(params.subCategory)}`}
              >
                {decodeURIComponent(params.subCategory)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-secondary">
              <BreadcrumbPage className="text-secondary border-b-2">
                {decodeURIComponent(params["place-blog"])}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <IndexPageInspireBlog
        slug={decodeURIComponent(params["place-blog"]) as string}
      />
    </div>
  );
};
export default memo(InspirationDynamic);
