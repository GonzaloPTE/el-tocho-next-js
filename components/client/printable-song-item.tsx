'use client';

import React from 'react';
import { Song } from '@/types/song';

interface PrintableSongItemProps {
  song: Song;
  songIndex: number;
  totalSongs: number;
}

export function PrintableSongItem({ song, songIndex, totalSongs }: PrintableSongItemProps) {
  const isLongSong = song.lyrics.split('\n').length > 35; // Adjusted threshold for A4

  // Basic A4-like column styling for print. 
  // More precise control might need CSS @page rules or specific width calculations.
  const lyricsContainerStyle: React.CSSProperties = {
    columnCount: isLongSong ? 2 : 1,
    columnGap: isLongSong ? '1cm' : 'normal',
    breakInside: 'avoid', // Try to keep song content together
  };

  return (
    // Web view container with border and shadow, print styles remove this
    <div 
      className="printable-song-item mb-6 p-4 sm:p-6 border border-stone-200 rounded-lg shadow-sm print:border-none print:shadow-none print:p-0 print:mb-4"
      style={{ breakAfter: 'page' }} // Changed from 'auto' to 'page'
    >
      <div className="flex items-center mb-3 print:mb-4 print:-ml-10 print:mt-[20mm]"> {/* Adjusted print margin bottom */}
        <div className="mr-4 print:mx-6 flex-shrink-0">
          {/* Changed back to rounded-full for a circle */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-stone-800 print:bg-black rounded-full flex items-center justify-center print-force-color">
            <span className="text-white print:text-white font-bold text-sm sm:text-base">{song.code}</span>
          </div>
        </div>
        {/* Flex container for title/author and song order */}
        <div className="flex-grow flex justify-between items-start">
          {/* Title and Author block */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold print:text-lg leading-tight text-stone-800 print:text-black">{song.title}</h2>
            {song.author && <h3 className="text-md sm:text-lg text-stone-600 print:text-black print:text-sm">{song.author}</h3>}
          </div>
          {/* Song order display - more prominent in print */}
          <div className="text-xs text-stone-500 print:text-black print:text-sm ml-4 whitespace-nowrap">
            Canción {songIndex + 1} de {totalSongs}
          </div>
        </div>
      </div>

      {/* Horizontal line for web view, hidden in print */}
      <hr className="my-3 border-stone-200 print:hidden" />

      <div style={lyricsContainerStyle} className="pt-2 print:pt-0">
        {/* Changed font-mono to font-sans for Arial-like font in web view */}
        <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm print:text-[9pt] leading-snug print:leading-tight select-text text-stone-700 print:text-black">
          {song.lyrics}
        </pre>
      </div>
    </div>
  );
} 