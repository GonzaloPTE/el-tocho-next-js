"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Play, Pause, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from '@/lib/theme-context';
import { Song } from "@/types/song";
import { motion, AnimatePresence } from "framer-motion";
import { WaveformPreview } from "@/components/ui/waveform-preview";

interface CategorySongListProps {
  initialSongs: Song[];
  categoryName: string; // For display purposes if needed, like "No songs found in {categoryName}"
}

export function CategorySongList({ initialSongs, categoryName }: CategorySongListProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [playingSong, setPlayingSong] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredSongs, setFilteredSongs] = React.useState<Song[]>(initialSongs);
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set()); // localStorage could be used here for persistence
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Initialize filteredSongs when initialSongs prop changes (e.g., navigating between categories)
    setFilteredSongs(initialSongs);
    setSearchTerm(''); // Reset search term when category changes
  }, [initialSongs]);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (searchTerm) {
        const filtered = initialSongs.filter(song => 
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (song.author && song.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
          song.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSongs(filtered);
      } else {
        setFilteredSongs(initialSongs);
      }
      setIsLoading(false);
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [searchTerm, initialSongs]);

  const handleSongClick = (songId: string) => {
    router.push(`/song/${songId}`);
  };

  const handlePlayPause = (songId: string) => {
    const song = initialSongs.find(s => s.id === songId);
    if (song && song.hasAudio) {
      if (playingSong === songId) {
        setPlayingSong(null);
        // TODO: Implement actual audio stop logic here
      } else {
        setPlayingSong(songId);
        // TODO: Implement actual audio play logic here
      }
    }
  };

  const toggleFavorite = (songId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(songId)) {
        newFavorites.delete(songId);
      } else {
        newFavorites.add(songId);
      }
      // Consider saving favorites to localStorage
      return newFavorites;
    });
  };

  return (
    <div>
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
        <Input
          type="text"
          placeholder={`Buscar en ${categoryName}...`}
          className={`w-full pl-10 pr-4 py-2 text-lg border-none focus:ring-2 rounded-full ${
            isDarkMode ? 'bg-stone-700 text-stone-100 focus:ring-stone-600' : 'bg-stone-100 text-stone-800 focus:ring-stone-300'
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-40"
          >
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-stone-400' : 'border-stone-500'}`}></div>
          </motion.div>
        ) : filteredSongs.length > 0 ? (
          <motion.div
            key="songList"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredSongs.map((song: Song, index) => (
              <motion.div 
                key={song.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 rounded-xl transition-all duration-300 ${
                  isDarkMode ? 'hover:bg-stone-700/50' : 'hover:bg-stone-50' // Adjusted hover background
                }`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={`flex-shrink-0 ${
                    isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
                  } ${playingSong === song.id ? 'animate-pulse' : ''} ${!song.hasAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handlePlayPause(song.id)}
                  disabled={!song.hasAudio}
                  aria-label={playingSong === song.id ? "Pausar" : "Reproducir"}
                >
                  {playingSong === song.id ? <Pause className="h-4 w-4 sm:h-6 sm:w-6" /> : <Play className="h-4 w-4 sm:h-6 sm:w-6" />}
                </Button>
                <div 
                  className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm sm:text-lg shadow-inner transition-colors ${
                    isDarkMode ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {song.code}
                </div>
                <div className="flex-grow cursor-pointer min-w-0" onClick={() => handleSongClick(song.id)}>
                  <p className={`font-semibold text-sm sm:text-lg truncate ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{song.title}</p>
                  {song.author && <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>{song.author}</p>}
                </div>
                {playingSong === song.id && song.hasAudio && (
                  <div className="w-16 sm:w-24 flex-shrink-0">
                    <WaveformPreview isDarkMode={isDarkMode} />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(song.id)}
                  className={`flex-shrink-0 ${
                    isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
                  } ${favorites.has(song.id) ? (isDarkMode ? 'text-red-400' : 'text-red-500') : ''}`}
                  aria-label={favorites.has(song.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${favorites.has(song.id) ? 'fill-current' : ''}`} />
                </Button>
                <ChevronRight 
                  className={`flex-shrink-0 ${
                    isDarkMode ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-400 group-hover:text-stone-600'
                  } transition-colors cursor-pointer`} 
                  size={20} 
                  onClick={() => handleSongClick(song.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="noResults"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
              {searchTerm ? `No se encontraron canciones para "${searchTerm}"` : `No hay canciones en ${categoryName}`}
            </p>
            {searchTerm && <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Intenta con otra búsqueda o revisa la ortografía.</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 