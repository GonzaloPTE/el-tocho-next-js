"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveformPreview } from "@/components/ui/waveform-preview";
import { useTheme } from '@/lib/theme-context';
import { Song } from '@/types/song';
import { useSongPreview } from '@/components/client/song-preview-context';
import { usePlaylist } from './playlist-context';
import { 
  getFavoriteSongIdsFromStorage,
  addSongIdToFavoritesStorage,
  removeSongIdFromFavoritesStorage
} from '@/lib/client-utils';

interface SongItemControlsProps {
  song: Song;
  onSelectSong: (songId: string) => void;
}

export function SongItemControls({ song, onSelectSong }: SongItemControlsProps) {
  const { isDarkMode } = useTheme();
  const { activePreviewSongId, togglePreview: toggleSongPreview } = useSongPreview();
  const playlist = usePlaylist();
  const [isFavorite, setIsFavorite] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const isThisSongPlayingInMainPlayer = playlist.currentSong?.id === song.id && playlist.isPlaying;
  console.log(`[SongItemControls: ${song.code}] Render. Is this playing in main: ${isThisSongPlayingInMainPlayer}. Playlist current: ${playlist.currentSong?.id}`);

  const isThisSongSelectedForPreview = song.id === activePreviewSongId;

  useEffect(() => {
    const favoriteIds = getFavoriteSongIdsFromStorage();
    setIsFavorite(favoriteIds.includes(song.id));
  }, [song.id]);

  const canPlayAudio = song.audioUrl && song.audioUrl.length > 0;
  const audioFileUrl = canPlayAudio && process.env.NEXT_PUBLIC_DOWNLOADS_BASE_URL ? `${process.env.NEXT_PUBLIC_DOWNLOADS_BASE_URL}/${song.slug}.mp3` : '';

  React.useEffect(() => {
    if (!canPlayAudio || !audioFileUrl || !audioPreviewRef) {
      return;
    }
    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio(audioFileUrl);
    } else if (audioPreviewRef.current.src !== audioFileUrl) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.src = audioFileUrl;
    }

    const audioElement = audioPreviewRef.current;
    const handlePreviewEnded = () => {
      if (song.id === activePreviewSongId) toggleSongPreview(song.id);
    };
    audioElement.addEventListener('ended', handlePreviewEnded);

    if (isThisSongSelectedForPreview && !isThisSongPlayingInMainPlayer) {
      audioElement.currentTime = 0;
      audioElement.play().catch(error => {
        console.error("Error playing preview:", error);
        if (song.id === activePreviewSongId) toggleSongPreview(song.id);
      });
    } else {
      audioElement.pause();
    }
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.removeEventListener('ended', handlePreviewEnded);
      }
    };
  }, [audioFileUrl, canPlayAudio, song.id, isThisSongSelectedForPreview, toggleSongPreview, activePreviewSongId, isThisSongPlayingInMainPlayer]);

  const handlePlayButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!canPlayAudio) return;

    if (isThisSongPlayingInMainPlayer) {
      playlist.togglePlayPause();
    } else {
      onSelectSong(song.id);
    }
    toggleSongPreview(song.id);
  };

  const toggleFavoriteHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const currentFavorites = getFavoriteSongIdsFromStorage();
    if (currentFavorites.includes(song.id)) {
      removeSongIdFromFavoritesStorage(song.id);
      setIsFavorite(false);
    } else {
      addSongIdToFavoritesStorage(song.id);
      setIsFavorite(true);
    }
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  const showPulseAndWaveform = isThisSongPlayingInMainPlayer;

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
      {canPlayAudio && (
        <Button
          variant="ghost"
          size="icon"
          className={`p-1 h-8 w-8 sm:h-9 sm:w-9 ${
            isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
          } ${showPulseAndWaveform ? `${isDarkMode ? 'text-stone-100' : 'text-stone-800'} animate-pulse` : ''}`}
          onClick={handlePlayButtonClick}
          aria-label={isThisSongPlayingInMainPlayer ? "Pausar" : "Reproducir"}
        >
          {isThisSongPlayingInMainPlayer ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      )}
      {showPulseAndWaveform && canPlayAudio && (
        <div className="w-12 sm:w-16 h-8 flex items-center">
          <WaveformPreview isDarkMode={isDarkMode} />
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFavoriteHandler}
        className={`p-1 h-8 w-8 sm:h-9 sm:w-9 ${
          isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
        } ${isFavorite ? (isDarkMode ? 'text-red-400' : 'text-red-500') : ''}`}
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? 'fill-current' : ''}`} />
      </Button>
    </div>
  );
} 