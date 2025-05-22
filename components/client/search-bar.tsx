"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Song } from "@/types/song";
import { useTheme } from "@/lib/theme-context";
import { searchSongs } from '@/lib/data/songs';

export function SearchBar() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Song[]>([]);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  React.useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const results = searchSongs(searchTerm, {
        priorityFields: ['title', 'author', 'lyrics', 'code'],
        limit: 5,
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSongClick = (songSlug: string) => {
    router.push(`/canciones/${songSlug}`);
  };

  const handleSearchButtonClick = () => {
    // Currently, search happens on type. This button could navigate to a dedicated search page
    // or trigger a more explicit search action if desired.
    if (searchResults.length > 0) {
      // Example: navigate to the first result or a search results page
      // router.push(`/canciones/${searchResults[0].slug}`);
    }
  };

  return (
    <div className="text-center">
      <h2 className={`text-5xl font-merriweather font-bold mb-8 leading-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>
        Encuentra tu canción favorita
      </h2>
      <div className="relative max-w-2xl mx-auto">
        <div className={`flex items-center shadow-xl rounded-full overflow-hidden ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'} border`}>
          <div className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-stone-400" size={24} />
            <Input
              type="text"
              placeholder="Título, autor, letra, código..."
              className={`w-full pl-16 pr-4 py-6 text-lg border-none focus:ring-2 ${isDarkMode ? 'bg-stone-800 text-stone-100 focus:ring-stone-600' : 'bg-white text-stone-800 focus:ring-stone-300'} rounded-l-full`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <X
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer ${isDarkMode ? 'text-stone-400 hover:text-stone-200' : 'text-stone-400 hover:text-stone-600'}`}
                size={20}
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              />
            )}
          </div>
          <Button 
            className={`${isDarkMode ? 'bg-stone-700 hover:bg-stone-600 text-stone-100' : 'bg-stone-800 hover:bg-stone-700 text-white'} rounded-r-full px-10 py-6 text-lg font-semibold transition-colors duration-300`}
            onClick={handleSearchButtonClick}
            aria-label="Search"
          >
            Buscar
          </Button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className={`mt-8 space-y-2 rounded-2xl shadow-xl p-6 border text-left ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
          {searchResults.map((song) => (
            <div 
              key={song.id}
              className={`flex items-center space-x-6 p-4 transition-all duration-300 cursor-pointer rounded-xl group ${isDarkMode ? 'hover:bg-stone-700' : 'hover:bg-stone-50'}`}
              onClick={() => handleSongClick(song.slug)}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl shadow-inner transition-colors ${isDarkMode ? 'bg-stone-700 text-stone-200 group-hover:bg-stone-600' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'}`}>
                {song.code}
              </div>
              <div className="flex-grow">
                <p className={`font-semibold text-lg mb-1 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{song.title}</p>
                <p className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>{song.author}</p>
              </div>
              <ChevronRight className={`${isDarkMode ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-400 group-hover:text-stone-600'} transition-colors`} size={24} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 