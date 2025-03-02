 
"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa6";
import ReactAudioPlayer from "react-audio-player";
import { Pause, Play } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<ReactAudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Add event listener on mount and clean up on unmount
  useEffect(() => {
    toggleAudio();
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Track scroll position and show button when scrolled down
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the page back to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleAudio = () => {
    if (audioPlayer?.audioEl?.current) {
      if (isPlaying) {
        audioPlayer?.audioEl.current.pause();
      } else {
        audioPlayer?.audioEl.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-[20px] flex gap-4 items-center justify-center">
      <ReactAudioPlayer
        src="/audio/mainAudio.mp3"
        loop
        volume={1.0}
        autoPlay
        ref={(player) => setAudioPlayer(player)}
        style={{ display: "none" }}
      />
      <Button
        onClick={toggleAudio}
        className="rounded-full p-3 bg-primary shadow-lg"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      {isVisible && (
        <Button onClick={scrollToTop} className="rounded-full text-[2rem]">
          <FaArrowUp size={35} />
        </Button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
