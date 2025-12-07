import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const PlacesGridSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="mb-8 space-y-4">
                <Skeleton className="h-10 w-48 md:w-64" />
                <Skeleton className="h-4 w-full max-w-md" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-8 w-20 rounded-full" />
                            <Skeleton className="h-8 w-20 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlacesGridSkeleton;
