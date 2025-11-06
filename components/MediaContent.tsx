"use client";

import { instaGramVedios } from "@/type/placesToGo";
import Image from "next/image";
import { useRef, useEffect } from "react";
import OptimizedImage from "./OptimizedImage";

export default function MediaContent({
  media_type,
  imageUrl,
  thumbnail_url,
}: instaGramVedios) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Pause video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    };
  }, []);

  if (media_type === "VIDEO") {
    return (
      <div className={`relative`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          poster={thumbnail_url}
        >
          <source src={imageUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={imageUrl || "/placeholder.svg"}
      alt="Instagram content"
      width={800}
      height={600}
      className={`object-cover`}
    />
  );
}
