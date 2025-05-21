"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from "lucide-react";
import { Song } from "@/types/song";
import { useTheme } from "@/lib/theme-context";

interface FeaturedSongNavigationProps {
  featuredSongs: Song[];
}

export function FeaturedSongNavigation({ featuredSongs }: FeaturedSongNavigationProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleSongClick = (songId: string) => {
    router.push(`/song/${songId}`);
  };

  return (
    <div className="space-y-6">
      {featuredSongs.map((song: Song) => (
        <div 
          key={song.id} 
          className={`flex items-center space-x-6 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 group cursor-pointer ${isDarkMode ? 'bg-stone-800 border-stone-700 hover:bg-stone-700' : 'bg-white border-stone-200 hover:bg-stone-50'}`}
          onClick={() => handleSongClick(song.id)}
        >
          <div className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-2xl shadow-inner transition-colors ${isDarkMode ? 'bg-stone-700 text-stone-200 group-hover:bg-stone-600' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'}`}>
            {song.code}
          </div>
          <div className="flex-grow">
            <h3 className={`font-semibold text-xl mb-2 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{song.title}</h3>
            <p className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>{song.author}</p>
          </div>
          <ChevronRight className={`${isDarkMode ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-400 group-hover:text-stone-600'} transition-colors`} size={24} />
        </div>
      ))}
    </div>
  );
} 