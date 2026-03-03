"use client";

import ProgressiveImage from "@/components/ProgressiveImage";
import { getImageUrl } from "@/lib/utils";
import { Media } from "@/type/programs";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ProgramCarouselProps {
  images: Media[];
}

export function ProgramCarousel({ images }: ProgramCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);


  // Normalize images array (Strapi v4 returns { data: [...] }, v5 or flattened returns [...])
  const normalizedImages = Array.isArray(images)
    ? images
    : (images as any)?.data
      ? (images as any).data
      : [];

  // If no images, show placeholder
  if (!normalizedImages || normalizedImages.length === 0) {
    return (
      <div className="relative h-48 sm:h-56 md:h-64 cursor-pointer w-full bg-muted rounded-t-xl flex items-center justify-center overflow-hidden">
        <ProgressiveImage
          src="/placeholder.svg"
          alt="No image available"
          fill
          className="object-cover opacity-50"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {normalizedImages.map((image: any, index: number) => (
            <div className="flex-[0_0_100%] min-w-0" key={image?.id || index}>
              <div className="relative h-48 sm:h-56 md:h-64 w-full group cursor-pointer">
                <ProgressiveImage
                  src={getImageUrl(image) || "/placeholder.svg"}
                  alt={image?.name || `Travel destination ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  quality={85}
                  priority={index === 0} // First image priority for LCP
                  objectFit="cover"
                  className="rounded-t-xl transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle overlay for better badge readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 transition-opacity duration-300 group-hover:opacity-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Only show if more than 1 image */}
      {normalizedImages.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1.5 transition-all duration-200 hover:scale-110 backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-md border border-white/20"
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev(); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1.5 transition-all duration-200 hover:scale-110 backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-md border border-white/20"
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext(); }}
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {normalizedImages.map((_: any, index: number) => (
              <button
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm ${index === selectedIndex
                    ? "bg-white w-4 scale-100 opacity-100"
                    : "bg-white/60 hover:bg-white/80 scale-90 opacity-80"
                  }`}
                onClick={(e) => { e.stopPropagation(); emblaApi?.scrollTo(index); }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}