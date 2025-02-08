/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import { fetchInspirationOneSubCategory } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";
import { memo, useState } from "react";
import CardFlex from "./CardFlex";
import CardGrid from "./CardGrid";
import { CiGrid41 } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";
import { InspireBlogs, InspireSubcategories, meta } from "@/type/inspiration";
import Loading from "@/components/Loading";

const IndexPageInspireSubCategory = ({
  routes,
  slug,
}: {
  routes: string;
  slug: string;
}) => {
  const [view, setView] = useState<string>("grid");
  const { data, error, isLoading } = useQuery<
    { data: InspireSubcategories[]; meta: meta },
    Error
  >({
    queryKey: ["fetchInspirationOneSubCategory"],
    queryFn: () => fetchInspirationOneSubCategory(slug),
  });
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <div className="flex gap-4 flex-col h-fit justify-between">
      <div className="relative w-full h-[calc(100vh-80px)] !z-[-9999]">
        <img
          src={data?.data?.at(-1)?.imageUrl}
          alt={data?.data?.at(-1)?.categoryName}
          className="w-full h-full object-cover !z-[-9999]"
        />
      </div>

      <div className="w-full flex flex-col gap-6 px-[2em]">
        <div className="w-full flex justify-between items-center">
          <h1 role="heading"  className="text-[2rem] font-bold">ALL you want about {slug}</h1>

          <div className="flex gap-2 items-center flex-wrap">
            <Button onClick={() => setView("grid")}>
              <CiGrid41 />
            </Button>
            <Button onClick={() => setView("flex")}>
              <CiGrid2H />
            </Button>
          </div>
        </div>

        {view == "grid" ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4">
            {data?.data?.at(-1)?.inspire_blogs?.map((item: InspireBlogs) => (
              <CardGrid
                key={item.id}
                details={item.details}
                title={item.title}
                imageUrl={item.imageUrl}
                routes={routes}
                slug={slug}
                link={`/inspiration/${routes}/${slug}/${item.title}` as string}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data?.data?.at(-1)?.inspire_blogs?.map((item: InspireBlogs) => (
              <CardFlex
                key={item.id}
                details={item.details}
                title={item.title}
                imageUrl={item.imageUrl}
                routes={routes}
                slug={slug}
                link={`/inspiration/${routes}/${slug}/${item.title}` as string}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default memo(IndexPageInspireSubCategory);
