import fs from 'fs';
import path from 'path';
import { Song, Category } from "@/types/song";
import { slugifyText } from "@/lib/utils";

export const categories: Category[] = [
  { letter: 'E', description: 'Entrada', slug: slugifyText('Entrada') },
  { letter: 'K', description: 'Kyrie', slug: slugifyText('Kyrie') },
  { letter: 'G', description: 'Gloria', slug: slugifyText('Gloria') },
  { letter: 'S', description: 'Salmo', slug: slugifyText('Salmo') },
  { letter: 'A', description: 'Aleluya', slug: slugifyText('Aleluya') },
  { letter: 'O', description: 'Ofertorio', slug: slugifyText('Ofertorio') },
  { letter: 'N', description: 'Santo', slug: slugifyText('Santo') },
  { letter: 'P', description: 'Padre Nuestro', slug: slugifyText('Padre Nuestro') },
  { letter: 'C', description: 'Comunión', slug: slugifyText('Comunión') },
  { letter: 'F', description: 'Final', slug: slugifyText('Final') }
];

// Function to read and parse cantoral.jsonl
function loadSongs(): Song[] {
  try {
    const filePath = path.resolve(process.cwd(), 'lib/data/cantoral.jsonl');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    return lines.map(line => JSON.parse(line) as Song);
  } catch (error) {
    console.error("Error loading songs from cantoral.jsonl:", error);
    // Return a default empty array or a minimal set of songs in case of an error
    // This prevents the application from crashing during build or runtime if the file is missing or corrupt
    return [
      {
        id: "error-song",
        code: "E00",
        title: "Error: Could not load songs",
        author: "System",
        category: "X",
        slug: "error-loading-songs",
        lyrics: "There was an issue loading the song data. Please check the server logs.",
        audioUrl: undefined,
        videoUrl: undefined,
      }
    ];
  }
}

export const allSongs: Song[] = loadSongs();

export function getFeaturedSongs(): Song[] {
  // Create a copy of allSongs to avoid mutating the original array
  const shuffledSongs = [...allSongs];

  // Fisher-Yates (aka Knuth) Shuffle algorithm
  for (let i = shuffledSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
  }

  // Return the first 3 songs, or fewer if not enough songs are available
  return shuffledSongs.slice(0, 3);
}

export function getSongById(id: string): Song | undefined {
  return allSongs.find(song => song.id === id);
}

// New function to get a song by its slug
export function getSongBySlug(slug: string): Song | undefined {
  return allSongs.find(song => song.slug === slug);
}

// New function to get a category by its slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

// Keep getCategoryByLetter for now, might be used by CategoryNavigation directly
// or can be removed later if CategoryNavigation also switches to slugs for its links.
export function getCategoryByLetter(letter: string): Category | undefined {
  return categories.find(cat => cat.letter.toLowerCase() === letter.toLowerCase());
}

export function getSongsByCategory(categoryLetter: string): Song[] {
  // This function might need to change to accept categorySlug if categories are primarily identified by slugs elsewhere
  // For now, assuming it's still using the letter from the category object.
  // If category objects are fetched by slug, then this should take a slug or a category name/description.
  // Let's assume for now it's still based on the 'category' field in Song, which is the letter.
  return allSongs.filter(song => song.category.toLowerCase() === categoryLetter.toLowerCase());
} 