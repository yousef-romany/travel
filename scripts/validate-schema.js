#!/usr/bin/env node
/**
 * Schema Validator for ZoeHolidays
 * Validates generated JSON-LD structured data before deploy.
 *
 * Catches the Ahrefs/Google structured-data issues that would otherwise only
 * surface after deploy:
 *   ❌ Missing @context
 *   ❌ Missing @type
 *   ❌ Empty required value
 *   ❌ Invalid URL
 *   ❌ Invalid ISO 8601 date
 *   ❌ Non schema.org @context
 *
 * Usage:
 *   node scripts/validate-schema.js                 # validate built-in fixtures
 *   node scripts/validate-schema.js file.json ...   # also validate given JSON-LD files
 *   node scripts/validate-schema.js --dir ./seo-jsonld  # validate all files in a dir
 *
 * Exit code: 0 = all valid, 1 = errors found.
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  RESET: '\x1b[0m',
};

function log(message, color = COLORS.RESET) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function err(message) {
  log(`❌ ${message}`, COLORS.RED);
}
function ok(message) {
  log(`✅ ${message}`, COLORS.GREEN);
}
function warn(message) {
  log(`⚠️  ${message}`, COLORS.YELLOW);
}
function info(message) {
  log(`ℹ️  ${message}`, COLORS.BLUE);
}

// Load .env so NEXT_PUBLIC_SITE_URL is available for URL validation
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const m = line.match(/^([^=:#]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
      }
    });
  }
}
loadEnvFile();

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://zoeholidays.com';
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.zoeholidays.com';

// Properties whose values must be absolute http(s) URLs when present.
const URL_PROPERTIES = new Set([
  'url',
  'image',
  'logo',
  'sameAs',
  'item',
  'contentUrl',
  'thumbnailUrl',
  'embedUrl',
  'uploadUrl',
  'acquireLicensePage',
  'license',
  'video',
  'mainEntityOfPage',
  'potentialAction',
  'identifier',
]);

// Properties that must resolve to absolute http(s) URLs or be omitted.
function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Fixtures mirroring the actual output of the components in components/seo/.
function buildFixtures() {
  return [
    {
      name: 'Organization',
      schema: {
        '@context': 'https://schema.org',
        '@type': ['TravelAgency', 'LocalBusiness', 'Organization'],
        name: 'ZoeHoliday',
        url: `${SITE_URL}`,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        telephone: '+20-103-035-4067',
        email: 'info@zoeholidays.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Luxor, Egypt',
          addressLocality: 'Luxor',
          addressRegion: 'Luxor Governorate',
          addressCountry: 'EG',
          postalCode: '85951',
        },
        sameAs: [
          'https://www.instagram.com/zoeholiday',
          'https://twitter.com/zoeholiday',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '523',
          bestRating: '5',
          worstRating: '1',
        },
      },
    },
    {
      name: 'WebSite',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ZoeHoliday',
        url: `${SITE_URL}`,
      },
    },
    {
      name: 'Breadcrumb',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}` },
          { '@type': 'ListItem', position: 2, name: 'Programs', item: `${SITE_URL}/programs` },
        ],
      },
    },
    {
      name: 'TouristTrip',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: 'Cairo & Nile Cruise 8 Days',
        description: 'A premium 8-day Egypt tour covering Cairo and the Nile.',
        image: `${STRAPI_URL}/uploads/hero.jpg`,
        url: `${SITE_URL}/programs/abc123`,
        offers: {
          '@type': 'Offer',
          price: 1200,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          validFrom: new Date().toISOString(),
          url: `${SITE_URL}/programs/abc123`,
        },
        duration: 'P8D',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '120',
        },
        subjectOf: { '@type': 'TouristDestination', name: 'Cairo' },
      },
    },
    {
      name: 'Article',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Top 10 Things to Do in Luxor',
        description: 'A guide to Luxor.',
        image: `${SITE_URL}/img/luxor.jpg`,
        datePublished: '2026-08-01',
        dateModified: '2026-08-20',
        author: { '@type': 'Organization', name: 'ZoeHoliday' },
        publisher: { '@type': 'Organization', name: 'ZoeHoliday' },
        mainEntityOfPage: `${SITE_URL}/inspiration/...`,
      },
    },
    {
      name: 'Event',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Abu Simbel Sound & Light Show',
        startDate: '2026-10-01T19:00:00',
        image: `${STRAPI_URL}/uploads/event.jpg`,
        location: {
          '@type': 'Place',
          name: 'Abu Simbel Temples',
          address: { '@type': 'PostalAddress', addressCountry: 'EG' },
        },
        url: `${SITE_URL}/events/abu-simbel-show`,
      },
    },
    {
      name: 'Review',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: { '@type': 'TouristTrip', name: 'Nile Cruise' },
        author: { '@type': 'Person', name: 'John Doe' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody: 'Amazing experience!',
      },
    },
    {
      name: 'FAQPage',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is Egypt safe for tourists?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes.' },
          },
        ],
      },
    },
  ];
}

function validateSchema(name, schema) {
  const issues = { error: [], warn: [] };
  const label = `[${name}]`;

  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    issues.error.push(`${label} Schema is not an object`);
    return issues;
  }

  // @context
  if (!('@context' in schema)) {
    issues.error.push(`${label} Missing @context`);
  } else {
    const ctx = schema['@context'];
    if (Array.isArray(ctx)) {
      if (!ctx.includes('https://schema.org')) {
        issues.error.push(`${label} Array @context does not include schema.org`);
      }
    } else if (typeof ctx !== 'string') {
      issues.error.push(`${label} @context must be a string or array`);
    } else if (ctx !== 'https://schema.org' && ctx !== 'http://schema.org') {
      issues.error.push(`${label} @context "${ctx}" is not schema.org`);
    }
  }

  // @type
  if (!('@type' in schema) || !schema['@type']) {
    issues.error.push(`${label} Missing @type`);
  } else {
    const types = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']];
    if (types.some((t) => typeof t !== 'string' || !t.trim())) {
      issues.error.push(`${label} @type contains empty/invalid value`);
    }
  }

  // Empty required string fields
  ['name', 'headline', 'description', 'reviewBody', 'text', 'answer'].forEach((k) => {
    if (k in schema && typeof schema[k] === 'string' && !schema[k].trim()) {
      issues.error.push(`${label} Empty "${k}" value`);
    }
  });

  // Require a name/headline only for content types that genuinely need one.
  const nodeTypes = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']];
  const NAME_REQUIRED = new Set([
    'Organization', 'WebSite', 'TouristTrip', 'Article', 'BlogPosting',
    'Event', 'Product', 'Hotel', 'LodgingBusiness', 'Service', 'Place',
  ]);
  if (
    nodeTypes.some((t) => NAME_REQUIRED.has(t)) &&
    schema.name === undefined && schema.headline === undefined
  ) {
    issues.error.push(`${label} "${nodeTypes.join(',')}" requires a "name"`);
  }

  // URL-like properties must be absolute http(s) URLs or arrays of them
  for (const [key, value] of Object.entries(schema)) {
    if (!URL_PROPERTIES.has(key)) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (typeof v !== 'string') continue;
      if (!isValidHttpUrl(v)) {
        issues.error.push(`${label} ${key} is not a valid http(s) URL: "${v}"`);
      }
    }
  }

  // Date properties must be valid ISO 8601 (date or date-time)
  ['datePublished', 'dateModified', 'startDate', 'endDate', 'validFrom', 'validUntil', 'uploadDate'].forEach((k) => {
    if (k in schema && schema[k]) {
      const v = schema[k];
      if (typeof v !== 'string' || Number.isNaN(Date.parse(v))) {
        issues.error.push(`${label} ${k} is not a valid ISO 8601 date: "${v}"`);
      }
    }
  });

  // ratingValue must be a valid number in range
  if (schema.aggregateRating || schema.reviewRating) {
    const rating = schema.aggregateRating || schema.reviewRating;
    if (rating && typeof rating === 'object') {
      const rv = Number(rating.ratingValue);
      if (rating.ratingValue !== undefined && (Number.isNaN(rv) || rv <= 0 || rv > 5)) {
        issues.warn.push(`${label} ratingValue "${rating.ratingValue}" out of expected 1-5 range`);
      }
    }
  }

  return issues;
}

// Load external files (.json / .jsonld) given as args or via --dir
function loadExternalFiles() {
  const args = process.argv.slice(2);
  const files = [];
  let dirMode = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir') {
      dirMode = args[i + 1];
      i++;
    } else if (!args[i].startsWith('-')) {
      files.push(args[i]);
    }
  }

  const result = [];
  if (dirMode && fs.existsSync(dirMode)) {
    fs.readdirSync(dirMode, { withFileTypes: true }).forEach((entry) => {
      if (entry.isFile() && /\.(json|jsonld)$/.test(entry.name)) {
        result.push(path.join(dirMode, entry.name));
      }
    });
  }
  files.forEach((f) => result.push(f));
  return result.filter((f) => fs.existsSync(f));
}

function run() {
  console.log('');
  log('═══════════════════════════════════════════════════════════', COLORS.CYAN);
  log('   Schema Validator', COLORS.CYAN);
  log('═══════════════════════════════════════════════════════════', COLORS.CYAN);
  console.log('');

  let totalErrors = 0;
  let totalWarnings = 0;
  let totalChecked = 0;

  // 1) Validate built-in fixtures mirroring components/seo/
  const fixtures = buildFixtures();
  const fixtureErrors = [];
  const fixtureWarnings = [];

  for (const fix of fixtures) {
    totalChecked++;
    const issues = validateSchema(fix.name, fix.schema);
    issues.error.forEach((m) => fixtureErrors.push(m));
    issues.warn.forEach((m) => fixtureWarnings.push(m));
  }

  if (fixtureErrors.length > 0) {
    err(`Built-in schema fixtures found ${fixtureErrors.length} ERROR(s):`);
    fixtureErrors.forEach((m) => err(`  ${m}`));
  } else {
    ok(`Built-in schema fixtures (${fixtures.length}) — all valid`);
  }
  fixtureWarnings.forEach((m) => warn(`  ${m}`));
  totalErrors += fixtureErrors.length;
  totalWarnings += fixtureWarnings.length;

  // 2) Validate any external JSON-LD files provided
  const externalFiles = loadExternalFiles();
  for (const file of externalFiles) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      totalErrors += 1;
      err(`[${file}] Failed to parse JSON: ${e.message}`);
      continue;
    }
    const list = Array.isArray(data) ? data : [data];
    for (const item of list) {
      totalChecked++;
      const issues = validateSchema(path.basename(file), item);
      if (issues.error.length > 0) {
        err(`[${path.basename(file)}]`);
        issues.error.forEach((m) => err(`  ${m}`));
        totalErrors += issues.error.length;
      } else {
        ok(`[${path.basename(file)}] valid`);
      }
      issues.warn.forEach((m) => warn(`  ${m}`));
      totalWarnings += issues.warn.length;
    }
  }

  // 3) Report
  console.log('');
  log('─────────────────────────────────────────────────────────────', COLORS.BLUE);
  log('Summary', COLORS.BLUE);
  log('─────────────────────────────────────────────────────────────', COLORS.BLUE);
  info(`Schemas checked: ${totalChecked}`);
  if (totalErrors > 0) {
    err(`Errors: ${totalErrors}`);
  } else {
    ok(`Errors: 0`);
  }
  if (totalWarnings > 0) {
    warn(`Warnings: ${totalWarnings}`);
  } else {
    info(`Warnings: 0`);
  }

  console.log('');
  log('═══════════════════════════════════════════════════════════', COLORS.CYAN);

  if (totalErrors > 0) {
    err('Schema validation FAILED. Fix errors before deploying.');
    log('═══════════════════════════════════════════════════════════', COLORS.CYAN);
    console.log('');
    process.exit(1);
  }

  ok('Schema validation PASSED ✨');
  log('═══════════════════════════════════════════════════════════', COLORS.CYAN);
  console.log('');
  process.exit(0);
}

run();
