"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveformPreview } from "@/components/ui/waveform-preview";
import { useTheme } from '@/lib/theme-context';
import { Song } from '@/types/song';
import { useSongPreview } from '@/components/client/song-preview-context';
import { 
  getFavoriteSongIdsFromStorage,
  addSongIdToFavoritesStorage,
  removeSongIdFromFavoritesStorage
} from '@/lib/client-utils';

interface SongItemControlsProps {
  song: Song;
}

export function SongItemControls({ song }: SongItemControlsProps) {
  const { isDarkMode } = useTheme();
  const { activePreviewSongId, togglePreview } = useSongPreview();
  const [isFavorite, setIsFavorite] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const isPreviewPlayingThisSong = song.id === activePreviewSongId;

  useEffect(() => {
    const favoriteIds = getFavoriteSongIdsFromStorage();
    setIsFavorite(favoriteIds.includes(song.id));
  }, [song.id]);

  const canPlayAudio = song.audioUrl && song.audioUrl.length > 0;
  const audioFileUrl = canPlayAudio && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/${song.slug}.mp3` : '';

  React.useEffect(() => {
    if (!canPlayAudio || !audioFileUrl) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      return;
    }

    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio(audioFileUrl);
    } else {
      if (audioPreviewRef.current.src !== audioFileUrl) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current.src = audioFileUrl;
      }
    }

    const audioElement = audioPreviewRef.current;
    const handlePreviewEnded = () => {
      if (song.id === activePreviewSongId) {
        togglePreview(song.id);
      }
    };

    audioElement.addEventListener('ended', handlePreviewEnded);

    if (isPreviewPlayingThisSong) {
      audioElement.currentTime = 0;
      audioElement.play().catch(error => {
        console.error("Error playing preview:", error);
        if (song.id === activePreviewSongId) {
          togglePreview(song.id);
        }
      });
    } else {
      audioElement.pause();
    }

    return () => {
      audioElement.pause();
      audioElement.removeEventListener('ended', handlePreviewEnded);
    };
  }, [audioFileUrl, canPlayAudio, song.id, song.slug, isPreviewPlayingThisSong, togglePreview, activePreviewSongId]);

  const handlePlayPausePreview = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!canPlayAudio) return;
    togglePreview(song.id);
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
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
      {canPlayAudio && (
        <Button
          variant="ghost"
          size="icon"
          className={`p-1 h-8 w-8 sm:h-9 sm:w-9 ${
            isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
          } ${isPreviewPlayingThisSong ? 'animate-pulse' : ''}`}
          onClick={handlePlayPausePreview}
          aria-label={isPreviewPlayingThisSong ? "Pausar previsualización" : "Reproducir previsualización"}
        >
          {isPreviewPlayingThisSong ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      )}
      {isPreviewPlayingThisSong && canPlayAudio && (
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