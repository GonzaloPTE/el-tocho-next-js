"use client"

import React from 'react';
import { Search, X, ChevronRight, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CATEGORIES, FEATURED_SONGS, ALL_SONGS, SITE_NAME } from "@/components/constants"
import { Category, Song, FeaturedSong } from "@/types/song";
import Footer from '@/components/footer';
import { useRouter } from 'next/navigation'

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Song[]>([]);
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

  return (
    <div className="bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 text-stone-800 font-inter min-h-screen flex flex-col">
      <header className="border-b border-stone-200 py-4 bg-white shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-merriweather font-bold text-stone-800 flex items-center">
            <BookOpen className="mr-2 text-stone-600" size={28} /> {SITE_NAME}
          </h1>
          <nav className="space-x-8">
            <a href="#" className="text-stone-600 hover:text-stone-800 transition-colors font-medium hover:underline decoration-2 underline-offset-8">Inicio</a>
            <a href="#" className="text-stone-600 hover:text-stone-800 transition-colors font-medium hover:underline decoration-2 underline-offset-8">Buscar</a>
            <a href="#" className="text-stone-600 hover:text-stone-800 transition-colors font-medium hover:underline decoration-2 underline-offset-8">Destacados</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-24">
          {/* Search section */}
          <div className="text-center">
            <h2 className="text-5xl font-merriweather font-bold mb-8 text-stone-800 leading-tight">
              Encuentra tu canción favorita
            </h2>
            <div className="relative max-w-2xl mx-auto">
              <div className="flex items-center shadow-xl rounded-full overflow-hidden bg-white border border-stone-200">
                <div className="relative flex-grow">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-stone-400" size={24} />
                  <Input
                    type="text"
                    placeholder="Buscar por título, autor, letra..."
                    className="w-full pl-16 pr-4 py-6 text-lg border-none focus:ring-2 focus:ring-stone-300 rounded-l-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <X
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 cursor-pointer hover:text-stone-600"
                      size={20}
                      onClick={() => setSearchTerm('')}
                    />
                  )}
                </div>
                <Button 
                  className="bg-stone-800 text-white hover:bg-stone-700 rounded-r-full px-10 py-6 text-lg font-semibold transition-colors duration-300"
                  onClick={() => {/* Implement search function */}}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="mt-8 space-y-2 bg-white rounded-2xl shadow-xl p-6 border border-stone-200">
              {searchResults.map((song, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-6 p-4 hover:bg-stone-50 transition-all duration-300 cursor-pointer rounded-xl group"
                  onClick={() => handleSongClick(song.id)}
                >
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-700 font-semibold text-xl shadow-inner group-hover:bg-stone-200 transition-colors">
                    {song.code}
                  </div>
                  <div className="flex-grow">
                    <p className="text-stone-800 font-semibold text-lg mb-1">{song.title}</p>
                    <p className="text-stone-500 text-base">{song.author}</p>
                  </div>
                  <ChevronRight className="text-stone-400 group-hover:text-stone-600 transition-colors" size={24} />
                </div>
              ))}
            </div>
          )}

          {/* Categories section */}
          <div>
            <h2 className="text-4xl font-merriweather font-bold mb-6 text-stone-800">Categorías</h2>
            <p className="text-stone-600 mb-8 leading-relaxed text-lg max-w-3xl">
              El Tocho organiza sus canciones según los momentos de la misa, desde la entrada hasta la salida. Cada categoría está representada por una letra en orden cronológico de la ceremonia.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {CATEGORIES.map((category: Category) => (
                <div key={category.letter} className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 hover:-translate-y-1 cursor-pointer">
                  <span className="text-4xl font-bold mb-4 text-stone-700">{category.letter}</span>
                  <p className="text-center text-sm text-stone-600">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured songs section */}
          <div>
            <h2 className="text-4xl font-merriweather font-bold mb-8 text-stone-800">Canciones Destacadas</h2>
            <div className="space-y-6">
              {FEATURED_SONGS.map((song: FeaturedSong) => (
                <div 
                  key={song.id} 
                  className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 hover:-translate-y-1 group cursor-pointer"
                  onClick={() => handleSongClick(song.id)}
                >
                  <div className="w-20 h-20 bg-stone-100 rounded-xl flex items-center justify-center text-stone-700 font-bold text-2xl shadow-inner group-hover:bg-stone-200 transition-colors">
                    {song.code}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-xl text-stone-800 mb-2">{song.title}</h3>
                    <p className="text-stone-500 text-lg">{song.author}</p>
                  </div>
                  <ChevronRight className="text-stone-400 group-hover:text-stone-600 transition-colors" size={24} />
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
