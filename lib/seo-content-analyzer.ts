/**
 * Advanced SEO Content Analyzer
 * Analyzes content quality, keyword optimization, readability, and SEO best practices
 */

export interface ContentAnalysisResult {
  score: number; // 0-100
  wordCount: number;
  characterCount: number;
  readingTime: number; // minutes
  keywordDensity: KeywordDensity[];
  readability: ReadabilityScore;
  headingStructure: HeadingAnalysis;
  linkAnalysis: LinkAnalysis;
  imageAnalysis: ImageAnalysis;
  recommendations: string[];
}

export interface KeywordDensity {
  keyword: string;
  count: number;
  density: number; // percentage
  isOptimal: boolean;
}

export interface ReadabilityScore {
  fleschReadingEase: number; // 0-100, higher is easier
  fleschKincaidGrade: number; // US grade level
  averageWordsPerSentence: number;
  averageSyllablesPerWord: number;
  readabilityLevel: 'Very Easy' | 'Easy' | 'Fairly Easy' | 'Standard' | 'Fairly Difficult' | 'Difficult' | 'Very Difficult';
}

export interface HeadingAnalysis {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  hasMultipleH1: boolean;
  isWellStructured: boolean;
  missingLevels: number[];
}

export interface LinkAnalysis {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: string[];
  linkDensity: number; // percentage
  isOptimal: boolean;
}

export interface ImageAnalysis {
  totalImages: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  altTextQuality: 'Excellent' | 'Good' | 'Poor' | 'Missing';
  averageAltLength: number;
}

/**
 * Analyze content for SEO quality
 */
export function analyzeContent(
  htmlContent: string,
  targetKeywords: string[] = []
): ContentAnalysisResult {
  // Strip HTML tags for text analysis
  const textContent = stripHtml(htmlContent);

  const wordCount = countWords(textContent);
  const characterCount = textContent.length;
  const readingTime = calculateReadingTime(textContent);
  const keywordDensity = analyzeKeywordDensity(textContent, targetKeywords);
  const readability = calculateReadability(textContent);
  const headingStructure = analyzeHeadingStructure(htmlContent);
  const linkAnalysis = analyzeLinkStructure(htmlContent);
  const imageAnalysis = analyzeImages(htmlContent);

  const recommendations = generateRecommendations({
    wordCount,
    keywordDensity,
    readability,
    headingStructure,
    linkAnalysis,
    imageAnalysis,
  });

  const score = calculateOverallScore({
    wordCount,
    keywordDensity,
    readability,
    headingStructure,
    linkAnalysis,
    imageAnalysis,
  });

  return {
    score,
    wordCount,
    characterCount,
    readingTime,
    keywordDensity,
    readability,
    headingStructure,
    linkAnalysis,
    imageAnalysis,
    recommendations,
  };
}

/**
 * Strip HTML tags from content
 */
function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate reading time (average 200 words per minute)
 */
function calculateReadingTime(text: string): number {
  const words = countWords(text);
  return Math.ceil(words / 200);
}

/**
 * Analyze keyword density
 */
function analyzeKeywordDensity(text: string, keywords: string[]): KeywordDensity[] {
  const totalWords = countWords(text);
  const lowerText = text.toLowerCase();

  return keywords.map(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    const regex = new RegExp(`\\b${lowerKeyword}\\b`, 'gi');
    const matches = lowerText.match(regex);
    const count = matches ? matches.length : 0;
    const density = (count / totalWords) * 100;

    // Optimal keyword density is 1-3%
    const isOptimal = density >= 1 && density <= 3;

    return {
      keyword,
      count,
      density: parseFloat(density.toFixed(2)),
      isOptimal,
    };
  });
}

/**
 * Calculate Flesch Reading Ease and Flesch-Kincaid Grade Level
 */
function calculateReadability(text: string): ReadabilityScore {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);

  const sentenceCount = sentences.length || 1;
  const wordCount = words.length || 1;
  const syllableCount = syllables || 1;

  const averageWordsPerSentence = wordCount / sentenceCount;
  const averageSyllablesPerWord = syllableCount / wordCount;

  // Flesch Reading Ease: 206.835 - 1.015(total words/total sentences) - 84.6(total syllables/total words)
  const fleschReadingEase = 206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord);

  // Flesch-Kincaid Grade Level: 0.39(total words/total sentences) + 11.8(total syllables/total words) - 15.59
  const fleschKincaidGrade = (0.39 * averageWordsPerSentence) + (11.8 * averageSyllablesPerWord) - 15.59;

  let readabilityLevel: ReadabilityScore['readabilityLevel'];
  if (fleschReadingEase >= 90) readabilityLevel = 'Very Easy';
  else if (fleschReadingEase >= 80) readabilityLevel = 'Easy';
  else if (fleschReadingEase >= 70) readabilityLevel = 'Fairly Easy';
  else if (fleschReadingEase >= 60) readabilityLevel = 'Standard';
  else if (fleschReadingEase >= 50) readabilityLevel = 'Fairly Difficult';
  else if (fleschReadingEase >= 30) readabilityLevel = 'Difficult';
  else readabilityLevel = 'Very Difficult';

  return {
    fleschReadingEase: Math.max(0, Math.min(100, parseFloat(fleschReadingEase.toFixed(2)))),
    fleschKincaidGrade: Math.max(0, parseFloat(fleschKincaidGrade.toFixed(2))),
    averageWordsPerSentence: parseFloat(averageWordsPerSentence.toFixed(2)),
    averageSyllablesPerWord: parseFloat(averageSyllablesPerWord.toFixed(2)),
    readabilityLevel,
  };
}

/**
 * Count syllables in a word (approximation)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  // Remove non-letters
  word = word.replace(/[^a-z]/g, '');

  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 0;

  // Adjust for silent 'e'
  if (word.endsWith('e')) count--;

  // Adjust for 'le' ending
  if (word.endsWith('le') && word.length > 2 && !/[aeiouy]/.test(word[word.length - 3])) {
    count++;
  }

  return Math.max(1, count);
}

/**
 * Analyze heading structure
 */
function analyzeHeadingStructure(html: string): HeadingAnalysis {
  const h1Count = (html.match(/<h1/gi) || []).length;
  const h2Count = (html.match(/<h2/gi) || []).length;
  const h3Count = (html.match(/<h3/gi) || []).length;
  const h4Count = (html.match(/<h4/gi) || []).length;
  const h5Count = (html.match(/<h5/gi) || []).length;
  const h6Count = (html.match(/<h6/gi) || []).length;

  const hasMultipleH1 = h1Count > 1;

  // Check if heading levels are used in order (no skipped levels)
  const missingLevels: number[] = [];
  if (h3Count > 0 && h2Count === 0) missingLevels.push(2);
  if (h4Count > 0 && h3Count === 0) missingLevels.push(3);
  if (h5Count > 0 && h4Count === 0) missingLevels.push(4);
  if (h6Count > 0 && h5Count === 0) missingLevels.push(5);

  const isWellStructured = h1Count === 1 && missingLevels.length === 0;

  return {
    h1Count,
    h2Count,
    h3Count,
    h4Count,
    h5Count,
    h6Count,
    hasMultipleH1,
    isWellStructured,
    missingLevels,
  };
}

/**
 * Analyze link structure
 */
function analyzeLinkStructure(html: string): LinkAnalysis {
  const linkRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi;
  const links = html.match(linkRegex) || [];

  let internalLinks = 0;
  let externalLinks = 0;
  const brokenLinks: string[] = [];

  links.forEach(link => {
    const hrefMatch = link.match(/href=["']([^"']*)["']/i);
    if (hrefMatch) {
      const href = hrefMatch[1];
      if (href.startsWith('/') || href.startsWith('#')) {
        internalLinks++;
      } else if (href.startsWith('http')) {
        externalLinks++;
      }

      // Check for obviously broken links
      if (href === '#' || href === '' || href === 'javascript:void(0)') {
        brokenLinks.push(href);
      }
    }
  });

  const totalLinks = internalLinks + externalLinks;
  const textContent = stripHtml(html);
  const wordCount = countWords(textContent);
  const linkDensity = (totalLinks / wordCount) * 100;

  // Optimal link density is 2-3%
  const isOptimal = linkDensity >= 2 && linkDensity <= 3;

  return {
    totalLinks,
    internalLinks,
    externalLinks,
    brokenLinks,
    linkDensity: parseFloat(linkDensity.toFixed(2)),
    isOptimal,
  };
}

/**
 * Analyze images
 */
function analyzeImages(html: string): ImageAnalysis {
  const imgRegex = /<img\s+[^>]*>/gi;
  const images = html.match(imgRegex) || [];

  const totalImages = images.length;
  let imagesWithAlt = 0;
  let totalAltLength = 0;

  images.forEach(img => {
    const altMatch = img.match(/alt=["']([^"']*)["']/i);
    if (altMatch && altMatch[1].trim().length > 0) {
      imagesWithAlt++;
      totalAltLength += altMatch[1].length;
    }
  });

  const imagesWithoutAlt = totalImages - imagesWithAlt;
  const averageAltLength = imagesWithAlt > 0 ? totalAltLength / imagesWithAlt : 0;

  let altTextQuality: ImageAnalysis['altTextQuality'];
  if (imagesWithoutAlt === 0 && averageAltLength >= 50 && averageAltLength <= 125) {
    altTextQuality = 'Excellent';
  } else if (imagesWithoutAlt <= totalImages * 0.1) {
    altTextQuality = 'Good';
  } else if (imagesWithoutAlt <= totalImages * 0.5) {
    altTextQuality = 'Poor';
  } else {
    altTextQuality = 'Missing';
  }

  return {
    totalImages,
    imagesWithAlt,
    imagesWithoutAlt,
    altTextQuality,
    averageAltLength: parseFloat(averageAltLength.toFixed(2)),
  };
}

/**
 * Generate SEO recommendations
 */
function generateRecommendations(data: {
  wordCount: number;
  keywordDensity: KeywordDensity[];
  readability: ReadabilityScore;
  headingStructure: HeadingAnalysis;
  linkAnalysis: LinkAnalysis;
  imageAnalysis: ImageAnalysis;
}): string[] {
  const recommendations: string[] = [];

  // Word count
  if (data.wordCount < 300) {
    recommendations.push(`Content is too short (${data.wordCount} words). Aim for at least 300 words for better SEO.`);
  } else if (data.wordCount < 600) {
    recommendations.push(`Content could be longer (${data.wordCount} words). Consider adding more detail for better rankings.`);
  }

  // Keyword density
  data.keywordDensity.forEach(kw => {
    if (kw.density < 1) {
      recommendations.push(`Keyword "${kw.keyword}" appears too rarely (${kw.density}%). Increase usage to 1-3%.`);
    } else if (kw.density > 3) {
      recommendations.push(`Keyword "${kw.keyword}" may be overused (${kw.density}%). Reduce to avoid keyword stuffing.`);
    }
  });

  // Readability
  if (data.readability.fleschReadingEase < 60) {
    recommendations.push(`Content readability is ${data.readability.readabilityLevel}. Simplify sentences for better user experience.`);
  }

  // Heading structure
  if (data.headingStructure.h1Count === 0) {
    recommendations.push('Missing H1 heading. Add a main heading to your content.');
  } else if (data.headingStructure.hasMultipleH1) {
    recommendations.push(`Multiple H1 headings found (${data.headingStructure.h1Count}). Use only one H1 per page.`);
  }

  if (data.headingStructure.missingLevels.length > 0) {
    recommendations.push(`Heading structure has gaps. Missing levels: H${data.headingStructure.missingLevels.join(', H')}.`);
  }

  if (data.headingStructure.h2Count === 0) {
    recommendations.push('No H2 headings found. Add subheadings to structure your content.');
  }

  // Links
  if (!data.linkAnalysis.isOptimal) {
    if (data.linkAnalysis.linkDensity < 2) {
      recommendations.push(`Add more internal links (current density: ${data.linkAnalysis.linkDensity}%). Aim for 2-3%.`);
    } else if (data.linkAnalysis.linkDensity > 3) {
      recommendations.push(`Too many links (current density: ${data.linkAnalysis.linkDensity}%). Reduce to 2-3% for optimal SEO.`);
    }
  }

  if (data.linkAnalysis.brokenLinks.length > 0) {
    recommendations.push(`Found ${data.linkAnalysis.brokenLinks.length} broken or empty links. Fix or remove them.`);
  }

  // Images
  if (data.imageAnalysis.imagesWithoutAlt > 0) {
    recommendations.push(`${data.imageAnalysis.imagesWithoutAlt} images are missing alt text. Add descriptive alt attributes.`);
  }

  if (data.imageAnalysis.averageAltLength < 50) {
    recommendations.push(`Alt text is too short (avg: ${data.imageAnalysis.averageAltLength} chars). Aim for 50-125 characters.`);
  } else if (data.imageAnalysis.averageAltLength > 125) {
    recommendations.push(`Alt text is too long (avg: ${data.imageAnalysis.averageAltLength} chars). Keep it under 125 characters.`);
  }

  return recommendations;
}

/**
 * Calculate overall SEO score (0-100)
 */
function calculateOverallScore(data: {
  wordCount: number;
  keywordDensity: KeywordDensity[];
  readability: ReadabilityScore;
  headingStructure: HeadingAnalysis;
  linkAnalysis: LinkAnalysis;
  imageAnalysis: ImageAnalysis;
}): number {
  let score = 0;

  // Word count (max 20 points)
  if (data.wordCount >= 1000) score += 20;
  else if (data.wordCount >= 600) score += 15;
  else if (data.wordCount >= 300) score += 10;
  else score += 5;

  // Keyword optimization (max 20 points)
  const optimalKeywords = data.keywordDensity.filter(kw => kw.isOptimal).length;
  const totalKeywords = data.keywordDensity.length || 1;
  score += (optimalKeywords / totalKeywords) * 20;

  // Readability (max 15 points)
  if (data.readability.fleschReadingEase >= 60) score += 15;
  else if (data.readability.fleschReadingEase >= 50) score += 10;
  else score += 5;

  // Heading structure (max 20 points)
  if (data.headingStructure.isWellStructured) {
    score += 20;
  } else {
    if (data.headingStructure.h1Count === 1) score += 10;
    if (data.headingStructure.h2Count > 0) score += 5;
    if (data.headingStructure.missingLevels.length === 0) score += 5;
  }

  // Link analysis (max 15 points)
  if (data.linkAnalysis.isOptimal && data.linkAnalysis.brokenLinks.length === 0) {
    score += 15;
  } else {
    if (data.linkAnalysis.totalLinks > 0) score += 5;
    if (data.linkAnalysis.internalLinks > 0) score += 5;
    if (data.linkAnalysis.brokenLinks.length === 0) score += 5;
  }

  // Image optimization (max 10 points)
  if (data.imageAnalysis.altTextQuality === 'Excellent') score += 10;
  else if (data.imageAnalysis.altTextQuality === 'Good') score += 7;
  else if (data.imageAnalysis.altTextQuality === 'Poor') score += 3;

  return Math.min(100, Math.round(score));
}

/**
 * Generate SEO-optimized alt text for images
 */
export function generateAltText(
  imageContext: {
    fileName?: string;
    pageTitle?: string;
    nearbyText?: string;
    location?: string;
    category?: string;
  }
): string {
  const parts: string[] = [];

  // Use page context
  if (imageContext.pageTitle) {
    parts.push(imageContext.pageTitle);
  }

  // Add location if available
  if (imageContext.location) {
    parts.push(imageContext.location);
  }

  // Add category
  if (imageContext.category) {
    parts.push(imageContext.category);
  }

  // Use nearby text if available
  if (imageContext.nearbyText) {
    const cleanText = imageContext.nearbyText
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100);
    parts.push(cleanText);
  }

  // Fallback to filename
  if (parts.length === 0 && imageContext.fileName) {
    const cleanFileName = imageContext.fileName
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    parts.push(cleanFileName);
  }

  // Combine and limit length
  let altText = parts.join(' - ');
  if (altText.length > 125) {
    altText = altText.substring(0, 122) + '...';
  }

  return altText || 'Image';
}
