#!/usr/bin/env node

/**
 * Test Strapi API Token Permissions
 *
 * This script tests if your Strapi API token has the correct permissions
 * for all collection types used in your Next.js application.
 *
 * Usage: node test-strapi-token.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const STRAPI_URL = env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = env.NEXT_PUBLIC_STRAPI_TOKEN;

// All collection types used in your app
const COLLECTIONS = [
  'inspire-categories',
  'inspire-subcategories',
  'inspire-blogs',
  'place-to-go-categories',
  'place-to-go-subcategories',
  'place-to-go-blogs',
  'programs',
  'events',
  'instagram-posts',
  'testimonials',
  'testimonial-votes',
  'bookings',
  'invoices',
  'plan-trips',
  'program-availabilities',
  'promo-codes',
  'referrals',
  'social-shares',
  'loyalty',
  'loyalty-transactions',
  'wishlists',
  'profiles',
];

async function testCollection(collection) {
  try {
    const url = `${STRAPI_URL}/api/${collection}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    if (response.status === 200) {
      const count = response.data.data?.length || 0;
      return {
        collection,
        status: '✅ PASS',
        statusCode: 200,
        message: `Found ${count} entries`,
      };
    }
  } catch (error) {
    if (error.response) {
      return {
        collection,
        status: '❌ FAIL',
        statusCode: error.response.status,
        message: error.response.data?.error?.message || error.message,
      };
    } else {
      return {
        collection,
        status: '⚠️  ERROR',
        statusCode: 'N/A',
        message: error.message,
      };
    }
  }
}

async function main() {
  console.log('🔍 Testing Strapi API Token Permissions\n');
  console.log(`Strapi URL: ${STRAPI_URL}`);
  console.log(`Token: ${STRAPI_TOKEN ? STRAPI_TOKEN.substring(0, 20) + '...' : 'NOT SET'}\n`);

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error('❌ ERROR: Missing environment variables!');
    console.error('Make sure NEXT_PUBLIC_STRAPI_URL and NEXT_PUBLIC_STRAPI_TOKEN are set in .env\n');
    process.exit(1);
  }

  console.log('Testing all collection types...\n');

  const results = [];

  // Test collections sequentially to avoid rate limiting
  for (const collection of COLLECTIONS) {
    process.stdout.write(`Testing ${collection}...`);
    const result = await testCollection(collection);
    results.push(result);
    process.stdout.write(`\r`);
  }

  // Print results
  console.log('━'.repeat(80));
  console.log('RESULTS:');
  console.log('━'.repeat(80));

  results.forEach(result => {
    console.log(
      `${result.status.padEnd(10)} | ${result.collection.padEnd(30)} | ${result.statusCode} - ${result.message}`
    );
  });

  console.log('━'.repeat(80));

  // Summary
  const passed = results.filter(r => r.status === '✅ PASS').length;
  const failed = results.filter(r => r.status === '❌ FAIL').length;
  const errors = results.filter(r => r.status === '⚠️  ERROR').length;

  console.log(`\nSummary: ${passed} passed, ${failed} failed, ${errors} errors\n`);

  if (failed > 0) {
    console.log('🔧 ACTION REQUIRED:');
    console.log('Some collections returned 401 Unauthorized or 403 Forbidden.');
    console.log('You need to configure token permissions in Strapi:\n');
    console.log('1. Go to Strapi Admin → Settings → API Tokens');
    console.log('2. Edit your token or create a new one');
    console.log('3. Enable "find" and "findOne" permissions for failed collections');
    console.log('4. OR set the token to "Full Access" (not recommended for production)');
    console.log('\nSee STRAPI_TOKEN_FIX.md for detailed instructions.\n');
  } else if (passed === COLLECTIONS.length) {
    console.log('✅ All collections are accessible! Token permissions are correctly configured.\n');
  }
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
