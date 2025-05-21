import fs from 'fs/promises';
import path from 'path';
import { allSongs } from '../lib/data/cantoral';
import type { Song } from '../types/song';

// Function to normalize strings for comparison (lowercase, remove accents, special chars)
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s.-]/g, '') // Remove non-alphanumeric (excluding '.', '-')
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim();
}

async function readMp3Filenames(filePath: string): Promise<string[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return data
      .split('\n') // Use single backslash for newline split
      .map((line) => line.trim().replace(/^'|'$/g, '')) // Remove surrounding single quotes
      .filter(Boolean);
  } catch (error) {
    console.error(`Error reading MP3 filenames from ${filePath}:`, error);
    throw error;
  }
}

function findBestMatch(
  mp3Filename: string,
  songs: Song[],
): Song | undefined {
  const normalizedMp3Name = normalizeString(
    path.basename(mp3Filename, path.extname(mp3Filename)),
  );

  let bestMatch: Song | undefined;
  let highestScore = 0;

  for (const song of songs) {
    if (!song.title || !song.slug) continue;

    const normalizedSongTitle = normalizeString(song.title);

    // Exact match preferred
    if (normalizedMp3Name === normalizedSongTitle) {
      return song;
    }

    // Simple scoring based on substring inclusion (can be improved)
    let score = 0;
    const mp3Parts = normalizedMp3Name.split(' ');
    const titleParts = normalizedSongTitle.split(' ');

    // Score based on common words
    for (const part of mp3Parts) {
      if (titleParts.includes(part)) {
        score++;
      }
    }
    // Bonus for starting with the same word
     if (mp3Parts.length > 0 && titleParts.length > 0 && mp3Parts[0] === titleParts[0]) {
      score += 2;
    }
    // Bonus if normalized mp3 name is a substring of normalized song title
    if (normalizedSongTitle.includes(normalizedMp3Name)) {
        score += 5;
    }
     // Bonus if normalized song title is a substring of normalized mp3 name
    if (normalizedMp3Name.includes(normalizedSongTitle)) {
        score += 3;
    }


    if (score > highestScore) {
      highestScore = score;
      bestMatch = song;
    }
  }
    // If a match is found with a reasonable score, return it.
    // Adjust threshold as needed. For example, require at least 1 word match
    // or a significant portion of the name to match.
    if (bestMatch && highestScore > 0) {
      return bestMatch;
    }

  return undefined;
}

async function generateMp3SlugMap(): Promise<void> {
  const mp3FilesPath = path.resolve(process.cwd(), 'lib/data/ficheros-mp3.txt');
  const outputFilePath = path.resolve(
    process.cwd(),
    'lib/data/mp3-slug-map.ts',
  );

  console.log('Starting generation of mp3-slug-map.ts...');

  try {
    const mp3Filenames = await readMp3Filenames(mp3FilesPath);
    console.log(`Read ${mp3Filenames.length} MP3 filenames from ${mp3FilesPath}.`);

    const cantoralSongs = allSongs.filter(song => song.slug); // Ensure songs have slugs
    console.log(`Loaded ${cantoralSongs.length} songs with slugs from cantoral.ts.`);

    const mp3SlugMap: Record<string, string> = {};
    let matchedCount = 0;
    const unmatchedFiles: string[] = [];

    for (const mp3Filename of mp3Filenames) {
      const matchedSong = findBestMatch(mp3Filename, cantoralSongs);
      if (matchedSong && matchedSong.slug) {
        mp3SlugMap[mp3Filename] = matchedSong.slug;
        matchedCount++;
      } else {
        unmatchedFiles.push(mp3Filename);
        console.warn(`WARN: No confident match found for MP3: "${mp3Filename}"`);
      }
    }

    console.log('\n--- Matching Summary ---');
    console.log(`Total MP3 files: ${mp3Filenames.length}`);
    console.log(`Successfully matched: ${matchedCount}`);
    console.log(`Unmatched files: ${unmatchedFiles.length}`);
    if (unmatchedFiles.length > 0) {
      console.log('Unmatched MP3 files:');
      unmatchedFiles.forEach((file) => console.log(`  - ${file}`));
    }

    const mapEntries = Object.entries(mp3SlugMap)
      .map(([filename, slug]) => `  '${filename.replace(/'/g, '\\\'')}': '${slug.replace(/'/g, '\\\'')}',`)
      .join('\n');
    const fileContent = `export const mp3SlugMap: Record<string, string> = {\n${mapEntries}\n};\n`;

    await fs.writeFile(outputFilePath, fileContent, 'utf-8');
    console.log(`\nSuccessfully generated and saved mp3-slug-map.ts to ${outputFilePath}`);

    if (unmatchedFiles.length > 0) {
        console.warn(`\nWARNING: ${unmatchedFiles.length} MP3 files could not be matched to slugs. These will be excluded from the map. Please review them manually.`);
    }

  } catch (error) {
    console.error('Error during mp3-slug-map generation:', error);
    process.exit(1);
  }
}

generateMp3SlugMap(); 