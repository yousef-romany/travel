"use client";
import { memo } from "react";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa6";
import { Button } from "../ui/button";
import ModeToggle from "./ModeToggle";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import Menu from "./Menu";
import { UserMenu } from "./UserMenu";
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
import { trackButtonClick, trackNavigation } from "@/lib/analytics";

const NavBar = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

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
    trackButtonClick("Wishlist", "NavBar", user ? "/wishlist" : "/login");
    if (!user) return (window.location.href = "/login");
    window.location.href = "/wishlist";
  };

  const handleLogoClick = () => {
    trackNavigation("Logo", "/");
  };

  const handleLoginClick = () => {
    trackButtonClick("Login", "NavBar", "/login");
  };

  return (
    <nav className="z-50 w-full h-[76px] px-3 sm:px-4 md:px-6 lg:px-8 fixed top-0 left-0 border-b-2 border-primary bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 flex justify-between items-center shadow-sm">
      {/* Mobile Menu */}
      <div className="lg:hidden flex-shrink-0">
        <Menu
          categories={data?.data || []}
          placesTogCategorie={
            Array.isArray(placeToGo?.data?.data) ? placeToGo.data.data : []
          }
        />
      </div>

      {/* Logo */}
      <Link href={"/"} className="flex-shrink-0 mx-auto lg:mx-0" onClick={handleLogoClick}>
        {theme == "light" ? (
          <Image
            src={logoLight}
            alt="ZoeHoliday Logo"
            className="!w-[120px] sm:!w-[150px] md:!w-[180px] lg:!w-[200px] !max-w-[200px] h-auto"
            priority
          />
        ) : (
          <Image
            src={logo}
            alt="ZoeHoliday Logo"
            className="!w-[120px] sm:!w-[150px] md:!w-[180px] lg:!w-[200px] !max-w-[200px] h-auto"
            priority
          />
        )}
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex flex-1 justify-center">
        <NavigationMenuDemo
          categories={data?.data || []}
          placesTogCategorie={
            Array.isArray(placeToGo?.data?.data) ? placeToGo.data.data : []
          }
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Wishlist - Hidden on mobile when logged in */}
        {!user && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleWishlistClick}
            className="hover:bg-primary/10 transition-colors h-9 w-9 sm:h-10 sm:w-10"
            title="Wishlist"
          >
            <FaRegHeart size={18} className="text-primary sm:w-5 sm:h-5" />
          </Button>
        )}

        {/* Theme Toggle */}
        <div className="flex-shrink-0">
          <ModeToggle />
        </div>

        {/* Auth Section */}
        {!user ? (
          <Link href="/login" onClick={handleLoginClick}>
            <Button className="px-3 sm:px-4 md:px-6 text-sm sm:text-base h-9 sm:h-10">
              Login
            </Button>
          </Link>
        ) : (
          <UserMenu />
        )}
      </div>
    </nav>
  );
};
export default memo(NavBar);
