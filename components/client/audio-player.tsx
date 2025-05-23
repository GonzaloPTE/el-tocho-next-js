"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Song } from '@/types/song';
import { useTheme } from '@/lib/theme-context';
import { Waveform } from '@/components/ui/waveform';
import { Button } from '@/components/ui/button';
import { Play, Pause, Rewind, FastForward, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';

// Mock waveform data - in a real app, this might come from the song object or be generated
const MOCK_WAVEFORM_DATA = Array(100).fill(0).map(() => Math.random());

interface AudioPlayerProps {
  song: Song | null;
  audioSrcOverride?: string;
  categoryDescription?: string;
  showWaveform?: boolean;
  showSongInfo?: boolean;
  showPlaybackControls?: boolean;
  showNavigationControls?: boolean;
  showShuffleButton?: boolean;
  showRepeatButton?: boolean;
  isShuffleActive?: boolean;
  isRepeatActive?: boolean;
  onPlay?: (song: Song) => void;
  onPause?: (song: Song) => void;
  onEnded?: (song: Song) => void;
  onNextSong?: () => void;
  onPrevSong?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  autoplay?: boolean;
  className?: string;
  // waveformColor?: string; // Removed
  // waveformProgressColor?: string; // Removed
  // TODO: Add shuffle/repeat state if managed internally, or props to reflect parent state
}

export function AudioPlayer({
  song,
  audioSrcOverride,
  categoryDescription,
  showWaveform = true,
  showSongInfo = true,
  showPlaybackControls = true,
  showNavigationControls = true,
  showShuffleButton = false,
  showRepeatButton = false,
  isShuffleActive = false,
  isRepeatActive = false,
  onPlay,
  onPause,
  onEnded,
  onNextSong,
  onPrevSong,
  onTimeUpdate,
  onShuffleToggle,
  onRepeatToggle,
  autoplay = false,
  className,
  // waveformColor, // Removed
  // waveformProgressColor, // Removed
}: AudioPlayerProps) {
  const { isDarkMode } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1); // Volume from 0 to 1

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const internalAudioSrcRef = useRef<string | null>(null); // Ref to track current internal src

  const audioFileUrl = audioSrcOverride || 
    (song && song.audioUrl && process.env.NEXT_PUBLIC_DOWNLOADS_BASE_URL 
      ? `${process.env.NEXT_PUBLIC_DOWNLOADS_BASE_URL}/${song.slug}.mp3` 
      : null);

  // Memoized event handlers for audio element
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
      setError(null);
    }
  }, []);

  const handleTimeUpdateInternal = useCallback(() => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      if (onTimeUpdate) {
        onTimeUpdate(current, total);
      }
    }
  }, [onTimeUpdate]);

  const handleEndedInternal = useCallback(() => {
    setIsPlaying(false);
    // setCurrentTime(0); // Keep current time at end, or reset? Depends on desired behavior
    if (song && onEnded) {
      onEnded(song);
    }
  }, [song, onEnded]);

  const handleError = useCallback((e: Event) => {
    console.error("Audio Player Error:", e);
    setError("Error playing audio.");
    setIsLoading(false);
    setIsPlaying(false);
  }, []);

  // Define handlePlayPause before the Media Session useEffect that depends on it
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !song) return;
    if (isPlaying) {
      audioRef.current.pause();
      if (onPause) onPause(song);
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        setError("No se pudo reproducir el audio.");
        setIsLoading(false);
      });
      if (onPlay) onPlay(song);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, song, onPlay, onPause]);

  useEffect(() => {
    if (!audioFileUrl || !song) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        internalAudioSrcRef.current = ""; // Clear internal src ref
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isNewSource = internalAudioSrcRef.current !== audioFileUrl;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioFileUrl);
      internalAudioSrcRef.current = audioFileUrl;
      isNewSource = true; // Definitely a new source
    } else if (isNewSource) {
      // Existing audio element, but new source URL
      audioRef.current.pause(); // Pause current playback before changing source
      audioRef.current.src = audioFileUrl;
      internalAudioSrcRef.current = audioFileUrl;
    }
    // If !isNewSource, audioRef.current exists and its src is already audioFileUrl

    const audioElement = audioRef.current;
    audioElement.volume = volume; // Apply volume/mute on every run if they changed
    audioElement.muted = isMuted;

    if (isNewSource) {
      setIsLoading(true);
      setError(null);
      setCurrentTime(0); // Reset current time ONLY for a new source
      setDuration(0);    // Reset duration, will be updated by loadedmetadata
      audioElement.load(); // Load the new source
    } else {
      // Source is not new. Handle direct play/pause commands from autoplay prop change.
      if (autoplay && audioElement.paused) {
        audioElement.play().catch(err => {
          console.warn("Play attempt failed (same song, autoplay=true):", err);
          setIsPlaying(false); // Ensure UI reflects failure
          if(onPause && song) onPause(song); // Notify parent about the effective pause
        });
      } else if (!autoplay && !audioElement.paused) {
        audioElement.pause();
        // The 'pause' event listener will call setIsPlaying(false)
        // and onPause will have already been called by handlePlayPause
      }
    }

    // Event listeners are set up below and should handle isPlaying state for most cases.
    // Be careful about adding/removing them if not necessary on every run.
    // For simplicity in this step, we assume they are fine as they were.

    const onLoadedMetadataCallback = () => {
      handleLoadedMetadata(); // Sets duration, clears loading/error
      // If it was a new source and autoplay is intended, and it's still paused (e.g. play() before load wasn't effective)
      if (isNewSource && autoplay && audioElement.paused) {
        console.log('[AudioPlayer] Attempting autoplay for new song on loadedmetadata. Autoplay prop:', autoplay);
        audioElement.play().catch(err => {
          console.warn("[AudioPlayer] Autoplay for new song failed on loadedmetadata:", err);
          setIsPlaying(false);
          if(onPause && song) onPause(song); // Notify parent
        });
      }
    };

    // --- Event Listeners --- (Simplified: assuming they are correctly added/removed as before for now)
    // It's generally better to ensure event listeners are added once or cleaned up properly if dependencies change.
    // For this focused fix, the core change is above.

    audioElement.addEventListener('loadedmetadata', onLoadedMetadataCallback);
    audioElement.addEventListener('timeupdate', handleTimeUpdateInternal);
    audioElement.addEventListener('ended', handleEndedInternal);
    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('stalled', handleError);
    audioElement.addEventListener('waiting', () => setIsLoading(true));
    audioElement.addEventListener('playing', () => {
        setIsLoading(false);
        setIsPlaying(true);
    });
    audioElement.addEventListener('pause', () => {
        if (audioRef.current && audioRef.current.currentTime < audioRef.current.duration && !audioRef.current.ended) {
            setIsPlaying(false);
        }
    });
    audioElement.addEventListener('canplay', () => setIsLoading(false));

    return () => {
      audioElement.removeEventListener('loadedmetadata', onLoadedMetadataCallback);
      audioElement.removeEventListener('timeupdate', handleTimeUpdateInternal);
      audioElement.removeEventListener('ended', handleEndedInternal);
      audioElement.removeEventListener('error', handleError);
      audioElement.removeEventListener('stalled', handleError);
      audioElement.removeEventListener('waiting', () => setIsLoading(true));
      audioElement.removeEventListener('playing', () => setIsLoading(false));
      audioElement.removeEventListener('canplay', () => setIsLoading(false));
      // No need to pause here if audio should persist across route changes if this component isn't unmounted
    };
  }, [song, audioFileUrl, volume, isMuted, autoplay, handleLoadedMetadata, handleTimeUpdateInternal, handleEndedInternal, handleError, onPlay, onPause]);

  // Media Session API Integration
  useEffect(() => {
    if (song && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.author || 'Artista Desconocido',
        album: song.category ? `El Tocho - ${song.category}` : 'Cantoral El Tocho',
        // artwork: [ // TODO: Add artwork if available
        //   { src: 'path/to/image.png', sizes: '96x96', type: 'image/png' },
        // ]
      });

      if (onPrevSong) {
        navigator.mediaSession.setActionHandler('previoustrack', onPrevSong);
      } else {
        navigator.mediaSession.setActionHandler('previoustrack', null);
      }
      if (onNextSong) {
        navigator.mediaSession.setActionHandler('nexttrack', onNextSong);
      } else {
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
      navigator.mediaSession.setActionHandler('play', handlePlayPause);
      navigator.mediaSession.setActionHandler('pause', handlePlayPause);
      // TODO: Consider adding seekbackward, seekforward, stop
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
      }
    };
  }, [song, onNextSong, onPrevSong, handlePlayPause]); // Re-run if these handlers change

  const handleSeek = (time: number) => {
    if (audioRef.current && audioRef.current.seekable) {
      // Ensure time is within valid range
      const newTime = Math.max(0, Math.min(time, duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRewind = () => handleSeek(currentTime - 10);
  const handleFastForward = () => handleSeek(currentTime + 10);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      // If muted and volume is adjusted, unmute
      if (newVolume > 0 && isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
       // If volume is set to 0, mute
      if (newVolume === 0 && !isMuted) {
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!song) {
    // Render nothing or a placeholder if no song is provided
    return null; 
  }
  
  const mainPlayerColorClass = isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200';
  const textColorClass = isDarkMode ? 'text-stone-300' : 'text-stone-700';
  const subTextColorClass = isDarkMode ? 'text-stone-400' : 'text-stone-500';
  const iconColorClass = isDarkMode ? 'text-stone-400 hover:text-stone-200' : 'text-stone-500 hover:text-stone-700';
  const primaryIconColorClass = isDarkMode ? 'text-stone-100 hover:text-stone-200' : 'text-stone-600 hover:text-stone-700';

  return (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-xl border ${mainPlayerColorClass} ${className || ''} flex flex-col space-y-4`}>
      {error && (
        <div className="p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm col-span-full">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Row 1: Header, Controls, Volume */}
      {/* Main parent div for the first row. Added sm:relative for absolute positioning of controls */}
      <div className="flex flex-col sm:flex-row items-center w-full sm:relative">
        {/* Song Info Header (Cabecera) - flex-1 to take space on the left */}
        {showSongInfo && (
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 sm:min-w-[180px] flex-1 py-2 sm:py-0">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md ${isDarkMode ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-700'}`}>
              {song.code}
            </div>
            <div className="min-w-0 flex-grow">
              <h3 className={`text-lg sm:text-xl font-semibold truncate ${textColorClass}`}>{song.title}</h3>
              {song.author && <p className={`text-sm sm:text-base truncate ${subTextColorClass}`}>{song.author}</p>}
              {song.category && <p className={`text-xs sm:text-sm truncate ${subTextColorClass}`}>Categoría: {categoryDescription || song.category}</p>}
            </div>
          </div>
        )}

        {/* Controls Middle Section (Absolutely centered on sm screens and up) */}
        {audioFileUrl && showPlaybackControls && (
          // On sm screens: absolute, centered. On xs: normal flow, order-first.
          <div className="order-first sm:order-none sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 py-2 sm:py-0">
            {/* Actual Playback Controls Buttons */}
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 flex-shrink-0">
              {showNavigationControls && onPrevSong && (
                <Button variant="ghost" size="icon" onClick={onPrevSong} aria-label="Previous song" className={iconColorClass} disabled={isLoading}>
                  <SkipBack className="h-5 w-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleRewind} aria-label="Rewind 10 seconds" className={iconColorClass} disabled={isLoading || !duration}>
                <Rewind className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePlayPause} 
                aria-label={isPlaying ? "Pause" : "Play"} 
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${primaryIconColorClass} disabled:opacity-50`}
                disabled={isLoading || !audioFileUrl || !duration && !isLoading} 
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                ) : isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleFastForward} aria-label="Fast-forward 10 seconds" className={iconColorClass} disabled={isLoading || !duration}>
                <FastForward className="h-5 w-5" />
              </Button>
              {showNavigationControls && onNextSong && (
                <Button variant="ghost" size="icon" onClick={onNextSong} aria-label="Next song" className={iconColorClass} disabled={isLoading}>
                  <SkipForward className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Volume, Shuffle, Repeat Controls (Volumen + new buttons) */}
        {audioFileUrl && showPlaybackControls && ( 
          <div className="flex items-center justify-end space-x-2 flex-1 min-w-[150px] sm:min-w-[180px] py-2 sm:py-0">
            {showShuffleButton && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onShuffleToggle}
                aria-label="Shuffle" 
                className={isShuffleActive ? primaryIconColorClass : iconColorClass} 
                disabled={isLoading}
              >
                <Shuffle className="h-5 w-5" />
              </Button>
            )}
            {showRepeatButton && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onRepeatToggle}
                aria-label="Repeat" 
                className={isRepeatActive ? primaryIconColorClass : iconColorClass} 
                disabled={isLoading}
              >
                <Repeat className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={toggleMute} className={iconColorClass}>
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange} 
              className="w-20 h-2 rounded-lg appearance-none cursor-pointer bg-stone-300 dark:bg-stone-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-stone-500 dark:[&::-webkit-slider-thumb]:bg-stone-400"
              aria-label="Volume"
            />
          </div>
        )}
      </div>

      {/* Row 2: Waveform Section - Full width below controls */}
      {audioFileUrl && showWaveform && (
        <div className="relative px-1 sm:px-2 py-2 w-full">
          <Waveform
            currentTime={currentTime}
            duration={duration}
            waveformData={MOCK_WAVEFORM_DATA}
            onClick={(timeInSeconds) => handleSeek(timeInSeconds)}
            isDarkMode={isDarkMode}
          />
          <div className="flex justify-between text-xs font-medium mt-1">
            <span className={subTextColorClass}>{formatTime(currentTime)}</span>
            <span className={subTextColorClass}>{formatTime(duration)}</span>
          </div>
        </div>
      )}
      
      {!audioFileUrl && showSongInfo && (
         <p className={`text-sm text-center italic ${subTextColorClass} mt-2`}>Audio no disponible para esta canción.</p>
      )}
    </div>
  );
} 