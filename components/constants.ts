import { FeaturedSong, Song, Category } from "@/types/song";

export const CATEGORIES: Category[] = [
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
  { id: 'E15', code: 'E15', title: 'Juntos como hermanos', author: 'Cesáreo Gabaráin', lyrics: '...lyrics here...', category: 'E' },
  { id: 'C45', code: 'C45', title: 'El Señor es mi pastor', author: 'Tradicional', lyrics: '...lyrics here...', category: 'C' },
  { id: 'F23', code: 'F23', title: 'Santa María del Camino', author: 'Juan Antonio Espinosa', lyrics: '...lyrics here...', category: 'F' },
];

export const ALL_SONGS: Song[] = [
  // Entrada (E)
  { id: 'E1', code: 'E1', title: 'Vamos cantando al Señor', author: 'Cesáreo Gabaráin', lyrics: '...lyrics here...', category: 'E' },
  { id: 'E2', code: 'E2', title: 'Alegre la mañana', author: 'Juan Antonio Espinosa', lyrics: '...lyrics here...', category: 'E' },
  { id: 'E3', code: 'E3', title: 'Iglesia peregrina', author: 'Cesáreo Gabaráin', lyrics: '...lyrics here...', category: 'E' },
  
  // Kyrie (K)
  { id: 'K1', code: 'K1', title: 'Señor, ten piedad', author: 'Tradicional', lyrics: '...lyrics here...', category: 'K' },
  { id: 'K2', code: 'K2', title: 'Kyrie eleison', author: 'Taizé', lyrics: '...lyrics here...', category: 'K' },
  
  // Gloria (G)
  { id: 'G1', code: 'G1', title: 'Gloria a Dios en el cielo', author: 'Tradicional', lyrics: '...lyrics here...', category: 'G' },
  
  // Salmo (S)
  { id: 'S1', code: 'S1', title: 'El Señor es mi luz', author: 'Juan A. Espinosa', lyrics: '...lyrics here...', category: 'S' },
  { id: 'S2', code: 'S2', title: 'A ti levanto mis ojos', author: 'Luis Alfredo Díaz Britos', lyrics: '...lyrics here...', category: 'S' },
  
  // Aleluya (A)
  { id: 'A1', code: 'A1', title: 'Aleluya cantará', author: 'Tradicional', lyrics: '...lyrics here...', category: 'A' },
  { id: 'A2', code: 'A2', title: 'Abre tu tienda al Señor', author: 'Carmelo Erdozáin', lyrics: '...lyrics here...', category: 'A' },
  
  // Ofertorio (O)
  { id: 'O1', code: 'O1', title: 'Te presentamos el vino y el pan', author: 'Juan A. Espinosa', lyrics: '...lyrics here...', category: 'O' },
  { id: 'O2', code: 'O2', title: 'Recibe, oh Dios eterno', author: 'Tradicional', lyrics: '...lyrics here...', category: 'O' },
  
  // Santo (N)
  { id: 'N1', code: 'N1', title: 'Santo, Santo, Santo', author: 'Tradicional', lyrics: '...lyrics here...', category: 'N' },
  
  // Padre Nuestro (P)
  { id: 'P1', code: 'P1', title: 'Padre Nuestro', author: 'Tradicional', lyrics: '...lyrics here...', category: 'P' },
  
  // Comunión (C)
  { id: 'C1', code: 'C1', title: 'Una espiga dorada por el sol', author: 'Cesáreo Gabaráin', lyrics: '...lyrics here...', category: 'C' },
  { id: 'C2', code: 'C2', title: 'Pescador de hombres', author: 'Cesáreo Gabaráin', lyrics: '...lyrics here...', category: 'C' },
  
  // Final (F)
  { id: 'F1', code: 'F1', title: 'Id y enseñad', author: 'Cesáreo Gabaráin', lyrics: '...lyrics here...', category: 'F' },
  { id: 'F2', code: 'F2', title: 'Caminando juntos', author: 'Juan A. Espinosa', lyrics: '...lyrics here...', category: 'F' },
  
  // Include featured songs
  ...FEATURED_SONGS
];

export const SITE_NAME = "El TOCHO.app";
