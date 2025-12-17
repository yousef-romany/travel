import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  CheckCircle2,
  Search,
  BarChart3,
  FileText,
  Globe,
  Smartphone,
  Zap,
  Link as LinkIcon,
  Shield,
  TrendingUp
} from "lucide-react";

export const metadata: Metadata = {
  title: "SEO Dashboard - ZoeHoliday Internal Tools",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SEODashboard() {
  const quickLinks = [
    {
      title: "Google Search Console",
      description: "Monitor search performance, indexing, and coverage",
      url: "https://search.google.com/search-console",
      icon: Search,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Google Analytics 4",
      description: "Track user behavior and conversion metrics",
      url: "https://analytics.google.com",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "PageSpeed Insights",
      description: "Test page performance and Core Web Vitals",
      url: "https://pagespeed.web.dev",
      icon: Zap,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Mobile-Friendly Test",
      description: "Check mobile usability and responsiveness",
      url: "https://search.google.com/test/mobile-friendly",
      icon: Smartphone,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Rich Results Test",
      description: "Validate structured data and schema markup",
      url: "https://search.google.com/test/rich-results",
      icon: FileText,
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Schema Markup Validator",
      description: "Test and validate your schema.org markup",
      url: "https://validator.schema.org",
      icon: CheckCircle2,
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const siteHealth = [
    { label: "Sitemap", status: "active", url: "/sitemap.xml" },
    { label: "Robots.txt", status: "active", url: "/robots.txt" },
    { label: "Google Verification", status: "verified", url: "/google867a9b2aa9e028e7.html" },
    { label: "Promo Codes Page", status: "active", url: "/promo-codes" },
  ];

  const seoFeatures = [
    { name: "Meta Tags", status: "✅ Optimized" },
    { name: "Open Graph", status: "✅ Configured" },
    { name: "Twitter Cards", status: "✅ Configured" },
    { name: "Schema.org Markup", status: "✅ Implemented" },
    { name: "Breadcrumbs Schema", status: "✅ Active" },
    { name: "FAQ Schema", status: "✅ Active" },
    { name: "Organization Schema", status: "✅ Active" },
    { name: "LocalBusiness Schema", status: "✅ Active" },
    { name: "Review Schema", status: "✅ Active" },
    { name: "Offer Schema", status: "✅ Active" },
    { name: "Mobile Responsive", status: "✅ Yes" },
    { name: "HTTPS", status: "✅ Enabled" },
    { name: "Canonical URLs", status: "✅ Set" },
    { name: "Image Alt Tags", status: "✅ Present" },
    { name: "DNS Prefetch", status: "✅ Configured" },
    { name: "Lazy Loading", status: "✅ Enabled" },
  ];

  const documentation = [
    { name: "Google Search Console Guide", file: "GOOGLE_SEARCH_CONSOLE_GUIDE.md" },
    { name: "Quick Start Guide", file: "GOOGLE_SEARCH_CONSOLE_QUICK_START.md" },
    { name: "SEO Checklist", file: "SEO_CHECKLIST.md" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-full border border-primary/20 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Internal Tools</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            SEO Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quick access to SEO tools, monitoring, and site health status
          </p>
        </div>

        {/* Site Health Status */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Site Health
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {siteHealth.map((item) => (
              <Card key={item.label} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {item.status}
                  </Badge>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            SEO Tools
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link) => (
              <Card key={link.title} className="group hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <link.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{link.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {link.description}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                      Open Tool <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* SEO Features Status */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Implemented Features
          </h2>
          <Card className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {seoFeatures.map((feature) => (
                <div key={feature.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{feature.name}</div>
                    <div className="text-xs text-green-600">{feature.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Documentation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Documentation
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {documentation.map((doc) => (
              <Card key={doc.name} className="p-6 hover:shadow-lg transition-shadow">
                <FileText className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{doc.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {doc.file}
                </p>
                <Badge variant="outline">Available in repo</Badge>
              </Card>
            ))}
          </div>
        </section>

        {/* Important URLs */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            Important URLs to Index
          </h2>
          <Card className="p-6">
            <div className="space-y-2">
              {[
                { url: "/", priority: "Highest" },
                { url: "/programs", priority: "High" },
                { url: "/promo-codes", priority: "High" },
                { url: "/placesTogo", priority: "High" },
                { url: "/events", priority: "Medium" },
                { url: "/plan-your-trip", priority: "Medium" },
                { url: "/about", priority: "Low" },
              ].map((item) => (
                <div key={item.url} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <a
                    href={item.url}
                    className="text-sm font-mono text-primary hover:underline flex items-center gap-2"
                  >
                    {item.url} <ExternalLink className="h-3 w-3" />
                  </a>
                  <Badge variant={
                    item.priority === "Highest" ? "default" :
                    item.priority === "High" ? "secondary" :
                    "outline"
                  }>
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-amber-500/5 border-primary/20">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://search.google.com/search-console/welcome"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90">
                  <Search className="h-4 w-4 mr-2" />
                  Open Google Search Console
                </Button>
              </a>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Sitemap
                </Button>
              </a>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
