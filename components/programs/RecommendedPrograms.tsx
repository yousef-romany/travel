"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgramType } from "@/fetch/programs";
import { getRecommendedPrograms } from "@/lib/recommendations";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, MapPin, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecommendedProgramsProps {
  currentProgram: ProgramType;
  allPrograms: ProgramType[];
  limit?: number;
}

export function RecommendedPrograms({
  currentProgram,
  allPrograms,
  limit = 4,
}: RecommendedProgramsProps) {
  const recommendations = getRecommendedPrograms(currentProgram, allPrograms, limit);

  if (recommendations.length === 0) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          You Might Also Like
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((program) => (
            <Link
              key={program.documentId}
              href={`/programs/${program.documentId}`}
              className="group block"
            >
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all hover:border-primary">
                {program.images && program.images.length > 0 && (
                  <div className="relative h-48 bg-muted">
                    <Image
                      src={
                        program.images[0].formats?.medium?.url ||
                        program.images[0].url
                      }
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary/90">
                        <Star className="h-3 w-3 fill-white mr-1" />
                        {program.rating}
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <h4 className="font-bold line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
                    {program.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{program.Location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{program.duration} days</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-xl font-bold text-primary">
                      ${program.price.toLocaleString()}
                    </p>
                    <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
