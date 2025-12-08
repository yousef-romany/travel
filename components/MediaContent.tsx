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
    // If using iframe fallback (for Instagram embed)
    if (useIframe && thumbnail_url) {
      return (
        <div className="relative group cursor-pointer w-full h-full flex items-center justify-center bg-black dark:bg-gray-950" onClick={togglePlay}>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 dark:bg-gray-950/70 z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                  <p className="text-white text-sm">Loading video...</p>
                </div>
              </div>
            )}

            {/* Show thumbnail with play overlay when not playing */}
            {!isPlaying && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={thumbnail_url}
                    alt="Instagram video thumbnail"
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-4 rounded-lg">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xl">
                      <Play className="w-10 h-10 text-primary ml-1" fill="currentColor" />
                    </div>
                    <p className="text-white text-sm px-4 text-center font-medium">
                      Click to play video
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Video player */}
            {isPlaying && (
              <div className="relative w-full h-full max-h-[85vh]">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain rounded-lg transition-opacity duration-300"
                  poster={thumbnail_url}
                  playsInline
                  controls={false}
                  muted={isMuted}
                  preload="metadata"
                  onPlay={() => {
                    setIsPlaying(true);
                    setIsLoading(false);
                    console.log('Video playing');
                  }}
                  onPause={() => {
                    setIsPlaying(false);
                    console.log('Video paused');
                  }}
                  onLoadedData={handleVideoLoad}
                  onCanPlay={handleCanPlay}
                  onError={handleVideoError}
                >
                  <source src={imageUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Custom pause overlay when playing */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 transition-opacity group-hover:bg-black/30 dark:group-hover:bg-black/50 pointer-events-none rounded-lg">
                  <div className="w-20 h-20 rounded-full bg-white/90 dark:bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                    <Pause className="w-10 h-10 text-primary dark:text-primary" fill="currentColor" />
                  </div>
                </div>

                {/* Progress bar and controls */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-b-lg">
                  {/* Progress bar */}
                  <div
                    className="w-full h-1.5 bg-white/30 rounded-full mb-2 cursor-pointer pointer-events-auto"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Time and controls */}
                  <div className="flex items-center justify-between pointer-events-auto">
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <button
                      onClick={toggleMute}
                      className="p-1.5 sm:p-2 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm transition-all shadow-lg"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="relative group cursor-pointer w-full h-full flex items-center justify-center bg-black dark:bg-gray-950" onClick={togglePlay}>
        <div className="relative w-full h-full flex items-center justify-center">
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
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
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
                <div className="absolute inset-0 -z-10">
                  <Image
                    src={thumbnail_url}
                    alt="Video thumbnail"
                    fill
                    className="object-cover opacity-20"
                  />
                </div>
              )}
            </div>
          )}

          {/* Video container with proper aspect ratio */}
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              className="w-full h-full max-h-[85vh] object-contain rounded-lg transition-opacity duration-300"
              style={{
                opacity: isLoading ? 0 : 1
              }}
              poster={thumbnail_url}
              playsInline
              controls={false}
              muted={isMuted}
              preload="metadata"
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 transition-opacity group-hover:bg-black/30 dark:group-hover:bg-black/50 pointer-events-none rounded-lg">
                {!isPlaying && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/90 dark:bg-white/80 flex items-center justify-center transition-transform hover:scale-110 shadow-2xl">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary dark:text-primary ml-1" fill="currentColor" />
                  </div>
                )}
                {isPlaying && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/90 dark:bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl">
                    <Pause className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary dark:text-primary" fill="currentColor" />
                  </div>
                )}
              </div>
            )}

            {/* Progress bar and controls */}
            {isPlaying && !isLoading && (
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-b-lg">
                {/* Progress bar */}
                <div
                  className="w-full h-1.5 bg-white/30 rounded-full mb-2 cursor-pointer pointer-events-auto"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Time and controls */}
                <div className="flex items-center justify-between pointer-events-auto">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 sm:p-2 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm transition-all shadow-lg"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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
