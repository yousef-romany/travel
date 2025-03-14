/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import logo from "@/public/logo.png";
import logoLight from "@/public/logoLight.png";
import smallLogo from "@/public/mainLogo.png";
import smallLogoLight from "@/public/mainLogoLight.png";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";
import OptimizedImage from "../OptimizedImage";
import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="py-12 px-4 md:px-8 rounded-tr-xl rounded-tl-xl shadow-2xl shadow-primary mt-[40px]">
      {/* Logo */}
      <div className="max-w-7xl mx-auto mb-16">
        {theme == "light" ? (
          <OptimizedImage
            src={logoLight as any}
            alt="ZoeHoliday.com Logo"
            className="mx-auto !h-[100px] !w-[220px] object-contain"
          />
        ) : (
          <OptimizedImage
            src={logo as any}
            alt="ZoeHoliday.com Logo"
            className="mx-auto !h-[100px] !w-[220px] object-contain"
          />
        )}
      </div>

      {/* Acknowledgement of Country */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 role="heading" className="text-2xl font-semibold mb-6">
          Acknowledgement of Country
        </h2>
        <div className="flex items-start gap-6">
          <div className="hidden md:block">
            <div className="p-4 bg-primary rounded-full flex items-center justify-center">
              {theme == "light" ? (
                <Image
                  src={smallLogo as any}
                  alt="ZoeHoliday.com Logo"
                  className="mx-auto !w-[40px] !h-[40px]"
                />
              ) : (
                <Image
                  src={smallLogoLight as any}
                  alt="ZoeHoliday.com Logo"
                  className="mx-auto !w-[40px] !h-[40px]"
                />
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg mb-4">
              We acknowledge the Traditional Aboriginal and Torres Strait
              Islander Owners of the land, sea and waters of the Australian
              continent, and recognise their custodianship of culture and
              Country for over 60,000 years.
            </p>
            <Link href="#" className="text-primary underline">
              Read more
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Language Selector */}
        <div className="md:col-span-1">
          <h3 role="heading" className="text-lg font-semibold mb-4">
            Change your region and language
          </h3>
          <LanguageSwitcher />
        </div>

        {/* Social Media */}
        <div className="md:col-span-1">
          <h3 role="heading" className="text-lg font-semibold mb-4">
            Find us on
          </h3>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-primary hover:text-secondary transition-colors"
            >
              <Facebook className="w-6 h-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="#"
              className="text-primary hover:text-secondary transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="#"
              className="text-primary hover:text-secondary transition-colors"
            >
              <Youtube className="w-6 h-6" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link
              href="#"
              className="text-primary hover:text-secondary transition-colors"
            >
              <Twitter className="w-6 h-6" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        {/* About Links */}
        <div className="md:col-span-1">
          <h3 role="heading" className="text-lg font-semibold mb-4">
            About this site
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-primary hover:text-secondary transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-primary hover:text-secondary transition-colors"
              >
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-primary hover:text-secondary transition-colors"
              >
                Sitemap
              </Link>
            </li>
          </ul>
        </div>

        {/* Other Sites */}
        <div className="md:col-span-1">
          <h3 role="heading" className="text-lg font-semibold mb-4">
            Other sites
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-primary hover:text-secondary transition-colors"
              >
                Media & Industry
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-primary hover:text-secondary transition-colors"
              >
                Business Events
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-primary hover:text-secondary transition-colors"
              >
                Tourism Investment
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
