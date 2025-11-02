import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import  { PlacesToGoBlogs }  from "@/type/placesToGo";

interface TravelPlanItemProps {
  place: PlacesToGoBlogs;
  onRemove: () => void;
}

export default function TravelPlanItem({
  place,
  onRemove,
}: TravelPlanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between p-3 mb-2 bg-muted rounded-lg cursor-move hover:bg-gray-200 transition duration-200 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span className="text-primary font-medium">{place?.title}</span>
      <div className="flex items-center">
        <span className="text-primary mr-2">${place?.price}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-red-500 hover:text-red-700 transition duration-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
