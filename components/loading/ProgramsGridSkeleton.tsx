import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const ProgramsGridSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="mb-8 text-center space-y-4 max-w-2xl mx-auto">
                <Skeleton className="h-10 w-48 mx-auto rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 9 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden h-full flex flex-col">
                        <div className="relative aspect-[4/3]">
                            <Skeleton className="h-full w-full" />
                        </div>
                        <CardHeader className="space-y-2 pb-2">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-2 flex-grow">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProgramsGridSkeleton;
