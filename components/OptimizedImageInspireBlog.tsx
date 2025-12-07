"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface OptimizedImageInspireBlogProps {
  src: string;
  alt: string;
  className?: string;
}

const OptimizedImageInspireBlog: React.FC<OptimizedImageInspireBlogProps> = ({
  src,
  alt,
  className = "",
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Extract object-fit related classes for the image
  const objectFitClasses = className.match(/(object-cover|object-contain|object-fill|object-none|object-scale-down)/)?.[0] || "object-cover";

  // Extract other classes for the wrapper (height, width, etc.)
  const wrapperClasses = className.replace(/(object-cover|object-contain|object-fill|object-none|object-scale-down)/g, "").trim();

  return (
    <div className={cn("relative overflow-hidden bg-muted/20", wrapperClasses)}>
      {!imageLoaded && !error && (
        <Skeleton className="absolute inset-0 w-full h-full z-10" />
      )}
      <Image
        src={error ? "/placeholder.svg" : src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          objectFitClasses,
          "transition-opacity duration-500",
          imageLoaded ? "opacity-100" : "opacity-0"
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

export default OptimizedImageInspireBlog;
