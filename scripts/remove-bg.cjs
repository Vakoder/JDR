const { Jimp } = require('jimp');
const path = require('path');

const inputPath  = path.join(__dirname, '../public/sword_logo.png');
const outputPath = path.join(__dirname, '../public/sword_logo.png');

async function processLogo() {
  const image = await Jimp.read(inputPath);

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r   = this.bitmap.data[idx + 0];
    const g   = this.bitmap.data[idx + 1];
    const b   = this.bitmap.data[idx + 2];
    const a   = this.bitmap.data[idx + 3];

    // Ignore pixels already transparent
    if (a === 0) return;

    // Luminosité
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Pixels très clairs (fond blanc ou reflets quasi-blancs) → transparent
    const isNeutral = Math.abs(r - g) < 40 && Math.abs(g - b) < 40 && Math.abs(r - b) < 40;
    if (isNeutral && lum > 230) {
      this.bitmap.data[idx + 3] = 0;
      return;
    }

    // Reflets clairs internes (crème, blanc cassé, teintes neutres moyennes)
    // → on les recolore en ambre clair plutôt que de les supprimer
    if (isNeutral && lum > 140) {
      const t = (lum - 140) / (255 - 140); // 0→1
      this.bitmap.data[idx + 0] = Math.round(180 + t * (240 - 180)); // 180→240
      this.bitmap.data[idx + 1] = Math.round(120 + t * (200 - 120)); // 120→200
      this.bitmap.data[idx + 2] = Math.round(30  + t * (100 - 30));  // 30→100
      return;
    }

    // Pixels dorés → on booste légèrement vers l'ambre cible #e8a838
    // (la plupart le sont déjà, on s'assure juste qu'ils ne tirent pas trop sur le blanc)
    if (r > g && g > b) {
      // déjà doré, on laisse tel quel
    }
  });

  await image.write(outputPath);
  console.log('✅ Logo traité :', outputPath);
}

processLogo().catch(console.error);
