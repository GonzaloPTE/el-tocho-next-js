import React from 'react';
import Link from 'next/link';
import { ChevronRight, SearchIcon } from "lucide-react";
import { Song } from "@/types/song";
import { SongItemControls } from '@/components/client/song-item-controls';
import { DebouncedCategorySearchInput } from '@/components/client/debounced-category-search-input';
import { SongPreviewProvider } from '@/components/client/song-preview-context'; 

// Define possible sort fields based on Song interface string properties
export type SongSortField = 'id' | 'code' | 'title' | 'author' | 'category' | 'slug' | 'lyrics' | 'audioUrl' | 'videoUrl';
export type SortOrder = 'asc' | 'desc';

interface CategorySongListProps {
  songs: Song[];
  categoryName: string;
  currentSearchTerm?: string;
  basePath: string;
  sortBy?: SongSortField;
  sortOrder?: SortOrder;
  isSearching?: boolean;
}

export function CategorySongList({ 
  songs, 
  categoryName, 
  currentSearchTerm, 
  basePath, 
  sortBy, 
  sortOrder = 'asc', // Default sortOrder to ascending
  isSearching // Destructure the prop
}: CategorySongListProps) {
  // Removed: useState for activePreviewSongId
  // Removed: handleTogglePreview function

  let processedSongs = [...songs];

  if (sortBy) {
    processedSongs.sort((a, b) => {
      const valA = String(a[sortBy] ?? ''); // Ensure string and provide default
      const valB = String(b[sortBy] ?? ''); // Ensure string and provide default

      if (sortBy === 'code') {
        // Natural sort for 'code' (e.g., A1, A2, A10)
        const matchA = valA.match(/^([A-Z]+)(\d+)$/);
        const matchB = valB.match(/^([A-Z]+)(\d+)$/);

        const letterA = matchA ? matchA[1] : valA;
        const numAStr = matchA ? matchA[2] : '0';
        const letterB = matchB ? matchB[1] : valB;
        const numBStr = matchB ? matchB[2] : '0';
        
        const numA = parseInt(numAStr, 10);
        const numB = parseInt(numBStr, 10);

        if (letterA.toLowerCase() < letterB.toLowerCase()) return sortOrder === 'asc' ? -1 : 1;
        if (letterA.toLowerCase() > letterB.toLowerCase()) return sortOrder === 'asc' ? 1 : -1;
        if (numA < numB) return sortOrder === 'asc' ? -1 : 1;
        if (numA > numB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      } else {
        // Standard string sort for other fields
        const strA = valA.toLowerCase();
        const strB = valB.toLowerCase();

        if (strA < strB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (strA > strB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });
  }

  return (
    <div className="mt-6">
      <DebouncedCategorySearchInput 
        initialSearchTerm={currentSearchTerm}
        categoryName={categoryName}
        basePath={basePath}
      />

      {isSearching && currentSearchTerm && processedSongs.length > 0 && (
        <div className="my-6 p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-stone-700 dark:text-stone-200 flex items-center">
            <SearchIcon className="w-4 h-4 mr-2 flex-shrink-0 text-stone-500 dark:text-stone-400" />
            Mostrando resultados para: <strong className="ml-1 font-semibold">"{currentSearchTerm}"</strong>
          </p>
        </div>
      )}

      <SongPreviewProvider>
        {processedSongs.length > 0 ? (
          <div className="space-y-1 pt-2">
            {processedSongs.map((song) => (
              <Link 
                href={`/canciones/${song.slug}`}
                key={song.id}
                className="flex items-center space-x-2 sm:space-x-4 p-3 sm:p-4 rounded-xl transition-all duration-200 hover:bg-stone-50 dark:hover:bg-stone-700/60 group border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
              >
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm sm:text-lg shadow-inner bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-200 transition-colors"
                >
                  {song.code}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-sm sm:text-lg truncate text-stone-800 dark:text-stone-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{song.title}</p>
                  {song.author && <p className="text-xs sm:text-sm truncate text-stone-500 dark:text-stone-400">{song.author}</p>}
                </div>
                <SongItemControls song={song} />
                <ChevronRight 
                  className="flex-shrink-0 text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors" 
                  size={20} 
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto h-12 w-12 text-stone-400 dark:text-stone-500 mb-3" />
            <p className="text-xl font-semibold text-stone-700 dark:text-stone-300">
              {currentSearchTerm 
                ? `No se encontraron canciones para "${currentSearchTerm}"` 
                : `No hay canciones en ${categoryName}`}
            </p>
            {currentSearchTerm && (
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                    Intenta con otra búsqueda o revisa la ortografía.
                </p>
            )}
          </div>
        )}
      </SongPreviewProvider>
    </div>
  );
} 