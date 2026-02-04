import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

const MAX_WIDTH = 1920; // 1080p+
const SIZE_THRESHOLD = 500 * 1024; // 500KB

async function compressImages() {
  console.log('🔍 Searching for images to compress...');
  
  const files = await glob('public/**/*.{jpg,jpeg,png}', { ignore: 'node_modules/**' });
  
  let savedBytes = 0;
  let processedCount = 0;

  for (const file of files) {
    try {
      const stats = await fs.stat(file);
      
      if (stats.size > SIZE_THRESHOLD) {
        console.log(`Processing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
        
        const ext = path.extname(file).toLowerCase();
        let pipeline = sharp(file).resize(MAX_WIDTH, MAX_WIDTH, { 
          fit: 'inside', 
          withoutEnlargement: true 
        });

        if (ext === '.jpg' || ext === '.jpeg') {
          pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
        } else if (ext === '.png') {
          // specific optimization for PNGs
          pipeline = pipeline.png({ quality: 80, compressionLevel: 9, palette: true });
        }

        const buffer = await pipeline.toBuffer();
        
        // Only save if we actually saved space
        if (buffer.length < stats.size) {
          await fs.writeFile(file, buffer);
          const saving = stats.size - buffer.length;
          savedBytes += saving;
          processedCount++;
          console.log(`✅ Compressed ${file}: ${(stats.size / 1024).toFixed(0)}KB -> ${(buffer.length / 1024).toFixed(0)}KB (Saved ${(saving / 1024).toFixed(0)}KB)`);
        } else {
          console.log(`⚠️  Skipping ${file}: Compression increased size or no gain`);
        }
      }
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message);
    }
  }

  console.log('---');
  console.log(`🎉 Finished! Compressed ${processedCount} images.`);
  console.log(`💾 Total space saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
}

compressImages();
