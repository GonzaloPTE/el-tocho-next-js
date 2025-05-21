import React from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Song } from "@/types/song";
import { SongItemControls } from '@/components/client/song-item-controls';

interface CategorySongListProps {
  songs: Song[];
  categoryName: string;
  currentSearchTerm?: string;
}

export function CategorySongList({ songs, categoryName, currentSearchTerm }: CategorySongListProps) {
  return (
    <div>
      <form method="GET" action="" className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 dark:text-stone-500" size={20} />
        <Input
          type="text"
          name="search"
          placeholder={`Buscar en ${categoryName}...`}
          defaultValue={currentSearchTerm || ''}
          className="w-full pl-10 pr-4 py-2 text-lg border bg-stone-100 border-stone-300 focus:ring-2 focus:ring-stone-400 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-100 dark:focus:ring-stone-500 rounded-full"
        />
      </form>

      {songs.length > 0 ? (
        <div className="space-y-1">
          {songs.map((song) => (
            <Link 
              href={`/song/${song.id}`}
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
        <div className="text-center py-8">
          <p className="text-xl font-semibold text-stone-700 dark:text-stone-300">
            {currentSearchTerm 
              ? `No se encontraron canciones para "${currentSearchTerm}"` 
              : `No hay canciones en ${categoryName}`}
          </p>
          {currentSearchTerm && <p className="text-sm text-stone-500 dark:text-stone-400">Intenta con otra búsqueda o revisa la ortografía.</p>}
        </div>
      )}
    </div>
  );
} 