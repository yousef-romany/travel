"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Check } from "lucide-react";
import {
  addToComparison,
  removeFromComparison,
  isInComparison,
  ComparisonProgram,
} from "@/lib/comparison";
import { toast } from "sonner";

interface CompareButtonProps {
  program: Omit<ComparisonProgram, "addedAt">;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CompareButton({ program, variant = "outline", size = "default", className }: CompareButtonProps) {
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    setIsInList(isInComparison(program.documentId));

    // Listen for storage changes
    const handleStorageChange = () => {
      setIsInList(isInComparison(program.documentId));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("comparisonUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("comparisonUpdated", handleStorageChange);
    };
  }, [program.documentId]);

  const handleToggle = () => {
    try {
      console.log("CompareButton clicked for program:", program.documentId, program.title);

      if (isInList) {
        removeFromComparison(program.documentId);
        setIsInList(false);
        toast.info("Removed from comparison");
        console.log("Removed from comparison");
      } else {
        console.log("Adding to comparison:", program);
        const added = addToComparison(program);
        console.log("Add result:", added);
        if (added) {
          setIsInList(true);
          toast.success("Added to comparison");
          console.log("Successfully added to comparison");
        } else {
          console.log("Failed to add - already in list");
        }
      }

      // Dispatch custom event to update other components
      window.dispatchEvent(new Event("comparisonUpdated"));

      // Log localStorage state
      const stored = localStorage.getItem("programComparison");
      console.log("Current comparison list:", stored);
    } catch (error: any) {
      console.error("Error in comparison:", error);
      toast.error(error.message || "Error updating comparison");
    }
  };

  return (
    <Button
      variant={isInList ? "default" : variant}
      size={size}
      onClick={handleToggle}
      className={`gap-2 ${className || ""}`}
    >
      {isInList ? (
        <>
          <Check className="h-4 w-4" />
          In Comparison
        </>
      ) : (
        <>
          <GitCompare className="h-4 w-4" />
          Compare
        </>
      )}
    </Button>
  );
}
