import { Song, Category } from "@/types/song";
import { slugifyText } from "@/lib/utils";
import { allSongs } from './cantoral';

// Re-export allSongs so it's available for other modules
export { allSongs };

// Helper function to remove accents from a string
function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const categories: Category[] = [
  { letter: 'A', description: 'Entrada', slug: slugifyText('Entrada') },
  { letter: 'B', description: 'Perdón y Agua', slug: slugifyText('Perdón-y-Agua') },
  { letter: 'C', description: 'Gloria', slug: slugifyText('Gloria') },
  { letter: 'D', description: 'Antifona', slug: slugifyText('Antifona') },
  { letter: 'E', description: 'Aleluya', slug: slugifyText('Aleluya') },
  { letter: 'F', description: 'Ofertorio', slug: slugifyText('Ofertorio') },
  { letter: 'G', description: 'Santo', slug: slugifyText('Santo') },
  { letter: 'H', description: 'Padre Nuestro', slug: slugifyText('Padre Nuestro') },
  { letter: 'I', description: 'Paz', slug: slugifyText('Paz') },
  { letter: 'J', description: 'Comunión', slug: slugifyText('Comunión') },
  { letter: 'K', description: 'Salida', slug: slugifyText('Salida') },
  { letter: 'M', description: 'María', slug: slugifyText('María') },
  { letter: 'V', description: 'Villancicos', slug: slugifyText('Villancicos') },
  { letter: 'X', description: 'Campamento', slug: slugifyText('Campamento') },
  { letter: 'Y', description: 'Internacional', slug: slugifyText('Internacional') },
  { letter: 'Z', description: 'Especiales', slug: slugifyText('Especiales') }
];

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

// Unified and flexible song search function
export type SongSearchableField = 'title' | 'author' | 'code' | 'lyrics';

interface SearchOptions {
  songsToSearch?: Song[];
  priorityFields: SongSearchableField[];
  limit?: number;
}

export function searchSongs(
  searchTerm: string,
  options: SearchOptions
): Song[] {
  const { songsToSearch = allSongs, priorityFields, limit } = options;

  if (!searchTerm.trim()) {
    // If no search term and a limit is applied, respect the limit on the original list
    // Otherwise, if it's for filtering, return the original list (or an empty one if not songsToSearch)
    if (limit && songsToSearch) return songsToSearch.slice(0, limit);
    return songsToSearch || []; 
  }

  const lowerSearchTerm = removeAccents(searchTerm.toLowerCase());
  const results: Song[] = [];
  const addedSongIds = new Set<string>();

  const addToResults = (song: Song) => {
    if (!addedSongIds.has(song.id)) {
      results.push(song);
      addedSongIds.add(song.id);
    }
  };

  for (const field of priorityFields) {
    // Ensure we iterate over the correct list of songs
    const currentListToSearch = songsToSearch || allSongs;
    currentListToSearch.forEach(song => {
      if (results.length === limit) return; // Stop if limit is reached

      const value = song[field];
      if (typeof value === 'string' && removeAccents(value.toLowerCase()).includes(lowerSearchTerm)) {
        addToResults(song);
      }
    });
    if (limit && results.length >= limit) break; // Break outer loop if limit is reached
  }
  
  return limit ? results.slice(0, limit) : results;
}

// Remove old search/filter functions: searchSongsGlobal, filterSongList, searchSongsInListWithPriority
// (Their logic is now incorporated into the new searchSongs function) 