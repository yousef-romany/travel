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
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Array of background music tracks
  // TODO: Add second audio file to /public/audio/ and uncomment the second track
  const audioTracks = [
    "/audio/videoplayback.mp3",
    // "/audio/track2.mp3", // Uncomment when you add your second audio file
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initRef.current) return;
    initRef.current = true;

    // Create and initialize audio with the first track
    const audio = new Audio("/audio/videoplayback.mp3");
    audio.loop = false; // Don't loop - we'll rotate tracks when we have multiple
    audio.volume = 0.3; // Set to 30% volume
    audio.preload = "auto";
    audioRef.current = audio;

    // Show controls after 2 seconds
    setTimeout(() => setShowControls(true), 2000);

    // Listen for audio state changes
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // Loop the single track (until we add more tracks)
      audio.currentTime = 0;
      audio.play().catch(console.error);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Only autoplay on home page and only once per session
    if (pathname === "/" && !hasPlayedRef.current) {
      hasPlayedRef.current = true;

      // Attempt to play immediately
      const playAudio = async () => {
        try {
          await audio.play();
          console.log("Background audio started automatically on home page");
        } catch (error) {
          console.log("Autoplay blocked, will play on first user interaction");

          // If autoplay is blocked, play on first user interaction
          const handleFirstInteraction = async () => {
            try {
              await audio.play();
              console.log("Background audio started after user interaction");
              // Remove listeners after successful play
              document.removeEventListener("click", handleFirstInteraction);
              document.removeEventListener("touchstart", handleFirstInteraction);
              document.removeEventListener("keydown", handleFirstInteraction);
              document.removeEventListener("scroll", handleFirstInteraction);
            } catch (err) {
              console.error("Error playing audio:", err);
            }
          };

          document.addEventListener("click", handleFirstInteraction, { once: true });
          document.addEventListener("touchstart", handleFirstInteraction, { once: true });
          document.addEventListener("keydown", handleFirstInteraction, { once: true });
          document.addEventListener("scroll", handleFirstInteraction, { once: true });
        }
      };

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        playAudio();
      }, 100);
    }

    // Cleanup only on component unmount (not on pathname change)
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", handlePlay);
        audioRef.current.removeEventListener("pause", handlePause);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Load new track when index changes
  useEffect(() => {
    if (!audioRef.current || currentTrackIndex === 0) return; // Skip initial mount

    const wasPlaying = isPlaying;
    const audio = audioRef.current;

    // Load new track
    audio.src = audioTracks[currentTrackIndex];
    audio.load();

    // If was playing, continue playing the new track
    if (wasPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrackIndex]);

  const toggleAudio = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
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
