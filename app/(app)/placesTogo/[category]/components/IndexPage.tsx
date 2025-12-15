import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import {
  PlacesToGoBlogs,
  PlacesToGoCategory,
  PlacesToGoSubcategories,
} from "@/type/placesToGo";
import { NoDataPlaceholder } from "@/components/NoDataPlaceholder";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";

const IndexPage = ({ slug, data }: { slug: string; data: PlacesToGoCategory }) => {
  return (
    <div className="flex gap-4 flex-col h-fit justify-between bg-gradient-to-b from-background to-secondary/20 min-h-screen">
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
        <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image) as string}
          alt={data?.data?.at(-1)?.categoryName as string}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-4 text-center z-10">
          <div className="inline-block mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="px-6 py-2 bg-black/30 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/20 shadow-xl tracking-wide uppercase">
              ✨ Discover Egypt
            </span>
          </div>
          <h1
            role="heading"
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100"
          >
            {data?.data?.at(-1)?.categoryName}
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Explore the wonders and hidden gems of this magnificent destination
          </p>
        </div>
      </div>
      <div className="w-full h-fit py-16 px-[2em] space-y-16 relative z-10">
        {/* sub category text */}
        <div className="w-full flex justify-center items-center mb-8">
          <div className="relative">
            <h1
              role="heading"
              className="text-4xl sm:text-5xl font-bold text-foreground pb-2 relative z-10"
            >
              Subcategories
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -rotate-1 rounded-full -z-0"></div>
          </div>
        </div>
        {/* grid system */}
        <div className="grid grid-cols-1 gap-10">
          {data?.data?.at(-1)?.place_to_go_subcategories?.length ?? 0 > 0 ? (
            data?.data
              ?.at(-1)
              ?.place_to_go_subcategories?.map(
                (item: PlacesToGoSubcategories) => (
                  // {/* card grid system */}
                  <div
                    key={item?.id}
                    className="px-4 sm:px-8 max-w-full w-full flex flex-col gap-8"
                  >
                    {/* title subcategory */}
                    <Link
                      href={`/placesTogo/${slug}/${item?.categoryName}`}
                      className="w-fit group"
                    >
                      <div className="w-full flex justify-center items-center mb-8">
                        <div className="relative">
                          <h1
                            role="heading"
                            className="text-4xl sm:text-5xl font-bold text-foreground pb-2 relative z-10 flex items-center gap-2 group-hover:text-primary transition-colors"
                          >
                            {item?.categoryName}
                            <MdArrowOutward className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-lg sm:text-xl md:text-2xl lg:text-3xl" />
                          </h1>
                          <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -rotate-1 rounded-full -z-0"></div>
                        </div>
                      </div>
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
                              <CarouselItem
                                key={itemBlog?.id}
                                className="basis-full md:basis-1/2 lg:basis-1/3 group pl-6"
                              >
                                <Link
                                  href={`/placesTogo/${slug}/${item?.categoryName}/${itemBlog?.title}`}
                                  className="block h-full"
                                >
                                  <Card className="p-0 h-full rounded-3xl overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-card">
                                    <CardContent className="p-0 h-full">
                                      <div className="relative overflow-hidden aspect-[4/3] h-full">
                                        <OptimizedImage
                                          src={getImageUrl(itemBlog?.image)}
                                          alt={itemBlog?.title}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-0 left-0 p-6 w-full">
                                          <h1
                                            role="heading"
                                            className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300"
                                          >
                                            {itemBlog?.title}
                                          </h1>
                                          <div className="flex items-center gap-2 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <span>Explore Details</span>
                                            <MdArrowOutward />
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Link>
                              </CarouselItem>
                            )
                          )}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4 md:-left-12 bg-background/80 backdrop-blur-sm border-primary/20 text-primary hover:bg-primary hover:text-white h-10 w-10 md:h-12 md:w-12" />
                        <CarouselNext className="-right-4 md:-right-12 bg-background/80 backdrop-blur-sm border-primary/20 text-primary hover:bg-primary hover:text-white h-10 w-10 md:h-12 md:w-12" />
                      </Carousel>
                    ) : (
                      <NoDataPlaceholder />
                    )}
                  </div>
                )
              )
          ) : (
            <NoDataPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
