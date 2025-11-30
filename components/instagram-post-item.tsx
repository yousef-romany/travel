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
      className={`relative group rounded-2xl overflow-hidden hover-lift animate-on-scroll ${getStaggerDelay(index)} bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 shadow-lg hover:shadow-2xl transition-all duration-500`}
    >
      {/* Instagram Post Image/Thumbnail */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={getImageUrl(thumbnailUrl, "/placeholder.svg?height=600&width=600")}
          alt={shortCaption}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Play Button Overlay for Videos */}
        {postData.media_type === "VIDEO" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <Button
                variant="outline"
                size="icon"
                className="relative w-16 h-16 rounded-full bg-white/90 backdrop-blur-md border-2 border-white/60 text-primary hover:bg-white hover:scale-110 hover:border-primary shadow-2xl transition-all duration-300"
              >
                <Play className="h-8 w-8 fill-current" />
              </Button>
            </div>
          </div>
        )}

        {/* Top Badge - Media Type */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1.5">
            {postData.media_type === "VIDEO" ? (
              <>
                <Play className="h-3 w-3 fill-white" />
                <span>Reel</span>
              </>
            ) : (
              <>
                <Heart className="h-3 w-3 fill-white" />
                <span>Post</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {/* Caption */}
          <p className="text-white font-medium text-sm mb-3 line-clamp-2 drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {shortCaption}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
            <a
              href={postData.permalink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onPostClick(postData.id)}
              className="flex-1"
            >
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                View on Instagram
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Corner Gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
