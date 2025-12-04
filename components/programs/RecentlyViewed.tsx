"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentlyViewed, RecentlyViewedProgram } from "@/lib/recently-viewed";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RecentlyViewed() {
  const [programs, setPrograms] = useState<RecentlyViewedProgram[]>([]);

  useEffect(() => {
    setPrograms(getRecentlyViewed());
  }, []);

  if (programs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.slice(0, 6).map((program) => (
            <Link
              key={program.documentId}
              href={`/programs/${program.title}`}
              className="group block"
            >
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {program.imageUrl && (
                  <div className="relative h-32 bg-muted">
                    <Image
                      src={program.imageUrl}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-3 space-y-2">
                  <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {program.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{program.Location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{program.rating}</span>
                    </div>
                    <Badge variant="secondary">{program.duration} days</Badge>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    ${program.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
