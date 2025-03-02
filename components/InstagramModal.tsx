"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import MediaContent from "./MediaContent";
import { instagramPostsType, instaGramType } from "@/type/placesToGo";

export default function InstagramModal({ idPost }: instagramPostsType) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<instaGramType>({} as instaGramType);
  useEffect(() => {
    try {
      fetch(
        `https://graph.instagram.com/${idPost}?fields=id,media_type,media_url,caption,permalink,thumbnail_url,timestamp&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN}`
      )
        .then((res) => res.json())
        .then((resData) => {
          console.log(resData, idPost);
          setData(resData);
        });
    } catch (error) {
      console.log(error);
    }
  }, [idPost]);

  const formattedDate = new Date(data?.timestamp as string).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
    }
  );

  return (
    <>
       <OptimizedImage
        src={data?.thumbnail_url}
        alt={data?.caption}
        onClick={() => setIsModalOpen(true)}
        className="w-full h-full rounded-[2rem] cursor-pointer"
        loading="lazy"
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-card flex items-center justify-center z-50">
          <div className="relative max-w-5xl w-full mx-4 bg-muted rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary/75">
                  @ZoeHolidays
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-primary hover:text-primary-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}

            <div className="flex flex-col md:flex-row">
              {/* Media */}
              <div className="relative flex-1 bg-card aspect-square md:aspect-auto">
                <div className="h-full">
                  <MediaContent
                    media_type={data?.media_type}
                    imageUrl={data?.media_url}
                    thumbnail_url={data?.thumbnail_url}
                    // className="w-full h-full"
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="w-full md:w-[400px] flex flex-col">
                {/* Caption and comments */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex gap-2 mb-4">
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold text-primary/75">
                          @ZoeHolidays
                        </span>{" "}
                        {data?.caption}
                      </p>
                      <p className="text-xs text-secondary-500 mt-1">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <a
                      href={data?.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View on Instagram
                    </a>
                    <span className="text-secondary-300">•</span>
                    <span className="text-sm text-secondary-500">
                      {data?.media_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
