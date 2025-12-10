#!/usr/bin/env node
/**
 * Environment Variables Checker
 * Validates that all required environment variables are set
 *
 * Usage:
 *   node scripts/check-env.js [options]
 *
 * Options:
 *   --strict    Fail if any optional variables are missing
 *   --cloudflare    Check only Cloudflare variables
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
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

// Load .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');

  if (!fs.existsSync(envPath)) {
    return false;
  }

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

  return true;
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    strict: args.includes('--strict'),
    cloudflareOnly: args.includes('--cloudflare'),
  };
}

// Required environment variables
const REQUIRED_VARS = [
  {
    name: 'NEXT_PUBLIC_STRAPI_URL',
    description: 'Strapi backend URL',
    example: 'https://dashboard.zoeholidays.com',
    getUrl: 'Your Strapi Dashboard URL'
  },
  {
    name: 'STRAPI_HOST',
    description: 'Strapi host URL',
    example: 'https://dashboard.zoeholidays.com',
    getUrl: 'Same as NEXT_PUBLIC_STRAPI_URL'
  },
  {
    name: 'NEXT_PUBLIC_STRAPI_TOKEN',
    description: 'Strapi API token',
    example: 'your_strapi_api_token_here',
    getUrl: 'Strapi Dashboard → Settings → API Tokens → Create Token'
  },
  {
    name: 'NEXT_PUBLIC_INSTAGRAM_TOKEN',
    description: 'Instagram API token',
    example: 'your_instagram_token_here',
    getUrl: 'Facebook Developers → Your App → Instagram Graph API'
  },
  {
    name: 'NEXT_PUBLIC_WHATSAPP_NUMBER',
    description: 'WhatsApp number (no + or spaces)',
    example: '201000000000',
    getUrl: 'Your WhatsApp Business number'
  }
];

// Optional environment variables
const OPTIONAL_VARS = [
  {
    name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    description: 'Google Analytics 4 measurement ID',
    example: 'G-XXXXXXXXXX',
    getUrl: 'Google Analytics → Admin → Data Streams → Measurement ID'
  }
];

// Cloudflare environment variables (optional but both required if using)
const CLOUDFLARE_VARS = [
  {
    name: 'CLOUDFLARE_ZONE_ID',
    description: 'Cloudflare Zone ID',
    example: 'your_cloudflare_zone_id_here',
    getUrl: 'Cloudflare Dashboard → Overview → API section (right sidebar)'
  },
  {
    name: 'CLOUDFLARE_API_TOKEN',
    description: 'Cloudflare API token with Cache Purge permission',
    example: 'your_cloudflare_api_token_here',
    getUrl: 'Cloudflare Dashboard → My Profile → API Tokens → Create Token'
  },
  {
    name: 'CLOUDFLARE_ACCOUNT_ID',
    description: 'Cloudflare Account ID (optional, for Workers)',
    example: 'your_account_id_here',
    getUrl: 'Cloudflare Dashboard → Overview → Account ID',
    optional: true
  }
];

// Check if a variable is set and not empty
function checkVar(varConfig) {
  const value = process.env[varConfig.name];
  const isSet = value && value.trim() !== '' && !value.includes('your_') && !value.includes('here');

  return {
    name: varConfig.name,
    description: varConfig.description,
    isSet,
    value: isSet ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : undefined,
    example: varConfig.example,
    getUrl: varConfig.getUrl
  };
}

// Main validation function
function validateEnvironment() {
  const options = parseArgs();

  console.log('');
  log('═══════════════════════════════════════════════════', COLORS.CYAN);
  log('   Environment Variables Checker', COLORS.CYAN);
  log('═══════════════════════════════════════════════════', COLORS.CYAN);
  console.log('');

  // Check for .env file
  const envFileExists = loadEnvFile();

  if (!envFileExists) {
    error('.env file not found!');
    console.log('');
    warning('Creating .env file from .env.example...');

    const examplePath = path.join(__dirname, '..', '.env.example');
    const envPath = path.join(__dirname, '..', '.env');

    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      success('Created .env file!');
      warning('Please edit .env and add your actual values');
    } else {
      error('.env.example not found! Cannot create .env file');
    }

    console.log('');
    process.exit(1);
  }

  success('.env file found');
  console.log('');

  let missingRequired = [];
  let missingOptional = [];
  let hasErrors = false;

  // Check required variables (unless cloudflare-only mode)
  if (!options.cloudflareOnly) {
    log('─────────────────────────────────────────────────────', COLORS.BLUE);
    log('Required Variables', COLORS.BLUE);
    log('─────────────────────────────────────────────────────', COLORS.BLUE);
    console.log('');

    REQUIRED_VARS.forEach(varConfig => {
      const result = checkVar(varConfig);

      if (result.isSet) {
        success(`${result.name}`);
        log(`  Value: ${result.value}`, COLORS.GREEN);
      } else {
        error(`${result.name} - MISSING!`);
        log(`  Description: ${result.description}`, COLORS.YELLOW);
        log(`  Example: ${result.example}`, COLORS.CYAN);
        log(`  Get from: ${result.getUrl}`, COLORS.BLUE);
        missingRequired.push(result);
        hasErrors = true;
      }
      console.log('');
    });

    // Check optional variables
    log('─────────────────────────────────────────────────────', COLORS.BLUE);
    log('Optional Variables', COLORS.BLUE);
    log('─────────────────────────────────────────────────────', COLORS.BLUE);
    console.log('');

    OPTIONAL_VARS.forEach(varConfig => {
      const result = checkVar(varConfig);

      if (result.isSet) {
        success(`${result.name}`);
        log(`  Value: ${result.value}`, COLORS.GREEN);
      } else {
        warning(`${result.name} - Not set (optional)`);
        log(`  Description: ${result.description}`, COLORS.YELLOW);
        if (options.strict) {
          missingOptional.push(result);
        }
      }
      console.log('');
    });
  }

  // Check Cloudflare variables
  log('─────────────────────────────────────────────────────', COLORS.BLUE);
  log('Cloudflare Variables (Optional)', COLORS.BLUE);
  log('─────────────────────────────────────────────────────', COLORS.BLUE);
  console.log('');

  const cloudflareResults = CLOUDFLARE_VARS.map(checkVar);
  const requiredCloudflareVars = cloudflareResults.filter(r => !r.optional);
  const anyCloudflareSet = requiredCloudflareVars.some(r => r.isSet);
  const allCloudflareSet = requiredCloudflareVars.every(r => r.isSet);

  cloudflareResults.forEach(result => {
    if (result.isSet) {
      success(`${result.name}`);
      log(`  Value: ${result.value}`, COLORS.GREEN);
    } else {
      if (anyCloudflareSet && !allCloudflareSet && !result.optional) {
        error(`${result.name} - MISSING!`);
        log(`  Description: ${result.description}`, COLORS.YELLOW);
        log(`  Example: ${result.example}`, COLORS.CYAN);
        log(`  Get from: ${result.getUrl}`, COLORS.BLUE);
        hasErrors = true;
      } else {
        warning(`${result.name} - Not set`);
        log(`  Description: ${result.description}`, COLORS.YELLOW);
      }
    }
    console.log('');
  });

  if (anyCloudflareSet && !allCloudflareSet) {
    error('Cloudflare configuration is incomplete!');
    warning('Both CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN are required.');
    warning('Either set both or remove both from .env');
    hasErrors = true;
  } else if (!anyCloudflareSet) {
    info('Cloudflare is not configured (optional)');
    info('To use Cloudflare features, see CLOUDFLARE_SETUP.md');
  } else {
    success('Cloudflare is fully configured! 🌐');
  }

  // Final report
  console.log('');
  log('═══════════════════════════════════════════════════', COLORS.CYAN);

  if (hasErrors) {
    error('Environment validation FAILED!');
    console.log('');

    if (missingRequired.length > 0) {
      error(`Missing ${missingRequired.length} required variables:`);
      missingRequired.forEach(v => {
        error(`  • ${v.name}`);
      });
    }

    console.log('');
    error('Actions required:');
    error('  1. Open .env file');
    error('  2. Add missing variables');
    error('  3. Save and run this script again');
    console.log('');
    error('📖 See .env.example for all required variables');
  } else if (options.strict && missingOptional.length > 0) {
    warning('Some optional variables are missing (--strict mode)');
    console.log('');
    missingOptional.forEach(v => {
      warning(`  • ${v.name}`);
    });
  } else {
    success('Environment validation PASSED! ✨');
    console.log('');
    success('All required variables are set');

    if (!anyCloudflareSet) {
      console.log('');
      info('💡 Tip: Set up Cloudflare for enhanced security and performance');
      info('   See CLOUDFLARE_SETUP.md for instructions');
    }
  }

  log('═══════════════════════════════════════════════════', COLORS.CYAN);
  console.log('');

  process.exit(hasErrors ? 1 : 0);
}

// Run validation
validateEnvironment();
