"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "./ui/skeleton";

interface AdvancedImageProps {
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
  /**
   * Enable art direction for different screen sizes
   * Example: { mobile: "/mobile.jpg", tablet: "/tablet.jpg", desktop: "/desktop.jpg" }
   */
  artDirection?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  /**
   * Custom blur data URL for better placeholders
   */
  blurDataURL?: string;
  /**
   * Enable low quality image placeholder (LQIP)
   */
  lqip?: boolean;
  /**
   * Aspect ratio for responsive images (e.g., "16/9", "4/3")
   */
  aspectRatio?: string;
}

/**
 * AdvancedImage Component - Maximum Quality & Performance
 *
 * Features:
 * - Automatic WebP/AVIF format selection (Next.js handles this)
 * - Low Quality Image Placeholder (LQIP) support
 * - Art direction for responsive images
 * - Progressive enhancement with smooth transitions
 * - Intersection Observer for smart lazy loading
 * - Fetchpriority attribute for LCP optimization
 * - Custom blur placeholders
 * - Aspect ratio preservation
 * - Error handling with retry logic
 *
 * @example
 * ```tsx
 * <AdvancedImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   priority={true}
 *   quality={95}
 *   aspectRatio="16/9"
 *   artDirection={{
 *     mobile: "/hero-mobile.jpg",
 *     desktop: "/hero-desktop.jpg"
 *   }}
 * />
 * ```
 */
const AdvancedImage: React.FC<AdvancedImageProps> = ({
  src,
  alt,
  className = "",
  priority = false,
  quality = 90,
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw",
  onLoad,
  objectFit = "cover",
  artDirection,
  blurDataURL,
  lqip = true,
  aspectRatio,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLDivElement>(null);

  // Art direction: Select appropriate image based on viewport
  useEffect(() => {
    if (!artDirection) return;

    const updateSrc = () => {
      const width = window.innerWidth;

      if (width < 768 && artDirection.mobile) {
        setCurrentSrc(artDirection.mobile);
      } else if (width < 1440 && artDirection.tablet) {
        setCurrentSrc(artDirection.tablet);
      } else if (artDirection.desktop) {
        setCurrentSrc(artDirection.desktop);
      } else {
        setCurrentSrc(src);
      }
    };

    updateSrc();
    window.addEventListener("resize", updateSrc);
    return () => window.removeEventListener("resize", updateSrc);
  }, [src, artDirection]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || typeof window === "undefined") return;

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
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setImageLoaded(true);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    if (retryCount < 2) {
      // Retry loading up to 2 times
      setRetryCount((prev) => prev + 1);
      setTimeout(() => {
        setError(false);
        setImageLoaded(false);
      }, 1000 * (retryCount + 1));
    } else {
      setImageLoaded(true);
      setError(true);
    }
  };

  // Generate simple blur placeholder if none provided
  const defaultBlurDataURL =
    blurDataURL ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+";

  // Calculate aspect ratio padding
  const aspectRatioStyle = aspectRatio
    ? {
        paddingBottom: `${(parseInt(aspectRatio.split("/")[1]) / parseInt(aspectRatio.split("/")[0])) * 100}%`,
      }
    : undefined;

  return (
    <div
      ref={imgRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={aspectRatio && !fill ? aspectRatioStyle : undefined}
    >
      {/* Loading skeleton with shimmer effect */}
      {!imageLoaded && !error && (
        <div className="absolute inset-0 w-full h-full z-10">
          <Skeleton className="w-full h-full animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted" />
        </div>
      )}

      {/* Image - only render when in view or priority */}
      {isInView && !error && (
        <Image
          src={currentSrc}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          placeholder={lqip ? "blur" : "empty"}
          blurDataURL={lqip ? defaultBlurDataURL : undefined}
          className={cn(
            "transition-all duration-700 ease-out",
            imageLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-sm",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            objectFit === "scale-down" && "object-scale-down"
          )}
          onLoad={handleLoad}
          onError={handleError}
          // @ts-ignore - fetchpriority is valid but not in types yet
          fetchpriority={priority ? "high" : "low"}
          {...props}
        />
      )}

      {/* Error state with retry */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
          <svg
            className="w-16 h-16 mb-4 text-muted-foreground opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-muted-foreground">Image unavailable</p>
          {retryCount < 2 && (
            <p className="text-xs text-muted-foreground mt-1">Retrying...</p>
          )}
        </div>
      )}

      {/* Loading progress indicator for priority images */}
      {priority && !imageLoaded && !error && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden z-20">
          <div className="h-full bg-primary animate-loading-bar" />
        </div>
      )}
    </div>
  );
};

export default AdvancedImage;
