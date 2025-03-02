"use client";

import { useState, useEffect } from "react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useDraggable } from "@dnd-kit/core";
import OptimizedImage from "@/components/OptimizedImage";
export const travelData = {
  categories: [
    {
      name: "Historical Sites",
      color: "bg-amber-100",
      subcategories: [
        {
          name: "Ancient Temples",
          places: [
            {
              id: 1,
              name: "Luxor Temple",
              image: "/placeholder.svg?height=100&width=100",
              price: 50,
            },
            {
              id: 2,
              name: "Karnak Temple",
              image: "/placeholder.svg?height=100&width=100",
              price: 60,
            },
            {
              id: 3,
              name: "Hatshepsut Temple",
              image: "/placeholder.svg?height=100&width=100",
              price: 45,
            },
          ],
        },
        {
          name: "Museums",
          places: [
            {
              id: 4,
              name: "Egyptian Museum",
              image: "/placeholder.svg?height=100&width=100",
              price: 40,
            },
            {
              id: 5,
              name: "Luxor Museum",
              image: "/placeholder.svg?height=100&width=100",
              price: 30,
            },
            {
              id: 6,
              name: "Mummification Museum",
              image: "/placeholder.svg?height=100&width=100",
              price: 25,
            },
          ],
        },
      ],
    },
    {
      name: "Natural Attractions",
      color: "bg-emerald-100",
      subcategories: [
        {
          name: "Nile River",
          places: [
            {
              id: 7,
              name: "Nile Cruise",
              image: "/placeholder.svg?height=100&width=100",
              price: 100,
            },
            {
              id: 8,
              name: "Felucca Ride",
              image: "/placeholder.svg?height=100&width=100",
              price: 30,
            },
          ],
        },
        {
          name: "Desert Experiences",
          places: [
            {
              id: 9,
              name: "Valley of the Kings",
              image: "/placeholder.svg?height=100&width=100",
              price: 65,
            },
            {
              id: 10,
              name: "Hot Air Balloon Ride",
              image: "/placeholder.svg?height=100&width=100",
              price: 120,
            },
          ],
        },
      ],
    },
    {
      name: "Food and Dining",
      color: "bg-rose-100",
      subcategories: [
        {
          name: "Local Cuisine",
          places: [
            {
              id: 11,
              name: "Sofra Restaurant",
              image: "/placeholder.svg?height=100&width=100",
              price: 25,
            },
            {
              id: 12,
              name: "Aisha Restaurant",
              image: "/placeholder.svg?height=100&width=100",
              price: 20,
            },
          ],
        },
        {
          name: "International Options",
          places: [
            {
              id: 13,
              name: "Pizza Roma-it",
              image: "/placeholder.svg?height=100&width=100",
              price: 15,
            },
            {
              id: 14,
              name: "Jewel of India",
              image: "/placeholder.svg?height=100&width=100",
              price: 18,
            },
          ],
        },
      ],
    },
  ],
};

interface Place {
  id: number;
  name: string;
  image: string;
  price: number;
}

function DraggablePlace({ place }: { place: Place }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: place.id.toString(),
    data: place,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center space-x-2 p-2 border rounded cursor-move"
    >
      <DragHandleDots2Icon className="h-5 w-5" />
      <OptimizedImage
        src={place.image || "/placeholder.svg"}
        alt={place.name}
        
        className="rounded"
      />
      <span>{place.name}</span>
    </div>
  );
}

export default function PlacesList() {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const allPlaces = travelData.categories.flatMap((category) =>
      category.subcategories.flatMap((subcategory) => subcategory.places)
    );
    setPlaces(allPlaces);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {places.map((place) => (
        <DraggablePlace key={place.id} place={place} />
      ))}
    </div>
  );
}
