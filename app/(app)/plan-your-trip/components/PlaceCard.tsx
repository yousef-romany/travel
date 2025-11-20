import { useDraggable } from "@dnd-kit/core";
import { Check } from "lucide-react";
import { PlacesToGoBlogs } from "@/type/placesToGo";
import OptimizedImage from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";

interface PlaceCardProps {
  place: PlacesToGoBlogs;
  isInPlan: boolean;
}

export default function PlaceCard({ place, isInPlan }: PlaceCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: place?.id?.toString(),
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
      className={`relative bg-muted shadow-md rounded-lg overflow-hidden cursor-move hover:shadow-lg transition duration-200 ${
        isDragging ? "opacity-50" : ""
      } ${isInPlan ? "border-2 border-green-500" : ""}`}
    >
      <OptimizedImage
        src={getImageUrl(place?.image) || "/placeholder.svg"}
        alt={place?.title || "null"}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{place?.title}</h3>
        <p className="text-gray-600">${place?.price}</p>
      </div>
      {isInPlan && (
        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
          <Check size={16} />
        </div>
      )}
    </div>
  );
}
