"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { FaArrowUp } from "react-icons/fa6";

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initRef = useRef(false);
  const hasPlayedRef = useRef(false); // Track if audio has played
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Show scroll button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initRef.current) return;
    initRef.current = true;

    // Create and initialize audio
    const audio = new Audio("/audio/videoplayback.mp3");
    audio.loop = true;
    audio.volume = 0.3; // Set to 30% volume
    audio.preload = "auto";
    audioRef.current = audio;

    // Show controls after 2 seconds
    setTimeout(() => setShowControls(true), 2000);

    // Only autoplay on home page and only once
    if (pathname === "/" && !hasPlayedRef.current) {
      hasPlayedRef.current = true;

      // Attempt to play immediately
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
          console.log("Background audio started automatically on home page");
        } catch (error) {
          console.log("Autoplay blocked, will play on first user interaction");

          // If autoplay is blocked, play on first user interaction
          const handleFirstInteraction = async () => {
            try {
              await audio.play();
              setIsPlaying(true);
              console.log("Background audio started after user interaction");
              // Remove listeners after successful play
              document.removeEventListener("click", handleFirstInteraction);
              document.removeEventListener("touchstart", handleFirstInteraction);
              document.removeEventListener("keydown", handleFirstInteraction);
            } catch (err) {
              console.error("Error playing audio:", err);
            }
          };

          document.addEventListener("click", handleFirstInteraction);
          document.addEventListener("touchstart", handleFirstInteraction);
          document.addEventListener("keydown", handleFirstInteraction);
        }
      };

      playAudio();
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [pathname]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
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

  if (!showControls) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex gap-2 flex flex-col">
      {/* Mute/Unmute Button */}
      <Button
        onClick={toggleMute}
        size="icon"
        className="rounded-full h-12 w-12 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Button>

      {/* Play/Pause Button */}
      <Button
        onClick={toggleAudio}
        size="icon"
        className="rounded-full h-12 w-12 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90"
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
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </Button>

      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="rounded-full h-12 w-12 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <FaArrowUp size={24} />
        </Button>
      )}
    </div>
  );
}
