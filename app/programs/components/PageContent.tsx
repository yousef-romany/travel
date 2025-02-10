"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { dataTypeCardTravel } from "@/type/programs";
import CardTravels from "./CardTravels";
import { useQuery } from "@tanstack/react-query";
import { fetchProgramsList } from "@/fetch/programs";
import Loading from "@/components/Loading";
import { meta } from "@/type/placesToGo";

export default function PageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const { data, error, isLoading } = useQuery<
    { data: dataTypeCardTravel[]; meta: meta },
    Error
  >({
    queryKey: ["fetchProgramsList"],
    queryFn: fetchProgramsList,
  });

  const [filteredPrograms, setFilteredPrograms] = useState<dataTypeCardTravel[]>(
    []
  );

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
        (program: dataTypeCardTravel) =>
          program?.Location.toLowerCase().includes(searchTerm.toLowerCase()) &&
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

      <div className="flex justify-between items-center mb-6">
        <Input
          className="max-w-xs"
          placeholder="Search by location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program: dataTypeCardTravel, index: number) => (
            <CardTravels
              key={index}
              title={program.title}
              rating={program.rating}
              duration={program.duration}
              Location={program.Location}
              descraption={program.descraption}
              price={program.price}
              images={program.images}
            />
          ))
        ) : (
          <p>No programs found.</p>
        )}
      </div>
    </div>
  );
}