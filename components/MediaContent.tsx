"use client";

import { instaGramVedios } from "@/type/placesToGo";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export default function MediaContent({
  media_type,
  imageUrl,
  thumbnail_url,
}: instaGramVedios) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [useIframe, setUseIframe] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Pause video when component unmounts
    return () => {
      video.pause();
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Auto-retry with iframe if video fails
  useEffect(() => {
    if (hasError && media_type === "VIDEO" && !useIframe) {
      const timer = setTimeout(() => {
        console.log('Video failed, attempting iframe fallback');
        setUseIframe(true);
        setHasError(false);
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasError, media_type, useIframe]);

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          // Try to play video
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Playback failed:", error);
              // If autoplay fails, try with muted
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().catch(e => {
                  console.error("Muted playback also failed:", e);
                  setHasError(true);
                });
              }
            });
          }
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Failed to toggle video playback:", error);
        setHasError(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    // Only log essential info - we have UI fallback handling
    if (videoRef.current?.error) {
      const error = videoRef.current.error;
      // Only log if it's not a common Instagram CORS/network issue
      if (error.code !== 2 && error.code !== 4) {
        console.warn(`Video load error (code ${error.code}):`, imageUrl);
      }
    }
    setIsLoading(false);
    setHasError(true);
  };

  const handleCanPlay = () => {
    console.log('Video can play');
    setIsLoading(false);
  };

  // Handle VIDEO and CAROUSEL_ALBUM (which may contain videos)
  if (media_type === "VIDEO" || media_type === "CAROUSEL_ALBUM") {
    // Fallback to a simple thumbnail view if the video URL is missing
    if (!imageUrl) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {thumbnail_url ? (
            <Image
              src={thumbnail_url}
              alt="Instagram media thumbnail"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="text-white">Media not available</div>
          )}
        </div>
      );
    }

    // Main video player component
    return (
      <div
        className="relative group/video cursor-pointer w-full h-full flex items-center justify-center bg-black"
        onClick={togglePlay}
      >
        {/* Main Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain transition-opacity duration-300"
          style={{ opacity: isLoading || hasError ? 0 : 1 }}
          poster={thumbnail_url}
          playsInline
          controls={false}
          muted={isMuted}
          loop
          preload="metadata"
          crossOrigin="anonymous"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedData={handleVideoLoad}
          onCanPlay={handleCanPlay}
          onError={handleVideoError}
          onWaiting={() => setIsLoading(true)}
        >
          <source src={imageUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Thumbnail as a fallback and initial view */}
        {(isLoading || hasError) && thumbnail_url && (
          <Image
            src={thumbnail_url}
            alt="Video thumbnail"
            fill
            className="object-contain transition-opacity duration-300"
            style={{ opacity: hasError ? 0.3 : 1 }}
          />
        )}

        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin" />
          </div>
        )}

        {/* Error State Overlay */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-3 sm:gap-4 p-4 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white text-sm sm:text-base font-semibold">Could not load video</p>
            <p className="text-white/70 text-xs sm:text-sm max-w-xs">
              This might be due to Instagram&apos;s privacy settings or network issues.
            </p>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://www.instagram.com/p/${imageUrl.split("/")[4]}/`, '_blank');
              }}
              className="mt-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm"
              size="sm"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              View on Instagram
            </Button>
          </div>
        )}

        {/* Custom Controls - visible when not loading/error */}
        {!isLoading && !hasError && (
          <>
            {/* Play/Pause Center Button */}
            <div
              className={
                "absolute inset-0 flex items-center justify-center transition-opacity duration-300 " +
                (isPlaying ? "opacity-0 group-hover/video:opacity-100" : "opacity-100")
              }
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="white" />
                ) : (
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="white" />
                )}
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
              {/* Progress Bar */}
              <div
                className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Time and Mute Button */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-white text-xs sm:text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <button
                  onClick={toggleMute}
                  className="p-1"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Handle IMAGE and CAROUSEL_ALBUM (with images)
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-gray-900">
      {media_type === "CAROUSEL_ALBUM" && (
        <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <p className="text-white text-xs font-semibold flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h10v6H7V9zm2 2v2h6v-2H9z" />
            </svg>
            Multiple Items
          </p>
        </div>
      )}
      <div className="relative max-w-full max-h-full" style={{ maxHeight: '85vh' }}>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={media_type === "CAROUSEL_ALBUM" ? "Instagram carousel album" : "Instagram photo"}
          width={1200}
          height={1200}
          className="object-contain w-auto h-auto max-w-full max-h-full"
          style={{ maxHeight: '85vh' }}
          priority
        />
      </div>
    </div>
  );
}
