"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

interface PlaceCategory {
    id: number;
    documentId?: string;
    categoryName: string;
    description?: string;
    image: any;
}

interface PlacesCarouselProps {
    categories: PlaceCategory[];
}

export default function PlacesCarousel({ categories }: PlacesCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start", containScroll: "trimSnaps" },
        [Autoplay({ delay: 5000, stopOnInteraction: false })]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    if (!categories || categories.length === 0) return null;

    const activeCategory = categories[selectedIndex];

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center w-full min-h-[600px] relative">
            {/* Top Pagination Navigation (Desktop only, positioned absolute top-right) */}
            <div className="hidden lg:flex absolute top-0 right-0 w-2/3 items-center gap-6 justify-between pr-4 items-end">
                <div className="flex items-center flex-1 transition-all duration-500 flex-wrap">
                    {categories.map((_, idx) => {
                        const isActive = idx === selectedIndex;
                        return (
                            <div key={idx} className="flex items-center">
                                <button
                                    onClick={() => scrollTo(idx)}
                                    className={`transition-all duration-500 ease-out ${isActive
                                        ? 'text-5xl font-extrabold text-[#f59e0b] tracking-tighter mx-2'
                                        : 'text-xl font-medium text-muted-foreground/30 hover:text-[#f59e0b]/80 mx-4'
                                        }`}
                                >
                                    {String(idx + 1).padStart(2, '0')}
                                </button>
                                <div
                                    className={`transition-all duration-500 ease-out bg-gradient-to-r from-[#f59e0b]/80 to-transparent ${isActive ? 'h-[2px] w-20 xl:w-32 mx-4 opacity-100' : 'h-[2px] w-0 opacity-0 mx-0'
                                        }`}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={scrollPrev}
                        className="p-1 hover:text-amber-600 text-muted-foreground/50 transition-colors"
                        aria-label="Previous destination"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="p-1 hover:text-amber-600 text-muted-foreground/50 transition-colors"
                        aria-label="Next destination"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Left Content Area */}
            <div className="w-full lg:w-1/3 flex flex-col justify-center order-2 lg:order-1 animate-fade-in px-4 lg:px-8 xl:pr-12">
                <h3 className="text-5xl lg:text-7xl font-light text-amber-600/90 mb-8 transition-all duration-300 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {activeCategory?.categoryName}
                </h3>
                <p className="text-muted-foreground/90 leading-relaxed max-w-md text-base md:text-lg mb-0 line-clamp-6 font-normal">
                    {activeCategory?.description || `The capital of Egypt and the largest city in Africa, the name means “the victorious city”. It is located on both banks of the River Nile near the head of the river's delta in northern Egypt and has been settled for more than 6000 years, serving as the capital of numerous Egyptian civilizations.`}
                </p>
            </div>

            {/* Right Carousel Area */}
            <div className="w-full lg:w-2/3 flex flex-col order-1 lg:order-2 overflow-hidden px-4 lg:px-0 lg:pt-16">

                {/* Mobile Navigation & Pagination (Visible only on mobile/tablet) */}
                <div className="flex lg:hidden items-center justify-between mb-6">
                    <div className="flex items-center flex-1 overflow-x-auto no-scrollbar py-2">
                        {categories.map((_, idx) => {
                            const isActive = idx === selectedIndex;
                            return (
                                <div key={idx} className="flex items-center shrink-0">
                                    <button
                                        onClick={() => scrollTo(idx)}
                                        className={`transition-all duration-500 ease-out ${isActive
                                            ? 'text-3xl font-extrabold text-[#f59e0b] tracking-tighter mx-1'
                                            : 'text-lg font-medium text-muted-foreground/30 hover:text-[#f59e0b]/80 mx-3'
                                            }`}
                                    >
                                        {String(idx + 1).padStart(2, '0')}
                                    </button>
                                    <div
                                        className={`transition-all duration-500 ease-out bg-gradient-to-r from-[#f59e0b]/80 to-transparent ${isActive ? 'h-[2px] w-12 md:w-16 mx-2 opacity-100' : 'h-[2px] w-0 opacity-0 mx-0'
                                            }`}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={scrollPrev}
                            className="p-1 hover:text-amber-600 text-muted-foreground/50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="p-1 hover:text-amber-600 text-muted-foreground/50 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Embla Viewport */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4">
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className="flex-[0_0_88%] md:flex-[0_0_75%] min-w-0 pl-4"
                            >
                                <div
                                    className={`relative h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-none overflow-hidden transition-all duration-700 ease-out cursor-pointer shadow-none ${index === selectedIndex ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-80'
                                        }`}
                                    onClick={() => scrollTo(index)}
                                >
                                    <Image
                                        src={getImageUrl(category.image) || "/placeholder.svg"}
                                        alt={category.categoryName}
                                        fill
                                        sizes="(max-width: 768px) 88vw, (max-width: 1200px) 75vw, 66vw"
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                    {/* Subtle overlay for inactive elements */}
                                    {index !== selectedIndex && (
                                        <div className="absolute inset-0 bg-background/20" />
                                    )}
                                    {/* Title overlay on image for mobile, hidden on desktop since it's on the left */}
                                    <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${index === selectedIndex ? 'opacity-100 lg:opacity-0' : 'opacity-100'}`}>
                                        <h4 className="text-white text-3xl font-light" style={{ fontFamily: 'Georgia, serif' }}>{category.categoryName}</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
