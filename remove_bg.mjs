import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processImage() {
  const inputPath = path.join(process.cwd(), 'public', 'favicon.png');
  const tempPath = path.join(process.cwd(), 'public', 'favicon_temp.png');

  try {
    const metadata = await sharp(inputPath).metadata();
    const width = metadata.width;
    const height = metadata.height;
    
    const padding = 10; // Crop 10 pixels inwards to remove white fringe
    const circleSvg = `<svg width="${width}" height="${height}">
      <circle cx="${width / 2}" cy="${height / 2}" r="${(Math.min(width, height) / 2) - padding}" fill="white" />
    </svg>`;

    // Apply the mask and save
    await sharp(inputPath)
      .composite([{
        input: Buffer.from(circleSvg),
        blend: 'dest-in'
      }])
      .png()
      .toFile(tempPath);
      
    // Replace original
    fs.renameSync(tempPath, inputPath);
    console.log('Successfully made favicon background transparent!');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();
