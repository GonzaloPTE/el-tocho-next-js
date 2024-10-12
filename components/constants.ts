import { FeaturedSong, Song } from "@/types/song";

export const CATEGORIES = [
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

export const FEATURED_SONGS: FeaturedSong[] = [
  { id: 'E15', code: 'E15', title: 'Juntos como hermanos', author: 'Cesáreo Gabaráin', lyrics: '...lyrics here...' },
  { id: 'C45', code: 'C45', title: 'El Señor es mi pastor', author: 'Tradicional', lyrics: '...lyrics here...' },
  { id: 'F23', code: 'F23', title: 'Santa María del Camino', author: 'Juan Antonio Espinosa', lyrics: '...lyrics here...' },
  // Add more featured songs as needed
];

export const ALL_SONGS: Song[] = [
  {
    id: 'A2',
    code: 'A.2',
    title: 'ABRE TU TIENDA AL SEÑOR',
    author: 'Carmelo Erdozáin',
    lyrics: '... lyrics here ...'
  },
  // ... other songs
  ...FEATURED_SONGS // Include featured songs in ALL_SONGS
];

export const SITE_NAME = "El TOCHO.app";
