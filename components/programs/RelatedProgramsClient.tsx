"use client";

import { useQuery } from "@tanstack/react-query";
import { searchPrograms, ProgramType } from "@/fetch/programs";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { MdArrowOutward } from "react-icons/md";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import CardTravels from "@/app/(app)/programs/components/CardTravels";

interface RelatedProgramsProps {
    placeTitle: string;
    location?: string; // Add location prop
    query: string;
}

const RelatedProgramsClient = ({ placeTitle, location, query }: RelatedProgramsProps) => {
    // Use location if available, otherwise fall back to query (category)
    const searchQuery = location || query;

    const { data, isLoading, error } = useQuery({
        queryKey: ["relatedPrograms", searchQuery],
        queryFn: () => searchPrograms(searchQuery, 10),
        enabled: !!searchQuery,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data?.data || data.data.length === 0) {
        return null;
    }

    return (
        <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Related Programs
                </h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8">
                Explore travel programs featuring {searchQuery}
            </p>

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full relative"
            >
                <CarouselContent className="-ml-4">
                    {data.data.map((program: ProgramType) => (
                        <CarouselItem key={program.id} className="pl-4 md:basis-1/2 lg:basis-1/3 h-full">
                            <div className="h-full p-1">
                                <CardTravels
                                    id={program.id}
                                    documentId={program.documentId}
                                    images={program.images}
                                    title={program.title}
                                    descraption={program.descraption}
                                    Location={program.Location}
                                    duration={program.duration}
                                    price={program.price}
                                    rating={program.rating}
                                    overView={program.overView}
                                    status={program.status}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious className="-left-12 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-white transition-colors" />
                    <CarouselNext className="-right-12 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-white transition-colors" />
                </div>
            </Carousel>
        </section>
    );
};

export default RelatedProgramsClient;
