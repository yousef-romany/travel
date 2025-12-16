import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, FileBarChart, Globe2, TrendingUp, Users2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function TourisminvestmentContent() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Tourism Investment Opportunities</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Partner with ZoeHoliday to tap into Egypt's booming tourism sector and create sustainable, profitable ventures
          </p>
        </div>

        <div className="mb-12 animate-slide-up animate-delay-200">
          <div className="aspect-video w-full bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl flex items-center justify-center mb-8">
            <TrendingUp className="w-32 h-32 text-primary/40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <AnimatedSection>
              <p className="text-4xl font-bold text-primary mb-2">14.7M</p>
              <p className="text-muted-foreground">Annual Visitors (2023)</p>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p className="text-4xl font-bold text-primary mb-2">$13.6B</p>
              <p className="text-muted-foreground">Tourism Revenue</p>
            </AnimatedSection>
            <AnimatedSection delay={400}>
              <p className="text-4xl font-bold text-primary mb-2">12%</p>
              <p className="text-muted-foreground">GDP Contribution</p>
            </AnimatedSection>
          </div>
        </div>

        <AnimatedSection className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">Why Invest in Egyptian Tourism?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <CardTitle>Rich Cultural Heritage</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Egypt's 7,000 years of history, including the Pyramids, temples, and ancient artifacts, continue to attract
                millions of tourists annually, ensuring sustained demand for tourism services.
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <CardTitle>Strategic Location</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Positioned at the crossroads of Africa, Asia, and Europe, Egypt serves as a gateway for international
                travelers and offers excellent connectivity to major global markets.
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <CardTitle>Government Support</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                The Egyptian government prioritizes tourism development with investment incentives, infrastructure
                improvements, and streamlined regulations for foreign investors.
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <CardTitle>Diverse Tourism Products</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                From beach resorts and desert safaris to Nile cruises and cultural tours, Egypt offers multiple tourism
                segments for investment diversification and risk mitigation.
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <CardTitle>Growing Middle Class</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Rising domestic tourism from Egypt's expanding middle class, combined with increased regional travel,
                creates a robust local market alongside international visitors.
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <CardTitle>Competitive Costs</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Lower operational costs compared to European destinations, favorable exchange rates, and affordable
                skilled labor make Egypt an attractive investment destination.
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">Investment Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Hospitality Development</CardTitle>
                <CardDescription>
                  Hotels, resorts, and accommodation facilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Boutique hotels in historic areas</li>
                  <li>• Red Sea beach resorts</li>
                  <li>• Eco-lodges and glamping sites</li>
                  <li>• Nile cruise vessels</li>
                  <li>• Serviced apartments</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Tour Operations</CardTitle>
                <CardDescription>
                  Travel agencies and tour services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Specialized tour operators</li>
                  <li>• Adventure tourism companies</li>
                  <li>• Cultural experience providers</li>
                  <li>• Transportation services</li>
                  <li>• Excursion booking platforms</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Technology & Innovation</CardTitle>
                <CardDescription>
                  Digital tourism solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Travel booking platforms</li>
                  <li>• Virtual reality experiences</li>
                  <li>• Tourism mobile applications</li>
                  <li>• Smart destination technologies</li>
                  <li>• AI-powered concierge services</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Food & Entertainment</CardTitle>
                <CardDescription>
                  Dining and leisure experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Themed restaurants</li>
                  <li>• Entertainment venues</li>
                  <li>• Cultural performance spaces</li>
                  <li>• Night markets and bazaars</li>
                  <li>• Food tourism experiences</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileBarChart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Infrastructure Projects</CardTitle>
                <CardDescription>
                  Tourism support infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Marinas and waterfront developments</li>
                  <li>• Tourism training centers</li>
                  <li>• Conference and exhibition centers</li>
                  <li>• Transportation hubs</li>
                  <li>• Visitor information centers</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-all hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Sustainable Tourism</CardTitle>
                <CardDescription>
                  Eco-friendly and responsible tourism
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Green hotels and resorts</li>
                  <li>• Wildlife conservation tourism</li>
                  <li>• Community-based tourism</li>
                  <li>• Renewable energy projects</li>
                  <li>• Waste management solutions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">Investment Incentives</h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-xl mb-4">Government Incentives</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Tax holidays and reductions for tourism projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Simplified licensing and regulatory procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>100% foreign ownership permitted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Repatriation of profits and capital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Access to industrial land at preferential rates</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-4">ZoeHoliday Partnership Benefits</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Local market expertise and insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Established network of suppliers and partners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Marketing and distribution channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Regulatory compliance assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Operational support and management services</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border hover-lift">
              <CardHeader>
                <CardTitle>Red Sea Resort Project</CardTitle>
                <CardDescription>Sharm El-Sheikh</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-4">
                  5-star resort with 200 rooms, diving center, and spa facilities. Achieved 85% occupancy rate within
                  first year of operation.
                </p>
                <p className="font-semibold text-foreground">ROI: 18% annually</p>
              </CardContent>
            </Card>

            <Card className="border-border hover-lift">
              <CardHeader>
                <CardTitle>Nile Cruise Line</CardTitle>
                <CardDescription>Luxor-Aswan Route</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-4">
                  Fleet of luxury cruise vessels offering 3-7 day cultural tours. Became preferred operator for
                  international travel agencies.
                </p>
                <p className="font-semibold text-foreground">ROI: 22% annually</p>
              </CardContent>
            </Card>

            <Card className="border-border hover-lift">
              <CardHeader>
                <CardTitle>Eco-Tourism Lodge</CardTitle>
                <CardDescription>Siwa Oasis</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-4">
                  Sustainable desert retreat with solar power and locally-sourced materials. Featured in leading
                  travel publications.
                </p>
                <p className="font-semibold text-foreground">ROI: 15% annually</p>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 md:p-12 text-center hover-scale transition-smooth">
            <h2 className="text-3xl font-bold mb-4 text-primary">Ready to Invest in Egyptian Tourism?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Schedule a consultation with our investment team to explore opportunities and receive detailed feasibility studies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="hover-glow">Schedule Consultation</Button>
              <Button size="lg" variant="outline" className="hover-glow">Download Investment Guide</Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Email: <a href="mailto:invest@zoeholiday.com" className="text-primary hover:underline">invest@zoeholiday.com</a> |
              Phone: <a href="tel:+201555100961" className="text-primary hover:underline">+20 155 510 0961</a>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
