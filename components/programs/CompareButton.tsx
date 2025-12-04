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
}

export function CompareButton({ program, variant = "outline", size = "default" }: CompareButtonProps) {
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
      if (isInList) {
        removeFromComparison(program.documentId);
        setIsInList(false);
        toast.info("Removed from comparison");
      } else {
        const added = addToComparison(program);
        if (added) {
          setIsInList(true);
          toast.success("Added to comparison");
        }
      }

      // Dispatch custom event to update other components
      window.dispatchEvent(new Event("comparisonUpdated"));
    } catch (error: any) {
      toast.error(error.message || "Error updating comparison");
    }
  };

  return (
    <Button
      variant={isInList ? "default" : variant}
      size={size}
      onClick={handleToggle}
      className="gap-2"
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
