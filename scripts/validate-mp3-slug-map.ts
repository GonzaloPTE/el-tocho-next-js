import fs from 'fs/promises';
import path from 'path';
import { mp3SlugMap } from '../lib/data/mp3-slug-map';
import { allSongs } from '../lib/data/cantoral'; // Corrected import
import type { Song } from '../types/song';

async function readMp3Filenames(filePath: string): Promise<string[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return data
      .split('\n')
      .map((line) => line.trim().replace(/^'|'$/g, ''))
      .filter(Boolean);
  } catch (error) {
    console.error(`Error reading MP3 filenames from ${filePath}:`, error);
    throw error;
  }
}

// Removed readCantoralSlugs as we now import directly

async function validateMp3SlugMap(): Promise<void> {
  let hasErrors = false;
  const mp3FilesPath = path.resolve(process.cwd(), 'lib/data/ficheros-mp3.txt');
  // Removed cantoralJsonlPath

  console.log('Starting validation of mp3-slug-map.ts against cantoral.ts...');

  try {
    const mp3Filenames = await readMp3Filenames(mp3FilesPath);
    console.log(`Read ${mp3Filenames.length} MP3 filenames from ${mp3FilesPath}`);

    // Use allSongs from cantoral.ts to get slugs
    const cantoralSlugs = new Set<string>(allSongs.map(song => song.slug).filter(Boolean) as string[]);
    console.log(`Read ${cantoralSlugs.size} unique slugs from lib/data/cantoral.ts`);

    const mapKeys = Object.keys(mp3SlugMap);
    const mapValues = Object.values(mp3SlugMap);

    console.log(`Found ${mapKeys.length} entries in mp3SlugMap.`);

    // 1. Verify every MP3 filename from ficheros-mp3.txt exists as a key in mp3SlugMap - REMOVED as unmatched files are now expected
    // console.log('\nChecking if all MP3 filenames from ficheros-mp3.txt are in mp3SlugMap...');
    // for (const filename of mp3Filenames) {
    //   if (!mp3SlugMap[filename]) {
    //     console.error(`ERROR: MP3 file "${filename}" from ficheros-mp3.txt is not found as a key in mp3SlugMap.`);
    //     hasErrors = true;
    //   }
    // }

    // 2. Verify every slug in mp3SlugMap values exists in cantoral.ts slugs
    console.log('\nChecking if all slugs in mp3SlugMap values exist in cantoral.ts...');
    for (const slug of mapValues) {
      if (!cantoralSlugs.has(slug)) {
        console.error(`ERROR: Slug "${slug}" from mp3SlugMap is not found in cantoral.ts.`);
        hasErrors = true;
      }
    }
    
    // 3. Verify every key in mp3SlugMap corresponds to an actual MP3 filename
    console.log('\nChecking if all keys in mp3SlugMap correspond to an MP3 file in ficheros-mp3.txt...');
    const mp3FilenamesSet = new Set(mp3Filenames);
    for (const mapKey of mapKeys) {
        if (!mp3FilenamesSet.has(mapKey)) {
            console.error(`ERROR: Map key "${mapKey}" in mp3SlugMap does not correspond to any filename in ficheros-mp3.txt.`);
            hasErrors = true;
        }
    }

    console.log('\n--- Validation Summary ---');
    if (hasErrors) {
      console.error('Validation FAILED. Please check the errors above.');
      process.exit(1);
    } else {
      console.log('Validation PASSED successfully. All checks are okay.');
    }

  } catch (error) {
    console.error('Error during validation process:', error);
    process.exit(1);
  }
}

validateMp3SlugMap(); 