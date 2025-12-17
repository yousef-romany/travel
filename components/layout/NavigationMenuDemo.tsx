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
import OptimizedImage from "../OptimizedImage";
import { Sparkles, MapPin } from "lucide-react";

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
            <ul className="grid gap-4 p-6 md:w-[450px] lg:w-full lg:max-w-[700px] md:grid-cols-2 lg:grid-cols-2">
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
                          <div className="relative overflow-hidden rounded-xl">
                            <OptimizedImage
                              src={getImageUrl(category.image)}
                              alt={category.categoryName}
                              className="h-[140px] md:h-[160px] lg:h-[180px] w-full rounded-xl object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ) : (
                          <Skeleton className="h-[140px] md:h-[160px] lg:h-[180px] w-full rounded-xl" />
                        )}
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{category.description}</p>
                      </div>
                    </ListItem>
                  ))
                : "No Data found ."}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-[1.2rem] text-primary font-semibold hover:text-primary/80 transition-all duration-300 group">
            <MapPin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Places to go
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-4 p-6 md:w-[450px] lg:w-full lg:max-w-[700px] md:grid-cols-2 lg:grid-cols-2">
              {placesTogCategorie.length > 0
                ? placesTogCategorie?.map(
                    (category: InspirationCategoryData) => (
                      <ListItem
                        key={category.id}
                        href={`/placesTogo/${category.categoryName}`}
                        title={category.categoryName}
                        className="text-primary group"
                      >
                        <div className="flex flex-col gap-3 text-primary">
                          {category?.image ? (
                            <div className="relative overflow-hidden rounded-xl">
                              <OptimizedImage
                                src={getImageUrl(category.image)}
                                alt={category.categoryName}
                                className="h-[140px] md:h-[160px] lg:h-[180px] w-full rounded-xl object-cover transform group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          ) : (
                            <Skeleton className="h-[140px] md:h-[160px] lg:h-[180px] w-full rounded-xl" />
                          )}
                          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{category.description}</p>
                        </div>
                      </ListItem>
                    )
                  )
                : "No Data found ."}
            </ul>
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
            "block select-none space-y-2 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 hover:shadow-lg hover:shadow-primary/10 focus:bg-gradient-to-br focus:from-primary/5 focus:to-primary/10 border border-transparent hover:border-primary/20 transform hover:-translate-y-1",
            className
          )}
          {...props}
        >
          <div className="text-base font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">{title}</div>
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
