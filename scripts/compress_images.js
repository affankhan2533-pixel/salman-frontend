const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  path.join(__dirname, '../public/images'),
  path.join(__dirname, '../public/images/hero'),
  path.join(__dirname, '../public/images/gallery'),
  path.join(__dirname, '../public/images/branding'),
];

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.png' && ext !== '.jpeg' && ext !== '.jpg') return;

  const stat = fs.statSync(filePath);
  if (stat.size < 200000) return; // Skip already small files (<200KB)

  const tempPath = filePath + '.tmp';
  try {
    const meta = await sharp(filePath).metadata();
    const maxDim = 1920;
    let pipeline = sharp(filePath);

    if (meta.width > maxDim || meta.height > maxDim) {
      pipeline = pipeline.resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true });
    }

    if (ext === '.png') {
      await pipeline.png({ quality: 80, compressionLevel: 9, palette: true }).toFile(tempPath);
    } else {
      await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(tempPath);
    }

    const newStat = fs.statSync(tempPath);
    if (newStat.size < stat.size) {
      fs.renameSync(tempPath, filePath);
      console.log(`Optimized ${path.basename(filePath)}: ${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${(newStat.size / 1024).toFixed(0)}KB`);
    } else {
      fs.unlinkSync(tempPath);
    }
  } catch (err) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.error(`Failed to optimize ${filePath}:`, err.message);
  }
}

async function main() {
  console.log('Starting image compression...');
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      if (fs.statSync(fullPath).isFile()) {
        await optimizeImage(fullPath);
      }
    }
  }
  console.log('Image compression completed successfully!');
}

main();
