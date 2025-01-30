/* eslint-disable @next/next/no-img-element */
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

const IndexPage = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<InspirationCategory, Error>({
    queryKey: ["fetchInspirationOneCategory"],
    queryFn: () => fetchInspirationOneCategory(slug),
  });
  if (isLoading) return <p>Loading categories...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex gap-4 flex-col h-fit justify-between">
      <div className="relative w-full h-[calc(100vh-80px)] !z-[-9999]">
        <img
          src={data?.data?.at(-1)?.imageUrl}
          alt={data?.data?.at(-1)?.categoryName}
          className="w-full h-full object-cover !z-[-9999]"
        />
        <h1 className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-8xl text-primary font-extrabold text-primary-600 drop-shadow-xl shadow-black">
          {data?.data?.at(-1)?.categoryName}
        </h1>
      </div>
      <div className="w-full h-fit py-10 px-[2em] space-y-16">
        {/* sub category text */}
        <div className=" w-full flex justify-center items-center">
          <h1 className="text-4xl text-primary border-b-4 text-bold">
            SubCategory
          </h1>
        </div>
        {/* grid system */}
        <div className="grid grid-cols-1 gap-10">
          {data?.data?.at(-1)?.inspire_subcategories?.length ?? 0 > 0
            ? data?.data
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
                      className="w-fit hover:border-b-2"
                    >
                      <h1 className="text-[2rem] font-bold flex items-center gap-2 w-fit">
                        {item?.categoryName} <MdArrowOutward />
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
                          {item?.inspire_blogs?.map(
                            (itemBlog: InspireBlogs) => (
                              <Link
                                key={itemBlog?.id}
                                href={`/inspiration/${slug}/${item?.categoryName}/${itemBlog?.title}`}
                                className="md:basis-1/2 lg:basis-1/3 rounded-3xl z-[-99999]"
                              >
                                <CarouselItem
                                  key={itemBlog?.id}
                                  className="rounded-3xl z-[-99999]"
                                >
                                  <Card className="p-0 h-[370px] rounded-3xl relative z-[-99999]">
                                    <CardContent className="p-0 rounded-3xl">
                                      <img
                                        src={itemBlog?.imageUrl}
                                        alt={itemBlog?.title}
                                        className="w-full h-full object-content rounded-3xl z-[-99999999]"
                                      />
                                    </CardContent>
                                    <CardFooter className="w-full rounded-3xl absolute bottom-0 left-[50%] translate-x-[-50%]">
                                      <h1 className="w-full text-[2rem] text-secondary font-extrabold text-primary-600 drop-shadow-2xl shadow-black">
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
                      "No Data"
                    )}
                  </div>
                ))
            : "No Data"}
        </div>
      </div>
    </div>
  );
};
export default memo(IndexPage);
