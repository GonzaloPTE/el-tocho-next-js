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
  lyrics: string;
  audioUrl?: string;
  videoUrl?: string;
  duration?: number;
  tag?: string;
}
