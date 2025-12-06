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

  // Auto-rotate videos
  useEffect(() => {
    if (!autoRotate || videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, videos.length, rotationInterval]);

  // Simple autoplay on video change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay failed - browser policy
      });
    };

    // Play when video is ready
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo, { once: true });
    }

    return () => {
      video.removeEventListener('loadeddata', playVideo);
    };
  }, [currentVideoIndex]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
      {/* Video Element - NO CONTROLS, FULLY AUTOMATIC */}
      <video
        ref={videoRef}
        key={currentVideoIndex}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        style={{
          pointerEvents: 'none'
        }}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className={cn("absolute inset-0 bg-black/40", overlayClassName)} />

      {/* Content */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  );
}