'use client'

import React from 'react';
import { ArrowLeft, ChevronRight, BookOpen, Moon, Sun, Play, Pause, Search, Heart } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Footer from '@/components/footer';
import { SITE_NAME, CATEGORIES, ALL_SONGS } from "@/components/constants"
import { useTheme } from '@/lib/theme-context'
import { Song, Category } from "@/types/song"
import { Waveform } from "@/components/ui/waveform"
import { motion, AnimatePresence } from "framer-motion"
import { WaveformPreview } from "@/components/ui/waveform-preview"

interface CategorySongsProps {
  categoryLetter: string;
}

export function CategorySongs({ categoryLetter }: CategorySongsProps) {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [playingSong, setPlayingSong] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredSongs, setFilteredSongs] = React.useState<Song[]>([]);
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(false);

  const category = CATEGORIES.find(cat => cat.letter === categoryLetter);
  const songs = React.useMemo(() => ALL_SONGS.filter(song => song.category === categoryLetter), [categoryLetter]);

  React.useEffect(() => {
    setFilteredSongs(songs);
  }, [songs]);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (searchTerm) {
        const filtered = songs.filter(song => 
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSongs(filtered);
      } else {
        setFilteredSongs(songs);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, songs]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Categoría no encontrada</div>
      </div>
    );
  }

  const handleSongClick = (songId: string) => {
    router.push(`/song/${songId}`)
  }

  const handlePlayPause = (songId: string) => {
    if (playingSong === songId) {
      setPlayingSong(null);
      // Here you would stop the audio
    } else {
      setPlayingSong(songId);
      // Here you would play the audio
    }
  }

  const toggleFavorite = (songId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(songId)) {
        newFavorites.delete(songId);
      } else {
        newFavorites.add(songId);
      }
      return newFavorites;
    });
  }

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode ? 'bg-stone-900 text-stone-100' : 'bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 text-stone-800'
    } font-inter`}>
      <header className={`border-b py-4 shadow-md sticky top-0 z-10 backdrop-blur-sm ${
        isDarkMode ? 'bg-stone-800/90 border-stone-700' : 'bg-white/90 border-stone-200'
      }`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-merriweather font-bold flex items-center">
            <BookOpen className="mr-2" size={28} /> {SITE_NAME}
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              className={`font-medium ${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className={`rounded-2xl shadow-xl p-6 border ${
            isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
          }`}>
            <div className="flex items-center space-x-6 mb-8">
              <div className={`w-24 h-24 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                isDarkMode ? 'bg-stone-700' : 'bg-stone-800'
              }`}>
                <span className="text-4xl">{category.letter}</span>
              </div>
              <div>
                <h2 className="text-3xl font-merriweather font-bold mb-2">{category.description}</h2>
                <p className={`text-xl ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                  {filteredSongs.length} canciones
                </p>
              </div>
            </div>

            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar canciones en esta categoría..."
                className={`w-full pl-10 pr-4 py-2 text-lg border-none focus:ring-2 ${
                  isDarkMode ? 'bg-stone-700 text-stone-100 focus:ring-stone-600' : 'bg-stone-100 text-stone-800 focus:ring-stone-300'
                } rounded-full`}
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
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-500"></div>
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
                      className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                        isDarkMode ? 'hover:bg-stone-700' : 'hover:bg-stone-50'
                      }`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`${
                          isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
                        } ${playingSong === song.id ? 'animate-pulse' : ''}`}
                        onClick={() => handlePlayPause(song.id)}
                      >
                        {playingSong === song.id ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg shadow-inner transition-colors ${
                        isDarkMode ? 'bg-stone-700 text-stone-200 group-hover:bg-stone-600' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                      }`}>
                        {song.code}
                      </div>
                      <div className="flex-grow cursor-pointer" onClick={() => handleSongClick(song.id)}>
                        <p className={`font-semibold text-lg ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{song.title}</p>
                        <p className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>{song.author}</p>
                      </div>
                      {playingSong === song.id && (
                        <div className="w-24">
                          <WaveformPreview isDarkMode={isDarkMode} />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(song.id)}
                        className={`${
                          isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
                        } ${favorites.has(song.id) ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`h-5 w-5 ${favorites.has(song.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <ChevronRight 
                        className={`${
                          isDarkMode ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-400 group-hover:text-stone-600'
                        } transition-colors cursor-pointer`} 
                        size={24} 
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
                  <p className="text-xl font-semibold">No se encontraron canciones</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
