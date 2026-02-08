import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PlanTripSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 max-w-7xl relative z-10">
                {/* Header Skeleton */}
                <div className="text-center mb-12 flex flex-col items-center">
                    <Skeleton className="h-10 w-64 md:w-96 mb-4" />
                    <Skeleton className="h-6 w-full max-w-2xl mb-6" />
                    <Skeleton className="h-16 w-full max-w-3xl rounded-lg" />
                </div>

                {/* Stats Bar Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>

                {/* Tabs & Grid Skeleton */}
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-10 w-64 rounded-lg" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <Skeleton className="h-48 w-full" />
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-px w-full" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanTripSkeleton;
