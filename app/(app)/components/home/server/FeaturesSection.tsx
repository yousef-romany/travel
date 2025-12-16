import { Zap, TrendingUp, Users, Award, Heart, Play, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Features Showcase Section - Server Component
 * Fully static component showcasing ZoeHoliday's key features
 */
export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 !w-full px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-8 sm:mb-12 text-center animate-on-scroll">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-accent rounded-full mb-3 sm:mb-4 shadow-lg">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Why Choose ZoeHoliday?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-2xl md:max-w-3xl px-4">
            We offer the most comprehensive travel experience with exclusive features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
          {/* Dynamic Pricing */}
          <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-4 shadow-sm">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Smart Pricing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the best deals with our dynamic pricing engine. Early bird discounts up to 30% off.
              </p>
              <div className="text-xs text-primary font-bold uppercase tracking-wide">Save up to $500 per trip</div>
            </CardContent>
          </Card>

          {/* Group Discounts */}
          <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-4 shadow-sm">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Group Discounts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Travel with friends and family! Get up to 20% off for groups of 16 or more.
              </p>
              <div className="text-xs text-primary font-bold uppercase tracking-wide">Bigger groups = Bigger savings</div>
            </CardContent>
          </Card>

          {/* Loyalty Program */}
          <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full mb-4 shadow-sm">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Loyalty Rewards</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Earn points on every booking. Redeem for discounts and exclusive perks.
              </p>
              <div className="text-xs text-primary font-bold uppercase tracking-wide">100 points = $1 USD</div>
            </CardContent>
          </Card>

          {/* Travel Insurance */}
          <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4 shadow-sm">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Travel Protection</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Travel worry-free with our comprehensive insurance options starting at $49.
              </p>
              <div className="text-xs text-primary font-bold uppercase tracking-wide">Up to $250K coverage</div>
            </CardContent>
          </Card>

          {/* Voice Search */}
          <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full mb-4 shadow-sm">
                <Play className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Voice Search</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find your perfect trip hands-free with our AI-powered voice search.
              </p>
              <div className="text-xs text-primary font-bold uppercase tracking-wide">Search in any language</div>
            </CardContent>
          </Card>

          {/* 24/7 Support */}
          <Card className="hover-lift border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-full mb-4 shadow-sm">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our expert travel guides are always here to help you plan your perfect trip.
              </p>
              <div className="text-xs text-primary font-bold uppercase tracking-wide">WhatsApp & Live Chat</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
