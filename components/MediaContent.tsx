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

  useEffect(() => {
    // Pause video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
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

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error event:', e);
    console.error('Video URL:', imageUrl);
    if (videoRef.current) {
      const error = videoRef.current.error;
      console.error('Video error code:', error?.code);
      console.error('Video error message:', error?.message);

      // Error codes:
      // 1 = MEDIA_ERR_ABORTED
      // 2 = MEDIA_ERR_NETWORK
      // 3 = MEDIA_ERR_DECODE
      // 4 = MEDIA_ERR_SRC_NOT_SUPPORTED

      if (error?.code === 2) {
        console.error('Network error - video may be blocked by CORS or network issues');
      } else if (error?.code === 4) {
        console.error('Video source not supported - codec or format issue');
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
    // If using iframe fallback (for Instagram embed)
    if (useIframe && thumbnail_url) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-black dark:bg-gray-950">
          <div className="relative w-full h-full max-w-[600px] max-h-[800px]">
            {/* Show thumbnail with play overlay */}
            <div className="relative w-full h-full">
              <Image
                src={thumbnail_url}
                alt="Instagram video thumbnail"
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-4">
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="w-10 h-10 text-primary ml-1" fill="currentColor" />
                </div>
                <p className="text-white text-sm px-4 text-center">
                  Instagram videos are best viewed on Instagram
                </p>
                <Button
                  onClick={() => window.open(imageUrl, '_blank')}
                  className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch on Instagram
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative group cursor-pointer w-full h-full flex items-center justify-center bg-black dark:bg-gray-950" onClick={togglePlay}>
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 dark:bg-gray-950/70 z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {hasError && !useIframe && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 dark:bg-gray-950/95 z-10 gap-4 p-6">
            <div className="flex flex-col items-center gap-3 max-w-md text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white text-base font-semibold">Unable to load video</p>
              <p className="text-white/70 text-sm">
                Instagram videos may be restricted due to privacy settings or CORS policies
              </p>
              <div className="flex gap-3 mt-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUseIframe(true);
                    setHasError(false);
                  }}
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  View Thumbnail
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(imageUrl, '_blank');
                  }}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Instagram
                </Button>
              </div>
            </div>
            {thumbnail_url && (
              <Image
                src={thumbnail_url}
                alt="Video thumbnail"
                fill
                className="object-contain opacity-20 -z-10"
              />
            )}
          </div>
        )}

        <video
          ref={videoRef}
          className="object-contain transition-opacity duration-300"
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            opacity: isLoading ? 0 : 1
          }}
          poster={thumbnail_url}
          playsInline
          controls={false}
          muted={isMuted}
          preload="metadata"
          crossOrigin="anonymous"
          onPlay={() => {
            setIsPlaying(true);
            console.log('Video playing');
          }}
          onPause={() => {
            setIsPlaying(false);
            console.log('Video paused');
          }}
          onLoadedData={handleVideoLoad}
          onCanPlay={handleCanPlay}
          onError={handleVideoError}
          onLoadedMetadata={() => console.log('Video metadata loaded')}
          onWaiting={() => console.log('Video waiting for data')}
          onStalled={() => console.log('Video stalled')}
        >
          <source src={imageUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Custom play/pause overlay with improved dark mode support */}
        {!isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 transition-opacity group-hover:bg-black/30 dark:group-hover:bg-black/50 pointer-events-none">
            {!isPlaying && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/90 dark:bg-white/80 flex items-center justify-center transition-transform hover:scale-110 shadow-xl">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary dark:text-primary ml-1" fill="currentColor" />
              </div>
            )}
            {isPlaying && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/90 dark:bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                <Pause className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary dark:text-primary" fill="currentColor" />
              </div>
            )}
          </div>
        )}

        {/* Audio control button - appears on hover when playing */}
        {isPlaying && !isLoading && (
          <button
            onClick={toggleMute}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 p-2 sm:p-2.5 md:p-3 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-lg pointer-events-auto"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </button>
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
              <path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h10v6H7V9zm2 2v2h6v-2H9z"/>
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
