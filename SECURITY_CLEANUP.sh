#!/bin/bash
# Security Cleanup Script for ZoeHolidays Travel Project
# This script removes compromised build artifacts and reinstalls dependencies

set -e  # Exit on error

echo "=================================================="
echo "  ZoeHolidays Security Cleanup Script"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Step 1: Stop all running Node processes
print_warning "Step 1: Stopping all Node.js processes..."
pkill -f "next" || true
pkill -f "npm" || true
sleep 2
print_status "All Node.js processes stopped"

# Step 2: Backup current package files
print_warning "Step 2: Backing up package configuration..."
cp package.json package.json.backup
cp package-lock.json package-lock.json.backup
print_status "Backup created"

# Step 3: Remove potentially compromised directories
print_warning "Step 3: Removing build artifacts and dependencies..."
rm -rf .next
rm -rf node_modules
rm -rf public/sw.js
rm -rf public/workbox-*.js
rm -rf public/fallback-*.js
rm -rf .npm
rm -rf ~/.npm/_cacache
print_status "Removed compromised files"

# Step 4: Clear npm cache
print_warning "Step 4: Clearing npm cache..."
npm cache clean --force
print_status "NPM cache cleared"

# Step 5: Reinstall dependencies
print_warning "Step 5: Reinstalling dependencies from scratch..."
npm install --legacy-peer-deps
print_status "Dependencies reinstalled"

# Step 6: Update vulnerable packages
print_warning "Step 6: Updating vulnerable packages..."
npm update axios --save
npm audit fix --force || true
print_status "Vulnerable packages updated"

# Step 7: Rebuild the project
print_warning "Step 7: Building the project..."
NODE_ENV=production npm run build
print_status "Project rebuilt"

# Step 8: Scan build output for malicious code
print_warning "Step 8: Scanning build output for malicious patterns..."
MALICIOUS_FOUND=0

if grep -r "SENDGRID_API_KEY\|tryRead.*config.js\|secrets.js" .next/static/chunks/ 2>/dev/null; then
    print_error "MALICIOUS CODE STILL DETECTED IN BUILD!"
    print_error "DO NOT DEPLOY THIS BUILD!"
    MALICIOUS_FOUND=1
else
    print_status "No malicious code detected in build artifacts"
fi

# Final report
echo ""
echo "=================================================="
echo "  Cleanup Summary"
echo "=================================================="
echo ""

if [ $MALICIOUS_FOUND -eq 0 ]; then
    print_status "Cleanup completed successfully!"
    print_status "Build appears clean"
    echo ""
    print_warning "NEXT STEPS:"
    echo "  1. Rotate ALL API keys (SendGrid, Strapi, Instagram, etc.)"
    echo "  2. Review git history for suspicious commits"
    echo "  3. Enable security monitoring (see SECURITY.md)"
    echo "  4. Run: npm audit"
    echo "  5. Consider switching to pnpm or yarn for better security"
else
    print_error "CLEANUP FAILED!"
    print_error "Malicious code still present after rebuild"
    echo ""
    print_warning "IMMEDIATE ACTIONS:"
    echo "  1. DO NOT deploy this application"
    echo "  2. Check for compromised npm packages: npm ls"
    echo "  3. Scan your system for malware"
    echo "  4. Review package.json for suspicious dependencies"
    echo "  5. Contact security team or seek professional help"
    exit 1
fi

echo ""
echo "=================================================="
