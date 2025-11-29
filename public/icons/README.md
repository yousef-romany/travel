# PWA Icons

This directory contains the Progressive Web App (PWA) icons for ZoeHoliday.

## Required Icon Sizes

For a complete PWA experience, the following icon sizes are needed:

### Android/Chrome
- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px
- 384x384px
- 512x512px

### iOS
- 152x152px (iPad)
- 180x180px (iPhone)
- 167x167px (iPad Pro)

## How to Generate Icons

### Option 1: Using Online Tools
1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload the logo from `/public/logo.png` or `/public/logoLight.png`
3. Download the generated icons
4. Extract and place all files in this directory

### Option 2: Using ImageMagick (Command Line)
If you have ImageMagick installed, run:

```bash
# From the project root
cd public/icons

# Generate all icon sizes
for size in 72 96 128 144 152 192 384 512; do
  convert ../logo.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Option 3: Using Sharp (Node.js)
Install sharp: `npm install sharp`

Then create and run this script:

```javascript
const sharp = require('sharp');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  sharp('public/logo.png')
    .resize(size, size)
    .toFile(`public/icons/icon-${size}x${size}.png`)
    .then(() => console.log(`Generated ${size}x${size}`))
    .catch(err => console.error(err));
});
```

## Current Status

⚠️ **Action Required**: Please generate the icon files using one of the methods above.

The manifest.json file is already configured and expects these files to exist.
