"use client";

import { Button } from "@/components/ui/button";
import { dataTypeCardTravel } from "@/type/programs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgramMobileActionProps {
    program: dataTypeCardTravel;
}

export function ProgramMobileAction({ program }: ProgramMobileActionProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down a bit (e.g., passed the hero)
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleBookingClick = () => {
        window.location.href = `/programs/${program.documentId}/book`;
    };

    if (!program) return null;

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-primary/10 p-4 transition-transform duration-300 md:hidden pb-safe",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-primary">
                            ${Number(program.price).toFixed(0)}
                        </span>
                        <span className="text-xs text-muted-foreground">/ person</span>
                    </div>
                </div>
                <Button
                    onClick={handleBookingClick}
                    className="flex-1 bg-gradient-to-r from-primary to-amber-600 shadow-lg"
                >
                    Book Now
                </Button>
            </div>
        </div>
    );
}
