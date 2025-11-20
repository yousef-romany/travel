"use client";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  PlacesToGoBlogs,
  PlacesToGoCategory,
  PlacesToGoSubcategories,
} from "@/type/placesToGo";
import { fetchPlaceToGoCategoriesOneCategory } from "@/fetch/placesToGo";
import Loading from "@/components/Loading";
import { NoDataPlaceholder } from "@/components/NoDataPlaceholder";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";

const IndexPage = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<PlacesToGoCategory, Error>({
    queryKey: ["fetchPlaceToGoCategoriesOneCategory"],
    queryFn: () => fetchPlaceToGoCategoriesOneCategory(slug),
  });
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex gap-4 flex-col h-fit justify-between">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>
      <div className="relative w-full h-[calc(100vh-80px)] !z-[-9999]">
        <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image) as string}
          alt={data?.data?.at(-1)?.categoryName as string}
          className="w-full h-full object-cover !z-[-9999]"
        />
        <h1
          role="heading"
          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-8xl text-primary font-extrabold text-primary-600 drop-shadow-xl shadow-black"
        >
          {data?.data?.at(-1)?.categoryName}
        </h1>
      </div>
      <div className="w-full h-fit py-10 px-[2em] space-y-16">
        {/* sub category text */}
        <div className=" w-full flex justify-center items-center">
          <h1
            role="heading"
            className="text-4xl text-primary border-b-4 text-bold"
          >
            SubCategory
          </h1>
        </div>
        {/* grid system */}
        <div className="grid grid-cols-1 gap-10">
          {data?.data?.at(-1)?.place_to_go_subcategories?.length ?? 0 > 0
            ? data?.data
                ?.at(-1)
                ?.place_to_go_subcategories?.map(
                  (item: PlacesToGoSubcategories) => (
                    // {/* card grid system */}
                    <div
                      key={item?.id}
                      className="px-[34px] max-w-full w-full flex flex-col gap-8"
                    >
                      {/* title subcategory */}
                      <Link
                        href={`/placesTogo/${slug}/${item?.categoryName}`}
                        className="w-fit hover:border-b-2"
                      >
                        <h1
                          role="heading"
                          className="text-[2rem] font-bold flex items-center gap-2 w-fit"
                        >
                          {item?.categoryName} <MdArrowOutward />
                        </h1>
                      </Link>
                      {/* slider */}
                      {(item?.place_to_go_blogs?.length ?? 0) > 0 ? (
                        <Carousel
                          opts={{
                            align: "start",
                          }}
                          className="w-full"
                        >
                          <CarouselContent className="space-x-6">
                            {item?.place_to_go_blogs?.map(
                              (itemBlog: PlacesToGoBlogs) => (
                                <Link
                                  key={itemBlog?.id}
                                  href={`/placesTogo/${slug}/${item?.categoryName}/${itemBlog?.title}`}
                                  className="md:basis-1/2 lg:basis-1/3 rounded-[1.3em] z-[-99999]"
                                >
                                  <CarouselItem
                                    key={itemBlog?.id}
                                    className="rounded-[1.3em] z-[-99999]"
                                  >
                                    <Card className="p-0 h-fit rounded-[1.3em] relative z-[-99999]">
                                      <CardContent className="p-0 rounded-[1.3em]">
                                        <OptimizedImage
                                          src={getImageUrl(itemBlog?.image)}
                                          alt={itemBlog?.title}
                                          className="w-full h-[100px] object-content rounded-[1.3em] z-[-99999999] max-h-[370px]"
                                        />
                                      </CardContent>
                                      <CardFooter className="w-full rounded-[1.3em]">
                                        <h1
                                          role="heading"
                                          className="w-full text-[1.6rem] text-primary font-extrabold text-primary-600 drop-shadow-2xl shadow-primary"
                                        >
                                          {itemBlog?.title}
                                        </h1>
                                      </CardFooter>
                                    </Card>
                                  </CarouselItem>
                                </Link>
                              )
                            )}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      ) : (
                        <NoDataPlaceholder />
                      )}
                    </div>
                  )
                )
            : <NoDataPlaceholder />}
        </div>
      </div>
    </div>
  );
};
export default memo(IndexPage);
