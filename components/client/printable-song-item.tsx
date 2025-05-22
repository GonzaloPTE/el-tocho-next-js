'use client';

import React from 'react';
import { Song } from '@/types/song';

interface PrintableSongItemProps {
  song: Song;
  songIndex: number;
  totalSongs: number;
  tag?: string; // Optional tag prop
  onTagChange: (newTag: string) => void; // Handler for tag changes
}

export function PrintableSongItem({ song, songIndex, totalSongs, tag, onTagChange }: PrintableSongItemProps) {
  const numberOfLines = song.lyrics.split('\n').length;
  const isLongSong = numberOfLines > 35; // Adjusted threshold for A4
  
  // TEMPORARY DEBUGGING - REMOVED
  // if (typeof window !== 'undefined') { // Ensure this only runs on the client
  //   console.log(`Song: ${song.title}, Lines: ${numberOfLines}, isLongSong: ${isLongSong}`);
  // }

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
      className={`printable-song-item mb-6 p-4 sm:p-6 border border-stone-200 rounded-lg shadow-sm print:border-none print:shadow-none print:p-0 print:my-4 ${
        isLongSong ? 'print-col-span-all' : ''
      }`}
    >
      <div className="flex items-center mb-3 print:mb-8">
        <div className="mr-4 flex-shrink-0">
          {/* Display songIndex + 1 in the circle */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-stone-800 print:bg-black rounded-full flex items-center justify-center print-force-color">
            <span className="text-white print:text-white font-bold text-sm sm:text-base">{songIndex + 1}</span>
          </div>
        </div>
        {/* Flex container for title/author and song order */}
        <div className="flex-grow flex justify-between items-start">
          {/* Title and Author block */}
          <div>
            {/* New container for input, separator, and title */}
            <div className="flex items-baseline mb-1">
              {/* Group for input (web) / tag display (print) and separator */}
              <div className="flex items-baseline mr-2">
                {/* Web: Input field */}
                <input
                  type="text"
                  placeholder="Entrada, Comunión,..."
                  value={tag || ''} // Controlled component
                  onChange={(e) => onTagChange(e.target.value)} // Update state
                  className="print:hidden text-sm border border-stone-300 rounded px-2 py-1 w-auto sm:w-36 md:w-48 focus:ring-sky-500 focus:border-sky-500"
                  onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                />
                {/* Print: Display tag value if present */}
                {tag && <span className="hidden print:inline text-sm text-stone-700">{tag}</span>}
                
                {/* Separator - Print view (only show if tag is present and not empty) */}
                {tag && tag.trim() !== '' && <span className="hidden print:inline text-stone-400 print:mx-1">-</span>}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold print:text-lg leading-tight text-stone-800 print:text-black">{song.title}</h2>
            </div>
            {/* Display author and song code conditionally */} 
            {song.author ? (
              <h3 className="text-md sm:text-lg text-stone-600 print:text-black print:text-xs ml-2">
                <span className="text-stone-500 print:text-gray-700">{song.code} - {song.author} </span>
              </h3>
            ) : (
              <h3 className="text-md sm:text-lg text-stone-500 print:text-gray-700 print:text-xs">
                {song.code}
              </h3>
            )}
          </div>
          {/* REMOVED Song order display (Canción X de Y) */}
          {/* <div className="text-xs text-stone-500 print:text-black print:text-sm ml-4 whitespace-nowrap">
            Canción {songIndex + 1} de {totalSongs}
          </div> */}
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