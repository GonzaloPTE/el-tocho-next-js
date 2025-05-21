import { Song, Category } from "@/types/song";

export const categories: Category[] = [
  { letter: 'E', description: 'Entrada' },
  { letter: 'K', description: 'Kyrie' },
  { letter: 'G', description: 'Gloria' },
  { letter: 'S', description: 'Salmo' },
  { letter: 'A', description: 'Aleluya' },
  { letter: 'O', description: 'Ofertorio' },
  { letter: 'N', description: 'Santo' },
  { letter: 'P', description: 'Padre Nuestro' },
  { letter: 'C', description: 'Comunión' },
  { letter: 'F', description: 'Final' }
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
    hasAudio: true,
    lyrics: MOCK_LYRICS
  },
  {
    id: "2",
    code: "E2",
    title: "Alegre la mañana",
    author: "Juan Antonio Espinosa",
    category: "E",
    hasAudio: false,
    lyrics: MOCK_LYRICS
  },
  {
    id: "3",
    code: "E3",
    title: "Iglesia peregrina",
    author: "Cesáreo Gabaráin",
    category: "E",
    hasAudio: true,
    lyrics: MOCK_LYRICS
  },
  {
    id: "4",
    code: "E15",
    title: "Juntos como hermanos",
    author: "Cesáreo Gabaráin",
    category: "E",
    hasAudio: false,
    lyrics: MOCK_LYRICS
  },
  // Example placeholder songs to ensure we have at least 3 for shuffling
  { id: 'E16', code: 'E16', title: 'Song Placeholder 1', author: 'Author 1', lyrics: MOCK_LYRICS, category: 'E', hasAudio: false },
  { id: 'C46', code: 'C46', title: 'Song Placeholder 2', author: 'Author 2', lyrics: MOCK_LYRICS, category: 'C', hasAudio: true },
  { id: 'F24', code: 'F24', title: 'Song Placeholder 3', author: 'Author 3', lyrics: MOCK_LYRICS, category: 'F', hasAudio: false },
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

export function getCategoryByLetter(letter: string): Category | undefined {
  return categories.find(cat => cat.letter.toLowerCase() === letter.toLowerCase());
}

export function getSongsByCategory(letter: string): Song[] {
  return allSongs.filter(song => song.category.toLowerCase() === letter.toLowerCase());
} 