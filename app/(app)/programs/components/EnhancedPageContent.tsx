"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CardTravels from "./CardTravels";
import { useQuery } from "@tanstack/react-query";
import { fetchProgramsList, ProgramType } from "@/fetch/programs";
import Loading from "@/components/Loading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { AdvancedFilters, ActiveFilters, FilterOptions } from "@/components/programs/AdvancedFilters";
import { SortOptions, SortOption } from "@/components/programs/SortOptions";
import { SavedSearches } from "@/components/programs/SavedSearches";
import { RecentlyViewed } from "@/components/programs/RecentlyViewed";
import { persistFilterState, restoreFilterState } from "@/lib/saved-searches";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getComparisonCount } from "@/lib/comparison";
import { Badge } from "@/components/ui/badge";

// Helper function to get stagger delay class
const getStaggerDelay = (index: number): string => {
  const delay = Math.min(index * 100, 800);
  const delayClasses = {
    0: "animate-delay-0",
    100: "animate-delay-100",
    200: "animate-delay-200",
    300: "animate-delay-300",
    400: "animate-delay-400",
    500: "animate-delay-500",
    600: "animate-delay-600",
    700: "animate-delay-700",
    800: "animate-delay-800",
  } as const;
  return delayClasses[delay as keyof typeof delayClasses] || "animate-delay-0";
};

export default function EnhancedPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    duration: "all",
    difficulty: "all",
    language: "all",
    groupSize: "all",
    priceRange: [0, 5000],
  });
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [comparisonCount, setComparisonCount] = useState(0);

  const { data, error, isLoading } = useQuery<
    { data: ProgramType[]; meta: any },
    Error
  >({
    queryKey: ["fetchProgramsList"],
    queryFn: () => fetchProgramsList(100),
  });

  const [filteredPrograms, setFilteredPrograms] = useState<ProgramType[]>([]);

  // Restore filter state on mount
  useEffect(() => {
    const restored = restoreFilterState();
    if (restored) {
      if (restored.searchTerm) setSearchTerm(restored.searchTerm);
      if (restored.filters) setFilters(restored.filters);
      if (restored.sortBy) setSortBy(restored.sortBy);
    }
  }, []);

  // Persist filter state whenever it changes
  useEffect(() => {
    persistFilterState({ searchTerm, filters, sortBy });
  }, [searchTerm, filters, sortBy]);

  // Update comparison count
  useEffect(() => {
    setComparisonCount(getComparisonCount());

    const handleUpdate = () => {
      setComparisonCount(getComparisonCount());
    };

    window.addEventListener("comparisonUpdated", handleUpdate);
    return () => window.removeEventListener("comparisonUpdated", handleUpdate);
  }, []);

  // Filter and sort programs
  useEffect(() => {
    if (data?.data) {
      let filtered = data.data.filter((program: ProgramType) => {
        // Search term filter
        const matchesSearch =
          program?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program?.Location?.toLowerCase().includes(searchTerm.toLowerCase());

        // Price range filter
        const matchesPrice =
          Number(program.price) >= filters.priceRange[0] &&
          Number(program.price) <= filters.priceRange[1];

        // Duration filter
        let matchesDuration = true;
        if (filters.duration !== "all") {
          const duration = program.duration;
          if (filters.duration === "1-3") matchesDuration = duration >= 1 && duration <= 3;
          else if (filters.duration === "4-7") matchesDuration = duration >= 4 && duration <= 7;
          else if (filters.duration === "8-14") matchesDuration = duration >= 8 && duration <= 14;
          else if (filters.duration === "15+") matchesDuration = duration >= 15;
        }

        // For difficulty, language, and groupSize, you'd need these fields in your Strapi schema
        // For now, we'll just return true (all programs match)
        // TODO: Add these fields to Strapi and uncomment below
        // const matchesDifficulty = filters.difficulty === "all" || program.difficulty === filters.difficulty;
        // const matchesLanguage = filters.language === "all" || program.languages?.includes(filters.language);
        // const matchesGroupSize = filters.groupSize === "all" || program.groupSize === filters.groupSize;

        return matchesSearch && matchesPrice && matchesDuration;
      });

      // Sort programs
      filtered = sortPrograms(filtered, sortBy);

      setFilteredPrograms(filtered);
    }
  }, [searchTerm, filters, sortBy, data]);

  // Trigger scroll animations when filtered programs change
  useScrollAnimation([filteredPrograms]);

  const sortPrograms = (programs: ProgramType[], sortOption: SortOption): ProgramType[] => {
    const sorted = [...programs];

    switch (sortOption) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating-desc":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "rating-asc":
        return sorted.sort((a, b) => a.rating - b.rating);
      case "duration-asc":
        return sorted.sort((a, b) => a.duration - b.duration);
      case "duration-desc":
        return sorted.sort((a, b) => b.duration - a.duration);
      case "popularity":
        // Sort by rating first, then by price (assuming higher price = more popular)
        return sorted.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.price - a.price;
        });
      case "newest":
        // Sort by ID (assuming higher ID = newer)
        return sorted.sort((a, b) => b.id - a.id);
      case "recommended":
      default:
        // Default sorting (by rating)
        return sorted.sort((a, b) => b.rating - a.rating);
    }
  };

  const handleFilterReset = () => {
    setFilters({
      duration: "all",
      difficulty: "all",
      language: "all",
      groupSize: "all",
      priceRange: [0, 5000],
    });
    setSearchTerm("");
    setSortBy("recommended");
  };

  const handleRemoveFilter = (key: keyof FilterOptions) => {
    if (key === "priceRange") {
      setFilters({ ...filters, priceRange: [0, 5000] });
    } else {
      setFilters({ ...filters, [key]: "all" });
    }
  };

  const handleApplySavedSearch = (savedSearch: any) => {
    if (savedSearch.filters.searchTerm) setSearchTerm(savedSearch.filters.searchTerm);
    if (savedSearch.filters.priceRange) setFilters({ ...filters, priceRange: savedSearch.filters.priceRange });
    if (savedSearch.filters.duration) setFilters({ ...filters, duration: savedSearch.filters.duration });
    if (savedSearch.filters.difficulty) setFilters({ ...filters, difficulty: savedSearch.filters.difficulty });
    if (savedSearch.filters.language) setFilters({ ...filters, language: savedSearch.filters.language });
    if (savedSearch.filters.groupSize) setFilters({ ...filters, groupSize: savedSearch.filters.groupSize });
    if (savedSearch.sortBy) setSortBy(savedSearch.sortBy);
  };

  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20">
              ✨ Curated Travel Experiences
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Egypt Travel Programs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover our exciting travel programs and embark on your next Egyptian adventure with expert guides and unforgettable experiences!
          </p>
        </div>

        {/* Recently Viewed Section */}
        <div className="mb-8">
          <RecentlyViewed />
        </div>

        {/* Saved Searches Section */}
        <div className="mb-8">
          <SavedSearches
            currentFilters={{ searchTerm, ...filters }}
            currentSort={sortBy}
            onApplySearch={handleApplySavedSearch}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <AdvancedFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleFilterReset}
            />
          </div>

          {/* Programs List */}
          <div className="lg:col-span-3">
            {/* Search and Sort Bar */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary transition-all"
                    placeholder="Search by location or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <SortOptions value={sortBy} onChange={setSortBy} />
                  {comparisonCount > 0 && (
                    <Link href="/compare">
                      <Button variant="outline" className="relative">
                        Compare
                        <Badge className="ml-2">{comparisonCount}</Badge>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} />

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-primary/10 px-4 py-3 rounded-lg border border-primary/20">
                  <div className="text-3xl font-bold text-primary">{filteredPrograms.length}</div>
                  <p className="text-sm text-muted-foreground">
                    program{filteredPrograms.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
            </div>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program: ProgramType, index: number) => (
                  <div key={program.id} className={`animate-on-scroll ${getStaggerDelay(index)}`}>
                    <CardTravels
                      id={program.id}
                      documentId={program.documentId}
                      title={program.title}
                      rating={program.rating}
                      duration={program.duration}
                      Location={program.Location}
                      descraption={program.descraption}
                      price={program.price}
                      images={program.images}
                      overView={program.overView}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 animate-fade-in">
                  <div className="inline-block p-6 bg-primary/10 rounded-full mb-6">
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    No Programs Found
                  </h3>
                  <p className="text-lg text-muted-foreground mb-2">
                    We couldn&apos;t find any programs matching your criteria.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try adjusting your search terms or filters to see more options.
                  </p>
                  <Button onClick={handleFilterReset} variant="outline">
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
