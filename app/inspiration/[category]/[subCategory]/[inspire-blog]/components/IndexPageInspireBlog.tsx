/* eslint-disable @next/next/no-img-element */
"use client";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInspirationOneBlog } from "@/fetch/category";
import MDXRenderer from "@/components/MDXRenderer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import InstagramEmbed from "react-instagram-embed";
import { InspireBlogs, meta } from "@/type/inspiration";
import { FaArrowTurnDown } from "react-icons/fa6";

const IndexPageInspireBlog = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<
    { data: InspireBlogs[]; meta: meta },
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

      <InstagramEmbed
        url={"https://www.instagram.com/p/DFVTlLGiBbf/"}
        clientAccessToken={"417a223b383891a82700267246c50581"}
      />

      <div className=" px-[2em] flex flex-col gap-6">
        <MDXRenderer mdxString={data?.data?.at(-1)?.details as string} />

        {data?.data?.at(-1)?.youtubeUrl && (
          <div className="w-full flex justify-center items-center flex-col">
            <div className="flex flex-col w-full items-start">
              <h1 className="text-[2.4rem] font-bold flex items-center gap-2 ">
                Curated Video Showcase <FaArrowTurnDown className="" />
              </h1>
              <p className="text-[1.2rem] text-center mb-12 px-4 ">
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
