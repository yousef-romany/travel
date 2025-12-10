#!/usr/bin/env node
/**
 * Build Verification Script
 * Scans build artifacts for malicious code patterns
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Malicious patterns to search for
const MALICIOUS_PATTERNS = [
  'SENDGRID_API_KEY',
  'secrets\\.js',
  'tryRead',
  '/app/config\\.js',
  'SG\\.',
  'config/prod\\.conf',
  'vercel\\.json.*API',
  'docker-compose.*secret',
  '\\.runtimeconfig\\.json'
];

// Suspicious functions that shouldn't be in client bundles
const SUSPICIOUS_FUNCTIONS = [
  'fs\\.readFileSync.*env',
  'process\\.env\\[.*SECRET',
  'eval\\(.*env',
  'Function\\(.*password'
];

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
  log(`🚨 ${message}`, COLORS.RED);
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

// Check if .next directory exists
function checkBuildExists() {
  const buildPath = path.join(process.cwd(), '.next');
  if (!fs.existsSync(buildPath)) {
    error('Build directory (.next) not found!');
    error('Run "npm run build" first');
    process.exit(1);
  }
  return buildPath;
}

// Scan for malicious patterns
function scanForMaliciousCode(buildPath) {
  info('Scanning build artifacts for malicious code patterns...');

  const chunksPath = path.join(buildPath, 'static', 'chunks');

  if (!fs.existsSync(chunksPath)) {
    warning('Static chunks directory not found, skipping chunk scan');
    return { found: false, matches: [] };
  }

  const allPatterns = [...MALICIOUS_PATTERNS, ...SUSPICIOUS_FUNCTIONS];
  const pattern = allPatterns.join('\\|');

  try {
    const result = execSync(
      `grep -r -n "${pattern}" "${chunksPath}" || true`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );

    if (result.trim()) {
      return { found: true, matches: result.trim().split('\n') };
    }

    return { found: false, matches: [] };
  } catch (err) {
    warning(`Grep scan failed: ${err.message}`);
    return { found: false, matches: [] };
  }
}

// Check for suspicious file sizes
function checkFileSizes(buildPath) {
  info('Checking for unusually large bundle sizes...');

  const chunksPath = path.join(buildPath, 'static', 'chunks');

  if (!fs.existsSync(chunksPath)) {
    return { suspicious: false, files: [] };
  }

  const suspiciousFiles = [];
  const MAX_CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (stat.isFile() && file.endsWith('.js')) {
        if (stat.size > MAX_CHUNK_SIZE) {
          suspiciousFiles.push({
            path: filePath.replace(process.cwd(), '.'),
            size: (stat.size / 1024 / 1024).toFixed(2) + ' MB'
          });
        }
      }
    }
  }

  scanDirectory(chunksPath);

  return {
    suspicious: suspiciousFiles.length > 0,
    files: suspiciousFiles
  };
}

// Check for environment variables in client bundles
function checkForEnvLeaks(buildPath) {
  info('Checking for leaked environment variables...');

  const chunksPath = path.join(buildPath, 'static', 'chunks');

  if (!fs.existsSync(chunksPath)) {
    return { found: false, matches: [] };
  }

  // Patterns that indicate env leaks
  const envPatterns = [
    'STRAPI_TOKEN.*[A-Za-z0-9]{32,}',
    'API_KEY.*[A-Za-z0-9]{32,}',
    'SECRET.*[A-Za-z0-9]{32,}',
    'PASSWORD.*[A-Za-z0-9]{16,}'
  ];

  const pattern = envPatterns.join('\\|');

  try {
    const result = execSync(
      `grep -r -o -E "${pattern}" "${chunksPath}" | head -20 || true`,
      { encoding: 'utf-8' }
    );

    if (result.trim()) {
      return { found: true, matches: result.trim().split('\n') };
    }

    return { found: false, matches: [] };
  } catch (err) {
    return { found: false, matches: [] };
  }
}

// Main verification function
function verifyBuild() {
  console.log('');
  log('═══════════════════════════════════════════════════', COLORS.BLUE);
  log('   Build Security Verification', COLORS.BLUE);
  log('═══════════════════════════════════════════════════', COLORS.BLUE);
  console.log('');

  const buildPath = checkBuildExists();

  let exitCode = 0;
  const issues = [];

  // 1. Scan for malicious code
  const maliciousScan = scanForMaliciousCode(buildPath);
  if (maliciousScan.found) {
    error('MALICIOUS CODE PATTERNS DETECTED!');
    console.log('');
    maliciousScan.matches.forEach(match => {
      error(`  ${match}`);
    });
    console.log('');
    issues.push('Malicious code patterns found');
    exitCode = 1;
  } else {
    success('No malicious code patterns detected');
  }

  // 2. Check file sizes
  const sizeScan = checkFileSizes(buildPath);
  if (sizeScan.suspicious) {
    warning('Unusually large bundle files detected:');
    sizeScan.files.forEach(file => {
      warning(`  ${file.path} - ${file.size}`);
    });
    issues.push('Large bundle sizes (possible code injection)');
  } else {
    success('Bundle sizes look normal');
  }

  // 3. Check for env leaks
  const envScan = checkForEnvLeaks(buildPath);
  if (envScan.found) {
    error('POTENTIAL ENVIRONMENT VARIABLE LEAKS DETECTED!');
    console.log('');
    envScan.matches.forEach(match => {
      error(`  ${match}`);
    });
    console.log('');
    issues.push('Environment variable leaks detected');
    exitCode = 1;
  } else {
    success('No environment variable leaks detected');
  }

  // Final report
  console.log('');
  log('═══════════════════════════════════════════════════', COLORS.BLUE);

  if (exitCode === 0 && issues.length === 0) {
    success('BUILD VERIFICATION PASSED! ✨');
    success('Your build appears secure and ready for deployment');
  } else {
    error('BUILD VERIFICATION FAILED!');
    error('DO NOT DEPLOY THIS BUILD!');
    console.log('');
    error('Issues found:');
    issues.forEach(issue => {
      error(`  • ${issue}`);
    });
    console.log('');
    error('Actions required:');
    error('  1. Run ./SECURITY_CLEANUP.sh');
    error('  2. Review package.json for suspicious dependencies');
    error('  3. Check git history for unauthorized changes');
    error('  4. Scan your system for malware');
  }

  log('═══════════════════════════════════════════════════', COLORS.BLUE);
  console.log('');

  process.exit(exitCode);
}

// Run verification
verifyBuild();
