"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import CardTravels from "./CardTravels";
import { useQuery } from "@tanstack/react-query";
import { fetchProgramsList } from "@/fetch/programs";
import Loading from "@/components/Loading";

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
    queryFn: fetchProgramsList,
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
            program?.Location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          Number(program.price) >= priceRange[0] &&
          Number(program.price) <= priceRange[1]
      );
      setFilteredPrograms(filtered);
    }
  }, [searchTerm, priceRange, data]);

  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full mx-auto py-8 !px-[2em]">
      <h1 className="text-4xl font-bold mb-4 text-center">Travel Programs</h1>
      <p className="text-xl text-center mb-8">
        Discover our exciting travel programs and embark on your next adventure!
      </p>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Input
          className="max-w-xs"
          placeholder="Search by location or title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          {filteredPrograms.length} program{filteredPrograms.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program: ProgramType) => (
            <CardTravels
              key={program.id}
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
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">No programs found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or price range.</p>
          </div>
        )}
      </div>
    </div>
  );
}