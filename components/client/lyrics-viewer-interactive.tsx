"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Rewind, Play, Pause, FastForward, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/ui/waveform";
import { TransposeControl } from "@/components/ui/transpose-control";
import { useTheme } from '@/lib/theme-context';
import { Song } from '@/types/song';

// Mock waveform data - in a real app, this might come from the song object or be generated
const MOCK_WAVEFORM_DATA = Array(100).fill(0).map(() => Math.random());
const MOCK_DURATION = 190; // 3:10 in seconds, example duration

interface LyricsViewerInteractiveProps {
  song: Song;
  // TODO: Add nextSongId and prevSongId if available for navigation
  // nextSongId?: string;
  // prevSongId?: string;
}

export function LyricsViewerInteractive({ song }: LyricsViewerInteractiveProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [transpose, setTranspose] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  // Duration might come from song.duration if available, otherwise use a mock or calculate
  const duration = song.duration || MOCK_DURATION; 

  const canPlayAudio = song.audioUrl && song.audioUrl.length > 0;

  const isLongSong = song.lyrics.split('\n').length > 20;

  const lyricsClassName = `whitespace-pre-wrap font-mono text-sm sm:text-base md:text-lg leading-relaxed select-text ${
    isLongSong ? 'columns-1 md:columns-2 gap-x-8 md:gap-x-12 lg:gap-x-16' : ''
  } ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleWaveformClick = (time: number) => {
    setCurrentTime(time);
    // TODO: Add audio seek logic here
  };

  // TODO: Implement actual chord transposition logic
  const displayLyrics = React.useMemo(() => {
    // Placeholder for transposition logic. For now, just returns original lyrics.
    // This function should parse lyrics and apply transposition based on `transpose` value.
    return song.lyrics;
  }, [song.lyrics, transpose]);

  // Placeholder for next/prev song navigation. 
  // This is brittle if IDs aren't sequential numbers.
  // Better to pass nextSongId/prevSongId as props if this feature is desired.
  const handleNextSong = () => {
    const currentId = parseInt(song.id);
    if (!isNaN(currentId)) router.push(`/canciones/${currentId + 1}`);
  };

  const handlePrevSong = () => {
    const currentId = parseInt(song.id);
    if (!isNaN(currentId) && currentId > 1) router.push(`/canciones/${currentId - 1}`);
  };

  return (
    <div className={`rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border space-y-6 ${
      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
            isDarkMode ? 'bg-stone-700' : 'bg-stone-800'
          }`}>
            <span className="text-2xl">{song.code}</span>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-merriweather font-bold leading-tight text-stone-800 dark:text-stone-100">{song.title}</h2>
            {song.author && <h3 className={`text-lg font-merriweather ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{song.author}</h3>}
          </div>
        </div>
        <div className="flex justify-end sm:justify-start">
          <TransposeControl
            value={transpose}
            onChange={setTranspose}
            min={-6} // Adjusted range for typical guitar transposition
            max={6}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {canPlayAudio && (
        <>
          <div className="space-y-2 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
            <div className="relative">
              <Waveform
                currentTime={currentTime}
                duration={duration} // Use actual or mock duration
                waveformData={MOCK_WAVEFORM_DATA} // Use actual or mock waveform data
                onClick={handleWaveformClick}
                isDarkMode={isDarkMode}
                // audioSrc={song.audioUrl} // Pass audioUrl to Waveform if it handles playback
              />
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs sm:text-sm font-medium">
                <span className={`${isDarkMode ? 'text-stone-400' : 'text-stone-600'} absolute left-0 sm:left-1 bottom-[-1.25rem] sm:bottom-[-1.5rem]`}>
                  {formatTime(currentTime)}
                </span>
                <span className={`${isDarkMode ? 'text-stone-400' : 'text-stone-600'} absolute right-0 sm:right-1 bottom-[-1.25rem] sm:bottom-[-1.5rem]`}>
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          <div className={`flex justify-center items-center space-x-1 sm:space-x-2 md:space-x-4`}>
            <Button
              variant="ghost"
              size="icon"
              className={`${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
              onClick={handlePrevSong} 
              aria-label="Canción anterior"
              // disabled={!prevSongId} // Would be enabled if prevSongId is passed
            >
              <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))} // TODO: Add audio rewind logic
              aria-label="Retroceder 10 segundos"
            >
              <Rewind className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${isDarkMode ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-800 hover:bg-stone-700'} text-white`}
              onClick={() => setIsPlaying(!isPlaying)} // TODO: Add audio play/pause logic
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
              onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))} // TODO: Add audio fast-forward logic
              aria-label="Avanzar 10 segundos"
            >
              <FastForward className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
              onClick={handleNextSong}
              aria-label="Siguiente canción"
              // disabled={!nextSongId} // Would be enabled if nextSongId is passed
            >
              <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </>
      )}
      
      <div className={`${lyricsClassName} mt-6 px-1 sm:px-2 md:px-4 lg:px-6`}>
        {displayLyrics}
      </div>
    </div>
  );
} 