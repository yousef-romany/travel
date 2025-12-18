/**
 * Comprehensive SEO Dashboard
 * Monitor and analyze SEO performance, schema validation, and content quality
 */

'use client';

import { useState, useEffect } from 'react';
import { analyzeContent } from '@/lib/seo-content-analyzer';

interface SEOMetrics {
  title: string;
  description: string;
  keywords: string[];
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  images: {
    total: number;
    withAlt: number;
    missingAlt: number;
  };
  links: {
    internal: number;
    external: number;
    broken: number;
  };
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  performanceScore?: number;
  mobileScore?: number;
}

interface SEODashboardProps {
  /**
   * Show in development mode only
   */
  devOnly?: boolean;

  /**
   * Position of the dashboard
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export default function SEODashboard({
  devOnly = true,
  position = 'bottom-right',
}: SEODashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'technical' | 'social'>(
    'overview'
  );

  // Hide in production if devOnly is true
  if (devOnly && process.env.NODE_ENV === 'production') {
    return null;
  }

  useEffect(() => {
    if (isOpen && !metrics) {
      analyzeCurrentPage();
    }
  }, [isOpen]);

  const analyzeCurrentPage = () => {
    if (typeof document === 'undefined') return;

    setLoading(true);

    try {
      // Get page content
      const title = document.title;
      const metaDescription =
        document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const metaKeywords =
        document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';

      // Get headings
      const h1Elements = Array.from(document.querySelectorAll('h1')).map((h) => h.textContent || '');
      const h2Elements = Array.from(document.querySelectorAll('h2')).map((h) => h.textContent || '');
      const h3Elements = Array.from(document.querySelectorAll('h3')).map((h) => h.textContent || '');

      // Get images
      const allImages = Array.from(document.querySelectorAll('img'));
      const imagesWithAlt = allImages.filter((img) => img.alt && img.alt.trim() !== '');

      // Get links
      const allLinks = Array.from(document.querySelectorAll('a'));
      const internalLinks = allLinks.filter(
        (a) => a.hostname === window.location.hostname || a.getAttribute('href')?.startsWith('/')
      );
      const externalLinks = allLinks.filter(
        (a) => a.hostname !== window.location.hostname && !a.getAttribute('href')?.startsWith('/')
      );

      // Get body content for analysis
      const bodyText = document.body.innerText;
      const wordCount = bodyText.split(/\s+/).filter((word) => word.length > 0).length;

      // Analyze content
      const keywords = metaKeywords.split(',').map((k) => k.trim()).filter(Boolean);
      const analysis = analyzeContent(bodyText, keywords);

      // Convert keyword density array to Record format
      const keywordDensityMap: Record<string, number> = {};
      analysis.keywordDensity.forEach((kd) => {
        keywordDensityMap[kd.keyword] = kd.density;
      });

      setMetrics({
        title,
        description: metaDescription,
        keywords,
        headings: {
          h1: h1Elements,
          h2: h2Elements,
          h3: h3Elements,
        },
        images: {
          total: allImages.length,
          withAlt: imagesWithAlt.length,
          missingAlt: allImages.length - imagesWithAlt.length,
        },
        links: {
          internal: internalLinks.length,
          external: externalLinks.length,
          broken: 0, // Would require checking each link
        },
        wordCount,
        readabilityScore: Math.round(analysis.readability.fleschReadingEase),
        keywordDensity: keywordDensityMap,
      });
    } catch (error) {
      console.error('Error analyzing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSEOScore = (): number => {
    if (!metrics) return 0;

    let score = 0;
    const maxScore = 100;

    // Title (15 points)
    if (metrics.title.length >= 30 && metrics.title.length <= 60) score += 15;
    else if (metrics.title.length > 0) score += 7;

    // Description (15 points)
    if (metrics.description.length >= 120 && metrics.description.length <= 160) score += 15;
    else if (metrics.description.length > 0) score += 7;

    // H1 tags (10 points)
    if (metrics.headings.h1.length === 1) score += 10;
    else if (metrics.headings.h1.length > 0) score += 5;

    // Heading structure (10 points)
    if (metrics.headings.h2.length >= 2) score += 10;
    else if (metrics.headings.h2.length > 0) score += 5;

    // Images with alt text (15 points)
    const altTextRatio = metrics.images.total > 0 ? metrics.images.withAlt / metrics.images.total : 1;
    score += Math.round(altTextRatio * 15);

    // Word count (15 points)
    if (metrics.wordCount >= 300) score += 15;
    else if (metrics.wordCount >= 150) score += 10;
    else if (metrics.wordCount > 0) score += 5;

    // Internal links (10 points)
    if (metrics.links.internal >= 3) score += 10;
    else if (metrics.links.internal > 0) score += 5;

    // Readability (10 points)
    score += Math.min(10, Math.round(metrics.readabilityScore / 10));

    return Math.min(maxScore, score);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          title="Open SEO Dashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          SEO
        </button>
      )}

      {/* Dashboard Panel */}
      {isOpen && (
        <div className="bg-background border rounded-lg shadow-2xl w-96 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              SEO Dashboard
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-80 transition-opacity"
              title="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {(['overview', 'content', 'technical', 'social'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-accent border-b-2 border-primary'
                    : 'hover:bg-accent/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading && (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">Analyzing page...</div>
              </div>
            )}

            {!loading && metrics && (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* SEO Score */}
                    <div className="text-center p-6 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">SEO Score</div>
                      <div className={`text-5xl font-bold ${getScoreColor(calculateSEOScore())}`}>
                        {calculateSEOScore()}
                        <span className="text-2xl">/100</span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-accent p-3 rounded">
                        <div className="text-xs text-muted-foreground">Word Count</div>
                        <div className="text-2xl font-bold">{metrics.wordCount}</div>
                      </div>
                      <div className="bg-accent p-3 rounded">
                        <div className="text-xs text-muted-foreground">Readability</div>
                        <div className="text-2xl font-bold">{metrics.readabilityScore}/100</div>
                      </div>
                      <div className="bg-accent p-3 rounded">
                        <div className="text-xs text-muted-foreground">Images</div>
                        <div className="text-2xl font-bold">
                          {metrics.images.withAlt}/{metrics.images.total}
                        </div>
                      </div>
                      <div className="bg-accent p-3 rounded">
                        <div className="text-xs text-muted-foreground">Links</div>
                        <div className="text-2xl font-bold">{metrics.links.internal}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <span>Title</span>
                        <span
                          className={`text-xs ${
                            metrics.title.length >= 30 && metrics.title.length <= 60
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          ({metrics.title.length} chars)
                        </span>
                      </h3>
                      <p className="text-sm bg-accent p-2 rounded">{metrics.title}</p>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <span>Description</span>
                        <span
                          className={`text-xs ${
                            metrics.description.length >= 120 && metrics.description.length <= 160
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          ({metrics.description.length} chars)
                        </span>
                      </h3>
                      <p className="text-sm bg-accent p-2 rounded">{metrics.description || 'None'}</p>
                    </div>

                    {/* Headings */}
                    <div>
                      <h3 className="font-semibold mb-2">Headings</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>H1:</span>
                          <span
                            className={metrics.headings.h1.length === 1 ? 'text-green-600' : 'text-red-600'}
                          >
                            {metrics.headings.h1.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>H2:</span>
                          <span>{metrics.headings.h2.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>H3:</span>
                          <span>{metrics.headings.h3.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Keyword Density */}
                    <div>
                      <h3 className="font-semibold mb-2">Top Keywords</h3>
                      <div className="space-y-1 text-sm">
                        {Object.entries(metrics.keywordDensity)
                          .slice(0, 5)
                          .map(([keyword, density]) => (
                            <div key={keyword} className="flex items-center justify-between">
                              <span>{keyword}</span>
                              <span className="text-muted-foreground">{density.toFixed(2)}%</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'technical' && (
                  <div className="space-y-4">
                    {/* Images */}
                    <div>
                      <h3 className="font-semibold mb-2">Images</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Total:</span>
                          <span>{metrics.images.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>With alt text:</span>
                          <span className="text-green-600">{metrics.images.withAlt}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Missing alt:</span>
                          <span className={metrics.images.missingAlt > 0 ? 'text-red-600' : ''}>
                            {metrics.images.missingAlt}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    <div>
                      <h3 className="font-semibold mb-2">Links</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Internal:</span>
                          <span>{metrics.links.internal}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>External:</span>
                          <span>{metrics.links.external}</span>
                        </div>
                      </div>
                    </div>

                    {/* Schema */}
                    <div>
                      <h3 className="font-semibold mb-2">Structured Data</h3>
                      <p className="text-sm text-muted-foreground">
                        Check schema in browser DevTools or use Google's Rich Results Test
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-4">
                    <div className="bg-accent p-3 rounded">
                      <h3 className="font-semibold mb-2">Social Preview</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Title</div>
                          <div className="font-medium truncate">{metrics.title}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Description</div>
                          <div className="line-clamp-2">{metrics.description}</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        Use social media debugging tools to preview how your page appears when shared:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Facebook Sharing Debugger</li>
                        <li>Twitter Card Validator</li>
                        <li>LinkedIn Post Inspector</li>
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-3 bg-accent/50">
            <button
              onClick={analyzeCurrentPage}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50 text-sm font-medium"
            >
              {loading ? 'Analyzing...' : 'Refresh Analysis'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
