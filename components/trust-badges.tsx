"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Award, Shield } from "lucide-react";

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4">
      {/* TripAdvisor */}
      <Link
        href="https://www.tripadvisor.com/Attraction_Review-g294205-d33951827-Reviews-ZoeHolidays-Luxor_Nile_River_Valley.html"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all group"
        aria-label="View our TripAdvisor reviews"
      >
        <div className="relative w-10 h-10 flex-shrink-0">
          <div className="absolute inset-0 bg-[#34E0A1] rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 -96 512.2 512.2" id="Layer_2" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path className="st0" d="M128.2 127.9C92.7 127.9 64 156.6 64 192c0 35.4 28.7 64.1 64.1 64.1 35.4 0 64.1-28.7 64.1-64.1.1-35.4-28.6-64.1-64-64.1zm0 110c-25.3 0-45.9-20.5-45.9-45.9s20.5-45.9 45.9-45.9S174 166.7 174 192s-20.5 45.9-45.8 45.9z"></path><circle className="st0" cx="128.4" cy="191.9" r="31.9"></circle><path className="st0" d="M384.2 127.9c-35.4 0-64.1 28.7-64.1 64.1 0 35.4 28.7 64.1 64.1 64.1 35.4 0 64.1-28.7 64.1-64.1 0-35.4-28.7-64.1-64.1-64.1zm0 110c-25.3 0-45.9-20.5-45.9-45.9s20.5-45.9 45.9-45.9S430 166.7 430 192s-20.5 45.9-45.8 45.9z"></path><circle className="st0" cx="384.4" cy="191.9" r="31.9"></circle><path className="st0" d="M474.4 101.2l37.7-37.4h-76.4C392.9 29 321.8 0 255.9 0c-66 0-136.5 29-179.3 63.8H0l37.7 37.4C14.4 124.4 0 156.5 0 192c0 70.8 57.4 128.2 128.2 128.2 32.5 0 62.2-12.1 84.8-32.1l43.4 31.9 42.9-31.2-.5-1.2c22.7 20.2 52.5 32.5 85.3 32.5 70.8 0 128.2-57.4 128.2-128.2-.1-35.4-14.6-67.5-37.9-90.7zM368 64.8c-60.7 7.6-108.3 57.6-111.9 119.5-3.7-62-51.4-112.1-112.3-119.5 30.6-22 69.6-32.8 112.1-32.8S337.4 42.8 368 64.8zM128.2 288.2C75 288.2 32 245.1 32 192s43.1-96.2 96.2-96.2 96.2 43.1 96.2 96.2c-.1 53.1-43.1 96.2-96.2 96.2zm256 0c-53.1 0-96.2-43.1-96.2-96.2s43.1-96.2 96.2-96.2 96.2 43.1 96.2 96.2c-.1 53.1-43.1 96.2-96.2 96.2z"></path></g></svg>
          </div>
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            TripAdvisor
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">5.0</span>
          </div>
        </div>
      </Link>

      {/* Trustpilot */}
      <Link
        href="https://www.trustpilot.com/review/zoeholidays.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all group"
        aria-label="Read our Trustpilot reviews"
      >
        <div className="relative w-10 h-10 flex-shrink-0">
          <div className="absolute inset-0 bg-[#00B67A] rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" aria-hidden="true">
              <path d="M17.227 16.67l2.19 6.742-7.413-5.388 5.223-1.354zM24 9.31h-9.165L12.005.589l-2.84 8.723L0 9.3l7.422 5.397-2.84 8.714 7.422-5.388 4.583-3.326L24 9.311z"/>
            </svg>
          </div>
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            Trustpilot
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-[#00B67A] text-[#00B67A]" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              {process.env.NEXT_PUBLIC_TRUSTPILOT_RATING || "4.8"}
            </span>
          </div>
        </div>
      </Link>

      {/* Viator */}
      <Link
        href="https://www.viator.com/tours/Luxor/Explore-Luxor-Ultimate-Day-Tour-of-East-and-West-Bank-Highlights/d826-5610207P1"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all group"
        aria-label="Book with us on Viator"
      >
        <div className="relative w-10 h-10 flex-shrink-0">
          <div className="absolute inset-0 bg-[#34E0A1] rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/viator-seeklogo-2.svg"
              alt="Viator Logo"
              width={24}
              height={24}
              className="object-cover w-6 h-6"
            />
          </div>
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            Viator Partner
          </p>
          <p className="text-xs text-muted-foreground">Trusted Provider</p>
        </div>
      </Link>

      {/* Licensed Tour Operator */}
      <div className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-lg">
        <div className="w-10 h-10 flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
          <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-foreground">Licensed</p>
          <p className="text-xs text-muted-foreground">Egypt Tour Operator</p>
        </div>
      </div>

      {/* Secure Booking */}
      <div className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-lg">
        <div className="w-10 h-10 flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-foreground">Secure</p>
          <p className="text-xs text-muted-foreground">SSL Encrypted</p>
        </div>
      </div>
    </div>
  );
}
