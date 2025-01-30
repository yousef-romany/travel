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
import IndexPage from "./components/IndexPage";
import { useParams } from "next/navigation";

const InspirationDynamic = () => {
  const params: { category: string } = useParams(); // Get params dynamically

  return (
    <>
      <div className="flex flex-col h-fit">
        <div className="bg-primary w-full p-2 px-[2em]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-secondary">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-secondary">
                <BreadcrumbLink href="/inspiration">Inspiration</BreadcrumbLink>
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
