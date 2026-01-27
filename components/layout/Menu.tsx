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
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();

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

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden md:flex sm:flex hover:bg-primary/10 transition-all rounded-full h-10 w-10 sticky top-0"
        >
          <RiMenu2Fill className="text-foreground h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[320px] sm:w-[380px] border-r border-border/40 bg-background/95 backdrop-blur-xl p-0"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-2 border-b border-border/10">
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent text-left">
              Explore
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Link
                  href="/programs"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-500/5 transition-all group border border-transparent hover:border-green-500/10"
                  onClick={handleLinkClick}
                >
                  <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-base font-medium group-hover:text-green-600 transition-colors">
                    Programs
                  </span>
                </Link>

                <Link
                  href="/plan-your-trip"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/5 transition-all group border border-transparent hover:border-blue-500/10"
                  onClick={handleLinkClick}
                >
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Compass className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-base font-medium group-hover:text-blue-600 transition-colors">
                    Plan Your Trip
                  </span>
                </Link>
              </div>

              {/* Accordion Menu */}
              <Accordion type="single" collapsible className="w-full space-y-2">
                {/* Places To Go Section */}
                <AccordionItem
                  value="places"
                  className="border-none bg-amber-500/5 rounded-xl px-2"
                >
                  <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-lg hover:bg-amber-500/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <MapPin className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-base font-semibold">
                        Places To Go
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-2 pt-2 pb-2 space-y-1">
                      {placesTogCategorie.length > 0 ? (
                        placesTogCategorie.map(
                          (category: InspirationCategoryData) => (
                            <Link
                              key={category.id}
                              href={`/placesTogo/${category.categoryName}`}
                              onClick={handleLinkClick}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-500/5 transition-colors group"
                            >
                              <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border border-border/20">
                                <Image
                                  src={getImageUrl(category.image)}
                                  alt={category.categoryName}
                                  fill
                                  sizes="40px"
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <span className="text-sm font-medium group-hover:text-amber-600 transition-colors">
                                {category.categoryName}
                              </span>
                            </Link>
                          ),
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground pl-3">
                          No places available
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <Link
                  href="/compare"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-500/5 transition-all group border border-transparent hover:border-orange-500/10"
                  onClick={handleLinkClick}
                >
                  <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                    <GitCompare className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-base font-medium group-hover:text-orange-600 transition-colors flex-1">
                    Compare Programs
                  </span>
                  {comparisonCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="h-5 px-2 text-[10px] font-bold"
                    >
                      {comparisonCount}
                    </Badge>
                  )}
                </Link>

                {/* Be Inspired Section */}
                <AccordionItem
                  value="inspired"
                  className="border-none bg-accent/5 rounded-xl px-2"
                >
                  <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-lg hover:bg-accent/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-base font-semibold">
                        Be Inspired
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-2 pt-2 pb-2 space-y-1">
                      {categories.length > 0 ? (
                        categories.map((category: InspirationCategoryData) => (
                          <Link
                            key={category.id}
                            href={`/inspiration/${category.categoryName}`}
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors group"
                          >
                            <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border border-border/20">
                              <Image
                                src={getImageUrl(category.image)}
                                alt={category.categoryName}
                                fill
                                sizes="40px"
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                              {category.categoryName}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground pl-3">
                          No categories available
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator className="bg-border/40" />

              {/* Direct Links */}
              <div className="space-y-2">
                <Link
                  href="/events"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/5 transition-all group border border-transparent hover:border-purple-500/10"
                  onClick={handleLinkClick}
                >
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-base font-medium group-hover:text-purple-600 transition-colors">
                    Events
                  </span>
                </Link>
              </div>
            </div>
          </ScrollArea>

          {/* Footer Area in Menu */}
          <div className="p-4 border-t border-border/10 bg-accent/5">
            <p className="text-xs text-center text-muted-foreground">
              © {currentYear} Zoe Holidays
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default memo(Menu);
