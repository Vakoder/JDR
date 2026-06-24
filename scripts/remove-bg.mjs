import Jimp from 'jimp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const inputPath  = path.join(__dirname, '../public/sword_logo.png');
const outputPath = path.join(__dirname, '../public/sword_logo.png');

const image = await Jimp.read(inputPath);

image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
  const r = this.bitmap.data[idx + 0];
  const g = this.bitmap.data[idx + 1];
  const b = this.bitmap.data[idx + 2];

  // If pixel is near-white (background), make it fully transparent
  if (r > 210 && g > 200 && b > 185) {
    this.bitmap.data[idx + 3] = 0; // alpha = 0
  }
});

await image.writeAsync(outputPath);
console.log('✅ Background removed successfully:', outputPath);
