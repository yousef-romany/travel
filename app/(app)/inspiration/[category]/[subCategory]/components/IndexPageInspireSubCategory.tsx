"use client";
import { Button } from "@/components/ui/button";
import { fetchInspirationOneSubCategory } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";
import { memo, useState } from "react";
// import CardFlex from "./CardFlex";
// import CardGrid from "./CardGrid";
import { CiGrid41 } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";
import { InspireBlogs, InspireSubcategories, meta } from "@/type/inspiration";
import Loading from "@/components/Loading";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import CardGrid from "@/app/(app)/placesTogo/[category]/[subCategory]/components/CardGrid";
import CardFlex from "@/app/(app)/placesTogo/[category]/[subCategory]/components/CardFlex";

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
    queryKey: ["fetchInspirationOneSubCategory", slug],
    queryFn: () => fetchInspirationOneSubCategory(slug),
  });

  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p className="text-center text-red-500 py-8">Error: {error.message}</p>;

  return (
    <div className="flex gap-4 flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Background decorative elements - responsive sizing and hidden on mobile */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-48 h-48 md:w-96 md:h-96 bg-primary rounded-full blur-[80px] md:blur-[120px]"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-amber-500 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      {/* Hero section with responsive height */}
      <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-hidden">
        <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image)}
          alt={data?.data?.at(-1)?.categoryName as string}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-4 sm:px-6 md:px-8 text-center">
          <div className="inline-block mb-3 md:mb-4">
            <span className="px-4 py-2 sm:px-6 sm:py-3 bg-primary/10 backdrop-blur-sm text-primary text-xs sm:text-sm font-semibold rounded-full border border-primary/20 shadow-lg">
              ✨ Get Inspired
            </span>
          </div>
          <h1
            role="heading"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent drop-shadow-2xl px-2"
          >
            {slug}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mt-3 md:mt-4 max-w-2xl mx-auto px-4">
            Discover amazing stories and tips about {slug}
          </p>
        </div>
      </div>

      {/* Content section with responsive padding */}
      <div className="w-full flex flex-col gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12 relative z-10">
        {/* Header with view toggle */}
        <div className="w-full flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            All About {slug}
          </h2>

          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setView("grid")}
              className={`transition-all duration-300 ${view === "grid" ? "bg-primary text-white shadow-lg" : "bg-background hover:bg-muted text-foreground border-input"}`}
              variant={view === "grid" ? "default" : "outline"}
              size="sm"
            >
              <CiGrid41 className="w-4 h-4 md:w-5 md:h-5" />
              <span className="ml-2 hidden sm:inline text-xs md:text-sm font-medium">Grid</span>
            </Button>
            <Button
              onClick={() => setView("flex")}
              className={`transition-all duration-300 ${view === "flex" ? "bg-primary text-white shadow-lg" : "bg-background hover:bg-muted text-foreground border-input"}`}
              variant={view === "flex" ? "default" : "outline"}
              size="sm"
            >
              <CiGrid2H className="w-4 h-4 md:w-5 md:h-5" />
              <span className="ml-2 hidden sm:inline text-xs md:text-sm font-medium">List</span>
            </Button>
          </div>
        </div>

        {/* Grid/Flex view with improved responsive breakpoints */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {data?.data?.at(-1)?.inspire_blogs?.map((item: InspireBlogs) => {
              console.log(data)
              return <CardGrid
                key={item.id}
                details={item.details}
                title={item.title}
                imageUrl={item.image}
                routes={routes}
                slug={slug}
                link={`/inspiration/${routes}/${slug}/${item.title}` as string}
              />
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:gap-6">
            {data?.data?.at(-1)?.inspire_blogs?.map((item: InspireBlogs) => (
              <CardFlex
                key={item.id}
                details={item.details}
                title={item.title}
                imageUrl={item.image}
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
