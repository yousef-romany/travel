/**
 * Internal Linking Helper for SEO
 * Automatically suggests related content links for better site architecture
 */

export interface RelatedLink {
  title: string;
  url: string;
  type: 'program' | 'destination' | 'article' | 'category';
  relevanceScore: number;
}

/**
 * Generate related internal links based on content
 */
export function generateRelatedLinks(
  currentPage: {
    type: 'program' | 'destination' | 'article';
    location?: string;
    category?: string;
    tags?: string[];
  },
  allContent: Array<{
    id: string;
    title: string;
    type: 'program' | 'destination' | 'article';
    location?: string;
    category?: string;
    tags?: string[];
  }>,
  maxLinks: number = 5
): RelatedLink[] {
  const links: RelatedLink[] = [];

  allContent.forEach(content => {
    if (content.id === (currentPage as any).id) return; // Skip self

    let relevanceScore = 0;

    // Same location = high relevance
    if (currentPage.location && content.location === currentPage.location) {
      relevanceScore += 3;
    }

    // Same category = medium relevance
    if (currentPage.category && content.category === currentPage.category) {
      relevanceScore += 2;
    }

    // Shared tags = low-medium relevance
    if (currentPage.tags && content.tags) {
      const sharedTags = currentPage.tags.filter(tag =>
        content.tags?.includes(tag)
      );
      relevanceScore += sharedTags.length * 0.5;
    }

    // Same type = small boost
    if (currentPage.type === content.type) {
      relevanceScore += 0.5;
    }

    if (relevanceScore > 0) {
      links.push({
        title: content.title,
        url: `/${content.type === 'program' ? 'programs' : content.type === 'destination' ? 'destinations' : 'inspiration'}/${content.id}`,
        type: content.type,
        relevanceScore,
      });
    }
  });

  // Sort by relevance and return top N
  return links
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxLinks);
}

/**
 * Generate breadcrumb links for current page
 */
export function generateBreadcrumbLinks(pathname: string): Array<{ label: string; href: string }> {
  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: 'Home', href: '/' },
  ];

  let currentPath = '';
  parts.forEach((part, index) => {
    currentPath += `/${part}`;

    // Format the label (capitalize, replace hyphens)
    const label = part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Get anchor text suggestions for internal links
 */
export function getAnchorTextSuggestions(
  targetPageTitle: string,
  targetLocation?: string
): string[] {
  const suggestions = [
    targetPageTitle,
    `Explore ${targetPageTitle}`,
    `Learn more about ${targetPageTitle}`,
  ];

  if (targetLocation) {
    suggestions.push(
      `${targetLocation} tours`,
      `Visit ${targetLocation}`,
      `${targetLocation} travel guide`
    );
  }

  return suggestions;
}

/**
 * Calculate internal link density for a page
 * Recommended: 2-3% of total words should be internal links
 */
export function calculateLinkDensity(
  totalWords: number,
  totalInternalLinks: number
): {
  density: number;
  isOptimal: boolean;
  recommendation: string;
} {
  const density = (totalInternalLinks / totalWords) * 100;
  const isOptimal = density >= 2 && density <= 3;

  let recommendation = '';
  if (density < 2) {
    recommendation = `Add ${Math.ceil((totalWords * 0.02) - totalInternalLinks)} more internal links for optimal SEO.`;
  } else if (density > 3) {
    recommendation = `Consider removing ${Math.ceil(totalInternalLinks - (totalWords * 0.03))} internal links to avoid over-optimization.`;
  } else {
    recommendation = 'Internal link density is optimal!';
  }

  return {
    density: parseFloat(density.toFixed(2)),
    isOptimal,
    recommendation,
  };
}

/**
 * Generate contextual internal links within content
 */
export function injectContextualLinks(
  content: string,
  availableLinks: Array<{ keyword: string; url: string; title: string }>,
  maxLinks: number = 3
): string {
  let modifiedContent = content;
  let linksAdded = 0;

  availableLinks.forEach(link => {
    if (linksAdded >= maxLinks) return;

    // Case-insensitive search for keyword
    const regex = new RegExp(`\\b${link.keyword}\\b`, 'i');
    const match = modifiedContent.match(regex);

    if (match && !modifiedContent.includes(`href="${link.url}"`)) {
      // Replace first occurrence with link
      modifiedContent = modifiedContent.replace(
        regex,
        `<a href="${link.url}" title="${link.title}" class="internal-link">${match[0]}</a>`
      );
      linksAdded++;
    }
  });

  return modifiedContent;
}
