"use client";
import { memo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInspirationOneBlog } from "@/fetch/category";
import MDXRenderer from "@/components/MDXRenderer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { PlacesToGoBlogs, instagramPostsType, meta } from "@/type/placesToGo";
import { FaArrowTurnDown } from "react-icons/fa6";
import InstagramModal from "@/components/InstagramModal";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/Loading";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import { Media } from "@/type/programs";

const IndexPageInspireBlog = ({ slug }: { slug: string }) => {
  useEffect(() => {
    applyHieroglyphEffect();
  }, []);
  const { data, error, isLoading } = useQuery<
    { data: PlacesToGoBlogs[]; meta: meta },
    Error
  >({
    queryKey: ["fetchInspirationOneBlog"],
    queryFn: () => fetchInspirationOneBlog(decodeURIComponent(slug)),
  });
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex gap-4 flex-col h-fit justify-between">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-4 md:right-16 w-48 h-48 md:w-72 md:h-72 bg-amber-500 rounded-full blur-[80px] md:blur-[120px]"></div>
        <div className="absolute bottom-10 left-4 md:left-16 w-48 h-48 md:w-72 md:h-72 bg-amber-600 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[calc(100vh-80px)] z-0">
        <OptimizedImage
          src={getImageUrl(data?.data?.at(-1)?.image as Media)}
          alt={data?.data?.at(-1)?.title as string}
          className="min-w-full"
        />
      </div>

      {/* Instagram Posts Section */}
      {(data?.data?.at(-1)?.instagram_posts?.length || 0) > 0 ? (
        <div className="w-full flex justify-center items-center flex-col mt-6 md:mt-12 gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col w-full max-w-7xl items-start">
            <h1
              role="heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold flex items-center gap-2 md:gap-3 mb-3 md:mb-4"
            >
              Instagram Feeds <FaArrowTurnDown className="text-lg sm:text-xl md:text-2xl" />
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 font-light max-w-3xl">
              Discover and preview top-notch content from across the Instagram
              universe.
            </p>
          </div>
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {data?.data?.at(-1)?.instagram_posts &&
              (data?.data?.at(-1)?.instagram_posts as instagramPostsType[]).map(
                (itemPost) => (
                  <InstagramModal
                    key={itemPost?.id}
                    idPost={itemPost?.idPost}
                  />
                )
              )}
          </div>
        </div>
      ) : null}

      {/* Content Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col gap-6 md:gap-8 py-6 md:py-10 max-w-7xl mx-auto w-full">
        <Separator />
        <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl dark:prose-invert max-w-none">
          <MDXRenderer mdxString={data?.data?.at(-1)?.details as string} />
        </div>
        <Separator />

        {/* YouTube Video Section */}
        {data?.data?.at(-1)?.youtubeUrl && (
          <div className="w-full flex justify-center items-center flex-col gap-6 md:gap-8 mt-6 md:mt-12">
            <div className="flex flex-col w-full items-start">
              <h1
                role="heading"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex items-center gap-2 md:gap-3 font-extrabold mb-3 md:mb-4"
              >
                Curated Video Showcase <FaArrowTurnDown className="text-lg sm:text-xl md:text-2xl" />
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 font-light max-w-3xl">
                Discover and preview top-notch content from across the YouTube
                universe.
              </p>
            </div>
            <div className="w-full max-w-5xl">
              <YouTubeEmbed videoUrl={data?.data?.at(-1)?.youtubeUrl as string} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default memo(IndexPageInspireBlog);
