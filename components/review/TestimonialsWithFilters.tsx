"use client";

import { useState } from "react";
import Testimonials from "@/components/testimonials";
import TestimonialFilters from "./TestimonialFilters";
import { Testimonial } from "@/fetch/testimonials";

interface TestimonialsWithFiltersProps {
  testimonials: Testimonial[];
  showRelatedContent?: boolean;
}

export default function TestimonialsWithFilters({
  testimonials,
  showRelatedContent = false,
}: TestimonialsWithFiltersProps) {
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>(testimonials);

  const handleFilterChange = (filtered: Testimonial[]) => {
    setFilteredTestimonials(filtered);
  };

  return (
    <div>
      {testimonials.length > 1 && (
        <TestimonialFilters
          testimonials={testimonials}
          onFilterChange={handleFilterChange}
        />
      )}

      <Testimonials
        testimonials={filteredTestimonials}
        showRelatedContent={showRelatedContent}
      />

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No reviews match your filters. Try adjusting your selection.
        </div>
      )}
    </div>
  );
}
