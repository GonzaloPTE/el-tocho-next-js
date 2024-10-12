export interface Category {
  letter: string;
  description: string;
}

export interface Song {
  id: string;
  code: string;
  title: string;
  author: string;
  lyrics: string;
}

export interface FeaturedSong extends Song {
  // No additional fields needed for now
}
