"use client";

import React, { useState, useEffect } from "react";
import { Play, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubeEmbedProps {
  videoUrl: string;
  title?: string;
  autoplay?: boolean;
  showControls?: boolean;
}

const YouTubeEmbed = ({
  videoUrl,
  title = "YouTube video player",
  autoplay = false,
  showControls = true
}: YouTubeEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');

  // Validate videoUrl
  if (!videoUrl || typeof videoUrl !== 'string') {
    console.error('Invalid YouTube URL provided:', videoUrl);
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 dark:bg-gray-950 shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 dark:bg-gray-950">
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white/60" />
            <p className="text-white/80 text-sm">No video URL provided</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert YouTube URL to embed format and get watch URL
  const getYouTubeUrls = (url: string): { embedUrl: string; watchUrl: string; videoId: string } => {
    // Trim whitespace
    url = url.trim();

    // Extract video ID from various YouTube URL formats
    let videoId = '';
    let watchUrl = url;

    // If already an embed URL, extract video ID
    if (url.includes('/embed/')) {
      videoId = url.split('/embed/')[1]?.split('?')[0] || '';
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0]?.split('#')[0] || '';
      watchUrl = url;
    }
    // Format: https://youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('#')[0] || '';
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    // Format: https://www.youtube.com/v/VIDEO_ID
    else if (url.includes('/v/')) {
      videoId = url.split('/v/')[1]?.split('?')[0]?.split('#')[0] || '';
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    // Format: https://www.youtube.com/shorts/VIDEO_ID
    else if (url.includes('/shorts/')) {
      videoId = url.split('/shorts/')[1]?.split('?')[0]?.split('#')[0] || '';
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    // Create embed URL with nocookie domain (more privacy, better for embedding)
    const embedUrl = videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}${showControls ? '' : '?controls=0'}`
      : url;

    console.log('YouTube URLs:', { original: url, embedUrl, watchUrl, videoId });

    return { embedUrl, watchUrl, videoId };
  };

  const { embedUrl, watchUrl, videoId } = getYouTubeUrls(videoUrl);

  // Store original URL for fallback
  useEffect(() => {
    setOriginalUrl(watchUrl);
  }, [watchUrl]);

  // Add autoplay parameter if needed
  const enhancedUrl = autoplay && !embedUrl.includes('autoplay=')
    ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`
    : embedUrl;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setIsBlocked(false);
  };

  const handleError = () => {
    console.error('YouTube embed error - video may be blocked from embedding');
    setIsLoading(false);
    setHasError(true);
    setIsBlocked(true);
  };

  // Detect if iframe content is blocked (timeout check)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Video taking too long to load - may be blocked');
        setIsBlocked(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  const openOnYouTube = () => {
    window.open(originalUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 dark:bg-gray-950 shadow-lg">
      {/* Loading State */}
      {isLoading && !isBlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 dark:bg-gray-950 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin" />
            <p className="text-white/80 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Blocked/Error State with YouTube Link */}
      {(hasError || isBlocked) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 z-10">
          <div className="flex flex-col items-center gap-4 px-4 text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <Play className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Video Cannot Be Embedded</p>
              <p className="text-white/70 text-sm mb-4">
                This video's owner has restricted playback on external sites.
              </p>
            </div>
            <Button
              onClick={openOnYouTube}
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Watch on YouTube
            </Button>
            {videoId && (
              <p className="text-white/50 text-xs mt-2">Video ID: {videoId}</p>
            )}
          </div>
        </div>
      )}

      {/* YouTube Iframe */}
      <iframe
        src={enhancedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        className="absolute inset-0 w-full h-full rounded-lg border-0"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default YouTubeEmbed;
