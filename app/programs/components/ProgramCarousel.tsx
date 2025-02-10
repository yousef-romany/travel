"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export function ProgramCarousel({
  images,
}: {
  images: { id: number; title: string; imageUrl: string }[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map(
            (image: { id: number; title: string; imageUrl: string }) => (
              <div className="flex-[0_0_100%] min-w-0" key={image.id}>
                <div className="relative h-48 w-full">
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`Travel destination ${image.id + 1} ${image.title}`}
                    fill
                    className="object-cover rounded-tl-xl rounded-tr-xl"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background rounded-full p-2"
        onClick={() => emblaApi?.scrollPrev()}
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background rounded-full p-2"
        onClick={() => emblaApi?.scrollNext()}
      >
        <ChevronRight className="w-6 h-6 text-primary" />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === selectedIndex ? "bg-background" : "bg-background/50"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
