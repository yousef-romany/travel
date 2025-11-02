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
      <div className="relative w-full h-[calc(100vh-80px)] !z-[-9999]">
        <OptimizedImage
          src={data?.data?.at(-1)?.imageUrl as string}
          alt={data?.data?.at(-1)?.title as string}
          className="w-full h-full object-cover !z-[-9999]"     />
      </div>

      {(data?.data?.at(-1)?.instagram_posts?.length || 0) > 0 ? (
        <div className="w-full flex justify-center items-center flex-col mt-4 gap-[2em] px-[2em]">
          <div className="flex flex-col w-full items-start">
            <h1
              role="heading"
              className="text-[2.4rem] font-extrabold flex items-center gap-2"
            >
              Instagram Feeds <FaArrowTurnDown />
            </h1>
            <p className="text-[1.2rem] text-center mb-12 px-4 font-thin">
              Discover and preview top-notch content from across the Instagram
              universe.
            </p>
          </div>
          <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-10 px-[2em]">
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

      <div className=" px-[2em] flex flex-col gap-6 py-6">
        <Separator />
        <MDXRenderer mdxString={data?.data?.at(-1)?.details as string} />
        <Separator />
        {data?.data?.at(-1)?.youtubeUrl && (
          <div className="w-full flex justify-center items-center flex-col gap-[2em]">
            <div className="flex flex-col w-full items-start">
              <h1
                role="heading"
                className="text-[2.4rem] flex items-center gap-2 font-extrabold"
              >
                Curated Video Showcase <FaArrowTurnDown className="" />
              </h1>
              <p className="text-[1.2rem] text-center mb-12 px-4  font-thin">
                Discover and preview top-notch content from across the YouTube
                universe .
              </p>
            </div>
            <YouTubeEmbed videoUrl={data?.data?.at(-1)?.youtubeUrl as string} />
          </div>
        )}
      </div>
    </div>
  );
};
export default memo(IndexPageInspireBlog);
