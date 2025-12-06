"use client";

import { instaGramVedios } from "@/type/placesToGo";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";

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

  useEffect(() => {
    // Pause video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          await videoRef.current.play();
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
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (media_type === "VIDEO") {
    return (
      <div className="relative group cursor-pointer w-full h-full flex items-center justify-center bg-black dark:bg-gray-950" onClick={togglePlay}>
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 dark:bg-gray-950/70 z-10">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 dark:bg-gray-950/90 z-10">
            <p className="text-white text-sm md:text-base">Unable to load video</p>
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
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          src={imageUrl}
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

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="relative max-w-full max-h-full" style={{ maxHeight: '85vh' }}>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Instagram content"
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
