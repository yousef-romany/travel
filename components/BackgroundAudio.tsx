"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { FaArrowUp } from "react-icons/fa6";

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Array of background music tracks - rotates between both
  const audioTracks = [
    "/audio/videoplayback.mp3",
    "/audio/mainAudio.mp3",
  ];

  // Show scroll button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show controls after 2 seconds (no audio is loaded yet)
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Lazy-create the audio element ONLY when the user clicks play.
  // This prevents the 6.8MB MP3 from being downloaded on page load.
  const getAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(audioTracks[0]);
      audio.loop = false;
      audio.volume = isMuted ? 0 : 0.3;
      audioRef.current = audio;
    }
    return audioRef.current;
  };

  const toggleAudio = async () => {
    const audio = getAudio();

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = 0.3;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Rotate to next track when current track ends
  const handleEnded = () => {
    const audio = getAudio();
    const nextIndex = (trackIndexRef.current + 1) % audioTracks.length;
    trackIndexRef.current = nextIndex;
    audio.src = audioTracks[nextIndex];
    audio.load();
    audio.play().catch(console.error);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  // Attach state listeners once the audio element exists
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef.current]);

  return (
    <>
      {/* Audio Controls */}
      {showControls && (
        <div className="fixed bottom-6 left-6 z-30 flex gap-3 flex-col">
          {/* Scroll to Top Button */}
          {isVisible && (
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-2xl h-12 w-12 shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 bg-gradient-to-br from-primary via-primary/90 to-amber-600 hover:from-primary/90 hover:to-amber-600/90 shadow-primary/20"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <FaArrowUp size={20} />
            </Button>
          )}

          {/* Play/Pause Button */}
          <Button
            onClick={toggleAudio}
            size="icon"
            className="rounded-2xl h-12 w-12 shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 bg-gradient-to-br from-primary via-primary/90 to-amber-600 hover:from-primary/90 hover:to-amber-600/90 shadow-primary/20"
            title={isPlaying ? "Pause Background Music" : "Play Background Music"}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5,3 19,12 5,21" rx="1" />
              </svg>
            )}
          </Button>

          {/* Mute/Unmute Button */}
          <Button
            onClick={toggleMute}
            size="icon"
            className="rounded-2xl h-12 w-12 shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 bg-gradient-to-br from-primary via-primary/90 to-amber-600 hover:from-primary/90 hover:to-amber-600/90 shadow-primary/20"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </div>
      )}
    </>
  );
}
