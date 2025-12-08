
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const INPUT_FILE = path.join(process.cwd(), 'public', 'logo.png');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'icons');

async function generateIcons() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error('❌ Error: public/logo.png not found!');
        process.exit(1);
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log('🎨 Generating PWA Icons using Sharp...');

    for (const size of SIZES) {
        const filename = `icon-${size}x${size}.png`;
        const outputPath = path.join(OUTPUT_DIR, filename);

        try {
            await sharp(INPUT_FILE)
                .resize(size, size)
                .toFile(outputPath);
            console.log(`✅ Generated ${filename}`);
        } catch (error) {
            console.error(`❌ Failed to generate ${filename}:`, error);
        }
    }

    console.log('\n✨ All icons generated successfully!');
}

generateIcons().catch(console.error);
