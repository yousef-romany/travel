"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  onLoad?: () => void;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

/**
 * ProgressiveImage Component
 *
 * Enhanced image component with:
 * - Progressive loading with blur placeholder
 * - Automatic lazy loading for non-priority images
 * - Error handling with fallback
 * - Loading skeleton
 * - Optimized performance with Next.js Image
 *
 * @example
 * ```tsx
 * <ProgressiveImage
 *   src="/image.jpg"
 *   alt="Description"
 *   priority={true} // For above-fold images
 *   fill={true}
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 * ```
 */
const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = "",
  priority = false,
  quality = 85,
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw",
  onLoad,
  objectFit = "cover",
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Priority images are always "in view"

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
      }
    );

    const element = document.getElementById(`img-${src.replace(/[^a-zA-Z0-9]/g, '')}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageLoaded(true);
    setError(true);
  };

  const imageId = `img-${src.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div
      id={imageId}
      className={cn("relative w-full h-full overflow-hidden", className)}
    >
      {/* Loading skeleton */}
      {!imageLoaded && !error && (
        <Skeleton className="absolute inset-0 w-full h-full z-10 animate-pulse" />
      )}

      {/* Image - only render when in view or priority */}
      {isInView && (
        <Image
          src={error ? "/placeholder.svg" : src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "transition-all duration-700 ease-out",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            objectFit === "scale-down" && "object-scale-down"
          )}
          onLoad={handleLoad}
          onError={handleError}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
          {...props}
        />
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-muted-foreground">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;
