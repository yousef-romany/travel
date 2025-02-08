import { memo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { RiMenu2Fill } from "react-icons/ri";
// import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import CardCategory from "./CardCategory";
import { InspirationCategoryData } from "@/type/inspiration";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";

interface MenuProps {
  categories: InspirationCategoryData[];
  placesTogCategorie: InspirationCategoryData[];
}

const Menu = ({ categories, placesTogCategorie }: MenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden md:block sm:block">
          <RiMenu2Fill className="text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="grid gap-8 py-6 w-[350px]">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="text-[1.4rem]">
                Be Inspired
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="!w-full">
              <ScrollArea className="h-full w-full rounded-md border">
                <div className="w-full h-[250px] flex flex-wrap gap-4 p-4 items-stretch justify-start">
                  {categories.length > 0
                    ? categories?.map((category: InspirationCategoryData) => (
                        <CardCategory
                          key={category.id}
                          categoryName={category.categoryName}
                          imageUrl={category.imageUrl}
                          url={`/inspiration/${category.categoryName}`}
                        />
                      ))
                    : "no data found ."}
                </div>
              </ScrollArea>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="text-[1.4rem]">
                Places To Go
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="!w-full">
              <ScrollArea className="h-full w-full rounded-md border">
                <div className="w-full h-[250px] flex flex-wrap gap-4 p-4 items-stretch justify-start">
                  {placesTogCategorie.length > 0
                    ? placesTogCategorie?.map(
                        (category: InspirationCategoryData) => (
                          <CardCategory
                            key={category.id}
                            categoryName={category.categoryName}
                            imageUrl={category.imageUrl}
                            url={`/placesTogo/${category.categoryName}`}
                          />
                        )
                      )
                    : "no data found ."}
                </div>
              </ScrollArea>
            </HoverCardContent>
          </HoverCard>
          <Link href={"/"} className="w-full text-primary text-center text-[1.4rem]">Plan your trip</Link>
          <Link href={"/programs"} className="w-full text-primary text-center text-[1.4rem]">Programs</Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default memo(Menu);
