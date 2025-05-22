'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Song } from '@/types/song';
import { allSongs } from '@/lib/data/songs'; // Direct import as per plan
import { getFavoriteSongIdsFromStorage } from '@/lib/client-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, PrinterIcon } from 'lucide-react';
import { PrintableSongItem } from '@/components/client/printable-song-item';

// Placeholder for PrintableSongItem - will be created next
// import { PrintableSongItem } from '@/components/client/printable-song-item';

export default function HojaFavoritosPage() {
  const router = useRouter();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [printableSheetTitle, setPrintableSheetTitle] = useState('Mis Canciones Favoritas');

  useEffect(() => {
    setIsClient(true);
    const favoriteIds = getFavoriteSongIdsFromStorage();
    const favSongsData = allSongs.filter(song => favoriteIds.includes(song.id));
    setFavoriteSongs(favSongsData);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!isClient) {
    // Avoid rendering anything on the server that depends on localStorage
    return null; 
  }

  return (
    <div className="hoja-favoritos-page min-h-screen bg-stone-50 print:bg-white text-stone-900 print:text-black">
      {/* Screen Controls - Hidden on Print */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 print:hidden">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Input 
            type="text"
            value={''}
            onChange={(e) => setPrintableSheetTitle(e.target.value)}
            placeholder="Escribe un título para la hoja..."
            className="w-full sm:w-1/2 md:w-1/3 text-center border-stone-300 focus:border-sky-500"
          />
          <Button onClick={handlePrint} className="w-full sm:w-auto">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Content to be Printed (includes fixed header/footer for print) */}
      <div className="printable-area">
        {/* Fixed Print Header - Now includes all elements */}
        <div className="print-header print:fixed print:top-0 print:left-0 print:right-0 print:h-[12mm] print:flex print:items-center print:justify-between print:text-xs print:border-b print:border-gray-300 hidden px-[15mm]">
          <span className="font-bold">EL TOCHO</span>
          <span className="flex-grow font-semibold text-lg text-center">{printableSheetTitle}</span>
          <a href="https://cantoraleltocho.com" target="_blank" rel="noopener noreferrer" className="hover:underline">cantoraleltocho.com</a>
        </div>

        {/* Song List - main content area */}
        {/* Adjust top padding for print to account for the new header height */}
        <div className="song-list-content container mx-auto px-2 sm:px-4 print:px-0 print:pb-[5mm]">
          {favoriteSongs.length > 0 ? (
            <div className="space-y-4 print:space-y-0">
              {favoriteSongs.map((song, index) => (
                <PrintableSongItem 
                  key={song.id} 
                  song={song} 
                  songIndex={index} 
                  totalSongs={favoriteSongs.length} 
                />
              ))}
              {/* <p className="text-center print:hidden">Renderización de PrintableSongItem aquí.</p> */}
              {/* Temporary display for development */} 
              {/* <div className="p-4 border print:border-none">
                  <h2 className="text-xl font-semibold mb-2 print:text-lg">Lista de Canciones (para imprimir):</h2>
                  {favoriteSongs.map(song => (
                      <div key={song.id} className="mb-4 p-2 border-b print:border-b-0">
                          <h3 className="font-bold text-lg print:text-base">{song.title} ({song.code})</h3>
                          <p className="text-sm print:text-xs">{song.author}</p>
                          <pre className="whitespace-pre-wrap font-mono text-xs print:text-[8pt] leading-tight mt-1">
                              {/* First 10 lines of lyrics for preview */}
                              {/* {song.lyrics.split('\n').slice(0,10).join('\n')}
                              {song.lyrics.split('\n').length > 10 && '...'} */}
                          {/* </pre>
                      </div>
                  ))}
              </div> */}
            </div>
          ) : (
            <p className="text-center text-lg print:hidden">No tienes canciones favoritas seleccionadas. Añade algunas desde el cancionero.</p>
          )}
        </div>
      </div>
    </div>
  );
} 