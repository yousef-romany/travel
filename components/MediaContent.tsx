"use client";

import { instaGramVedios } from "@/type/placesToGo";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";

export default function MediaContent({
  media_type,
  imageUrl,
  thumbnail_url,
}: instaGramVedios) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Pause video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (media_type === "VIDEO") {
    return (
      <div className="relative group cursor-pointer w-full h-full flex items-center justify-center" onClick={togglePlay}>
        <video
          ref={videoRef}
          className="object-contain"
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
          poster={thumbnail_url}
          playsInline
          controls={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          src={imageUrl}
        >
          <source src={imageUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Custom play/pause overlay - no sound control */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/30 pointer-events-none">
          {!isPlaying && (
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center transition-transform hover:scale-110 shadow-xl">
              <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
            </div>
          )}
          {isPlaying && (
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
              <Pause className="w-10 h-10 text-black" fill="currentColor" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative max-w-full max-h-full" style={{ maxHeight: '85vh' }}>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Instagram content"
          width={1200}
          height={1200}
          className="object-contain w-auto h-auto max-w-full max-h-full"
          style={{ maxHeight: '85vh' }}
        />
      </div>
    </div>
  );
}
