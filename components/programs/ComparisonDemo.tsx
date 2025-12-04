"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Star, Clock, DollarSign, MapPin, Plus, Check, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProgramsList } from "@/fetch/programs";
import { getImageUrl } from "@/lib/utils";

interface DemoProgram {
  documentId: string;
  title: string;
  price: number;
  duration: number;
  rating: number;
  Location: string;
  images: any[];
}

export function ComparisonDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const [demoPrograms, setDemoPrograms] = useState<DemoProgram[]>([]);

  // Fetch programs from Strapi
  const { data: programsData, isLoading, isError } = useQuery({
    queryKey: ["comparisonDemoPrograms"],
    queryFn: fetchProgramsList,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (programsData?.data) {
      setDemoPrograms(programsData.data.slice(0, 3));
    }
  }, [programsData]);

  const toggleProgram = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((sid) => sid !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="p-4 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !demoPrograms.length) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card className="border-2 border-destructive/20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Unable to load programs for comparison demo
            </p>
            <Link href="/programs">
              <Button>Browse All Programs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Instruction Header */}
      <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <GitCompare className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">How It Works</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Click the "+" button on up to 3 programs below</li>
                <li>See your selected programs highlighted with a checkmark</li>
                <li>Click "Compare Selected" to see them side-by-side</li>
                <li>Use comparison to make the best decision for your trip!</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {demoPrograms.map((program) => {
          const isSelected = selected.includes(program.documentId);
          const imageUrl = program.images?.[0] ? getImageUrl(program.images[0]) : null;

          return (
            <Card
              key={program.documentId}
              className={`relative overflow-hidden transition-all ${
                isSelected
                  ? "border-2 border-primary shadow-lg scale-105"
                  : "border hover:shadow-md"
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <Badge
                  variant="default"
                  className="absolute top-2 left-2 z-10 gap-1"
                >
                  <Check className="h-3 w-3" />
                  Selected
                </Badge>
              )}

              {/* Add/Remove Button */}
              <Button
                size="icon"
                variant={isSelected ? "destructive" : "default"}
                className="absolute top-2 right-2 z-10 h-8 w-8"
                onClick={() => toggleProgram(program.documentId)}
                disabled={!isSelected && selected.length >= 3}
              >
                {isSelected ? (
                  <span className="text-lg font-bold">×</span>
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>

              {/* Program Image */}
              <div className="relative h-48 w-full bg-muted">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={program.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Program Info */}
              <CardContent className="p-4 space-y-3">
                <h3 className="font-bold text-lg line-clamp-1">{program.title}</h3>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-primary">
                      ${program.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{program.duration} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{program.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="text-xs truncate">{program.Location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {selected.length > 0 && (
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground mb-2">
              {selected.length} program{selected.length !== 1 ? "s" : ""} selected
              {selected.length < 3 && ` • Add ${3 - selected.length} more`}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {selected.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelected([])}
            >
              Clear Selection
            </Button>
          )}

          {selected.length >= 2 ? (
            <Link href="/compare">
              <Button size="lg" className="gap-2">
                <GitCompare className="h-4 w-4" />
                Compare {selected.length} Programs
              </Button>
            </Link>
          ) : (
            <Button size="lg" disabled className="gap-2">
              <GitCompare className="h-4 w-4" />
              Select at least 2 programs
            </Button>
          )}
        </div>
      </div>

      {/* Pro Tip */}
      {selected.length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium">Pro tip:</span> On actual program pages, click the "Compare" button to add programs to your comparison list
          </p>
        </div>
      )}
    </div>
  );
}
