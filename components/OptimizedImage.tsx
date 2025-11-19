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

  return (
    <div className={cn("relative w-full h-full", className)}>
      {!imageLoaded && <Skeleton className="absolute inset-0 w-full h-full" />}
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-contain transition-opacity duration-300",
          className
        )}
        loading="lazy"
        style={{
          visibility: imageLoaded ? "visible" : "hidden",
        }}
        onLoadingComplete={() => setImageLoaded(true)}
        placeholder="blur"
        blurDataURL="/placeholder.svg"
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
