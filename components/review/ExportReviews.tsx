"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Testimonial } from "@/fetch/testimonials";
import { toast } from "sonner";
import { format } from "date-fns";

interface ExportReviewsProps {
  testimonials: Testimonial[];
  programTitle?: string;
}

export default function ExportReviews({ testimonials, programTitle }: ExportReviewsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const getFullName = (testimonial: Testimonial) => {
    if (testimonial.user?.profile?.firstName && testimonial.user?.profile?.lastName) {
      return `${testimonial.user.profile.firstName} ${testimonial.user.profile.lastName}`;
    }
    return testimonial.user?.username || "Anonymous";
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = ["Date", "Reviewer", "Country", "Rating", "Comment", "Verified", "Helpful Votes"];
      const rows = testimonials.map((t) => [
        format(new Date(t.createdAt), "yyyy-MM-dd"),
        getFullName(t),
        t.user?.profile?.country || "N/A",
        t.rating.toString(),
        `"${t.comment.replace(/"/g, '""')}"`, // Escape quotes
        t.isVerified ? "Yes" : "No",
        "0", // Mock helpful votes
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `reviews-${programTitle || "export"}-${format(new Date(), "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV exported successfully!");
    } catch (error) {
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        programTitle: programTitle || "All Reviews",
        totalReviews: testimonials.length,
        averageRating: (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1),
        reviews: testimonials.map((t) => ({
          id: t.documentId,
          date: t.createdAt,
          reviewer: getFullName(t),
          country: t.user?.profile?.country,
          rating: t.rating,
          comment: t.comment,
          verified: t.isVerified,
          type: t.testimonialType,
        })),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `reviews-${programTitle || "export"}-${format(new Date(), "yyyy-MM-dd")}.json`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("JSON exported successfully!");
    } catch (error) {
      toast.error("Failed to export JSON");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToText = () => {
    setIsExporting(true);
    try {
      const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);

      const textContent = [
        `${programTitle || "Reviews Export"}`,
        `Export Date: ${format(new Date(), "PPP")}`,
        `Total Reviews: ${testimonials.length}`,
        `Average Rating: ${avgRating}/5`,
        ``,
        "=" .repeat(80),
        ``,
        ...testimonials.flatMap((t) => [
          `Date: ${format(new Date(t.createdAt), "PPP")}`,
          `Reviewer: ${getFullName(t)} ${t.user?.profile?.country ? `(${t.user.profile.country})` : ""}`,
          `Rating: ${"⭐".repeat(t.rating)} (${t.rating}/5)`,
          `Verified: ${t.isVerified ? "✓ Yes" : "✗ No"}`,
          ``,
          `Comment:`,
          t.comment,
          ``,
          "-".repeat(80),
          ``,
        ]),
      ].join("\n");

      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `reviews-${programTitle || "export"}-${format(new Date(), "yyyy-MM-dd")}.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Text file exported successfully!");
    } catch (error) {
      toast.error("Failed to export text file");
    } finally {
      setIsExporting(false);
    }
  };

  if (testimonials.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting} className="gap-2">
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export Reviews
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileText className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToText}>
          <FileText className="w-4 h-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          {testimonials.length} {testimonials.length === 1 ? "review" : "reviews"} will be exported
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
