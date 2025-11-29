 
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
    <div className="flex gap-4 flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-hidden">
        <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image) as string}
          alt={data?.data?.at(-1)?.categoryName as string}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-4 text-center">
          <div className="inline-block mb-3 md:mb-4">
            <span className="px-4 py-2 md:px-6 md:py-3 bg-primary/10 backdrop-blur-sm text-primary text-xs md:text-sm font-semibold rounded-full border border-primary/20 shadow-lg">
              ✨ Explore
            </span>
          </div>
          <h1
            role="heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent drop-shadow-2xl"
          >
            {slug}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mt-3 md:mt-4 max-w-2xl mx-auto px-4">
            Discover everything about {slug}
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-[2em] py-8 md:py-12 relative z-10">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            All About {slug}
          </h2>

          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setView("grid")}
              className={view === "grid" ? "bg-gradient-to-r from-primary to-amber-600" : ""}
              variant={view === "grid" ? "default" : "outline"}
              size="sm"
            >
              <CiGrid41 className="w-4 h-4 md:w-5 md:h-5" />
              <span className="ml-1 hidden sm:inline text-xs md:text-sm">Grid</span>
            </Button>
            <Button
              onClick={() => setView("flex")}
              className={view === "flex" ? "bg-gradient-to-r from-primary to-amber-600" : ""}
              variant={view === "flex" ? "default" : "outline"}
              size="sm"
            >
              <CiGrid2H className="w-4 h-4 md:w-5 md:h-5" />
              <span className="ml-1 hidden sm:inline text-xs md:text-sm">List</span>
            </Button>
          </div>
        </div>

        {view == "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
          <div className="flex flex-col gap-4 md:gap-6">
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
