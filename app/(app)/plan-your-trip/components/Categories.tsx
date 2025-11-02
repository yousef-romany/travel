"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface CategoriesProps {
  categories: {
    name: string;
    subcategories: {
      name: string;
      places: { id: number; name: string; image: string; price: number }[];
    }[];
  }[];
}

export default function Categories({ categories }: CategoriesProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  return (
    <Accordion type="single" collapsible className="w-full">
      {categories.map((category, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger>{category.name}</AccordionTrigger>
          <AccordionContent>
            {category.subcategories.map((subcategory, subIndex) => (
              <Button
                key={subIndex}
                variant={
                  selectedSubcategory === subcategory.name
                    ? "default"
                    : "outline"
                }
                className="w-full mb-2"
                onClick={() => setSelectedSubcategory(subcategory.name)}
              >
                {subcategory.name}
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
