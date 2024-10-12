'use client'

import React from 'react';
import { ArrowLeft, ChevronRight, BookOpen, Moon, Sun, Music } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Footer from '@/components/footer';
import { SITE_NAME, CATEGORIES, ALL_SONGS } from "@/components/constants"
import { useTheme } from '@/lib/theme-context'
import { Song, Category } from "@/types/song"

interface CategorySongsProps {
  categoryLetter: string;
}

export function CategorySongs({ categoryLetter }: CategorySongsProps) {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme();

  const category = CATEGORIES.find(cat => cat.letter === categoryLetter);
  const songs = ALL_SONGS.filter(song => song.category === categoryLetter);

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
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                isDarkMode ? 'bg-stone-700' : 'bg-stone-800'
              }`}>
                <span className="text-2xl">{category.letter}</span>
              </div>
              <div>
                <h2 className="text-2xl font-merriweather font-bold">{category.description}</h2>
                <p className={`text-lg ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                  {songs.length} canciones
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {songs.map((song: Song) => (
                <div 
                  key={song.id} 
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer group ${
                    isDarkMode ? 'hover:bg-stone-700' : 'hover:bg-stone-50'
                  }`}
                  onClick={() => handleSongClick(song.id)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg shadow-inner transition-colors ${
                    isDarkMode ? 'bg-stone-700 text-stone-200 group-hover:bg-stone-600' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                  }`}>
                    {song.code}
                  </div>
                  <div className="flex-grow">
                    <p className={`font-semibold text-lg ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{song.title}</p>
                    <p className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>{song.author}</p>
                  </div>
                  <Music className={`${
                    isDarkMode ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-400 group-hover:text-stone-600'
                  } transition-colors`} size={20} />
                  <ChevronRight className={`${
                    isDarkMode ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-400 group-hover:text-stone-600'
                  } transition-colors`} size={24} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
