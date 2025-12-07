"use client";

import { X, Heart, MessageCircle, Play, Instagram, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import MediaContent from "./MediaContent";
import { instagramPostsType, instaGramType } from "@/type/placesToGo";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function InstagramModal({ idPost }: instagramPostsType) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<instaGramType>({} as instaGramType);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);

  useEffect(() => {
    if (!isFetched) {
      try {
        setIsLoading(true);
        fetch(
          `https://graph.instagram.com/${idPost}?fields=id,media_type,media_url,caption,permalink,thumbnail_url,timestamp&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN}`
        )
          .then((res) => res.json())
          .then((resData) => {
            setData(resData);
            setIsLoading(false);
            setIsFetched(true);
          })
          .catch((error) => {
            console.error("Error fetching Instagram data:", error);
            setIsLoading(false);
            setIsFetched(true);
          });
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsFetched(true);
      }
    }
  }, [idPost, isFetched]);

  const formattedDate = data?.timestamp ? new Date(data.timestamp as string).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  ) : "";

  const thumbnailUrl = data?.thumbnail_url || data?.media_url;
  const caption = data?.caption || "Exploring Egypt with ZoeHoliday ✨";
  const shortCaption = caption.length > 80 ? caption.substring(0, 80) + "..." : caption;

  // Split caption into lines for better readability (max 4 lines when collapsed)
  const captionLines = caption.split('\n').filter(line => line.trim());
  const displayCaption = showFullCaption ? caption : (caption.length > 150 ? caption.substring(0, 150) + "..." : caption);

  return (
    <>
      {/* Thumbnail Card - Fully Responsive */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="group w-full max-w-md mx-auto rounded-2xl cursor-pointer overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:scale-[1.02]"
      >
        {isLoading ? (
          <div className="w-full aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Header with Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/50 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-xs sm:text-sm font-bold">ZH</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">ZoeHolidays</p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 trucate">{formattedDate}</p>
              </div>
              {data?.media_type === "VIDEO" && (
                <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-[10px] sm:text-xs font-semibold shadow-sm flex-shrink-0">
                  Reel
                </div>
              )}
            </div>

            {/* Image with Better Overlay */}
            <div className="relative w-full aspect-square overflow-hidden">
              {thumbnailUrl && (
                <Image
                  src={thumbnailUrl}
                  alt={shortCaption}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}

              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

              {/* Play Button for Videos */}
              {data?.media_type === "VIDEO" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-[#D4AF37]/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/95 backdrop-blur-md border-2 border-white/80 flex items-center justify-center shadow-2xl">
                      <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-[#D4AF37] text-[#D4AF37] ml-0.5 sm:ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions with Improved Spacing */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm">
              {/* Action Icons */}
              <div className="flex items-center gap-4 sm:gap-5">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors" />
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors" />
              </div>

              {/* Caption with Better Typography */}
              <div className="space-y-1">
                <p className="text-xs sm:text-sm leading-relaxed line-clamp-3">
                  <span className="font-bold text-gray-900 dark:text-white">ZoeHolidays</span>{" "}
                  <span className="text-gray-700 dark:text-gray-200">{shortCaption}</span>
                </p>
              </div>

              {/* Branded Button */}
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C49F2F] hover:to-amber-700 text-white border-0 shadow-md hover:shadow-lg transition-all font-semibold text-xs sm:text-sm"
              >
                <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                View Full Post
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Modal with Improved Layout */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">ZH</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    @ZoeHolidays
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-medium">
                      Official
                    </span>
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                aria-label="Close Instagram post modal"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
              </button>
            </div>

            {/* Content with Better Balance */}
            <div className="flex flex-col md:flex-row h-[calc(92vh-73px)] w-full">
              {/* Media - Takes 60% on desktop */}
              <div className="relative flex-[6] bg-black w-full flex items-center justify-center overflow-hidden min-h-[400px] md:min-h-0">
                <div className="w-full h-full flex items-center justify-center">
                  <MediaContent
                    media_type={data?.media_type}
                    imageUrl={data?.media_url}
                    thumbnail_url={data?.thumbnail_url}
                  />
                </div>
              </div>

              {/* Sidebar - Takes 40% on desktop, balanced layout */}
              <div className="flex-[4] w-full md:max-w-md flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
                {/* Caption and Info with Better Spacing */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                  {/* Caption with Read More */}
                  <div className="space-y-2">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      <span className="font-bold text-[#D4AF37]">@ZoeHolidays</span>{" "}
                      <span className="text-gray-800 dark:text-gray-100">{displayCaption}</span>
                    </p>
                    {caption.length > 150 && (
                      <button
                        onClick={() => setShowFullCaption(!showFullCaption)}
                        className="text-xs font-medium text-[#D4AF37] hover:text-amber-600 transition-colors"
                      >
                        {showFullCaption ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-800"></div>

                  {/* Media Info with Better Contrast */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Type</span>
                      <span className="font-semibold px-3 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                        {data?.media_type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Posted</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formattedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions with Branded Button */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 space-y-3">
                  {/* Instagram Link with Branded Colors */}
                  <a
                    href={data?.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C49F2F] hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                      size="lg"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      View on Instagram
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>

                  {/* Secondary Actions */}
                  <div className="flex gap-2 justify-center">
                    <Button variant="ghost" size="icon" className="hover:text-red-500 dark:hover:text-red-400 text-gray-600 dark:text-gray-400" aria-label="Like post">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-blue-500 dark:hover:text-blue-400 text-gray-600 dark:text-gray-400" aria-label="Comment on post">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
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
