"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowUp, Play, Ticket, Compass, MessageCircle } from "lucide-react";
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
        [Autoplay({ delay: 6000, stopOnInteraction: false })]
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
        <div className="w-full h-full flex flex-col pt-6 sm:pt-12 pb-6 relative overflow-hidden bg-[#111111] text-white">
            {/* Top Pagination Navigation */}
            <div className="flex items-center justify-between px-6 sm:px-12 mb-4 sm:mb-8 z-10 w-full max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar py-2">
                    {categories.map((_, idx) => {
                        const isActive = idx === selectedIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => scrollTo(idx)}
                                className={`transition-colors duration-500 ease-out text-base sm:text-2xl font-medium tracking-widest shrink-0 ${isActive ? 'text-[#d4af37]' : 'text-zinc-700 hover:text-[#d4af37]/70'
                                    }`}
                            >
                                {String(idx + 1).padStart(2, '0')}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-4 lg:hidden">
                    <button onClick={scrollPrev} className="hover:text-[#d4af37] text-zinc-600 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={scrollNext} className="hover:text-[#d4af37] text-zinc-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row relative z-10 px-6 sm:px-12">
                {/* Image Slider Area */}
                <div className="w-full lg:w-[60%] h-[40dvh] lg:h-full lg:absolute lg:right-6 lg:top-0 order-1 lg:order-2 overflow-hidden mb-6 lg:mb-0">
                    <div className="overflow-visible h-full flex items-center" ref={emblaRef}>
                        <div className="flex h-full gap-4 sm:gap-6 w-full">
                            {categories.map((category, index) => (
                                <div key={category.id} className="flex-[0_0_88%] sm:flex-[0_0_75%] lg:flex-[0_0_100%] min-w-0 h-full relative cursor-grab active:cursor-grabbing" onClick={() => scrollTo(index)}>
                                    <div className={`relative w-full h-full overflow-hidden transition-all duration-700 ease-out bg-zinc-900 shadow-2xl ${index === selectedIndex ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-70'}`}>
                                        <Image
                                            src={getImageUrl(category.image) || "/placeholder.svg"}
                                            alt={category.categoryName}
                                            fill
                                            sizes="(max-width: 1024px) 88vw, 60vw"
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                                        {/* Mobile overlay title - perfectly matches screenshot text on image */}
                                        <div className="absolute bottom-4 left-6 right-6 z-20 lg:hidden">
                                            <h4 className="text-white text-3xl font-normal drop-shadow-md" style={{ fontFamily: 'Georgia, serif' }}>
                                                {category.categoryName}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Left Content Area */}
                <div className="w-full lg:w-[40%] flex flex-col justify-end lg:justify-center order-2 lg:order-1 relative z-20 lg:h-full pb-4 lg:pb-0">
                    <h3 className="text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-none text-[#e2b761] mb-6 drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                        {activeCategory?.categoryName}
                    </h3>

                    <div className="flex gap-4 sm:gap-6 mb-8 lg:mb-12">
                        {/* 3 Floating Action Buttons */}
                        <div className="flex flex-col gap-3 shrink-0">
                            <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#e2b761] text-black flex items-center justify-center hover:bg-amber-400 hover:scale-105 transition-all shadow-md active:scale-95">
                                <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                            </button>
                            <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#e2b761] text-black flex items-center justify-center hover:bg-amber-400 hover:scale-105 transition-all shadow-md active:scale-95">
                                <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" strokeWidth={2.5} />
                            </button>
                            <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#e2b761] text-black flex items-center justify-center hover:bg-amber-400 hover:scale-105 transition-all shadow-md active:scale-95">
                                <Ticket className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-[#a0a0a0] text-sm sm:text-base lg:text-lg leading-relaxed lg:leading-loose font-normal m-0 pt-0.5 lg:max-w-md line-clamp-6">
                            {activeCategory?.description || `Cairo and Giza are where Egypt's vibrant present meets ancient past—bustling streets, historic mosques, and majestic pyramids tell stories that span millennia.`}
                        </p>
                    </div>

                    <div className="w-full lg:w-max">
                        <Link href="/placesTogo" className="block w-full">
                            <Button
                                className="w-full lg:w-auto h-[3.25rem] sm:h-14 rounded-full border border-[#e2b761]/40 text-[#e2b761] bg-transparent hover:bg-[#e2b761] hover:text-[#111] transition-all duration-300 font-medium px-8 text-sm sm:text-base tracking-wide"
                            >
                                <Compass className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-45 transition-transform duration-500" />
                                View All Destinations
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Chat button (Fixed floating) */}
            <div className="absolute right-6 -bottom-4 lg:bottom-12 z-50">
                <button className="h-[3.25rem] w-[3.25rem] sm:h-16 sm:w-16 rounded-full bg-[#fae1a6] text-[#6b4715] flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300">
                    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden lg:flex absolute right-12 bottom-12 z-20 gap-3">
                <button onClick={scrollPrev} className="h-12 w-12 rounded-full border border-zinc-700 bg-black/50 text-white flex items-center justify-center hover:bg-[#e2b761] hover:text-black hover:border-transparent transition-all backdrop-blur-sm">
                    <ChevronLeft className="w-5 h-5 pr-0.5" />
                </button>
                <button onClick={scrollNext} className="h-12 w-12 rounded-full border border-zinc-700 bg-black/50 text-white flex items-center justify-center hover:bg-[#e2b761] hover:text-black hover:border-transparent transition-all backdrop-blur-sm">
                    <ChevronRight className="w-5 h-5 pl-0.5" />
                </button>
            </div>
        </div>
    );
}
