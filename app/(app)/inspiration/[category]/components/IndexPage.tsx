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

const IndexPage = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<InspirationCategory, Error>({
    queryKey: ["fetchInspirationOneCategory"],
    queryFn: () => fetchInspirationOneCategory(slug),
  });
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  
  return (
    <div className="flex gap-4 flex-col h-fit justify-between bg-gradient-to-b from-background to-secondary/20 min-h-screen">
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
        {data?.data?.at(-1)?.image && <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image as Media)}
          alt={data?.data?.at(-1)?.categoryName as string}
          className="w-full h-full object-cover opacity-40"
        />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-4 text-center">
          <div className="inline-block mb-4">
            <span className="px-6 py-3 bg-primary/10 backdrop-blur-sm text-primary text-sm font-semibold rounded-full border border-primary/20 shadow-lg">
              ✨ Discover
            </span>
          </div>
          <h1
            role="heading"
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent drop-shadow-2xl mb-4"
          >
            {data?.data?.at(-1)?.categoryName}
          </h1>
        </div>
      </div>

      <div className="w-full h-fit py-16 px-[2em] space-y-16 relative z-10">
        {/* sub category text */}
        <div className="w-full flex justify-center items-center">
          <h1
            role="heading"
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent pb-2"
          >
            Subcategories
          </h1>
        </div>
        {/* grid system */}
        <div className="grid grid-cols-1 gap-10">
          {data?.data?.at(-1)?.inspire_subcategories?.length ?? 0 > 0 ? (
            data?.data
              ?.at(-1)
              ?.inspire_subcategories?.map((item: InspireSubcategories) => (
                // {/* card grid system */}
                <div
                  key={item?.id}
                  className="px-[34px] max-w-full w-full flex flex-col gap-8"
                >
                  {/* title subcategory */}
                  <Link
                    href={`/inspiration/${slug}/${item?.categoryName}`}
                    className="w-fit group"
                  >
                    <h1
                      role="heading"
                      className="text-[2rem] font-bold flex items-center gap-2 w-fit bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-primary transition-all"
                    >
                      {item?.categoryName} <MdArrowOutward className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
                      <CarouselContent className="space-x-6">
                        {item?.inspire_blogs?.map((itemBlog: InspireBlogs) => (
                          <Link
                            key={itemBlog?.id}
                            href={`/inspiration/${slug}/${item?.categoryName}/${itemBlog?.title}`}
                            className="md:basis-1/2 lg:basis-1/3"
                          >
                            <CarouselItem className="group">
                              <Card className="p-0 h-fit rounded-2xl overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 transition-all duration-300">
                                <CardContent className="p-0">
                                  <div className="relative overflow-hidden">
                                    <OptimizedImage
                                      src={getImageUrl(itemBlog.image) as string}
                                      alt={itemBlog?.title}
                                      className="w-full h-[250px] object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                  </div>
                                </CardContent>
                                <CardFooter className="p-6">
                                  <h1
                                    role="heading"
                                    className="w-full text-xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-primary transition-all"
                                  >
                                    {itemBlog?.title}
                                  </h1>
                                </CardFooter>
                              </Card>
                            </CarouselItem>
                          </Link>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
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
