"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getSavedSearches,
  deleteSavedSearch,
  markSearchAsUsed,
  saveSearch,
  SavedSearch,
} from "@/lib/saved-searches";
import { Bookmark, Trash2, Clock, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SavedSearchesProps {
  currentFilters?: any;
  currentSort?: string;
  onApplySearch?: (search: SavedSearch) => void;
}

export function SavedSearches({
  currentFilters,
  currentSort,
  onApplySearch,
}: SavedSearchesProps) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [searchName, setSearchName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = () => {
    setSearches(getSavedSearches());
  };

  const handleSaveCurrentSearch = () => {
    if (!searchName.trim()) {
      toast.error("Please enter a name for this search");
      return;
    }

    try {
      saveSearch(searchName.trim(), currentFilters || {}, currentSort);
      toast.success("Search saved successfully!");
      setSearchName("");
      setIsDialogOpen(false);
      loadSearches();
    } catch (error) {
      toast.error("Failed to save search");
    }
  };

  const handleApplySearch = (search: SavedSearch) => {
    markSearchAsUsed(search.id);
    loadSearches();

    if (onApplySearch) {
      onApplySearch(search);
    }

    toast.success(`Applied search: ${search.name}`);
  };

  const handleDeleteSearch = (id: string, name: string) => {
    deleteSavedSearch(id);
    loadSearches();
    toast.info(`Deleted search: ${name}`);
  };

  const getFilterSummary = (filters: SavedSearch["filters"]): string => {
    const parts: string[] = [];

    if (filters.searchTerm) parts.push(`"${filters.searchTerm}"`);
    if (filters.priceRange) parts.push(`$${filters.priceRange[0]}-$${filters.priceRange[1]}`);
    if (filters.duration && filters.duration !== "all") parts.push(filters.duration + " days");
    if (filters.difficulty && filters.difficulty !== "all") parts.push(filters.difficulty);
    if (filters.language && filters.language !== "all") parts.push(filters.language);
    if (filters.location) parts.push(filters.location);

    return parts.length > 0 ? parts.join(" • ") : "No filters";
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (searches.length === 0 && !currentFilters) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Saved Searches
            </CardTitle>
            <CardDescription>
              Quick access to your favorite search criteria
            </CardDescription>
          </div>
          {currentFilters && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Save Current
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Current Search</DialogTitle>
                  <DialogDescription>
                    Save your current filters and sort settings for quick access later.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-name">Search Name</Label>
                    <Input
                      id="search-name"
                      placeholder="e.g., 5-day Cairo tours under $500"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveCurrentSearch();
                        }
                      }}
                    />
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <p className="font-medium mb-1">Current Filters:</p>
                    <p className="text-muted-foreground">
                      {getFilterSummary(currentFilters)}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCurrentSearch}>
                    Save Search
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {searches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No saved searches yet.</p>
            <p className="text-sm mt-1">
              Apply some filters and click &quot;Save Current&quot; to save your search.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {searches.map((search) => (
              <div
                key={search.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:border-primary transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">{search.name}</h4>
                    {search.lastUsed && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeAgo(search.lastUsed)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {getFilterSummary(search.filters)}
                  </p>
                  {search.sortBy && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Sort: {search.sortBy}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Saved {getTimeAgo(search.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleApplySearch(search)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteSearch(search.id, search.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
