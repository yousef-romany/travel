"use client";
import { memo } from "react";
import Image from "next/image";
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
import logo from "@/public/logo.png";
import logoLight from "@/public/logoLight.png";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth(); // ✅ هنا جبنا المستخدم

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

  const handleWishlistClick = () => {
    if (!user) return (window.location.href = "/login"); // ✅ لو مش داخل هنعمله redirect
    window.location.href = "/wishlist";
  };

  return (
    <div className="z-50 w-full h-[76px] px-[2em] fixed top-0 left-0 border-b-2 border-primary bg-card flex justify-between items-center">
      <Menu
        categories={data?.data || []}
        placesTogCategorie={
          Array.isArray(placeToGo?.data?.data) ? placeToGo.data.data : []
        }
      />
      <Link href={"/"}>
        {theme == "light" ? (
          <Image
            src={logoLight}
            alt="logo"
            className="!w-[200px] !max-w-[200px] h-auto"
          />
        ) : (
          <Image
            src={logo}
            alt="logo"
            className="!w-[200px] !max-w-[200px] h-auto"
          />
        )}
      </Link>

      <NavigationMenuDemo
        categories={data?.data || []}
        placesTogCategorie={
          Array.isArray(placeToGo?.data?.data) ? placeToGo.data.data : []
        }
      />

      <div className="flex items-center gap-3">
        {/* Wishlist */}
        <Button size="icon" variant="outline" onClick={handleWishlistClick}>
          <FaRegHeart size={20} className="text-primary" />
        </Button>

        <ModeToggle />

        {/* Auth Buttons */}
        {!user ? (
          // ✅ لو مش داخل 
          <Link href="/login">
            <Button className="px-4">Login</Button>
          </Link>
        ) : (
          // ✅ لو داخل
          <div className="flex gap-2 items-center">
            <Link href="/me">
              <Button variant="secondary" className="px-4">
                {user.username}
              </Button>
            </Link>
            <Button variant="destructive" className="px-4" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default memo(NavBar);
