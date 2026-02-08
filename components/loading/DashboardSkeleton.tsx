import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DashboardSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-10 w-96" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="space-y-6">
                {/* Tabs Skeleton */}
                <Skeleton className="h-10 w-full lg:w-[600px] rounded-md" />

                {/* Quick Stats Skeleton */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Upcoming Bookings Skeleton */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="w-24 h-24 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                                <div className="space-y-2 flex flex-col items-end">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recently Viewed Skeleton */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <Skeleton className="h-40 w-full" />
                                    <CardContent className="p-4 space-y-3">
                                        <Skeleton className="h-5 w-3/4" />
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
