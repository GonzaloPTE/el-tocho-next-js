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

const MOCK_LYRICS = `
FA            DO                  re
ABRE TU TIENDA AL SEÑOR, 
    SIb       FA
RECÍBELE DENTRO, 
DO
ESCUCHA SU VOZ.
FA           DO                   re
ABRE TU TIENDA AL SEÑOR,
    SIb            FA
PREPARA TU FUEGO
    DO7            FA
QUE LLEGA EL AMOR.


                    re
El adviento es esperanza,
            SIb            FA
la esperanza salvación;
                        DO
ya se acerca el Señor.
        FA                re
Preparemos los caminos,
        SIb             FA
los caminos del amor,
        DO7          FA
escuchemos su voz.

`;

export const allSongs: Song[] = [
  {
    id: "1",
    code: "E1",
    title: "Vamos cantando al Señor",
    author: "Cesáreo Gabaráin",
    category: "E",
    slug: slugifyText("Vamos cantando al Señor Cesáreo Gabaráin"),
    hasAudio: true,
    lyrics: MOCK_LYRICS
  },
  {
    id: "2",
    code: "E2",
    title: "Alegre la mañana",
    author: "Juan Antonio Espinosa",
    category: "E",
    slug: slugifyText("Alegre la mañana Juan Antonio Espinosa"),
    hasAudio: false,
    lyrics: MOCK_LYRICS
  },
  {
    id: "3",
    code: "E3",
    title: "Iglesia peregrina",
    author: "Cesáreo Gabaráin",
    category: "E",
    slug: slugifyText("Iglesia peregrina Cesáreo Gabaráin"),
    hasAudio: true,
    lyrics: MOCK_LYRICS
  },
  {
    id: "4",
    code: "E15",
    title: "Juntos como hermanos",
    author: "Cesáreo Gabaráin",
    category: "E",
    slug: slugifyText("Juntos como hermanos Cesáreo Gabaráin"),
    hasAudio: false,
    lyrics: MOCK_LYRICS
  },
  // Example placeholder songs to ensure we have at least 3 for shuffling
  { id: 'E16', code: 'E16', title: 'Song Placeholder 1', author: 'Author 1', lyrics: MOCK_LYRICS, category: 'E', slug: slugifyText('Song Placeholder 1 Author 1'), hasAudio: false },
  { id: 'C46', code: 'C46', title: 'Song Placeholder 2', author: 'Author 2', lyrics: MOCK_LYRICS, category: 'C', slug: slugifyText('Song Placeholder 2 Author 2'), hasAudio: true },
  { id: 'F24', code: 'F24', title: 'Song Placeholder 3', author: 'Author 3', lyrics: MOCK_LYRICS, category: 'F', slug: slugifyText('Song Placeholder 3 Author 3'), hasAudio: false },
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