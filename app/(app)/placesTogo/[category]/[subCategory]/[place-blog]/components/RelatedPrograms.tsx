"use client";

import { useQuery } from "@tanstack/react-query";
import { searchPrograms, ProgramType } from "@/fetch/programs";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface RelatedProgramsProps {
    placeTitle: string;
    query: string;
}

const RelatedPrograms = ({ placeTitle, query }: RelatedProgramsProps) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["relatedPrograms", query],
        queryFn: () => searchPrograms(query, 10),
        enabled: !!query,
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
                Explore travel programs featuring {query}
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
                            <Link href={`/programs/${program.documentId}`} className="block h-full">
                                <Card className="group h-full rounded-3xl overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card flex flex-col">
                                    <div className="relative overflow-hidden aspect-[4/3] w-full">
                                        <OptimizedImage
                                            src={getImageUrl(program.images?.[0])}
                                            alt={program.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                        {program.price && (
                                            <Badge className="absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                                ${program.price}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-grow p-6">
                                        <CardHeader className="p-0 mb-3">
                                            <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                                {program.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0 flex-grow">
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {program.descraption}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="p-0 mt-4 pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                                                <span>View Program</span>
                                                <MdArrowOutward />
                                            </div>
                                        </CardFooter>
                                    </div>
                                </Card>
                            </Link>
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

export default RelatedPrograms;
