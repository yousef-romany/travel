"use client";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import logo from "@/public/logo.png";
import smallLogo from "@/public/mainLogo.png";

import LanguageSwitcher from "../LanguageSwitcher";

export default function Footer() {
  return (
    <footer className="py-12 px-4 md:px-8 mt-[100px] rounded-tr-xl rounded-tl-xl shadow-2xl shadow-primary">
      {/* Logo */}
      <div className="max-w-7xl mx-auto mb-16">
        <Image
          src={logo}
          alt="ZoeHoliday.com Logo"
          width={220}
          height={100}
          className="mx-auto"
        />
      </div>

      {/* Acknowledgement of Country */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 role="heading"  className="text-2xl font-semibold mb-6">
          Acknowledgement of Country
        </h2>
        <div className="flex items-start gap-6">
          <div className="hidden md:block">
            <div className="p-4 bg-primary rounded-full flex items-center justify-center">
              <Image
                src={smallLogo}
                alt="ZoeHoliday.com Logo"
                width={40}
                height={40}
                className="mx-auto"
              />
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
          <h3 role="heading"  className="text-lg font-semibold mb-4">
            Change your region and language
          </h3>
          <LanguageSwitcher />
        </div>

        {/* Social Media */}
        <div className="md:col-span-1">
          <h3 role="heading"  className="text-lg font-semibold mb-4">Find us on</h3>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              <Facebook className="w-6 h-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Instagram className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Youtube className="w-6 h-6" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Twitter className="w-6 h-6" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        {/* About Links */}
        <div className="md:col-span-1">
          <h3 role="heading"  className="text-lg font-semibold mb-4">About this site</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>

        {/* Other Sites */}
        <div className="md:col-span-1">
          <h3 role="heading"  className="text-lg font-semibold mb-4">Other sites</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Media & Industry
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Business Events
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Tourism Investment
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
