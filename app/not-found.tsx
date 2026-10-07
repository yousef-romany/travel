import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, MapPin, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
        Error 404
      </p>
      <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mb-2 max-w-md text-muted-foreground">
        The page you are looking for does not exist, has been moved, or the link
        may be broken.
      </p>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        Try searching for a destination, or head back to our homepage to keep
        planning your Egypt adventure.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/programs">
            <MapPin className="mr-2 h-4 w-4" />
            Browse Tours
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/placesTogo">
            <Compass className="mr-2 h-4 w-4" />
            Explore Destinations
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/contact">
            <Search className="mr-2 h-4 w-4" />
            Contact Us
          </Link>
        </Button>
      </div>
    </div>
  );
}
