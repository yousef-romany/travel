/* eslint-disable @next/next/no-img-element */
"use client";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInspirationOneBlog } from "@/fetch/category";
import MDXRenderer from "@/components/MDXRenderer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
// import InstagramEmbed from "react-instagram-embed";
import { PlacesToGoBlogs, instaGramVedios, meta } from "@/type/placesToGo";
import { FaArrowTurnDown } from "react-icons/fa6";
import InstagramModal from "@/components/InstagramModal";

const IndexPageInspireBlog = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<
    { data: PlacesToGoBlogs[]; meta: meta },
    Error
  >({
    queryKey: ["fetchInspirationOneBlog"],
    queryFn: () => fetchInspirationOneBlog(decodeURIComponent(slug)),
  });
  if (isLoading) return <p>Loading categories...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex gap-4 flex-col h-fit justify-between">
      <div className="relative w-full h-[calc(100vh-80px)] !z-[-9999]">
        <img
          src={data?.data?.at(-1)?.imageUrl}
          alt={data?.data?.at(-1)?.title}
          className="w-full h-full object-cover !z-[-9999]"
        />
      </div>

      {data?.data?.at(-1)?.instagram_posts?.length as number > 0 ? (
        <div className="w-full flex justify-center items-center flex-col mt-4 px-[2em] gap-9">
          <div className="flex flex-col w-full items-start">
            <h1 className="text-[2.4rem] flex items-center gap-2 font-extrabold">
              Instagram Feeds <FaArrowTurnDown className="" />
            </h1>
            <p className="text-[1.2rem] text-center mb-12 px-4  font-thin">
              Discover and preview top-notch content from across the Instagram
              universe.
            </p>
          </div>
          <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-10 px-[2em]">
            {data?.data
              ?.at(-1)
              ?.instagram_posts.map((item: instaGramVedios) => (
                <InstagramModal
                  key={item.id}
                  createdAtInsta={item.createdAtInsta}
                  imageUrl={item.imageUrl}
                  thumbnail_url={item.thumbnail_url}
                  caption={item.caption}
                  permalink={item.permalink}
                  media_type={item.media_type}
                />
              ))}
          </div>
        </div>
      ) : null}

      <div className=" px-[2em] flex flex-col gap-6">
        <MDXRenderer mdxString={data?.data?.at(-1)?.details as string} />

        {data?.data?.at(-1)?.youtubeUrl && (
          <div className="w-full flex justify-center items-center flex-col gap-9">
            <div className="flex flex-col w-full items-start">
              <h1 className="text-[2.4rem] flex items-center gap-2 font-extrabold">
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
