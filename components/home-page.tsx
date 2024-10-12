"use client"

import React from 'react';
import { Search, X, ChevronRight, BookOpen, Moon, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CATEGORIES, FEATURED_SONGS, ALL_SONGS, SITE_NAME } from "@/components/constants"
import { Category, Song, FeaturedSong } from "@/types/song";
import Footer from '@/components/footer';
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Song[]>([]);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter()

  React.useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredResults = ALL_SONGS.filter(song => 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.code.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSongClick = (songId: string) => {
    router.push(`/song/${songId}`)
  }

  const handleCategoryClick = (categoryLetter: string) => {
    router.push(`/category/${categoryLetter}`)
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
          <nav className="flex items-center space-x-8">
            <a href="#" className={`transition-colors font-medium hover:underline decoration-2 underline-offset-8 ${
              isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
            }`}>Inicio</a>
            <a href="#" className={`transition-colors font-medium hover:underline decoration-2 underline-offset-8 ${
              isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
            }`}>Buscar</a>
            <a href="#" className={`transition-colors font-medium hover:underline decoration-2 underline-offset-8 ${
              isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
            }`}>Destacados</a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-24">
          {/* Search section */}
          <div className="text-center">
            <h2 className={`text-5xl font-merriweather font-bold mb-8 leading-tight ${
              isDarkMode ? 'text-stone-100' : 'text-stone-800'
            }`}>
              Encuentra tu canción favorita
            </h2>
            <div className="relative max-w-2xl mx-auto">
              <div className={`flex items-center shadow-xl rounded-full overflow-hidden ${
                isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
              } border`}>
                <div className="relative flex-grow">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-stone-400" size={24} />
                  <Input
                    type="text"
                    placeholder="Buscar por título, autor, letra..."
                    className={`w-full pl-16 pr-4 py-6 text-lg border-none focus:ring-2 ${
                      isDarkMode ? 'bg-stone-800 text-stone-100 focus:ring-stone-600' : 'bg-white text-stone-800 focus:ring-stone-300'
                    } rounded-l-full`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <X
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                        isDarkMode ? 'text-stone-400 hover:text-stone-200' : 'text-stone-400 hover:text-stone-600'
                      }`}
                      size={20}
                      onClick={() => setSearchTerm('')}
                    />
                  )}
                </div>
                <Button 
                  className={`${
                    isDarkMode ? 'bg-stone-700 hover:bg-stone-600 text-stone-100' : 'bg-stone-800 hover:bg-stone-700 text-white'
                  } rounded-r-full px-10 py-6 text-lg font-semibold transition-colors duration-300`}
                  onClick={() => {/* Implement search function */}}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className={`mt-8 space-y-2 rounded-2xl shadow-xl p-6 border ${
              isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
            }`}>
              {searchResults.map((song, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-6 p-4 transition-all duration-300 cursor-pointer rounded-xl group ${
                    isDarkMode ? 'hover:bg-stone-700' : 'hover:bg-stone-50'
                  }`}
                  onClick={() => handleSongClick(song.id)}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl shadow-inner transition-colors ${
                    isDarkMode ? 'bg-stone-700 text-stone-200 group-hover:bg-stone-600' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                  }`}>
                    {song.code}
                  </div>
                  <div className="flex-grow">
                    <p className={`font-semibold text-lg mb-1 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{song.title}</p>
                    <p className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>{song.author}</p>
                  </div>
                  <ChevronRight className={`${
                    isDarkMode ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-400 group-hover:text-stone-600'
                  } transition-colors`} size={24} />
                </div>
              ))}
            </div>
          )}

          {/* Categories section */}
          <div>
            <h2 className={`text-4xl font-merriweather font-bold mb-6 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>Categorías</h2>
            <p className={`mb-8 leading-relaxed text-lg max-w-3xl ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
              El Tocho organiza sus canciones según los momentos de la misa, desde la entrada hasta la salida. Cada categoría está representada por una letra en orden cronológico de la ceremonia.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {CATEGORIES.map((category: Category) => (
                <div 
                  key={category.letter} 
                  className={`flex flex-col items-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 cursor-pointer ${
                    isDarkMode ? 'bg-stone-800 border-stone-700 hover:bg-stone-700' : 'bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                  onClick={() => handleCategoryClick(category.letter)}
                >
                  <span className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-stone-100' : 'text-stone-700'}`}>{category.letter}</span>
                  <p className={`text-center text-sm ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured songs section */}
          <div>
            <h2 className={`text-4xl font-merriweather font-bold mb-8 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>Canciones Destacadas</h2>
            <div className="space-y-6">
              {FEATURED_SONGS.map((song: FeaturedSong) => (
                <div 
                  key={song.id} 
                  className={`flex items-center space-x-6 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 group cursor-pointer ${
                    isDarkMode ? 'bg-stone-800 border-stone-700 hover:bg-stone-700' : 'bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                  onClick={() => handleSongClick(song.id)}
                >
                  <div className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-2xl shadow-inner transition-colors ${
                    isDarkMode ? 'bg-stone-700 text-stone-200 group-hover:bg-stone-600' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                  }`}>
                    {song.code}
                  </div>
                  <div className="flex-grow">
                    <h3 className={`font-semibold text-xl mb-2 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{song.title}</h3>
                    <p className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>{song.author}</p>
                  </div>
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

export default HomePage
