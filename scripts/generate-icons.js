#!/usr/bin/env node
/**
 * Generate PWA Icons using Sharp
 *
 * Usage: node scripts/generate-icons.js
 *
 * This script generates all required PWA icon sizes from the logo
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Paths
const logoPath = path.join(__dirname, '../public/logo.png');
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('✓ Created icons directory');
}

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ Error: logo.png not found at', logoPath);
  console.log('Please ensure logo.png exists in the public directory');
  process.exit(1);
}

console.log('🎨 Starting icon generation...\n');

// Generate all icon sizes
Promise.all(
  sizes.map(size => {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    return sharp(logoPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath)
      .then(() => {
        console.log(`✓ Generated ${size}x${size}px icon`);
        return true;
      })
      .catch(err => {
        console.error(`❌ Error generating ${size}x${size}px:`, err.message);
        return false;
      });
  })
)
.then(results => {
  const successful = results.filter(Boolean).length;
  console.log(`\n🎉 Successfully generated ${successful}/${sizes.length} icons!`);

  if (successful === sizes.length) {
    console.log('\n✅ All PWA icons are ready!');
    console.log('Your app is now installable on iOS and Android devices.\n');
  } else {
    console.log('\n⚠️  Some icons failed to generate. Please check the errors above.\n');
    process.exit(1);
  }
})
.catch(err => {
  console.error('\n❌ Fatal error:', err);
  process.exit(1);
});
