"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import CardTravels from "./CardTravels";
import { useQuery } from "@tanstack/react-query";
import { fetchProgramsList } from "@/fetch/programs";
import Loading from "@/components/Loading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Helper function to get stagger delay class
const getStaggerDelay = (index: number): string => {
  const delay = Math.min(index * 100, 800);
  const delayClasses = {
    0: "animate-delay-0",
    100: "animate-delay-100",
    200: "animate-delay-200",
    300: "animate-delay-300",
    400: "animate-delay-400",
    500: "animate-delay-500",
    600: "animate-delay-600",
    700: "animate-delay-700",
    800: "animate-delay-800",
  } as const;
  return delayClasses[delay as keyof typeof delayClasses] || "animate-delay-0";
};

// Updated types for Media
interface MediaFormat {
  url: string;
  width: number;
  height: number;
}

interface Media {
  id: number;
  name: string;
  url: string;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
}

export interface ProgramType {
  id: number;
  documentId: string;
  title: string;
  descraption: string;
  Location: string;
  duration: number;
  price: number;
  rating: number;
  overView: string;
  images: Media[];
}

interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export default function PageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const { data, error, isLoading } = useQuery<
    { data: ProgramType[]; meta: Meta },
    Error
  >({
    queryKey: ["fetchProgramsList"],
    queryFn: () => fetchProgramsList(100),
  });

  const [filteredPrograms, setFilteredPrograms] = useState<ProgramType[]>([]);

  // Update filteredPrograms when data changes
  useEffect(() => {
    if (data?.data) {
      setFilteredPrograms(data.data);
    }
  }, [data]);

  // Filter programs based on search term and price range
  useEffect(() => {
    if (data?.data) {
      const filtered = data.data.filter(
        (program: ProgramType) =>
          (program?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program?.Location?.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) &&
          Number(program.price) >= priceRange[0] &&
          Number(program.price) <= priceRange[1]
      );
      setFilteredPrograms(filtered);
    }
  }, [searchTerm, priceRange, data]);

  // Trigger scroll animations when filtered programs change
  useScrollAnimation([filteredPrograms]);

  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20">
              ✨ Curated Travel Experiences
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Egypt Travel Programs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover our exciting travel programs and embark on your next Egyptian adventure with expert guides and unforgettable experiences!
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-12 animate-slide-up animate-delay-200">
          <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold mb-2">Search Programs</label>
                <Input
                  className="w-full bg-background/50 border-primary/20 focus:border-primary transition-all"
                  placeholder="Search by location or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 bg-primary/10 px-4 py-3 rounded-lg border border-primary/20">
                <div className="text-3xl font-bold text-primary">{filteredPrograms.length}</div>
                <p className="text-sm text-muted-foreground">
                  program{filteredPrograms.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <label className="block text-sm font-semibold mb-4">
                Price Range: <span className="text-primary">${priceRange[0]} - ${priceRange[1]}</span>
              </label>
              <Slider
                min={0}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
                className="max-w-2xl"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program: ProgramType, index: number) => (
              <div key={program.id} className={`animate-on-scroll ${getStaggerDelay(index)}`}>
                <CardTravels
                  id={program.id}
                  documentId={program.documentId}
                  title={program.title}
                  rating={program.rating}
                  duration={program.duration}
                  Location={program.Location}
                  descraption={program.descraption}
                  price={program.price}
                  images={program.images}
                  overView={program.overView}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 animate-fade-in">
              <div className="inline-block p-6 bg-primary/10 rounded-full mb-6">
                <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                No Programs Found
              </h3>
              <p className="text-lg text-muted-foreground mb-2">
                We couldn't find any programs matching your criteria.
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or price range to see more options.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
