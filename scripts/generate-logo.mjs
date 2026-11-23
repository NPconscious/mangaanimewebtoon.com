import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = 'C:/Users/nikhil/.gemini/antigravity/brain/49c53989-92b7-48a1-9373-411f118d6dfd/.user_uploaded/media_1795454579049_e246f5bc.jpg';
const publicDir = path.resolve('public');

async function generate() {
  console.log('Processing logo from:', inputPath);
  
  // 1. Mask out black corners with anti-aliased circle
  const maskSvg = Buffer.from(`
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <circle cx="511" cy="516.5" r="496" fill="#ffffff" />
    </svg>
  `);

  const baseImage = sharp(inputPath);

  // Generate public/logo.png (1024x1024 with transparent corners)
  await baseImage
    .clone()
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('Generated public/logo.png');

  // Generate public/logo.webp
  await baseImage
    .clone()
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .webp({ quality: 90 })
    .toFile(path.join(publicDir, 'logo.webp'));
  console.log('Generated public/logo.webp');

  // Generate favicon-32x32.png
  await sharp(path.join(publicDir, 'logo.png'))
    .resize(32, 32, { fit: 'contain' })
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  // Generate favicon.png (64x64)
  await sharp(path.join(publicDir, 'logo.png'))
    .resize(64, 64, { fit: 'contain' })
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated public/favicon.png');

  // Generate apple-touch-icon.png (180x180)
  await sharp(path.join(publicDir, 'logo.png'))
    .resize(180, 180, { fit: 'contain' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Copy or convert to favicon.ico (32x32 png can act as modern favicon or we can wrap)
  // Most modern browsers accept 32x32 PNG as favicon.ico or favicon.png
  await sharp(path.join(publicDir, 'logo.png'))
    .resize(48, 48, { fit: 'contain' })
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated public/favicon.ico');

  // Generate favicon.svg by wrapping the base64 or high-res image into SVG
  const logoBuffer = await sharp(path.join(publicDir, 'logo.png'))
    .resize(128, 128)
    .png()
    .toBuffer();
  const base64Data = logoBuffer.toString('base64');
  const svgContent = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${base64Data}" width="128" height="128" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  console.log('Generated public/favicon.svg');
}

generate().catch(err => {
  console.error('Error generating logo/favicons:', err);
  process.exit(1);
});
