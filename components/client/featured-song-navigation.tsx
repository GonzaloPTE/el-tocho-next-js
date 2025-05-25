"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { HeartCrack, ChevronRight, PrinterIcon } from 'lucide-react';
import { Song, Category } from '@/types/song';
import { useTheme } from '@/lib/theme-context';
import { getFavoriteSongIdsFromStorage } from '@/lib/client-utils';
import { SongItemControls } from '@/components/client/song-item-controls';
import { SongPreviewProvider } from '@/components/client/song-preview-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePlaylist } from './playlist-context';
import { AudioPlayerTestWrapper } from './audio-player-test-wrapper';

interface FeaturedSongNavigationProps {
  allSongs: Song[];
  categories: Category[];
}

function getInitialSongForPlayer(playlistCurrentSong: Song | null, playableFavorites: Song[]): Song | undefined {
  if (playlistCurrentSong && playableFavorites.some(s => s.id === playlistCurrentSong.id)) {
    return playlistCurrentSong;
  }
  return playableFavorites.length > 0 ? playableFavorites[0] : undefined;
}

export function FeaturedSongNavigation({ allSongs, categories }: FeaturedSongNavigationProps) {
  const { isDarkMode } = useTheme();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const router = useRouter();
  const playlist = usePlaylist();

  console.log('[FeaturedSongNavigation] Render. Current playlist song:', playlist.currentSong?.id, 'Is playing:', playlist.isPlaying);

  const playableFavoriteSongs = useMemo(() => {
    return favoriteSongs.filter(song => song.audioUrl && song.audioUrl.length > 0);
  }, [favoriteSongs]);

  useEffect(() => {
    const favoriteIds = getFavoriteSongIdsFromStorage();
    const newFavoriteSongs = allSongs.filter(song => favoriteIds.includes(song.id));
    setFavoriteSongs(newFavoriteSongs);

    const handleFavoritesChanged = () => {
      const updatedFavoriteIds = getFavoriteSongIdsFromStorage();
      const updatedNewFavoriteSongs = allSongs.filter(song => updatedFavoriteIds.includes(song.id));
      setFavoriteSongs(updatedNewFavoriteSongs);
    };
    window.addEventListener('favoritesChanged', handleFavoritesChanged);
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChanged);
    };
  }, [allSongs]);

  const handleSelectSongForPlaylist = (songId: string) => {
    const songIndex = playableFavoriteSongs.findIndex(s => s.id === songId);
    if (songIndex !== -1) {
      playlist.loadPlaylist(playableFavoriteSongs, songIndex, playlist.isShuffled, true);
    }
  };

  const initialSongForPlayer = getInitialSongForPlayer(playlist.currentSong, playableFavoriteSongs);

  if (favoriteSongs.length === 0) {
    return (
      <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center space-y-3 min-h-[200px] ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <HeartCrack className={`w-12 h-12 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`} />
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>No hay canciones favoritas</h3>
        <p className={`${isDarkMode ? 'text-stone-400' : 'text-stone-500'} max-w-xs`}>
          Marca tus canciones preferidas con el icono de corazón para verlas aquí.
        </p>
      </div>
    );
  }

  const itemBaseClasses = "flex items-center space-x-2 sm:space-x-4 p-3 sm:p-4 rounded-xl transition-all duration-200 group border border-transparent";
  const itemHoverClasses = "hover:bg-stone-50 dark:hover:bg-stone-700/60 hover:border-stone-200 dark:hover:border-stone-700";
  const itemPlayingClasses = isDarkMode ? "bg-stone-700/60 border-stone-600" : "bg-stone-200 border-stone-300";
  const textPlayingClass = isDarkMode ? "text-stone-100 font-bold" : "text-stone-900 font-bold";

  return (
    <SongPreviewProvider>
      {playableFavoriteSongs.length > 0 && initialSongForPlayer && (
        <div className="mb-6">
          <AudioPlayerTestWrapper 
            song={initialSongForPlayer} 
            allSongs={playableFavoriteSongs}
            categories={categories}
          />
        </div>
      )}

      <div className="space-y-1">
        {favoriteSongs.map((song) => {
          const isCurrentlySelected = playlist.currentSong?.id === song.id;
          const itemClasses = `${itemBaseClasses} ${isCurrentlySelected ? itemPlayingClasses : itemHoverClasses}`;
          const titleClasses = `font-semibold text-sm sm:text-lg truncate ${isCurrentlySelected ? textPlayingClass : 'text-stone-800 dark:text-stone-100 group-hover:text-sky-600 dark:group-hover:text-sky-400'} transition-colors`;

          return (
            <Link 
              href={`/canciones/${song.slug}`}
              key={song.id} 
              className={itemClasses}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm sm:text-lg shadow-inner bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-200 transition-colors"
              >
                {song.code}
              </div>
              <div className="flex-grow min-w-0">
                <p className={titleClasses}>{song.title}</p>
                {song.author && <p className="text-xs sm:text-sm truncate text-stone-500 dark:text-stone-400">{song.author}</p>}
              </div>
              <SongItemControls 
                song={song} 
                onSelectSong={handleSelectSongForPlaylist} 
              />
              <ChevronRight 
                className="flex-shrink-0 text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors" 
                size={20} 
              />
            </Link>
          );
        })}
      </div>
      {favoriteSongs.length > 0 && (
        <div className="mt-6 text-center">
          <Button 
            onClick={() => router.push('/hoja-favoritos')}
            variant="outline"
            className="border-stone-300 hover:border-stone-400 dark:border-stone-600 dark:hover:border-stone-500 dark:text-stone-300 dark:hover:text-stone-100"
          >
            <PrinterIcon className="mr-2 h-4 w-4" />
            Imprimir Hoja de Favoritos
          </Button>
        </div>
      )}
    </SongPreviewProvider>
  );
} 