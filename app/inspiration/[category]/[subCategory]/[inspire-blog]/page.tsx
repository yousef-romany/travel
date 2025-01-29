import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { memo } from "react";
// import IndexPage from "./components/IndexPage";

const InspirationDynamic = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;

  return (
    <div className="flex flex-col h-fit">
      <div className="bg-primary w-full p-2 px-[32px]">
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
              <BreadcrumbPage className="text-secondary border-b-2">{slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <IndexPage slug={slug?.at(-1) as string} /> */}
    </div>
  );
};
export default memo(InspirationDynamic);
