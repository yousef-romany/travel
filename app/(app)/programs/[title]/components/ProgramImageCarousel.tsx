"use client";
import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { dataTypeCardTravel } from "@/type/programs";

interface ProgramImageCarouselProps {
  program: dataTypeCardTravel;
}

export function ProgramImageCarousel({ program }: ProgramImageCarouselProps) {
  const [activeImage, setActiveImage] = useState(0);

  if (!program.images || program.images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl border border-primary/20 flex items-center justify-center text-muted-foreground">
          No images available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl border border-primary/20">
        <Image
          src={
            program.images?.at(activeImage)?.imageUrl
              ? getImageUrl(program.images?.at(activeImage)?.imageUrl as string)
              : (program.images?.at(activeImage) ? getImageUrl(program.images?.at(activeImage) as any) : "/placeholder.svg")
          }
          alt={`${program.title} - Image ${activeImage + 1}`}
          fill
          className="object-cover transition-opacity duration-500"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {program.images?.map((img, index) => (
          <button
            key={index}
            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-all ${
              index === activeImage
                ? "ring-2 ring-primary scale-105"
                : "ring-1 ring-border hover:ring-primary/50"
            }`}
            onClick={() => setActiveImage(index)}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={img.imageUrl ? getImageUrl(img.imageUrl as string) : getImageUrl(img as any) || "/placeholder.svg"}
              alt={`${program.title} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
              loading="lazy"
              quality={70}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
