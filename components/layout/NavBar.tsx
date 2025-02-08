"use client";
import Image from "next/image";
import { memo } from "react";
import logo from "@/public/logo.png";
import { FaRegHeart } from "react-icons/fa6";
import { Button } from "../ui/button";
import ModeToggle from "./ModeToggle";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import Menu from "./Menu";
import { fetchInspirationCategories } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";
import { InspirationCategory } from "@/type/inspiration";
import Link from "next/link";
import { fetchPlaceToGoCategories } from "@/fetch/placesToGo";
import Loading from "../Loading";

const NavBar = () => {
  const { data, error, isLoading } = useQuery<InspirationCategory, Error>({
    queryKey: ["InspirationCategories"],
    queryFn: fetchInspirationCategories,
  });

  const placeToGo = useQuery<{ data: InspirationCategory }>({
    queryKey: ["PlacesToGoCategories"],
    queryFn: fetchPlaceToGoCategories,
  });

  if (placeToGo.isLoading && isLoading) return <Loading />;
  if (placeToGo.error && error instanceof Error)
    return <p>Error: {error.message}</p>;
  return (
    <div className="z-50 w-full h-[76px] px-[2em] fixed top-0 left-0 border-b-2 border-primary bg-card flex justify-between items-center">
      <Menu categories={data?.data || []} placesTogCategorie={Array.isArray(placeToGo?.data?.data) ? placeToGo.data.data : []} />
      <Link href={"/"}>
        <Image src={logo} alt="logo" className="max-w-[200px] h-auto" />
      </Link>
      <NavigationMenuDemo
        categories={data?.data || []}
        placesTogCategorie={Array.isArray(placeToGo?.data?.data) ? placeToGo.data.data : []}
      />
      <div className="flex items-center gap-2">
        <Button size={"icon"} variant={"outline"}>
          <FaRegHeart size={20} className="text-primary" />
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
};
export default memo(NavBar);
