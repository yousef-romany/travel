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
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-[1.2rem] text-primary">
            Be inspired
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-full lg:max-w-[600px] md:grid-cols-2 lg:grid-cols-[.75fr_1fr]">
              {categories.length > 0
                ? categories?.map((category: InspirationCategoryData) => (
                    <ListItem
                      key={category.id}
                      href={`/inspiration/${category.categoryName}`}
                      title={category.categoryName}
                      className="text-primary"
                    >
                      <div className="flex flex-col gap-4 text-primary">
                        {category?.image ? (
                          <OptimizedImage
                            src={getImageUrl(category.image)}
                            alt={category.categoryName}
                            className="h-[120px] md:h-[140px] lg:h-[160px] w-full rounded-xl object-cover"
                          />
                        ) : (
                          <Skeleton className="h-[120px] md:h-[140px] lg:h-[160px] w-full rounded-xl" />
                        )}
                        <p className="line-clamp-2 text-sm">{category.description}</p>
                      </div>
                    </ListItem>
                  ))
                : "No Data found ."}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-[1.2rem] text-primary">
            Places to go
          </NavigationMenuTrigger>
          <NavigationMenuContent className="">
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-full lg:max-w-[600px] md:grid-cols-2 lg:grid-cols-[.75fr_1fr]">
              {placesTogCategorie.length > 0
                ? placesTogCategorie?.map(
                    (category: InspirationCategoryData) => (
                      <ListItem
                        key={category.id}
                        href={`/placesTogo/${category.categoryName}`}
                        title={category.categoryName}
                        className="text-primary"
                      >
                        <div className="flex flex-col gap-4 text-primary">
                          {category?.image ? (
                            <OptimizedImage
                              src={getImageUrl(category.image)}
                              alt={category.categoryName}
                              className="h-[120px] md:h-[140px] lg:h-[160px] w-full rounded-xl object-cover"
                            />
                          ) : (
                            <Skeleton className="h-[120px] md:h-[140px] lg:h-[160px] w-full rounded-xl" />
                          )}
                          <p className="line-clamp-2 text-sm">{category.description}</p>
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
                "!text-[1.2rem] text-primary",
                navigationMenuTriggerStyle()
              )}
            >
              Plan Your Trip
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/programs" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                "!text-[1.2rem] text-primary",
                navigationMenuTriggerStyle()
              )}
            >
              Programs
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/events" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                "!text-[1.2rem] text-primary",
                navigationMenuTriggerStyle()
              )}
            >
              Events
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
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
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
