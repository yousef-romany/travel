"use client";

import OptimizedImage from "@/components/OptimizedImage";
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


  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative h-48 w-full bg-muted rounded-tl-xl rounded-tr-xl flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((image: Media, index: number) => (
            <div className="flex-[0_0_100%] min-w-0" key={image?.id}>
              <div className="relative h-48 w-full">
                <OptimizedImage
                  src={getImageUrl(image)}
                  alt={image?.name || `Travel destination ${index + 1}`}
                  className="object-cover rounded-tl-xl rounded-tr-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex ? "bg-background" : "bg-background/50"
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}