"use client";

import { useEffect, useState } from "react";
import { getComparisonList, removeFromComparison, clearComparison, ComparisonProgram } from "@/lib/comparison";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Star, MapPin, Clock, DollarSign, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useComparisonTracking } from "@/hooks/useEnhancedAnalytics";

export default function CompareContent() {
    const [programs, setPrograms] = useState<ComparisonProgram[]>([]);
    const router = useRouter();
    const { trackCompare } = useComparisonTracking();

    useEffect(() => {
        console.log("ComparePage: Loading programs on mount");
        loadPrograms();

        const handleUpdate = () => {
            console.log("ComparePage: Comparison updated event received");
            loadPrograms();
        };

        window.addEventListener("comparisonUpdated", handleUpdate);
        return () => window.removeEventListener("comparisonUpdated", handleUpdate);
    }, []);

    const loadPrograms = () => {
        const list = getComparisonList();
        console.log("ComparePage: Loaded programs from localStorage:", list);
        console.log("ComparePage: Number of programs:", list.length);
        setPrograms(list);

        // Track comparison usage when programs are loaded
        if (list.length > 0) {
            trackCompare(
                list.map(p => p.title),
                "Programs"
            );
        }
    };

    const handleRemove = (documentId: string) => {
        removeFromComparison(documentId);
        loadPrograms();
        window.dispatchEvent(new Event("comparisonUpdated"));
    };

    const handleClearAll = () => {
        clearComparison();
        loadPrograms();
        window.dispatchEvent(new Event("comparisonUpdated"));
    };

    if (programs.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trash2 className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">No Programs to Compare</h1>
                    <p className="text-muted-foreground mb-8">
                        Start adding programs to comparison to see them side by side here.
                    </p>
                    <Button onClick={() => router.push("/programs")}>
                        Browse Programs
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Compare Programs</h1>
                    <p className="text-muted-foreground">
                        Comparing {programs.length} program{programs.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button variant="outline" onClick={handleClearAll}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${programs.length}, 1fr)` }}>
                    {/* Header Row - Images */}
                    <div></div>
                    {programs.map((program) => (
                        <Card key={program.documentId} className="relative overflow-hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
                                onClick={() => handleRemove(program.documentId)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            {program.imageUrl && (
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={program.imageUrl}
                                        alt={program.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-bold mb-2 line-clamp-2">{program.title}</h3>
                                <Link href={`/programs/${program.documentId}`}>
                                    <Button variant="outline" size="sm" className="w-full">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}

                    {/* Price Row */}
                    <div className="flex items-center py-4 px-6 bg-muted/50 rounded-lg font-semibold">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Price
                    </div>
                    {programs.map((program) => (
                        <div key={`price-${program.documentId}`} className="flex items-center justify-center py-4 bg-card border rounded-lg">
                            <span className="text-2xl font-bold text-primary">
                                ${program.price.toLocaleString()}
                            </span>
                        </div>
                    ))}

                    {/* Duration Row */}
                    <div className="flex items-center py-4 px-6 bg-muted/50 rounded-lg font-semibold">
                        <Clock className="h-4 w-4 mr-2" />
                        Duration
                    </div>
                    {programs.map((program) => (
                        <div key={`duration-${program.documentId}`} className="flex items-center justify-center py-4 bg-card border rounded-lg">
                            <span className="text-lg font-medium">
                                {program.duration} days
                            </span>
                        </div>
                    ))}

                    {/* Rating Row */}
                    <div className="flex items-center py-4 px-6 bg-muted/50 rounded-lg font-semibold">
                        <Star className="h-4 w-4 mr-2" />
                        Rating
                    </div>
                    {programs.map((program) => (
                        <div key={`rating-${program.documentId}`} className="flex items-center justify-center py-4 bg-card border rounded-lg">
                            <Badge variant="secondary" className="text-lg">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                {program.rating}
                            </Badge>
                        </div>
                    ))}

                    {/* Location Row */}
                    <div className="flex items-center py-4 px-6 bg-muted/50 rounded-lg font-semibold">
                        <MapPin className="h-4 w-4 mr-2" />
                        Location
                    </div>
                    {programs.map((program) => (
                        <div key={`location-${program.documentId}`} className="flex items-center justify-center py-4 bg-card border rounded-lg text-center px-2">
                            <span>{program.Location}</span>
                        </div>
                    ))}

                    {/* Description Row */}
                    <div className="flex items-center py-4 px-6 bg-muted/50 rounded-lg font-semibold">
                        Description
                    </div>
                    {programs.map((program) => (
                        <div key={`desc-${program.documentId}`} className="flex items-start p-4 bg-card border rounded-lg">
                            <p className="text-sm text-muted-foreground line-clamp-4">
                                {program.descraption}
                            </p>
                        </div>
                    ))}

                    {/* Action Row */}
                    <div></div>
                    {programs.map((program) => (
                        <div key={`action-${program.documentId}`} className="py-4">
                            <Link href={`/programs/${program.documentId}`} className="block">
                                <Button className="w-full" size="lg">
                                    Book Now
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-6">
                {programs.map((program) => (
                    <Card key={program.documentId} className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
                            onClick={() => handleRemove(program.documentId)}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        {program.imageUrl && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={program.imageUrl}
                                    alt={program.title}
                                    fill
                                    className="object-cover rounded-t-lg"
                                />
                            </div>
                        )}

                        <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold">{program.title}</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                                    <p className="text-2xl font-bold text-primary">
                                        ${program.price.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Duration</p>
                                    <p className="text-lg font-semibold">{program.duration} days</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Rating</p>
                                    <Badge variant="secondary">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                        {program.rating}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                                    <p className="font-medium">{program.Location}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Description</p>
                                <p className="text-sm line-clamp-3">{program.descraption}</p>
                            </div>

                            <div className="flex gap-2">
                                <Link href={`/programs/${program.documentId}`} className="flex-1">
                                    <Button className="w-full">Book Now</Button>
                                </Link>
                                <Link href={`/programs/${program.documentId}`}>
                                    <Button variant="outline">View Details</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
