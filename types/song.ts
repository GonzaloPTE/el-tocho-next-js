export interface Category {
  letter: string;
  description: string;
  slug: string;
}

export interface Song {
  id: string;
  code: string;
  title: string;
  author: string;
  category: string;
  slug: string;
  hasAudio: boolean;
  lyrics: string;
  duration?: number;
}
