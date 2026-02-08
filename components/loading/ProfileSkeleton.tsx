import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Skeleton */}
            <div className="w-full h-[300px] relative bg-muted/20">
                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
                        <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
                        <div className="space-y-2 mb-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <div className="flex gap-2 pt-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Tabs Skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-10 w-full lg:w-[800px] rounded-lg" />
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                        <Skeleton className="h-64 w-full rounded-xl" />
                        <Skeleton className="h-40 w-full rounded-xl" />
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                        <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;
