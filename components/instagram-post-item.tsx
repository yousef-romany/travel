"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import axios from "axios";

interface InstagramPostItemProps {
  postId: string;
  index: number;
  onPostClick: (postId: string) => void;
}

interface InstagramData {
  id: string;
  media_type: string;
  media_url: string;
  caption?: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
}

export function InstagramPostItem({ postId, index, onPostClick }: InstagramPostItemProps) {
  const [postData, setPostData] = useState<InstagramData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchInstagramPost = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://graph.instagram.com/${postId}?fields=id,media_type,media_url,caption,permalink,thumbnail_url,timestamp&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN}`
        );
        setPostData(response.data);
        setError(false);
      } catch (err) {
        console.error("Error fetching Instagram post:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramPost();
  }, [postId]);

  const getStaggerDelay = (idx: number): string => {
    const delay = Math.min(idx * 100, 800);
    const delayClasses = {
      0: "animate-delay-0",
      100: "animate-delay-100",
      200: "animate-delay-200",
      300: "animate-delay-300",
      400: "animate-delay-400",
      500: "animate-delay-500",
      600: "animate-delay-600",
      700: "animate-delay-700",
      800: "animate-delay-800",
    } as const;
    return delayClasses[delay as keyof typeof delayClasses] || "animate-delay-0";
  };

  if (isLoading) {
    return (
      <div className={`relative group rounded-2xl overflow-hidden animate-on-scroll ${getStaggerDelay(index)}`}>
        <div className="relative aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !postData) {
    return null;
  }

  const thumbnailUrl = postData.thumbnail_url || postData.media_url;
  const caption = postData.caption || "Exploring Egypt with ZoeHoliday";
  const shortCaption = caption.length > 60 ? caption.substring(0, 60) + "..." : caption;

  return (
    <div
      className={`relative group rounded-lg overflow-hidden animate-on-scroll ${getStaggerDelay(index)} bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800`}
    >
      {/* Instagram Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">ZH</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">ZoeHolidays</p>
        </div>
        {postData.media_type === "VIDEO" && (
          <div className="px-2 py-0.5 rounded bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-xs font-semibold">
            Reel
          </div>
        )}
      </div>

      {/* Instagram Post Image/Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-black">
        <Image
          src={getImageUrl(thumbnailUrl, "/placeholder.svg?height=600&width=600")}
          alt={shortCaption}
          fill
          className="object-contain"
        />

        {/* Play Button Overlay for Videos - Always visible */}
        {postData.media_type === "VIDEO" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
              <Play className="h-7 w-7 fill-white text-white ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Instagram Actions */}
      <div className="p-3 space-y-3">
        {/* Action Icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 hover:text-red-500 cursor-pointer transition-colors" />
            <MessageCircle className="h-6 w-6 hover:text-blue-500 cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Caption */}
        <div>
          <p className="text-sm line-clamp-2">
            <span className="font-semibold">ZoeHolidays</span>{" "}
            <span className="text-gray-700 dark:text-gray-300">{shortCaption}</span>
          </p>
        </div>

        {/* View on Instagram Button */}
        <a
          href={postData.permalink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onPostClick(postData.id)}
          className="block"
        >
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            View on Instagram
          </Button>
        </a>
      </div>
    </div>
  );
}
