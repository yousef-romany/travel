"use client";

import { X, Heart, MessageCircle, Send, Bookmark, Play, Instagram, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import MediaContent from "./MediaContent";
import OptimizedImage from "./OptimizedImage";
import { instagramPostsType, instaGramType } from "@/type/placesToGo";
import { Button } from "./ui/button";
import Image from "next/image";

export default function InstagramModal({ idPost }: instagramPostsType) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<instaGramType>({} as instaGramType);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      fetch(
        `https://graph.instagram.com/${idPost}?fields=id,media_type,media_url,caption,permalink,thumbnail_url,timestamp&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN}`
      )
        .then((res) => res.json())
        .then((resData) => {
          setData(resData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching Instagram data:", error);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [idPost]);

  const formattedDate = data?.timestamp ? new Date(data.timestamp as string).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  ) : "";

  const thumbnailUrl = data?.thumbnail_url || data?.media_url;
  const shortCaption = data?.caption ? (data.caption.length > 100 ? data.caption.substring(0, 100) + "..." : data.caption) : "Exploring Egypt with ZoeHoliday";

  return (
    <>
      {/* Thumbnail Card */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative w-full h-full rounded-2xl cursor-pointer overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 shadow-lg hover:shadow-2xl transition-all duration-500"
      >
        {isLoading ? (
          <div className="w-full h-full aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Image */}
            <div className="relative w-full h-full aspect-square overflow-hidden">
              {thumbnailUrl && (
                <Image
                  src={thumbnailUrl}
                  alt={shortCaption}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

              {/* Play Button for Videos */}
              {data?.media_type === "VIDEO" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-16 h-16 rounded-full bg-white/90 backdrop-blur-md border-2 border-white/60 flex items-center justify-center shadow-2xl">
                      <Play className="h-8 w-8 fill-primary text-primary ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Top Badge */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                  <Instagram className="h-3 w-3" />
                  <span>{data?.media_type === "VIDEO" ? "Reel" : "Post"}</span>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-medium text-sm mb-2 line-clamp-2 drop-shadow-lg">
                  {shortCaption}
                </p>
                <p className="text-white/80 text-xs mb-3 drop-shadow-md">
                  {formattedDate}
                </p>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                >
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  View Full Post
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-6xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    @ZoeHolidays
                    <span className="text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                      • Official
                    </span>
                  </span>
                  <p className="text-xs text-muted-foreground">{formattedDate}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row max-h-[calc(100vh-200px)]">
              {/* Media */}
              <div className="relative flex-1 bg-black flex items-center justify-center">
                <div className="w-full h-full max-h-[600px] lg:max-h-[700px]">
                  <MediaContent
                    media_type={data?.media_type}
                    imageUrl={data?.media_url}
                    thumbnail_url={data?.thumbnail_url}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-[400px] flex flex-col bg-card">
                {/* Caption and Info */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {/* Caption */}
                    <div>
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                          @ZoeHolidays
                        </span>{" "}
                        <span className="text-foreground">{data?.caption}</span>
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border"></div>

                    {/* Media Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30">
                          {data?.media_type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Posted</span>
                        <span className="font-medium">{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-border bg-muted/30">
                  <div className="space-y-3">
                    {/* Instagram Link */}
                    <a
                      href={data?.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        View on Instagram
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>

                    {/* Secondary Actions */}
                    <div className="flex gap-2 justify-center text-muted-foreground">
                      <Button variant="ghost" size="icon" className="hover:text-red-500">
                        <Heart className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-blue-500">
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-green-500">
                        <Send className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-yellow-500">
                        <Bookmark className="w-5 h-5" />
                      </Button>
                    </div>
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
