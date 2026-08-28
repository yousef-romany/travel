#!/usr/bin/env node
/**
 * Google Business Reviews Import Script
 * Fetches the aggregate rating & review count from a Google Business Profile
 * via the Google Places API and feeds it into the sitewide schema.
 *
 * Usage:
 *   node scripts/fetch-google-reviews.js --query="ZoeHoliday, Luxor, Egypt"
 *   node scripts/fetch-google-reviews.js --placeId="ChIJ..."
 *
 * Options:
 *   --query="..."     Business name + location to search for
 *   --placeId="..."   Bypass search and use a known Google place_id
 *   --key="..."       Google Places API key (falls back to GOOGLE_PLACES_API_KEY)
 *   --write           Write the values into .env.local automatically
 *   --json            Print raw JSON of the selected place for debugging
 *
 * Environment Variables:
 *   GOOGLE_PLACES_API_KEY         - Your Google Places API key (required)
 *   NEXT_PUBLIC_GOOGLE_RATING     - (written by --write) average rating
 *   NEXT_PUBLIC_GOOGLE_REVIEW_COUNT - (written by --write) number of reviews
 *
 * Get a key from: https://console.cloud.google.com/ → APIs → Places API
 * Enable the "Places API" and create a key with at least the Places request
 * permission.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const candidates = ['.env.local', '.env'];
  for (const name of candidates) {
    const envPath = path.join(__dirname, '..', name);
    if (!fs.existsSync(envPath)) continue;
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = value;
      }
    });
  }
}

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error('Invalid JSON from API: ' + body.slice(0, 200)));
          }
        });
      })
      .on('error', reject);
  });
}

function parseArgs(argv) {
  const args = {};
  argv.forEach((a) => {
    const eq = a.indexOf('=');
    if (a === '--write') args.write = true;
    else if (a === '--json') args.json = true;
    else if (eq > -1) args[a.slice(0, eq)] = a.slice(eq + 1);
  });
  return args;
}

function writeEnv(entries) {
  const envPath = path.join(__dirname, '..', '.env.local');
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  let lines = content.split('\n');
  for (const [key, value] of Object.entries(entries)) {
    const idx = lines.findIndex((l) => l.startsWith(`${key}=`));
    if (idx > -1) lines[idx] = `${key}=${value}`;
    else lines.push(`${key}=${value}`);
  }
  // Drop empty trailing lines, then re-add a single one
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  lines.push('');
  fs.writeFileSync(envPath, lines.join('\n'));
}

async function main() {
  loadEnvFile();
  const a = parseArgs(process.argv.slice(2));
  const apiKey = a.key || process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error(
      '\n❌ No Google Places API key found.\n' +
        '   Provide one via --key="..." or GOOGLE_PLACES_API_KEY in .env.local\n' +
        '   Create a key at https://console.cloud.google.com/ (enable the Places API).\n'
    );
    process.exit(1);
  }

  let place;
  if (a.query) {
    const query = encodeURIComponent(a.query);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;
    console.log('🔎 Searching Google Places for:', a.query);
    const result = await httpsGetJson(url);
    if (result.status !== 'OK' || !result.candidates || result.candidates.length === 0) {
      console.error('❌ Places search failed:', JSON.stringify(result.status || result));
      process.exit(1);
    }
    place = result.candidates[0];
    console.log('   Best match:', place.name, '—', place.formatted_address);
  } else if (a.placeId) {
    place = { place_id: a.placeId };
  } else {
    console.error('\n❌ Provide --query="Business Name, City" or --placeId="...".\n');
    process.exit(1);
  }

  // Fetch details to get the canonical Google Maps URL for sameAs
  let placeUrl = null;
  try {
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(place.place_id)}&fields=url,name,rating,user_ratings_total,formatted_address&key=${apiKey}`;
    const detail = await httpsGetJson(detailUrl);
    if (detail.status === 'OK' && detail.result) {
      placeUrl = detail.result.url || null;
      place.rating = detail.result.rating ?? place.rating;
      place.user_ratings_total =
        detail.result.user_ratings_total ?? place.user_ratings_total;
      place.formatted_address =
        detail.result.formatted_address ?? place.formatted_address;
    }
  } catch (e) {
    console.warn('⚠️  Could not fetch place details:', e.message);
  }

  if (place.rating == null || place.user_ratings_total == null) {
    console.error('❌ No rating/review count found for the selected place.');
    process.exit(1);
  }

  const rating = Number(place.rating).toFixed(1);
  const count = String(place.user_ratings_total);

  if (a.json) {
    console.log(
      JSON.stringify(
        {
          name: place.name,
          address: place.formatted_address,
          rating,
          ratingCount: count,
          url: placeUrl,
        },
        null,
        2
      )
    );
  } else {
    console.log('\n📊 Google Business review summary:');
    console.log('   Rating:', rating, '★');
    console.log('   Review count:', count);
    if (placeUrl) console.log('   Profile URL:', placeUrl);
  }

  const entries = {
    NEXT_PUBLIC_GOOGLE_RATING: rating,
    NEXT_PUBLIC_GOOGLE_REVIEW_COUNT: count,
  };
  if (placeUrl) entries.NEXT_PUBLIC_GOOGLE_REVIEWS_URL = placeUrl;

  if (a.write) {
    writeEnv(entries);
    console.log('\n✅ Wrote to .env.local:', Object.keys(entries).join(', '));
  } else {
    console.log(
      '\nTo persist these, re-run with --write (or set:\n' +
        '   NEXT_PUBLIC_GOOGLE_RATING=' +
        rating +
        '\n   NEXT_PUBLIC_GOOGLE_REVIEW_COUNT=' +
        count +
        '\n   NEXT_PUBLIC_GOOGLE_REVIEWS_URL=' +
        (placeUrl || '<your-google-maps-url>') +
        ')\n'
    );
  }
}

main().catch((e) => {
  console.error('❌ Unhandled error:', e);
  process.exit(1);
});
