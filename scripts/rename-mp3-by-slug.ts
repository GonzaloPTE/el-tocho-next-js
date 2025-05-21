import fs from 'fs/promises';
import fsSync from 'fs'; // For synchronous operations like existsSync, mkdirSync
import path from 'path';
import { mp3SlugMap } from '../lib/data/mp3-slug-map';

const sourceDirectory = 'E:\\Borrame\\audios';
const targetDirectory = 'E:\\Borrame\\audios\\slugs';

async function renameAndCopyMp3s(): Promise<void> {
  console.log(`Starting MP3 renaming and copying process...`);
  console.log(`Source directory: ${sourceDirectory}`);
  console.log(`Target directory: ${targetDirectory}`);

  try {
    // Ensure target directory exists
    if (!fsSync.existsSync(targetDirectory)) {
      fsSync.mkdirSync(targetDirectory, { recursive: true });
      console.log(`Created target directory: ${targetDirectory}`);
    }

    const filesInSource = await fs.readdir(sourceDirectory);
    let copiedCount = 0;
    let skippedCount = 0;

    for (const filename of filesInSource) {
      const sourceFilePath = path.join(sourceDirectory, filename);
      const fileStats = await fs.stat(sourceFilePath);

      // Skip if it's a directory or not an mp3 file (basic check)
      if (fileStats.isDirectory() || path.extname(filename).toLowerCase() !== '.mp3') {
        continue;
      }

      // The keys in mp3SlugMap are like 'Some Song.mp3' (already have extension)
      const slug = mp3SlugMap[filename];

      if (slug) {
        let newFilename = `${slug}.mp3`;
        let targetFilePath = path.join(targetDirectory, newFilename);
        let counter = 1;

        // Handle filename collisions
        while (fsSync.existsSync(targetFilePath)) {
          newFilename = `${slug}-${counter}.mp3`;
          targetFilePath = path.join(targetDirectory, newFilename);
          counter++;
        }

        await fs.copyFile(sourceFilePath, targetFilePath);
        console.log(`COPIED: '${filename}' -> '${newFilename}'`);
        copiedCount++;
      } else {
        console.warn(`SKIPPED: '${filename}' - No slug found in mp3SlugMap.`);
        skippedCount++;
      }
    }

    console.log(`\n--- Process Summary ---`);
    console.log(`Total files processed in source: ${filesInSource.length}`);
    console.log(`Successfully copied and renamed: ${copiedCount}`);
    console.log(`Skipped (no slug found or not MP3): ${skippedCount + (filesInSource.length - copiedCount - skippedCount)}`);

  } catch (e: unknown) {
    const error = e as { code?: string; message?: string }; // Type assertion
    console.error('Error during MP3 renaming and copying process:', error.message || error);
    if (error.code === 'ENOENT') {
        console.error(`Please ensure the source directory '${sourceDirectory}' exists and contains MP3 files.`);
    }
    process.exit(1);
  }
}

renameAndCopyMp3s(); 