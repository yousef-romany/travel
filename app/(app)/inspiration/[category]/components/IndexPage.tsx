"use client";
import { memo } from "react";
import {
  InspirationCategory,
  InspireBlogs,
  InspireSubcategories,
} from "@/type/inspiration";
import { useQuery } from "@tanstack/react-query";
import { fetchInspirationOneCategory } from "@/fetch/category";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import Loading from "@/components/Loading";
import { NoDataPlaceholder } from "@/components/NoDataPlaceholder";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import { Media } from "@/type/programs";
import OptimizedImageInspireBlog from "@/components/OptimizedImageInspireBlog";

const IndexPage = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<InspirationCategory, Error>({
    queryKey: ["fetchInspirationOneCategory"],
    queryFn: () => fetchInspirationOneCategory(slug),
  });
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex gap-4 flex-col h-fit justify-between bg-gradient-to-b from-background to-secondary/20 min-h-screen">
      {/* Background decorative elements - hide on mobile for performance */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-48 h-48 md:w-96 md:h-96 bg-primary rounded-full blur-[80px] md:blur-[120px]"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-amber-500 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      {/* Hero section with responsive height */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[calc(100vh-80px)] overflow-hidden">
        {data?.data?.at(-1)?.image && <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image as Media)}
          alt={data?.data?.at(-1)?.categoryName as string}
          className="w-full h-full object-cover opacity-40"
        />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-4 sm:px-6 md:px-8 text-center">
          <div className="inline-block mb-3 md:mb-4">
            <span className="px-4 py-2 sm:px-6 sm:py-3 bg-primary/10 backdrop-blur-sm text-primary text-xs sm:text-sm font-semibold rounded-full border border-primary/20 shadow-lg">
              ✨ Discover
            </span>
          </div>
          <h1
            role="heading"
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent drop-shadow-2xl mb-4 px-2"
          >
            {data?.data?.at(-1)?.categoryName}
          </h1>
        </div>
      </div>

      {/* Content section with responsive padding */}
      <div className="w-full h-fit py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-12 md:space-y-16 relative z-10">
        {/* sub category text */}
        <div className="w-full flex justify-center items-center">
          <h1
            role="heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent pb-2"
          >
            Subcategories
          </h1>
        </div>
        {/* grid system */}
        <div className="grid grid-cols-1 gap-8 md:gap-10 lg:gap-12">
          {data?.data?.at(-1)?.inspire_subcategories?.length ?? 0 > 0 ? (
            data?.data
              ?.at(-1)
              ?.inspire_subcategories?.map((item: InspireSubcategories) => (
                // {/* card grid system */}
                <div
                  key={item?.id}
                  className="w-full flex flex-col gap-6 md:gap-8"
                >
                  {/* title subcategory */}
                  <Link
                    href={`/inspiration/${slug}/${item?.categoryName}`}
                    className="w-fit group"
                  >
                    <h1
                      role="heading"
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold flex items-center gap-2 w-fit bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-primary transition-all"
                    >
                      {item?.categoryName} <MdArrowOutward className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-lg sm:text-xl md:text-2xl lg:text-3xl" />
                    </h1>
                  </Link>
                  {/* slider */}
                  {(item?.inspire_blogs?.length ?? 0) > 0 ? (
                    <Carousel
                      opts={{
                        align: "start",
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {item?.inspire_blogs?.map((itemBlog: InspireBlogs) => (
                          <CarouselItem
                            key={itemBlog?.id}
                            className="pl-2 md:pl-4 basis-full sm:basis-1 lg:basis-1/3 xl:basis-1/4"
                          >
                            <Link
                              href={`/inspiration/${slug}/${item?.categoryName}/${itemBlog?.title}`}
                              className="block h-full"
                            >
                              <Card className="p-0 h-full rounded-xl md:rounded-2xl overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 transition-all duration-300 group">
                                <CardContent className="p-0">
                                  <div className="relative overflow-hidden">
                                    <OptimizedImageInspireBlog
                                      src={getImageUrl(itemBlog.image) as string}
                                      alt={itemBlog?.title}
                                      className="w-full h-[200px] sm:h-[220px] md:h-[250px] object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                  </div>
                                </CardContent>
                                <CardFooter className="p-4 md:p-6">
                                  <h1
                                    role="heading"
                                    className="w-full text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-primary transition-all line-clamp-2"
                                  >
                                    {itemBlog?.title}
                                  </h1>
                                </CardFooter>
                              </Card>
                            </Link>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-4 lg:-left-6" />
                      <CarouselNext className="-right-4 lg:-right-6" />
                    </Carousel>
                  ) : (
                    <NoDataPlaceholder />
                  )}
                </div>
              ))
          ) : (
            <NoDataPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};
export default memo(IndexPage);
