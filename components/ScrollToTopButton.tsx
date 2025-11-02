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

  // Show scroll button
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAudio = () => {
    if (!audioPlayer?.audioEl?.current) return;

    // أول مرة → التشغيل الإجباري
    const audio = audioPlayer.audioEl.current;
    if (!isPlaying) {
      audio.play().catch(() => {}); // ignore autoplay errors
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-[20px] flex gap-4 items-center justify-center">

      {/* 🎧 مش هنعتمد على autoPlay نهائي */}
      <ReactAudioPlayer
        src="/audio/mainAudio.mp3"
        loop
        volume={1.0}
        ref={(player) => setAudioPlayer(player)}
        style={{ display: "none" }}
      />

      <Button
        onClick={toggleAudio}
        className="rounded-full p-3 bg-primary shadow-lg"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
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
