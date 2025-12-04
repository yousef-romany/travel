import { memo, useState, useEffect } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RiMenu2Fill } from "react-icons/ri";
import { Sparkles, MapPin, Calendar, Compass, GitCompare } from "lucide-react";
import { getComparisonCount } from "@/lib/comparison";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CardCategory from "./CardCategory";
import { InspirationCategoryData } from "@/type/inspiration";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface MenuProps {
  categories: InspirationCategoryData[];
  placesTogCategorie: InspirationCategoryData[];
}

const Menu = ({ categories, placesTogCategorie }: MenuProps) => {
  const [comparisonCount, setComparisonCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setComparisonCount(getComparisonCount());
    };

    updateCount();
    window.addEventListener("comparisonUpdated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("comparisonUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden md:flex sm:flex border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all"
        >
          <RiMenu2Fill className="text-primary h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] sm:w-[380px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Explore
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
          <div className="space-y-2">
            {/* Accordion Menu */}
            <Accordion type="single" collapsible className="w-full">
              {/* Be Inspired Section */}
              <AccordionItem value="inspired" className="border-primary/10">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-base font-semibold">Be Inspired</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 pt-2 space-y-2">
                    {categories.length > 0 ? (
                      categories.map((category: InspirationCategoryData) => (
                        <Link
                          key={category.id}
                          href={`/inspiration/${category.categoryName}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
                        >
                          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={getImageUrl(category.image)}
                              alt={category.categoryName}
                              fill
                              sizes="48px"
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">
                            {category.categoryName}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground pl-3">No categories available</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Places To Go Section */}
              <AccordionItem value="places" className="border-primary/10">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <MapPin className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-base font-semibold">Places To Go</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 pt-2 space-y-2">
                    {placesTogCategorie.length > 0 ? (
                      placesTogCategorie.map((category: InspirationCategoryData) => (
                        <Link
                          key={category.id}
                          href={`/placesTogo/${category.categoryName}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
                        >
                          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={getImageUrl(category.image)}
                              alt={category.categoryName}
                              fill
                              sizes="48px"
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">
                            {category.categoryName}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground pl-3">No places available</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator className="my-4" />

            {/* Direct Links */}
            <div className="space-y-1">
              <Link
                href="/plan-your-trip"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Compass className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Plan Your Trip
                </span>
              </Link>

              <Link
                href="/programs"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all group"
              >
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Programs
                </span>
              </Link>

              <Link
                href="/compare"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all group relative"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <GitCompare className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Compare Programs
                </span>
                {comparisonCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-auto h-5 px-2 text-[10px] font-bold"
                  >
                    {comparisonCount}
                  </Badge>
                )}
              </Link>

              <Link
                href="/events"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all group"
              >
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Events
                </span>
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
export default memo(Menu);
