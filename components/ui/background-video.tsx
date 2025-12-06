"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Play, Volume2, VolumeX } from "lucide-react";

interface BackgroundVideoProps {
  videos: string[];
  className?: string;
  overlayClassName?: string;
  autoRotate?: boolean;
  rotationInterval?: number; // in milliseconds
  priority?: boolean;
  children?: React.ReactNode;
}

/**
 * Optimized Background Video Component
 * - Enhanced autoplay with fallback
 * - Lazy loading support
 * - Multiple video rotation
 * - SEO optimized with schema markup
 * - Mobile optimized with poster fallback
 * - Light/Dark mode support
 */
export function BackgroundVideo({
  videos,
  className,
  overlayClassName,
  autoRotate = true,
  rotationInterval = 30000,
  priority = false,
  children,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted on client
  useEffect(() => {
    setIsMounted(true);
    console.log('BackgroundVideo mounted with videos:', videos);
  }, [videos]);

  // Rotate videos
  useEffect(() => {
    if (!autoRotate || videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      setHasError(false);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, videos.length, rotationInterval]);

  // Handle video loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('Video can play:', videos[currentVideoIndex]);
      setIsLoaded(true);
      setHasError(false);
    };
    const handlePlay = () => {
      console.log('Video playing:', videos[currentVideoIndex]);
      setIsPlaying(true);
    };
    const handlePause = () => {
      console.log('Video paused');
      setIsPlaying(false);
    };
    const handleError = (e: Event) => {
      console.error("Video failed to load:", videos[currentVideoIndex], e);
      setHasError(true);
      setIsLoaded(false);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
    };
  }, [currentVideoIndex, videos]);

  // Attempt to play video on mount/change with retry logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isMounted) return;

    console.log('Attempting to load video:', videos[currentVideoIndex]);

    // Reset loaded state
    setIsLoaded(false);
    setHasError(false);

    // Play video with error handling and retry
    const playVideo = async () => {
      try {
        video.load(); // Force reload the video
        console.log('Video loaded, attempting autoplay...');
        await video.play();
        console.log('Video autoplay successful');
        setIsPlaying(true);
      } catch (error) {
        console.warn("Video autoplay failed, will retry on user interaction:", error);
        setIsPlaying(false);
        // On autoplay failure, still mark as loaded so user can see the poster/first frame
        setIsLoaded(true);
      }
    };

    // Delay to ensure video is loaded
    const timer = setTimeout(playVideo, 100);

    return () => clearTimeout(timer);
  }, [currentVideoIndex, isMounted, videos]);

  // User interaction handler to start video
  const handleVideoClick = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
    } catch (error) {
      console.error("Failed to play video:", error);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Don't render until mounted (avoid SSR issues)
  if (!isMounted) {
    return (
      <div className={cn("relative w-full h-full overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-amber-600/30 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-amber-800/40" />
        <div className={cn("absolute inset-0 bg-black/40 dark:bg-black/60", overlayClassName)} />
        {children && <div className="relative z-10 h-full">{children}</div>}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Video Element */}
      <video
        ref={videoRef}
        key={currentVideoIndex}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        poster="/placeholder.svg?height=1080&width=1920"
        aria-hidden="true"
        onClick={handleVideoClick}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading placeholder with dark mode support */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-amber-600/30 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-amber-800/40 animate-pulse" />
      )}

      {/* Error fallback with dark mode support */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
          <p className="text-white/80 dark:text-white/60 text-sm md:text-base">Unable to load video</p>
        </div>
      )}

      {/* Play button overlay when not playing */}
      {!isPlaying && isLoaded && (
        <button
          onClick={handleVideoClick}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 dark:bg-black/40 hover:bg-black/30 dark:hover:bg-black/50 transition-all cursor-pointer group"
          aria-label="Play video"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white/90 dark:bg-white/80 flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xl">
            <Play className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary dark:text-primary ml-1" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Audio control button */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 p-2 md:p-3 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm transition-all shadow-lg"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
          )}
        </button>
      )}

      {/* Overlay with dark mode support */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 dark:bg-black/60",
          overlayClassName
        )}
      />

      {/* Content */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}

      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "Egypt Travel Video",
            description: "Experience the beauty and wonder of Egypt through immersive video content showcasing ancient monuments, culture, and breathtaking landscapes.",
            thumbnailUrl: "/placeholder.svg?height=1080&width=1920",
            contentUrl: videos[currentVideoIndex],
            uploadDate: new Date().toISOString(),
            duration: "PT30S",
          }),
        }}
      />
    </div>
  );
}
