"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { FaArrowUp } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initRef = useRef(false);
  const hasPlayedRef = useRef(false); // Track if audio has played
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showAudioDialog, setShowAudioDialog] = useState(false);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initRef.current) return;
    initRef.current = true;

    // Create and initialize audio with the first track
    const audio = new Audio(audioTracks[0]);
    audio.loop = false; // Don't loop - rotate to next track
    audio.volume = 0.3; // Set to 30% volume
    audio.preload = "auto";
    audioRef.current = audio;

    // Show controls after 2 seconds
    setTimeout(() => setShowControls(true), 2000);

    // Listen for audio state changes
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // Rotate to next track when current track ends
      setCurrentTrackIndex((prev) => (prev + 1) % audioTracks.length);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Autoplay on all pages, only once per session
    if (!hasPlayedRef.current) {
      hasPlayedRef.current = true;

      // Attempt to play immediately
      const playAudio = async () => {
        try {
          await audio.play();
          console.log("Background audio started automatically");
        } catch (error) {
          console.log("Autoplay blocked, showing dialog to user");

          // Show dialog asking user to enable audio
          setShowAudioDialog(true);
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
    if (!audioRef.current) return;

    // Skip the very first mount (when component initializes)
    if (currentTrackIndex === 0 && !audioRef.current.src) return;

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

  const handleEnableAudio = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setShowAudioDialog(false);
      console.log("Background audio started after user permission");
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleDeclineAudio = () => {
    setShowAudioDialog(false);
    console.log("User declined background audio");
  };

  return (
    <>
      {/* Audio Permission Dialog */}
      <Dialog open={showAudioDialog} onOpenChange={setShowAudioDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2.5 bg-gradient-to-br from-primary to-amber-600 rounded-xl">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              Enable Background Music?
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Would you like to play ambient background music to enhance your browsing experience?
              You can control the volume or mute it anytime using the controls at the bottom left.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-auto pt-6 sm:mt-6">
            <Button
              variant="outline"
              onClick={handleDeclineAudio}
              className="rounded-xl px-6 py-2.5"
            >
              No, Thanks
            </Button>
            <Button
              onClick={handleEnableAudio}
              className="bg-gradient-to-br from-primary via-primary/90 to-amber-600 hover:from-primary/90 hover:to-amber-600/90 rounded-xl px-6 py-2.5 shadow-lg shadow-primary/20"
            >
              Yes, Play Music
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audio Controls */}
      {showControls && (
        <div className="fixed bottom-6 left-6 z-30 flex gap-3 flex-col">
          {/* Scroll to Top Button */}
          {isVisible && (
            <Button
              onClick={scrollToTop}
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
