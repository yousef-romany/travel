/* eslint-disable @next/next/no-img-element */
"use client";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import MDXRenderer from "@/components/MDXRenderer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import InstagramEmbed from "react-instagram-embed";
import { fetchPlaceToGoOneBlog } from "@/fetch/placesToGo";
import MapComponent from "@/components/Map";
import { instaGramVedios, meta, PlacesToGoBlogs } from "@/type/placesToGo";
import { FaArrowTurnDown } from "react-icons/fa6";
import InstagramModal from "@/components/InstagramModal";

const IndexPageInspireBlog = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<
    { data: PlacesToGoBlogs[]; meta: meta },
    Error
  >({
    queryKey: ["fetchPlaceToGoOneBlog"],
    queryFn: () => fetchPlaceToGoOneBlog(decodeURIComponent(slug)),
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

      {(data?.data?.at(-1)?.instagram_posts?.length as number) > 0 ? (
        <div className="w-full flex justify-center items-center flex-col mt-4 gap-9 px-[2em]">
          <div className="flex flex-col w-full items-start">
            <h1 className="text-[2.4rem] font-extrabold flex items-center gap-2 ">
              Instagram Feeds <FaArrowTurnDown className="" />
            </h1>
            <p className="text-[1.2rem] text-center mb-12 px-4 font-thin">
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

      <InstagramEmbed
        url={"https://www.instagram.com/p/DFVTlLGiBbf/"}
        clientAccessToken={"417a223b383891a82700267246c50581"}
      />

      <div className=" px-[2em] flex flex-col gap-6">
        <MDXRenderer mdxString={data?.data?.at(-1)?.details as string} />

        {data?.data?.at(-1)?.youtubeUrl && (
          <div className="w-full flex justify-center items-center flex-col gap-9">
            <div className="flex flex-col">
              <h1 className="w-full text-[2.4rem] font-extrabold">
                Curated Video Showcase
              </h1>
              <p className="text-[1.2rem] text-center mb-12  font-thin">
                Discover and preview top-notch content from across the YouTube
                universe
              </p>
            </div>
            <YouTubeEmbed videoUrl={data?.data?.at(-1)?.youtubeUrl as string} />
          </div>
        )}
        <div className="w-full flex justify-center items-center flex-col gap-9">
          <h1 className="w-full text-[2.4rem] font-extrabold flex items-center gap-2 ">
            Location Preview Map <FaArrowTurnDown className="" />
          </h1>
          <MapComponent
            title={data?.data?.at(-1)?.title as string}
            lat={data?.data?.at(-1)?.lat as number}
            lng={data?.data?.at(-1)?.lng as number}
          />
        </div>
      </div>
    </div>
  );
};
export default memo(IndexPageInspireBlog);
