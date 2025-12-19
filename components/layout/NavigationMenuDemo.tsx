"use client";

import * as React from "react";
import Link from "next/link";
import { cn, getImageUrl } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { InspirationCategoryData } from "@/type/inspiration";
import { Skeleton } from "../ui/skeleton";
import ProgressiveImage from "../ProgressiveImage";
import { Sparkles, MapPin } from "lucide-react";

const ScrollProgressBar = ({ containerRef }: { containerRef: React.RefObject<HTMLUListElement | null> }) => {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 overflow-hidden z-10 rounded-t-xl">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ease-out shadow-lg shadow-primary/50 relative overflow-hidden"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: `0 0 12px 2px rgba(var(--primary), ${scrollProgress / 100})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

const InspiredMenuContent = ({ categories }: { categories: InspirationCategoryData[] }) => {
  const scrollRef = React.useRef<HTMLUListElement>(null);

  return (
    <div className="relative">
      <ScrollProgressBar containerRef={scrollRef} />
      <ul
        ref={scrollRef}
        className="grid gap-4 p-6 pt-8 w-[600px] md:w-[680px] lg:w-[900px] md:grid-cols-2 lg:grid-cols-3 max-h-[70vh] overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
      >
        {categories.length > 0
          ? categories?.map((category: InspirationCategoryData) => (
              <ListItem
                key={category.id}
                href={`/inspiration/${category.categoryName}`}
                title={category.categoryName}
                className="text-primary group"
              >
                <div className="flex flex-col gap-3 text-primary">
                  {category?.image ? (
                    <div className="relative overflow-hidden rounded-xl h-[140px] md:h-[150px] lg:h-[160px] w-full">
                      <ProgressiveImage
                        src={getImageUrl(category.image)}
                        alt={category.categoryName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 900px) 50vw, 300px"
                        quality={80}
                        priority={false}
                        objectFit="cover"
                        className="rounded-xl transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    </div>
                  ) : (
                    <Skeleton className="h-[140px] md:h-[150px] lg:h-[160px] w-full rounded-xl" />
                  )}
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                    {category.description}
                  </p>
                </div>
              </ListItem>
            ))
          : "No Data found."}
      </ul>
    </div>
  );
};

const PlacesToGoMenuContent = ({ categories }: { categories: InspirationCategoryData[] }) => {
  const scrollRef = React.useRef<HTMLUListElement>(null);

  return (
    <div className="relative">
      <ScrollProgressBar containerRef={scrollRef} />
      <ul
        ref={scrollRef}
        className="grid gap-4 p-6 pt-8 w-[600px] md:w-[680px] lg:w-[900px] md:grid-cols-2 lg:grid-cols-3 max-h-[70vh] overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
      >
        {categories.length > 0
          ? categories?.map((category: InspirationCategoryData) => (
              <ListItem
                key={category.id}
                href={`/placesTogo/${category.categoryName}`}
                title={category.categoryName}
                className="text-primary group"
              >
                <div className="flex flex-col gap-3 text-primary">
                  {category?.image ? (
                    <div className="relative overflow-hidden rounded-xl h-[140px] md:h-[150px] lg:h-[160px] w-full">
                      <ProgressiveImage
                        src={getImageUrl(category.image)}
                        alt={category.categoryName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 900px) 50vw, 300px"
                        quality={80}
                        priority={false}
                        objectFit="cover"
                        className="rounded-xl transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    </div>
                  ) : (
                    <Skeleton className="h-[140px] md:h-[150px] lg:h-[160px] w-full rounded-xl" />
                  )}
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                    {category.description}
                  </p>
                </div>
              </ListItem>
            ))
          : "No Data found."}
      </ul>
    </div>
  );
};

interface MenuProps {
  categories: InspirationCategoryData[];
  placesTogCategorie: InspirationCategoryData[];
}
export function NavigationMenuDemo({
  categories,
  placesTogCategorie,
}: MenuProps) {
  return (
    <NavigationMenu className="md:block hidden">
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-[1.2rem] text-primary font-semibold hover:text-primary/80 transition-all duration-300 group">
            <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Be inspired
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <InspiredMenuContent categories={categories} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-[1.2rem] text-primary font-semibold hover:text-primary/80 transition-all duration-300 group">
            <MapPin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Places to go
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <PlacesToGoMenuContent categories={placesTogCategorie} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/plan-your-trip" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                "!text-[1.2rem] text-primary font-semibold hover:text-primary/80 transition-all duration-300 relative group",
                navigationMenuTriggerStyle()
              )}
            >
              Plan Your Trip
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/programs" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                "!text-[1.2rem] text-primary font-semibold hover:text-primary/80 transition-all duration-300 relative group",
                navigationMenuTriggerStyle()
              )}
            >
              Programs
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/events" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                "!text-[1.2rem] text-primary font-semibold hover:text-primary/80 transition-all duration-300 relative group",
                navigationMenuTriggerStyle()
              )}
            >
              Events
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li className="list-none">
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-2 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 hover:shadow-xl hover:shadow-primary/5 focus:bg-gradient-to-br focus:from-primary/5 focus:to-primary/10 border border-border/10 hover:border-primary/30 transform hover:-translate-y-0.5 bg-background/50",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-tight mb-2 group-hover:text-primary transition-colors duration-300">{title}</div>
          {children}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

/*
Blink MacSystemFont
*/
