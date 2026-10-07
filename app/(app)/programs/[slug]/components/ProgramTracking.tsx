"use client";
import { useEffect } from "react";
import { trackProgramView } from "@/lib/analytics";
import { addToRecentlyViewed } from "@/lib/recently-viewed";
import { getImageUrl } from "@/lib/utils";
import { dataTypeCardTravel } from "@/type/programs";

interface ProgramTrackingProps {
  program: dataTypeCardTravel;
}

export function ProgramTracking({ program }: ProgramTrackingProps) {
  useEffect(() => {
    if (program?.title && program?.documentId) {
      // Track program view
      trackProgramView(program.title, program.documentId);

      // Add to recently viewed
      const firstImage = program.images?.[0];
      const imageUrl = firstImage?.imageUrl
        ? getImageUrl(firstImage.imageUrl)
        : (firstImage ? getImageUrl(firstImage as any) : undefined);

      addToRecentlyViewed({
        id: program.id || 0,
        documentId: program.documentId,
        title: program.title,
        price: Number(program.price) || 0,
        duration: Number(program.duration) || 1,
        Location: program.Location || "Egypt",
        rating: Number(program.rating) || 5,
        imageUrl: imageUrl,
      });
    }
  }, [program]);

  return null; // This component only handles side effects
}
