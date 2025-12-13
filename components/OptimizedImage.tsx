"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative w-full h-full", className)}>
      {!imageLoaded && !error && (
        <Skeleton className="absolute inset-0 w-full h-full z-10" />
      )}
      <Image
        src={error ? "/placeholder.svg" : src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "object-contain transition-opacity duration-500",
          imageLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageLoaded(true);
          setError(true);
        }}
        placeholder="blur"
        blurDataURL="/placeholder.svg"
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
