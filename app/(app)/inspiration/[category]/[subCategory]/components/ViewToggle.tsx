"use client";

import { Button } from "@/components/ui/button";
import { CiGrid41, CiGrid2H } from "react-icons/ci";

export default function ViewToggle({
  view,
  setView,
}: {
  view: string;
  setView: (view: string) => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <Button
        onClick={() => setView("grid")}
        className={`transition-all duration-300 ${view === "grid" ? "bg-primary text-white shadow-lg" : "bg-background hover:bg-muted text-foreground border-input"}`}
        variant={view === "grid" ? "default" : "outline"}
        size="sm"
      >
        <CiGrid41 className="w-4 h-4 md:w-5 md:h-5" />
        <span className="ml-2 hidden sm:inline text-xs md:text-sm font-medium">Grid</span>
      </Button>
      <Button
        onClick={() => setView("flex")}
        className={`transition-all duration-300 ${view === "flex" ? "bg-primary text-white shadow-lg" : "bg-background hover:bg-muted text-foreground border-input"}`}
        variant={view === "flex" ? "default" : "outline"}
        size="sm"
      >
        <CiGrid2H className="w-4 h-4 md:w-5 md:h-5" />
        <span className="ml-2 hidden sm:inline text-xs md:text-sm font-medium">List</span>
      </Button>
    </div>
  );
}
