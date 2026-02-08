import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const EventsGridSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Hero Section Skeleton */}
            <div className="text-center mb-12 flex flex-col items-center">
                <Skeleton className="h-8 w-48 rounded-full mb-4" />
                <Skeleton className="h-12 w-64 md:w-96 mb-4" />
                <Skeleton className="h-6 w-full max-w-lg" />
            </div>

            {/* Filter Tabs Skeleton */}
            <div className="mb-8 w-full max-w-3xl mx-auto">
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Events Grid Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden border-primary/20 shadow-xl">
                        <div className="relative h-48">
                            <Skeleton className="h-full w-full" />
                        </div>
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-10 w-full rounded-md mt-4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default EventsGridSkeleton;
