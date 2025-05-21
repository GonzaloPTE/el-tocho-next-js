"use client";

import React from 'react';
import { Play, Pause, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveformPreview } from "@/components/ui/waveform-preview";
import { useTheme } from '@/lib/theme-context';
import { Song } from '@/types/song';

interface SongItemControlsProps {
  song: Song;
}

export function SongItemControls({ song }: SongItemControlsProps) {
  const { isDarkMode } = useTheme();
  // State for this specific song item
  const [isPlayingPreview, setIsPlayingPreview] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false); // Replace with global state/localStorage if needed

  const handlePlayPausePreview = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from bubbling to the Link navigation
    if (song.hasAudio) {
      setIsPlayingPreview(!isPlayingPreview);
      // TODO: Implement actual audio play/pause for preview
      if (!isPlayingPreview) {
        console.log(`Playing preview for ${song.title}`);
      } else {
        console.log(`Pausing preview for ${song.title}`);
      }
    }
  };

  const toggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from bubbling to the Link navigation
    setIsFavorite(!isFavorite);
    // TODO: Implement actual favorite persistence (e.g., localStorage, API call)
    console.log(`Toggled favorite for ${song.title} to ${!isFavorite}`);
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"> {/* Added flex-shrink-0 */}
      {song.hasAudio && (
        <Button
          variant="ghost"
          size="icon"
          className={`p-1 h-8 w-8 sm:h-9 sm:w-9 ${
            isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
          } ${isPlayingPreview ? 'animate-pulse' : ''}`}
          onClick={handlePlayPausePreview}
          aria-label={isPlayingPreview ? "Pausar previsualización" : "Reproducir previsualización"}
        >
          {isPlayingPreview ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      )}
      {isPlayingPreview && song.hasAudio && (
        <div className="w-12 sm:w-16 h-8 flex items-center">
          <WaveformPreview isDarkMode={isDarkMode} />
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFavorite}
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