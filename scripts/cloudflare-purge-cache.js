#!/usr/bin/env node
/**
 * Cloudflare Cache Purge Script
 * Purges Cloudflare cache after deployments
 *
 * Usage:
 *   node scripts/cloudflare-purge-cache.js [options]
 *
 * Options:
 *   --all          Purge all cache
 *   --files=url1,url2   Purge specific URLs
 *   --tags=tag1,tag2    Purge by cache tags
 *
 * Environment Variables:
 *   CLOUDFLARE_ZONE_ID     - Your Cloudflare Zone ID
 *   CLOUDFLARE_API_TOKEN   - Your Cloudflare API Token
 *
 * Get these from:
 *   Zone ID: Cloudflare Dashboard → Overview → API section (right sidebar)
 *   API Token: My Profile → API Tokens → Create Token (Cache Purge permission)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

// Load .env file
loadEnvFile();

// Configuration from environment variables
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m'
};

function log(message, color = COLORS.RESET) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function error(message) {
  log(`❌ ${message}`, COLORS.RED);
}

function success(message) {
  log(`✅ ${message}`, COLORS.GREEN);
}

function warning(message) {
  log(`⚠️  ${message}`, COLORS.YELLOW);
}

function info(message) {
  log(`ℹ️  ${message}`, COLORS.BLUE);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    all: false,
    files: [],
    tags: []
  };

  args.forEach(arg => {
    if (arg === '--all') {
      options.all = true;
    } else if (arg.startsWith('--files=')) {
      options.files = arg.substring(8).split(',').map(f => f.trim());
    } else if (arg.startsWith('--tags=')) {
      options.tags = arg.substring(7).split(',').map(t => t.trim());
    }
  });

  return options;
}

// Make HTTPS request to Cloudflare API
function cloudflareRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(response.errors?.[0]?.message || 'API request failed'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Purge all cache
async function purgeAll() {
  info('Purging all Cloudflare cache...');

  try {
    const result = await cloudflareRequest(
      `/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
      'POST',
      { purge_everything: true }
    );

    success('All cache purged successfully!');
    return result;
  } catch (err) {
    error(`Failed to purge cache: ${err.message}`);
    throw err;
  }
}

// Purge specific files
async function purgeFiles(files) {
  info(`Purging ${files.length} specific files...`);

  try {
    const result = await cloudflareRequest(
      `/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
      'POST',
      { files: files }
    );

    success(`Purged ${files.length} files successfully!`);
    files.forEach(file => {
      log(`  • ${file}`, COLORS.GREEN);
    });
    return result;
  } catch (err) {
    error(`Failed to purge files: ${err.message}`);
    throw err;
  }
}

// Purge by cache tags
async function purgeTags(tags) {
  info(`Purging cache by ${tags.length} tags...`);

  try {
    const result = await cloudflareRequest(
      `/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
      'POST',
      { tags: tags }
    );

    success(`Purged cache for ${tags.length} tags successfully!`);
    tags.forEach(tag => {
      log(`  • ${tag}`, COLORS.GREEN);
    });
    return result;
  } catch (err) {
    error(`Failed to purge by tags: ${err.message}`);
    throw err;
  }
}

// Main function
async function main() {
  console.log('');
  log('═══════════════════════════════════════════════════', COLORS.BLUE);
  log('   Cloudflare Cache Purge Tool', COLORS.BLUE);
  log('═══════════════════════════════════════════════════', COLORS.BLUE);
  console.log('');

  // Check environment variables
  if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
    error('Missing required environment variables!');
    console.log('');
    error('Please set the following in your .env file:');
    error('  CLOUDFLARE_ZONE_ID=your_zone_id');
    error('  CLOUDFLARE_API_TOKEN=your_api_token');
    console.log('');
    error('Get these from:');
    error('  Zone ID: Cloudflare Dashboard → Overview → API section');
    error('  API Token: Cloudflare Dashboard → My Profile → API Tokens');
    console.log('');
    process.exit(1);
  }

  // Parse arguments
  const options = parseArgs();

  // Show usage if no options provided
  if (!options.all && options.files.length === 0 && options.tags.length === 0) {
    info('Usage:');
    console.log('');
    log('  Purge all cache:', COLORS.YELLOW);
    log('    npm run cloudflare:purge -- --all', COLORS.BLUE);
    console.log('');
    log('  Purge specific files:', COLORS.YELLOW);
    log('    npm run cloudflare:purge -- --files=https://zoeholidays.com/,https://zoeholidays.com/programs', COLORS.BLUE);
    console.log('');
    log('  Purge by tags:', COLORS.YELLOW);
    log('    npm run cloudflare:purge -- --tags=programs,static', COLORS.BLUE);
    console.log('');
    warning('No action specified. Defaulting to purge all cache.');
    options.all = true;
  }

  try {
    // Execute purge operations
    if (options.all) {
      await purgeAll();
    } else {
      if (options.files.length > 0) {
        await purgeFiles(options.files);
      }
      if (options.tags.length > 0) {
        await purgeTags(options.tags);
      }
    }

    console.log('');
    log('═══════════════════════════════════════════════════', COLORS.BLUE);
    success('Cache purge completed successfully! ✨');
    log('═══════════════════════════════════════════════════', COLORS.BLUE);
    console.log('');

    info('Next steps:');
    log('  • Verify changes on your live site', COLORS.RESET);
    log('  • Check Cloudflare Analytics for cache hit rate', COLORS.RESET);
    log('  • Monitor for any issues', COLORS.RESET);
    console.log('');
  } catch (err) {
    console.log('');
    log('═══════════════════════════════════════════════════', COLORS.RED);
    error('Cache purge failed!');
    log('═══════════════════════════════════════════════════', COLORS.RED);
    console.log('');
    error('Error details:');
    error(`  ${err.message}`);
    console.log('');
    error('Troubleshooting:');
    error('  1. Verify CLOUDFLARE_ZONE_ID is correct');
    error('  2. Verify CLOUDFLARE_API_TOKEN has "Cache Purge" permission');
    error('  3. Check Cloudflare API status: https://www.cloudflarestatus.com/');
    console.log('');
    process.exit(1);
  }
}

// Run the script
main();
