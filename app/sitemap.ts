import { MetadataRoute } from 'next';
import { allSongs, categories } from '@/lib/data/songs';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://cantoraleltocho.com';

// Define allowed change frequencies for stricter typing
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    '/',
    '/categorias',
    '/canciones',
    '/descargas',
    '/acerca-de',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: lastModified,
    changeFrequency: (route === '/' ? 'weekly' : 'monthly') as ChangeFrequency,
    priority: route === '/' ? 1.0 : 0.8,
  }));

  // Dynamic category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/categorias/${category.slug}`,
    lastModified: lastModified,
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.7,
  }));

  // Dynamic song pages
  const songPages: MetadataRoute.Sitemap = allSongs.map((song) => ({
    url: `${BASE_URL}/canciones/${song.slug}`,
    lastModified: lastModified, 
    changeFrequency: 'yearly' as ChangeFrequency, 
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...songPages,
  ];
} 