"use client";

import React, { useEffect, useMemo } from 'react';
import { Song, Category } from '@/types/song';
import { AudioPlayer } from './audio-player';
import { usePlaylist } from './playlist-context';

interface AudioPlayerTestWrapperProps {
  song: Song;
  categories: Category[];
  allSongs: Song[];
}

function TestPlayerComponent({ song: initialSongFromProps, categories, allSongs }: AudioPlayerTestWrapperProps) {
  const playlist = usePlaylist();

  useEffect(() => {
    const playableSongs = allSongs.filter(s => s.audioUrl && s.audioUrl.length > 0);
    if (playableSongs.length > 0) {
      const initialIndex = playableSongs.findIndex(s => s.id === initialSongFromProps.id);
      playlist.loadPlaylist(playableSongs, initialIndex >= 0 ? initialIndex : 0, playlist.isShuffled, false);
    }
  }, [allSongs, initialSongFromProps, playlist.loadPlaylist, playlist.isShuffled]);

  const categoryDescription = useMemo(() => {
    if (!playlist.currentSong) return '';
    const foundCategory = Array.isArray(categories) ? categories.find(cat => cat.letter === playlist.currentSong!.category) : undefined;
    return foundCategory?.description || playlist.currentSong!.category;
  }, [playlist.currentSong, categories]);
  
  if (!playlist.currentSong) {
    return <div>Loading playlist or no song selected...</div>; 
  }

  return (
    <AudioPlayer 
      song={playlist.currentSong}
      categoryDescription={categoryDescription}
      showNavigationControls={true}
      showShuffleButton={false}
      showRepeatButton={true}
      isShuffleActive={playlist.isShuffled}
      isRepeatActive={playlist.repeatMode !== 'none'}
      autoplay={playlist.isPlaying}
      playNonce={playlist.playNonce}
      onPlay={(songFromPlayer) => {
        if (playlist.currentSong && songFromPlayer.id === playlist.currentSong.id && !playlist.isPlaying) {
          playlist.togglePlayPause();
        }
      }}
      onPause={(songFromPlayer) => {
        if (playlist.currentSong && songFromPlayer.id === playlist.currentSong.id && playlist.isPlaying) {
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
    <TestPlayerComponent {...props} />
  );
} 