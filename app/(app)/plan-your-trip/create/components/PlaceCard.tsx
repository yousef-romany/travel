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
        className="w-full h-28 sm:h-32 md:h-36 object-cover"
      />
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-2 leading-tight">{place?.title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">${place?.price}</p>
      </div>
      {isInPlan && (
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-green-500 text-white p-1 sm:p-1.5 rounded-full shadow-lg">
          <Check size={14} className="sm:w-4 sm:h-4" />
        </div>
      )}
    </div>
  );
}
