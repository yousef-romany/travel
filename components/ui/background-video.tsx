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
    if (!video) {
      console.warn("[BackgroundVideo] No video element found");
      return;
    }

    console.log(`[BackgroundVideo] Loading video ${currentVideoIndex + 1}/${videos.length}:`, videos[currentVideoIndex]);

    // Reset loaded state when index changes
    setIsLoaded(false);

    const handleCanPlay = () => {
      console.log("[BackgroundVideo] Video can play, readyState:", video.readyState);
      setIsLoaded(true);
      video.play()
        .then(() => {
          console.log("[BackgroundVideo] Video playback started successfully");
        })
        .catch((error) => {
          console.error("[BackgroundVideo] Video autoplay blocked or failed:", error);
          // Still show video even if autoplay fails
          setIsLoaded(true);
        });
    };

    const handleEnded = () => {
      console.log("[BackgroundVideo] Video ended");
      if (autoRotate && videos.length > 1) {
        console.log(`[BackgroundVideo] Rotating to next video: ${(currentVideoIndex + 1) % videos.length}`);
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      } else {
        // If not rotating or only one video, loop it
        console.log("[BackgroundVideo] Looping current video");
        video.currentTime = 0;
        video.play().catch(console.warn);
      }
    };

    const handleError = (e: Event) => {
      console.error("[BackgroundVideo] Video error:", {
        error: video.error,
        networkState: video.networkState,
        readyState: video.readyState,
        src: video.src,
        event: e
      });
    };

    const handleLoadStart = () => {
      console.log("[BackgroundVideo] Video load started");
    };

    const handleLoadedMetadata = () => {
      console.log("[BackgroundVideo] Video metadata loaded, duration:", video.duration);
    };

    // Set the source directly on the video element
    console.log("[BackgroundVideo] Setting video src to:", videos[currentVideoIndex]);
    video.src = videos[currentVideoIndex];
    video.load();
    console.log("[BackgroundVideo] video.load() called");

    // Add error handler
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Check if video is already loaded
    if (video.readyState >= 3) {
      console.log("[BackgroundVideo] Video already loaded (readyState >= 3)");
      handleCanPlay();
    } else {
      console.log("[BackgroundVideo] Waiting for canplay event, current readyState:", video.readyState);
      video.addEventListener('canplay', handleCanPlay, { once: true });
    }

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentVideoIndex, autoRotate, videos]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
        autoPlay
        muted
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-hidden="true"
      />

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
