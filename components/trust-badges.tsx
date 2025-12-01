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
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
              <path d="M12.006 4.295c-2.67 0-5.338.784-7.631 2.35H.244l2.351 2.35a10.884 10.884 0 0 0-1.394 5.29c0 6.042 4.898 10.94 10.94 10.94 6.043 0 10.941-4.898 10.941-10.94 0-6.043-4.898-10.941-10.94-10.941h-.136zm0 19.359c-4.627 0-8.418-3.79-8.418-8.419 0-4.627 3.79-8.418 8.418-8.418 4.628 0 8.419 3.79 8.419 8.418 0 4.628-3.79 8.419-8.419 8.419z"/>
              <circle cx="7.835" cy="14.235" r="2.933"/>
              <circle cx="16.133" cy="14.235" r="2.933"/>
            </svg>
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

      {/* Viator */}
      <Link
        href="https://www.viator.com/tours/Luxor/Explore-Luxor-Ultimate-Day-Tour-of-East-and-West-Bank-Highlights/d826-5610207P1"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all group"
        aria-label="Book with us on Viator"
      >
        <div className="relative w-10 h-10 flex-shrink-0 bg-[#00AA6C] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">V</span>
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
