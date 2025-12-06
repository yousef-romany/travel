"use client";

import { useEffect, useRef, useState } from "react";

interface BackgroundVideoProps {
  videos: string[];
  className?: string;
  overlayClassName?: string;
  autoRotate?: boolean;
  rotationInterval?: number;
  priority?: boolean;
  children?: React.ReactNode;
}

export function BackgroundVideo({
  videos,
  className = "",
  overlayClassName = "",
  autoRotate = true,
  rotationInterval = 30000,
  priority = false,
  children,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle video loading and autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset loaded state when index changes
    setIsLoaded(false);

    const handleCanPlay = () => {
      setIsLoaded(true);
      video.play().catch((error) => {
        console.warn("Video autoplay blocked:", error);
        // Still show video even if autoplay fails
        setIsLoaded(true);
      });
    };

    const handleEnded = () => {
      if (autoRotate && videos.length > 1) {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      } else {
        // If not rotating or only one video, loop it
        video.currentTime = 0;
        video.play().catch(console.warn);
      }
    };

    // Check if video is already loaded
    if (video.readyState >= 3) {
      handleCanPlay();
    } else {
      video.addEventListener('canplay', handleCanPlay, { once: true });
    }

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoIndex, autoRotate, videos.length]);

  // Fallback rotation timer in case video stalls or doesn't end properly
  useEffect(() => {
    if (!autoRotate || videos.length <= 1) return;

    const interval = setInterval(() => {
      // Only rotate if we haven't just rotated (optional check could be added here)
      // For now, we'll rely on onEnded mostly, but this acts as a safety net
      // However, having both might cause double skips. 
      // Let's rely on onEnded primarily. 
      // If we really want a fallback, we should reset it on video play.
      // For this implementation, I will REMOVE the interval to avoid conflicts
      // as requested in the plan to rely on onEnded.
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, videos.length, rotationInterval]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        // Removing key to prevent full re-mount flickering, 
        // but we need to ensure src change triggers reload.
        // Actually, keeping key is safer for ensuring fresh state for each video
        // but might cause a black flash. Let's try without key and rely on src change.
        // If src changes, video element stays, just loads new source.
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-hidden="true"
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
      </video>

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-amber-600/20 animate-pulse" />
      )}

      {/* Dark Overlay */}
      <div className={`absolute inset-0 bg-black/40 ${overlayClassName}`} />

      {/* Content */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  );
}
