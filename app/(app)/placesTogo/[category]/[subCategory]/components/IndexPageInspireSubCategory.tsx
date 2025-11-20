 
"use client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { memo, useState } from "react";
import CardFlex from "./CardFlex";
import CardGrid from "./CardGrid";
import { CiGrid41 } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";
import { meta } from "@/type/inspiration";
import { fetchPlaceToOneSubCategory } from "@/fetch/placesToGo";
import { PlacesToGoBlogs, PlacesToGoSubcategories } from "@/type/placesToGo";
import Loading from "@/components/Loading";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";

const IndexPageInspireSubCategory = ({
  routes,
  slug,
}: {
  routes: string;
  slug: string;
}) => {
  const [view, setView] = useState<string>("grid");
  const { data, error, isLoading } = useQuery<
    { data: PlacesToGoSubcategories[]; meta: meta },
    Error
  >({
    queryKey: ["fetchPlaceToOneSubCategory"],
    queryFn: () => fetchPlaceToOneSubCategory(slug),
  });
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  console.log("data , : hello", data);
  return (
    <div className="flex gap-4 flex-col h-fit justify-between">
      <div className="relative w-full h-[calc(100vh-80px)] !z-[-9999]">
        <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image) as string}
          alt={data?.data?.at(-1)?.categoryName as string}
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
            {data?.data
              ?.at(-1)
              ?.place_to_go_blogs?.map((item: PlacesToGoBlogs) => (
                <CardGrid
                  key={item.id}
                  details={item.details}
                  title={item.title}
                  imageUrl={item.image}
                  routes={routes}
                  slug={slug}
                  link={`/placesTogo/${routes}/${slug}/${item.title}` as string}
                />
              ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data?.data
              ?.at(-1)
              ?.place_to_go_blogs?.map((item: PlacesToGoBlogs) => (
                <CardFlex
                  key={item.id}
                  details={item.details}
                  title={item.title}
                  imageUrl={item.image}
                  routes={routes}
                  slug={slug}
                  link={`/placesTogo/${routes}/${slug}/${item.title}` as string}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default memo(IndexPageInspireSubCategory);
