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

const NavBar = () => {
  const { data, error, isLoading } = useQuery<InspirationCategory, Error>({
    queryKey: ["InspirationCategories"],
    queryFn: fetchInspirationCategories,
  });

  if (isLoading) return <p>Loading categories...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div className="w-full h-[76px] px-[32px] fixed top-0 left-0 border-b-2 bg-card flex justify-between items-center">
      <Menu categories={data?.data || []} />
      <Image src={logo} alt="logo" className="max-w-[200px] h-auto" />
      <NavigationMenuDemo categories={data?.data || []} />
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
