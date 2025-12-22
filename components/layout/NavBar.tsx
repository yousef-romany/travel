"use client";
import { memo, useState, useEffect } from "react";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa6";
import { GitCompare } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import ModeToggle from "./ModeToggle";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import Menu from "./Menu";
import { UserMenu } from "./UserMenu";
import { InspirationCategoryData } from "@/type/inspiration";
import Link from "next/link";
import logo from "@/public/logo.png";
import logoLight from "@/public/logoLight.png";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { trackButtonClick, trackNavigation } from "@/lib/analytics";
import { getComparisonCount } from "@/lib/comparison";

// Page Scroll Progress Bar Component
const PageScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollHeight = documentHeight - windowHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    handleScroll(); // Initial calculation
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden pointer-events-none z-50">
      <div
        className="h-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-100 ease-out"
        style={{
          width: "100%",
          transform: `translateX(${scrollProgress - 100}%)`,
        }}
      />
    </div>
  );
};

interface NavBarProps {
  inspirationCategories: InspirationCategoryData[];
  placesCategories: InspirationCategoryData[];
}

const NavBar = ({ inspirationCategories, placesCategories }: NavBarProps) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [comparisonCount, setComparisonCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update comparison count
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

  const handleComparisonClick = () => {
    trackButtonClick("Comparison", "NavBar", "/compare");
  };

  return (
    <nav
      className={`z-50 w-full fixed top-0 left-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isScrolled
          ? "h-[60px] sm:h-[65px] bg-background/70 backdrop-blur-xl border-b border-border/40 shadow-sm supports-[backdrop-filter]:bg-background/60"
          : "h-[70px] sm:h-[80px] bg-transparent border-b border-transparent"
        }`}
    >
      {/* Background Gradient Mesh for Premium Feel */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-background/0 via-background/50 to-background/0 pointer-events-none transition-opacity duration-500 ${isScrolled ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* NavBar Content Container */}
      <div className="h-full w-full flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-10 max-w-[1920px] mx-auto relative">

        {/* Left Section - Mobile Menu (Mobile Only) */}
        <div className="flex items-center gap-2 lg:hidden z-10 flex-shrink-0">
          <Menu
            categories={inspirationCategories}
            placesTogCategorie={placesCategories}
          />
        </div>

        {/* Center/Left Section - Logo */}
        <Link
          href={"/"}
          className={`flex-shrink-0 z-10 transition-transform duration-500 lg:mr-auto ${
            isScrolled ? "scale-90 sm:scale-95" : "scale-100"
          } lg:relative lg:left-auto lg:translate-x-0 mx-auto lg:mx-0`}
          onClick={handleLogoClick}
        >
          {theme === "light" ? (
            <Image
              src={logoLight}
              alt="ZoeHoliday Logo"
              className="w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] h-auto object-contain"
              priority
            />
          ) : (
            <Image
              src={logo}
              alt="ZoeHoliday Logo"
              className="w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] h-auto object-contain"
              priority
            />
          )}
        </Link>

        {/* Center Section - Desktop Navigation (Desktop Only) */}
        <div className="hidden lg:flex flex-1 justify-center z-10 max-w-3xl absolute left-1/2 -translate-x-1/2">
          <NavigationMenuDemo
            categories={inspirationCategories}
            placesTogCategorie={placesCategories}
          />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0 z-10">
          {/* Comparison Button */}
          <Link href="/compare" onClick={handleComparisonClick}>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 relative group rounded-full"
              title="Compare Programs"
              aria-label="Compare Programs"
            >
              <GitCompare
                className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-foreground/80 group-hover:text-primary transition-colors"
              />
              {comparisonCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-[18px] w-[18px] sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs font-bold ring-2 ring-background animate-in zoom-in"
                >
                  {comparisonCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Wishlist Button - Only show when not logged in and on medium+ screens */}
          {!user && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleWishlistClick}
              className="hidden md:flex hover:bg-primary/10 hover:text-primary transition-all duration-300 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full group"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <FaRegHeart
                className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-foreground/80 group-hover:text-primary transition-colors"
              />
            </Button>
          )}

          {/* Theme Toggle */}
          <div className="flex-shrink-0">
            <ModeToggle />
          </div>

          {/* Auth Section */}
          {!user ? (
            <Link href="/login" onClick={handleLoginClick} className="flex-shrink-0">
              <Button className="px-3 sm:px-4 md:px-6 rounded-full text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white border-0 whitespace-nowrap">
                Login
              </Button>
            </Link>
          ) : (
            <div className="flex-shrink-0">
              <UserMenu />
            </div>
          )}
        </div>
      </div>

      {/* Page Scroll Progress Bar */}
      <PageScrollProgressBar />
    </nav>
  );
};
export default memo(NavBar);
