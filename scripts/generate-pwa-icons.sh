#!/bin/bash

# PWA Icon Generator Script
# This script generates all required PWA icon sizes from a source image

echo "🎨 Generating PWA Icons for ZoeHolidays..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed. Please install it first:"
    echo "   Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "   macOS: brew install imagemagick"
    exit 1
fi

# Source image (you can replace this with your logo path)
SOURCE_IMAGE="public/logo.png"

# Output directory
OUTPUT_DIR="public/icons"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Icon sizes needed for PWA
SIZES=(72 96 128 144 152 192 384 512)

echo "📦 Generating icons..."

for size in "${SIZES[@]}"; do
    output_file="$OUTPUT_DIR/icon-${size}x${size}.png"
    echo "  Creating ${size}x${size}..."
    
    # Generate icon with rounded corners and padding
    convert "$SOURCE_IMAGE" \
        -resize "${size}x${size}" \
        -gravity center \
        -background "linear-gradient(135deg,#d4af37,#f4d47b)" \
        -extent "${size}x${size}" \
        "$output_file"
    
    if [ $? -eq 0 ]; then
        echo "  ✅ Created $output_file"
    else
        echo "  ❌ Failed to create $output_file"
    fi
done

echo ""
echo "✅ PWA icons generated successfully!"
echo "📁 Icons saved to: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Verify icons in $OUTPUT_DIR"
echo "2. Test PWA installation in browser"
echo "3. Check manifest.json references correct icon paths"
