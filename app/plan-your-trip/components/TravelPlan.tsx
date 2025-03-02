/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"

interface Place {
  id: number
  name: string
  image: string
  price: number
}

function SortablePlace({ place }: { place: Place }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: place.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-2 mb-2 bg-white border rounded shadow"
    >
      <span>{place.name}</span>
      <span>${place.price}</span>
    </div>
  )
}

export default function TravelPlan() {
  const [places, setPlaces] = useState<Place[]>([])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over.id) {
      setPlaces((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  function handleDragOver(event: any) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const activePlace = active.data.current
      if (activePlace && !places.find((place) => place.id === activePlace.id)) {
        setPlaces((prevPlaces) => [...prevPlaces, activePlace])
      }
    }
  }

  const totalPrice = places.reduce((sum, place) => sum + place.price, 0)

  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-bold mb-4">Your Travel Plan</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext items={places} strategy={verticalListSortingStrategy}>
          {places.map((place) => (
            <SortablePlace key={place.id} place={place} />
          ))}
        </SortableContext>
      </DndContext>
      <div className="mt-4">
        <strong>Total Price: ${totalPrice}</strong>
      </div>
      <Button className="mt-4" onClick={() => setPlaces([])}>
        Clear Plan
      </Button>
    </div>
  )
}

