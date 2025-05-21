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

export const featuredSongs: Song[] = [
  { id: 'E15', code: 'E15', title: 'Juntos como hermanos', author: 'Cesáreo Gabaráin', lyrics: '...lyrics here...', category: 'E', hasAudio: false },
  { id: 'C45', code: 'C45', title: 'El Señor es mi pastor', author: 'Tradicional', lyrics: '...lyrics here...', category: 'C', hasAudio: false },
  { id: 'F23', code: 'F23', title: 'Santa María del Camino', author: 'Juan Antonio Espinosa', lyrics: '...lyrics here...', category: 'F', hasAudio: false },
];

export const allSongs: Song[] = [
  {
    id: "1",
    code: "E1",
    title: "Vamos cantando al Señor",
    author: "Cesáreo Gabaráin",
    category: "E",
    hasAudio: true,
    lyrics: '...'
  },
  {
    id: "2",
    code: "E2",
    title: "Alegre la mañana",
    author: "Juan Antonio Espinosa",
    category: "E",
    hasAudio: false,
    lyrics: '...'
  },
  {
    id: "3",
    code: "E3",
    title: "Iglesia peregrina",
    author: "Cesáreo Gabaráin",
    category: "E",
    hasAudio: true,
    lyrics: '...'
  },
  {
    id: "4",
    code: "E15",
    title: "Juntos como hermanos",
    author: "Cesáreo Gabaráin",
    category: "E",
    hasAudio: false,
    lyrics: '...'
  },
  // ... Añade más canciones según sea necesario, asegurándote de que algunas tengan hasAudio: true y otras hasAudio: false
]; 