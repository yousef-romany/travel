"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { dataTypeCardTravel } from "@/type/programs";
import CardTravels from "./CardTravels";

const travelPrograms = [
  {
    title: "European Adventure",
    description: "Explore the rich history and diverse cultures of Europe",
    duration: "14 days",
    price: 3499,
    location: "Europe",
    rating: 4.5,
    images: [
      "/placeholder.svg?height=300&width=400&text=Paris",
      "/placeholder.svg?height=300&width=400&text=Rome",
      "/placeholder.svg?height=300&width=400&text=Barcelona",
    ],
  },
  {
    title: "African Safari",
    description:
      "Experience the wildlife and breathtaking landscapes of Africa",
    duration: "10 days",
    price: 4299,
    location: "Africa",
    rating: 4.8,
    images: [
      "/placeholder.svg?height=300&width=400&text=Serengeti",
      "/placeholder.svg?height=300&width=400&text=Kruger",
      "/placeholder.svg?height=300&width=400&text=Masai Mara",
    ],
  },
  {
    title: "Caribbean Cruise",
    description:
      "Relax and unwind on a luxurious Caribbean island-hopping cruise",
    duration: "7 days",
    price: 1899,
    location: "Caribbean",
    rating: 4.2,
    images: [
      "/placeholder.svg?height=300&width=400&text=Bahamas",
      "/placeholder.svg?height=300&width=400&text=Jamaica",
      "/placeholder.svg?height=300&width=400&text=St. Lucia",
    ],
  },
  {
    title: "Asian Expedition",
    description: "Discover the ancient traditions and modern marvels of Asia",
    duration: "16 days",
    price: 3999,
    location: "Asia",
    rating: 4.6,
    images: [
      "/placeholder.svg?height=300&width=400&text=Tokyo",
      "/placeholder.svg?height=300&width=400&text=Bangkok",
      "/placeholder.svg?height=300&width=400&text=Singapore",
    ],
  },
];

export default function PageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [filteredPrograms, setFilteredPrograms] = useState(travelPrograms);

  useEffect(() => {
    const filtered = travelPrograms.filter(
      (program) =>
        program.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
        program.price >= priceRange[0] &&
        program.price <= priceRange[1]
    );
    setFilteredPrograms(filtered);
  }, [searchTerm, priceRange]);

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
        {filteredPrograms.map((program: dataTypeCardTravel, index: number) => (
          <CardTravels
            key={index}
            title={program.title}
            rating={program.rating}
            duration={program.duration}
            location={program.location}
            description={program.description}
            price={program.price}
            images={program.images}
          />
        ))}
      </div>
    </div>
  );
}
