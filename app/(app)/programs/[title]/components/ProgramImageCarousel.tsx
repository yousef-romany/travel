"use client";

import * as React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { dataTypeCardTravel } from "@/type/programs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand, Grid, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgramImageCarouselProps {
  program: dataTypeCardTravel;
}

export function ProgramImageCarousel({ program }: ProgramImageCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const images = program.images || [];

  if (images.length === 0) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl border border-primary/20 flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div
                    className="relative aspect-video cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    <Image
                      src={
                        img.imageUrl
                          ? getImageUrl(img.imageUrl as string)
                          : getImageUrl((img as any)) || "/placeholder.svg"
                      }
                      alt={`${program.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-4 bg-background/80 hover:bg-background" />
              <CarouselNext className="right-4 bg-background/80 hover:bg-background" />
            </div>

            <div className="absolute bottom-4 right-4 z-10">
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="gap-2 shadow-lg backdrop-blur-md bg-background/60 hover:bg-background/80">
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">View all photos</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({current + 1}/{count})
                  </span>
                </Button>
              </DialogTrigger>
            </div>
          </Carousel>
        </div>

        {/* Thumbnails */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide py-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300",
                current === index
                  ? "ring-2 ring-primary scale-105 opacity-100"
                  : "opacity-70 hover:opacity-100 ring-1 ring-border"
              )}
            >
              <Image
                src={
                  img.imageUrl
                    ? getImageUrl(img.imageUrl as string)
                    : getImageUrl((img as any)) || "/placeholder.svg"
                }
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">Image Gallery</DialogTitle> {/* Accessibility fix */}
          <div className="absolute right-4 top-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="flex items-center justify-center h-full w-full">
            <Carousel className="w-full max-w-5xl" opts={{ align: "center", loop: true }} setApi={(api) => {
              if (api) {
                api.scrollTo(current, true); // Sync initial slide
                // Sync back to main carousel on change
                api.on("select", () => {
                  const selected = api.selectedScrollSnap();
                  setCurrent(selected);
                  // Also scroll the main api if needed, though they are decoupled.
                  // It's better to keep local state.
                });
              }
            }}>
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index} className="flex items-center justify-center h-[80vh]">
                    <div className="relative w-full h-full">
                      <Image
                        src={
                          img.imageUrl
                            ? getImageUrl(img.imageUrl as string)
                            : getImageUrl((img as any)) || "/placeholder.svg"
                        }
                        alt={`${program.title} - Fullscreen Image ${index + 1}`}
                        fill
                        className="object-contain"
                        priority
                        quality={90}
                        sizes="90vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-black/50 text-white border-none hover:bg-black/70" />
              <CarouselNext className="right-4 bg-black/50 text-white border-none hover:bg-black/70" />
            </Carousel>
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 pointer-events-none">
            image {current + 1} of {count}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
