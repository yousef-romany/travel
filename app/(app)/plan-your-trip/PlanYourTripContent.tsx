/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import PlaceCard from "./components/PlaceCard";
import TravelPlanItem from "./components/TravelPlanItem";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import {
  PlacesToGoBlogs,
  PlacesToGoCategory,
  PlacesToGoCategoryData,
  PlacesToGoSubcategories,
} from "@/type/placesToGo";
import { fetchPlanYourTrip } from "@/fetch/planYourTrip";
import { Badge } from "@/components/ui/badge";

export default function PlanYourTripContent() {
  const [travelPlan, setTravelPlan] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active?.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setTravelPlan((items) => {
        const oldIndex = items.findIndex(
          (item) => item?.id.toString() === active?.id
        );
        const newIndex = items.findIndex(
          (item) => item?.id.toString() === over?.id
        );

        if (oldIndex === -1) {
          const newItem = selectedSubcategory?.place_to_go_blogs?.find(
            (place) => place?.id.toString() === active?.id
          );
          if (newItem && !items.some((item) => item?.id === newItem?.id)) {
            return [
              ...items.slice(0, newIndex),
              newItem,
              ...items.slice(newIndex),
            ];
          }
        } else if (newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }

        return items;
      });
    }

    setActiveId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (over && active?.id !== over?.id) {
      const activePlace = selectedSubcategory?.place_to_go_blogs?.find(
        (place) => place?.id.toString() === active?.id
      );
      if (
        activePlace &&
        !travelPlan.some((place) => place?.id === activePlace?.id)
      ) {
        setTravelPlan((prevPlan) => [...prevPlan, activePlace]);
      }
    }
  };

  const removeFromPlan = (placeId: number) => {
    setTravelPlan((prevPlan) =>
      prevPlan.filter((place) => place?.id !== placeId)
    );
  };

  const totalPrice = travelPlan.reduce(
    (sum, place) => sum + Number(place.price),
    0
  );

  const { data, isLoading, error } = useQuery<PlacesToGoCategory>({
    queryKey: ["fetchPlanYourTrip"],
    queryFn: fetchPlanYourTrip,
  });

  const [selectedCategory, setSelectedCategory] = useState(data?.data?.at(0));
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    data?.data?.at(0)?.place_to_go_subcategories[0]
  );
  useEffect(() => {
    setSelectedCategory(data?.data?.at(0));
    setSelectedSubcategory(data?.data?.at(0)?.place_to_go_subcategories[0]);
  }, [data]);
  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="!px-[2em] mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">
          Plan Your Travel
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {data?.data?.map((category: PlacesToGoCategoryData) => (
                  <Badge
                    key={category?.id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedSubcategory(
                        category?.place_to_go_subcategories[0]
                      );
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer`}
                    variant={
                      selectedCategory?.categoryName === category.categoryName
                        ? "default"
                        : "secondary"
                    }
                  >
                    {category.categoryName}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Subcategories
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCategory?.place_to_go_subcategories.map(
                  (subcategory: PlacesToGoSubcategories) => (
                    <Badge
                      key={subcategory.categoryName}
                      onClick={() => setSelectedSubcategory(subcategory)}
                      className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer`}
                      variant={
                        selectedSubcategory?.categoryName ===
                        subcategory?.categoryName
                          ? "default"
                          : "secondary"
                      }
                    >
                      {subcategory.categoryName}
                    </Badge>
                  )
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Places
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSubcategory?.place_to_go_blogs?.map(
                  (place: PlacesToGoBlogs) => (
                    <PlaceCard
                      key={place?.id}
                      place={place}
                      isInPlan={travelPlan.some((p) => p?.id === place?.id)}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-card shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Your Travel Plan
              </h2>
              <SortableContext
                items={travelPlan.map((item) => item?.id)}
                strategy={verticalListSortingStrategy}
                disabled
              >
                {travelPlan.map((place) => (
                  <TravelPlanItem
                    key={place?.id}
                    place={place}
                    onRemove={() => {
                      removeFromPlan(place?.id);
                    }}
                  />
                ))}
              </SortableContext>
              {travelPlan.length === 0 && (
                <p className="text-primary text-center">
                  Drag and drop places here to build your plan
                </p>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xl font-semibold text-primary">
                  Total Price: ${totalPrice}
                </p>
              </div>
              <Button
                onClick={() => setTravelPlan([])}
                className="mt-4 w-full py-2 px-4 rounded transition duration-200"
              >
                Clear Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <PlaceCard
            place={
              selectedSubcategory?.place_to_go_blogs?.find(
                (place) => place?.id.toString() === activeId
              ) || travelPlan.find((place) => place?.id.toString() === activeId)
            }
            isInPlan={travelPlan.some((p) => p?.id.toString() === activeId)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
