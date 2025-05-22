"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Rewind, Play, Pause, FastForward, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/ui/waveform";
import { TransposeControl } from "@/components/ui/transpose-control";
import { useTheme } from '@/lib/theme-context';
import { Song } from '@/types/song';
import { transposeFullLyrics } from '@/lib/utils';

// Mock waveform data - in a real app, this might come from the song object or be generated
const MOCK_WAVEFORM_DATA = Array(100).fill(0).map(() => Math.random());
// const MOCK_DURATION = 190; // 3:10 in seconds, example duration - We'll use actual duration if available or from audio element

// --- Transposition Logic --- (This will be removed)
// const SHARP_NOTES = ... (and other helpers)
// --- End Transposition Logic ---

interface LyricsViewerInteractiveProps {
  song: Song;
  // TODO: Add nextSongId and prevSongId if available for navigation
  // nextSongId?: string;
  // prevSongId?: string;
}

export function LyricsViewerInteractive({ song }: LyricsViewerInteractiveProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isDarkMode } = useTheme();
  const [transpose, setTranspose] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(song.duration || 0);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const canPlayAudio = song.audioUrl && song.audioUrl.length > 0;
  const audioFileUrl = canPlayAudio && process.env.NEXT_PUBLIC_DOWNLOADS_BASE_URL ? `${process.env.NEXT_PUBLIC_DOWNLOADS_BASE_URL}/${song.slug}.mp3` : '';

  // Stable event handlers
  const handleLoadedMetadata = React.useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [setDuration]);

  const handleTimeUpdate = React.useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [setCurrentTime]);

  const handleEnded = React.useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [setIsPlaying, setCurrentTime]);

  React.useEffect(() => {
    let audioElement: HTMLAudioElement | null = null;

    if (canPlayAudio && audioFileUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioFileUrl);
      } else {
        if (audioRef.current.src !== audioFileUrl) {
          audioRef.current.pause();
          setIsPlaying(false);
          setCurrentTime(0);
          audioRef.current.src = audioFileUrl;
        }
      }
      audioRef.current.load();
      audioElement = audioRef.current;

      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('ended', handleEnded);

      if (!song.duration && audioElement.readyState >= HTMLMediaElement.HAVE_METADATA) {
         setDuration(audioElement.duration);
      }

    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      if (!song.duration) setDuration(0);
    }

    return () => {
      if (audioElement) {
        audioElement.pause();
        setIsPlaying(false); // Ensure state reflects pause
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, [
    song.slug, 
    audioFileUrl, 
    canPlayAudio, 
    song.duration, 
    handleLoadedMetadata, 
    handleTimeUpdate, 
    handleEnded,
    setIsPlaying, // Direct usage in effect
    setCurrentTime, // Direct usage in effect
    setDuration // Direct usage in effect
  ]);

  React.useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
      setIsPlaying(false);
    }
  }, [pathname, setIsPlaying]); // Added setIsPlaying to dependency array

  const handlePlayPause = () => {
    if (audioRef.current && canPlayAudio) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current && canPlayAudio) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const handleRewind = () => {
    handleSeek(Math.max(0, currentTime - 10));
  };

  const handleFastForward = () => {
    handleSeek(Math.min(duration, currentTime + 10));
  };


  const isLongSong = song.lyrics.split('\\n').length > 20;

  const lyricsClassName = `whitespace-pre-wrap font-mono text-sm sm:text-base md:text-lg leading-relaxed select-text ${
    isLongSong ? 'columns-1 md:columns-2 gap-x-8 md:gap-x-12 lg:gap-x-16' : ''
  } ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleWaveformClick = (timeInSeconds: number) => {
    // The Waveform component provides the clicked time directly in seconds.
    handleSeek(timeInSeconds);
  };

  const displayLyrics = React.useMemo(() => {
    return transposeFullLyrics(song.lyrics, transpose);
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
                onClick={handleWaveformClick} // Already takes a fraction, will be multiplied by duration
                isDarkMode={isDarkMode}
                // audioSrc={audioFileUrl} // Pass audioFileUrl if Waveform needs it directly (e.g. for internal generation)
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
              onClick={handleRewind}
              aria-label="Retroceder 10 segundos"
            >
              <Rewind className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${isDarkMode ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-800 hover:bg-stone-700'} text-white`}
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
              onClick={handleFastForward}
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
      
      <div className={`${lyricsClassName} mt-6 pt-12 px-1 sm:px-2 md:px-4 lg:px-6`}>
        {displayLyrics}
      </div>
    </div>
  );
} 