export interface Category {
  letter: string;
  description: string;
}

export interface Song {
  id: string;
  code: string;
  title: string;
  author: string;
  category: string;
  hasAudio: boolean;
  lyrics: string;
  duration?: number;
}
