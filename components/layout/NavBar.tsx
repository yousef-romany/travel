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
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary transition-all duration-200 ease-out shadow-lg shadow-primary/50 relative overflow-hidden"
        style={{
          width: `${scrollProgress}%`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
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
  const [isFixed, setIsFixed] = useState(false);

  // Handle scroll effect - navbar becomes fixed after scrolling past hero section
  useEffect(() => {
    const handleScroll = () => {
      // Assume hero section is around 600-700px, adjust threshold as needed
      const heroHeight = 650;
      setIsFixed(window.scrollY > heroHeight);
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
    <nav className={`z-50 w-full h-[76px] px-3 sm:px-4 md:px-6 lg:px-8 border-b-2 border-primary flex justify-between items-center transition-all duration-300 relative ${
      isFixed
        ? "fixed top-0 left-0 bg-card/98 backdrop-blur-md supports-[backdrop-filter]:bg-card/95 shadow-lg animate-in slide-in-from-top"
        : "bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70 shadow-sm"
    }`}>
      {/* Mobile Menu */}
      <div className="lg:hidden flex-shrink-0">
        <Menu categories={inspirationCategories} placesTogCategorie={placesCategories} />
      </div>

      {/* Logo */}
      <Link
        href={"/"}
        className="flex-shrink-0 mx-auto lg:mx-0"
        onClick={handleLogoClick}
      >
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
          categories={inspirationCategories}
          placesTogCategorie={placesCategories}
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Comparison */}
        <Link href="/compare" onClick={handleComparisonClick}>
          <Button
            size="icon"
            variant="outline"
            className="hover:bg-primary/10 transition-colors h-9 w-9 sm:h-10 sm:w-10 relative"
            title="Compare Programs"
          >
            <GitCompare size={18} className="text-primary sm:w-5 sm:h-5" />
            {comparisonCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
              >
                {comparisonCount}
              </Badge>
            )}
          </Button>
        </Link>

        {/* Wishlist - Hidden on mobile when logged in */}
        {!user && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleWishlistClick}
            className="hover:bg-primary/10 transition-colors h-9 w-9 sm:h-10 sm:w-10 sm:hidden lg:flex md:flex"
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

      {/* Page Scroll Progress Bar - Only visible when navbar is fixed */}
      {isFixed && <PageScrollProgressBar />}
    </nav>
  );
};
export default memo(NavBar);
