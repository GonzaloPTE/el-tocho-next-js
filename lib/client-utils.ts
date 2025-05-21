'use client';

const FAVORITES_STORAGE_KEY = 'favoriteSongIds';

export function getFavoriteSongIdsFromStorage(): string[] {
  if (typeof window === 'undefined') return []; // Guard against SSR
  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
  return storedFavorites ? JSON.parse(storedFavorites) : [];
}

export function addSongIdToFavoritesStorage(songId: string): string[] {
  if (typeof window === 'undefined') return [];
  const currentFavorites = getFavoriteSongIdsFromStorage();
  if (!currentFavorites.includes(songId)) {
    const newFavorites = [...currentFavorites, songId];
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    return newFavorites;
  }
  return currentFavorites;
}

export function removeSongIdFromFavoritesStorage(songId: string): string[] {
  if (typeof window === 'undefined') return [];
  const currentFavorites = getFavoriteSongIdsFromStorage();
  const newFavorites = currentFavorites.filter(id => id !== songId);
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
  return newFavorites;
} 