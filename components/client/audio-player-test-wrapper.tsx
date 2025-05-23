"use client";

import React, { useEffect, useMemo } from 'react';
import { Song, Category } from '@/types/song';
import { AudioPlayer } from './audio-player';
import { PlaylistProvider, usePlaylist } from './playlist-context';

interface AudioPlayerTestWrapperProps {
  song: Song;
  categories: Category[];
  allSongs: Song[];
}

function TestPlayerComponent({ song, categories, allSongs }: AudioPlayerTestWrapperProps) {
  const playlist = usePlaylist();

  useEffect(() => {
    const playableSongs = allSongs.filter(s => s.audioUrl && s.audioUrl.length > 0);
    if (playableSongs.length > 0) {
      const initialIndex = playableSongs.findIndex(s => s.id === song.id);
      playlist.loadPlaylist(playableSongs, initialIndex >= 0 ? initialIndex : 0);
    }
  }, [allSongs, song, playlist.loadPlaylist]);

  const categoryDescription = useMemo(() => {
    if (!playlist.currentSong) return '';
    return categories.find(cat => cat.letter === playlist.currentSong!.category)?.description || playlist.currentSong!.category;
  }, [playlist.currentSong, categories]);
  
  if (!playlist.currentSong) {
    return <div>Loading playlist or no song selected...</div>; 
  }

  return (
    <AudioPlayer 
      song={playlist.currentSong}
      categoryDescription={categoryDescription}
      showNavigationControls={true}
      showShuffleButton={true}
      showRepeatButton={true}
      isShuffleActive={playlist.isShuffled}
      isRepeatActive={playlist.repeatMode !== 'none'}
      autoplay={playlist.isPlaying}
      playNonce={playlist.playNonce}
      onPlay={() => {
        if (!playlist.isPlaying) {
          playlist.togglePlayPause();
        }
      }}
      onPause={() => {
        if (playlist.isPlaying) {
          playlist.togglePlayPause();
        }
      }}
      onEnded={playlist.playNextSong}
      onTimeUpdate={(currentTime, duration) => {
      }}
      onNextSong={playlist.playNextSong}
      onPrevSong={playlist.playPrevSong}
      onShuffleToggle={playlist.toggleShuffle}
      onRepeatToggle={playlist.cycleRepeatMode}
    />
  );
}

export function AudioPlayerTestWrapper(props: AudioPlayerTestWrapperProps) {
  return (
    <PlaylistProvider>
      <TestPlayerComponent {...props} />
    </PlaylistProvider>
  );
} 