"use client";

import { X, Heart, MessageCircle, Play, Instagram, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import MediaContent from "./MediaContent";
import { instagramPostsType, instaGramType } from "@/type/placesToGo";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useModalTracking } from "@/hooks/useEnhancedAnalytics";

export default function InstagramModal({ idPost }: instagramPostsType) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<instaGramType>({} as instaGramType);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const { trackOpen, trackClose } = useModalTracking("instagram-post");

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
        onClick={() => {
          setIsModalOpen(true);
          trackOpen("thumbnail-click");
        }}
        className="group w-full max-w-sm rounded-2xl cursor-pointer overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:scale-[1.02]"
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
                  trackOpen("view-full-post-button");
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

      {/* Modal - Fully Robust Grid Layout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
          {/* Backdrop Blur Layer */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            onClick={() => {
              setIsModalOpen(false);
              trackClose("backdrop-click");
            }}
          />

          {/* Modal Container */}
          <div
            className="relative w-full max-w-[1600px] h-full sm:h-[92vh] md:h-[95vh] bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-500 border border-gray-200/30 dark:border-gray-800/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed height */}
            <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 backdrop-blur-md">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-xs sm:text-sm md:text-base font-bold">ZH</span>
                </div>
                <div>
                  <span className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                    @ZoeHolidays
                    <span className="text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-medium border border-[#D4AF37]/30">
                      Official
                    </span>
                  </span>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  trackClose("close-button");
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-all bg-gray-50 dark:bg-gray-800/50"
                aria-label="Close Instagram post modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
              </button>
            </div>

            {/* Content Area - Grid for Desktop, Flex for Mobile */}
            <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-[1.2fr_360px] lg:grid-cols-[1.5fr_400px] xl:grid-cols-[2fr_450px]">
              {/* Media Section - Fills remaining grid space */}
              <div className="relative bg-black flex items-center justify-center overflow-hidden h-[55vh] sm:h-[60vh] md:h-auto border-b md:border-b-0">
                <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                  <MediaContent
                    media_type={data?.media_type}
                    imageUrl={data?.media_url}
                    thumbnail_url={data?.thumbnail_url}
                  />
                </div>
              </div>

              {/* Sidebar Section - Forced width on desktop */}
              <div className="flex flex-col bg-white dark:bg-gray-900 md:border-l border-gray-200 dark:border-gray-800 min-h-0">
                {/* Scrollable Caption Area */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
                  {/* Caption */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <span className="font-bold text-[#D4AF37]">@ZoeHolidays</span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                        {displayCaption}
                      </p>
                      {caption.length > 150 && (
                        <button
                          onClick={() => setShowFullCaption(!showFullCaption)}
                          className="mt-2 text-xs font-bold text-[#D4AF37] hover:text-amber-500 transition-colors uppercase tracking-wider"
                        >
                          {showFullCaption ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

                  {/* Metadata */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Content Type</span>
                      <span className="font-bold px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                        {data?.media_type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Publish Date</span>
                      <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{formattedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions - Fixed at bottom */}
                <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-4">
                  <a
                    href={data?.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C49F2F] hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all h-12 text-base font-bold"
                      size="lg"
                    >
                      <Instagram className="w-5 h-5 mr-3" />
                      View on Instagram
                      <ExternalLink className="w-4 h-4 ml-3 opacity-70" />
                    </Button>
                  </a>

                  <div className="flex gap-4 justify-center items-center">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors" aria-label="Like post">
                      <Heart className="w-6 h-6" />
                      <span className="text-xs font-medium">Like</span>
                    </button>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors" aria-label="Comment on post">
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-xs font-medium">Comment</span>
                    </button>
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
