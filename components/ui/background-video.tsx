"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
 * - Muted autoplay for better UX
 * - Lazy loading support
 * - Multiple video rotation
 * - SEO optimized with schema markup
 * - Mobile optimized with poster fallback
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

  // Rotate videos
  useEffect(() => {
    if (!autoRotate || videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, videos.length, rotationInterval]);

  // Handle video loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoaded(true);
    video.addEventListener("canplay", handleCanPlay);

    return () => video.removeEventListener("canplay", handleCanPlay);
  }, [currentVideoIndex]);

  // Attempt to play video on mount/change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset loaded state
    setIsLoaded(false);

    // Play video with error handling
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Video autoplay failed:", error);
      }
    };

    playVideo();
  }, [currentVideoIndex]);

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
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        poster="/placeholder.svg?height=1080&width=1920"
        aria-hidden="true"
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-amber-600/20 animate-pulse" />
      )}

      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40",
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
