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

  // Auto-rotate videos
  useEffect(() => {
    if (!autoRotate || videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, videos.length, rotationInterval]);

  // Handle video loading and autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset loaded state
    setIsLoaded(false);

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    const playVideo = async () => {
      try {
        await video.play();
        setIsLoaded(true);
      } catch (error) {
        console.warn("Video autoplay blocked:", error);
        // Still show video even if autoplay fails
        setIsLoaded(true);
      }
    };

    // Check if video is already loaded
    if (video.readyState >= 3) {
      setIsLoaded(true);
      playVideo();
    } else {
      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('loadeddata', playVideo, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', playVideo);
    };
  }, [currentVideoIndex]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        key={currentVideoIndex}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
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
