"use client";

import React, { useState } from 'react';
import { Song, Category } from '@/types/song';
import { AudioPlayer } from './audio-player';

interface AudioPlayerTestWrapperProps {
  song: Song;
  categories: Category[];
  allSongs: Song[];
}

export function AudioPlayerTestWrapper({ song: initialSong, categories, allSongs }: AudioPlayerTestWrapperProps) {
  const [currentSong, setCurrentSong] = useState<Song>(initialSong);
  const [currentIndex, setCurrentIndex] = useState(() => 
    allSongs.filter(s => s.audioUrl && s.audioUrl.length > 0).findIndex(s => s.id === initialSong.id)
  );
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isPlayingExpected, setIsPlayingExpected] = useState(false);

  const playableSongs = allSongs.filter(s => s.audioUrl && s.audioUrl.length > 0);

  const handlePlayInWrapper = (playedSong: Song) => {
    console.log('Playing in wrapper:', playedSong.title);
    setIsPlayingExpected(true);
  };

  const handlePauseInWrapper = (pausedSong: Song) => {
    console.log('Paused in wrapper:', pausedSong.title);
    setIsPlayingExpected(false);
  };

  const handleEnded = (endedSong: Song) => {
    console.log('Ended:', endedSong.title);
    if (isPlayingExpected) {
        handleNextSong(); 
    } else {
        setIsPlayingExpected(false);
    }
  };

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    console.log(`Time: ${currentTime.toFixed(1)} / ${duration.toFixed(1)}`);
  };

  const handleNextSong = () => {
    if (playableSongs.length === 0) return;
    const nextIndex = (currentIndex + 1) % playableSongs.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(playableSongs[nextIndex]);
    console.log('Next song:', playableSongs[nextIndex].title);
  };

  const handlePrevSong = () => {
    if (playableSongs.length === 0) return;
    const prevIndex = (currentIndex - 1 + playableSongs.length) % playableSongs.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(playableSongs[prevIndex]);
    console.log('Previous song:', playableSongs[prevIndex].title);
  };

  const handleShuffleToggle = () => {
    setIsShuffle(prev => !prev);
    console.log('Shuffle toggled:', !isShuffle);
  };

  const handleRepeatToggle = () => {
    setIsRepeat(prev => !prev);
    console.log('Repeat toggled:', !isRepeat);
  };

  const categoryDescription = categories.find(cat => cat.letter === currentSong.category)?.description || currentSong.category;

  return (
    <AudioPlayer 
      song={currentSong}
      categoryDescription={categoryDescription}
      showNavigationControls={true}
      showShuffleButton={true}
      showRepeatButton={true}
      isShuffleActive={isShuffle}
      isRepeatActive={isRepeat}
      autoplay={isPlayingExpected}
      onPlay={handlePlayInWrapper}
      onPause={handlePauseInWrapper}
      onEnded={handleEnded}
      onTimeUpdate={handleTimeUpdate}
      onNextSong={handleNextSong}
      onPrevSong={handlePrevSong}
      onShuffleToggle={handleShuffleToggle}
      onRepeatToggle={handleRepeatToggle}
    />
  );
} 