"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { ContentStep } from "@/type/programs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ProgramItineraryProps {
    steps: ContentStep[];
}

export function ProgramItinerary({ steps }: ProgramItineraryProps) {
    if (!steps || steps.length === 0) return null;

    return (
        <div className="relative">
            <div className="absolute left-[19px] md:left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-amber-500 to-primary/20" aria-hidden="true" />

            <Accordion type="single" collapsible className="space-y-4" defaultValue="item-0">
                {steps.map((step, index) => {
                    const stepImage = step.image || step.imageUrl || step.place_to_go_subcategories?.at(0)?.image || null;
                    const stepImageUrl = stepImage ? getImageUrl(stepImage) : null;

                    // Construct link to place page if available
                    let placeLink = null;
                    let subCategoryName = "";

                    if (step.place_to_go_subcategories && step.place_to_go_subcategories.length > 0) {
                        const subCat = step.place_to_go_subcategories.at(-1);
                        if (subCat) {
                            subCategoryName = subCat.categoryName;
                            const mainCat = subCat.place_to_go_categories?.at(0);
                            if (mainCat) {
                                placeLink = `/placesTogo/${encodeURIComponent(mainCat.categoryName)}/${encodeURIComponent(subCat.categoryName)}`;
                            }
                        }
                    }

                    return (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border-none relative pl-12 md:pl-16 group"
                        >
                            <div className="absolute left-0 top-3 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary to-amber-600 text-white font-bold text-base md:text-lg shadow-lg z-10 group-hover:scale-110 transition-all duration-300">
                                {index + 1}
                            </div>

                            <div className="bg-gradient-to-br from-background via-background/90 to-primary/5 rounded-xl border border-primary/10 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                <AccordionTrigger className="px-5 py-4 hover:no-underline [&[data-state=open]>div>h3]:text-primary">
                                    <div className="flex flex-col items-start gap-1 text-left w-full">
                                        <h3 className="text-lg md:text-xl font-bold transition-colors">
                                            {step.title}
                                        </h3>
                                        {subCategoryName && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                                                <span>{subCategoryName}</span>
                                            </div>
                                        )}
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="px-5 pb-5 pt-0">
                                    <div className="space-y-4 pt-2">
                                        {stepImageUrl && (
                                            <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-muted group/image">
                                                <Image
                                                    src={stepImageUrl}
                                                    alt={step.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                                                    sizes="(max-width: 768px) 100vw, 600px"
                                                />
                                                {placeLink && (
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <span className="bg-white/90 text-primary px-4 py-2 rounded-full text-sm font-bold shadow-lg transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
                                                            View Location Gallery
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                                            <p>{step.description || "Explore this amazing destination with our guided tour."}</p>
                                        </div>

                                        {placeLink && (
                                            <div className="pt-2">
                                                <a
                                                    href={placeLink}
                                                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-amber-600 transition-colors"
                                                >
                                                    Read full guide about {subCategoryName}
                                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </AccordionContent>
                            </div>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
