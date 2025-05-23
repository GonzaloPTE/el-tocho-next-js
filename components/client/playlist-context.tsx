"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Song } from '@/types/song';

// --- 1. State Interface ---
export type RepeatMode = 'none' | 'one' | 'all';

interface PlaylistState {
  songs: Song[];                  // Current playlist of playable songs
  originalPlaylist: Song[];       // Original list loaded (e.g., all favorites)
  currentSong: Song | null;
  currentSongIndex: number;       // Index within the `songs` array (or `shuffledSongs` if active)
  isPlaying: boolean;             // Global playback state for the playlist
  isShuffled: boolean;
  shuffledSongs: Song[];          // Shuffled version of `songs`
  repeatMode: RepeatMode;
  playNonce: number;
}

// --- 2. Actions Interface ---
interface PlaylistActions {
  loadPlaylist: (newSongs: Song[], startIndex?: number, startShuffled?: boolean, startPlaying?: boolean) => void;
  playSongAtIndex: (index: number) => void;
  togglePlayPause: () => void;
  playNextSong: () => void;
  playPrevSong: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  cycleRepeatMode: () => void;
  clearPlaylist: () => void;
  // Future: addSongToQueue, removeSongFromQueue
}

// --- 3. Context Type ---
interface PlaylistContextType extends PlaylistState, PlaylistActions {}

// --- 4. Create Context ---
const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'el-tocho-playlist';

// Initial State for the provider
const initialPlaylistState: PlaylistState = {
  songs: [],
  originalPlaylist: [],
  currentSong: null,
  currentSongIndex: -1,
  isPlaying: false,
  isShuffled: false,
  shuffledSongs: [],
  repeatMode: 'none',
  playNonce: 0,
};

// Helper to get initial state, attempting to load from localStorage
function getInitialState(): PlaylistState {
  if (typeof window === 'undefined') {
    return initialPlaylistState;
  }
  try {
    const persistedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (persistedStateJSON) {
      const persistedState = JSON.parse(persistedStateJSON);
      
      // Reconstruct what we can, validate, and merge with defaults
      const playableOriginal = (persistedState.originalPlaylist || []).filter((s: Song) => s.audioUrl && s.audioUrl.length > 0);
      let songs = playableOriginal;
      let currentSong: Song | null = null;
      let currentSongIndex = persistedState.currentSongIndex !== undefined ? persistedState.currentSongIndex : -1;

      if (currentSongIndex >= 0 && currentSongIndex < songs.length) {
        currentSong = songs[currentSongIndex];
      } else {
        currentSongIndex = -1; // Reset if out of bounds
      }

      let shuffledSongs: Song[] = [];
      if (persistedState.isShuffled && songs.length > 0) {
        // Re-shuffle on load to maintain integrity if originalPlaylist changed, or store shuffled indices?
        // For now, let's just re-create a shuffle. If currentSong was in the list, try to find it.
        shuffledSongs = [...songs];
        for (let i = shuffledSongs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
        }
        if (currentSong) {
          const newIdxInShuffled = shuffledSongs.findIndex(s => s.id === currentSong!.id);
          if (newIdxInShuffled !== -1) currentSongIndex = newIdxInShuffled;
          else currentSongIndex = 0; // Fallback if song not found, should not happen if logic is correct
        } else if (shuffledSongs.length > 0) {
            currentSongIndex = 0; 
            currentSong = shuffledSongs[0];
        } else {
            currentSongIndex = -1;
        }
      }

      return {
        ...initialPlaylistState, // Start with defaults
        originalPlaylist: persistedState.originalPlaylist || [],
        songs: songs, 
        currentSong: currentSong, // Will be null if index was bad or songs empty
        currentSongIndex: currentSongIndex,
        isPlaying: false, // Always start paused
        isShuffled: persistedState.isShuffled || false,
        shuffledSongs: persistedState.isShuffled ? shuffledSongs : [],
        repeatMode: persistedState.repeatMode || 'none',
        playNonce: (persistedState.playNonce || 0) + 1,
      };
    }
  } catch (error) {
    console.error('Error loading playlist from localStorage:', error);
  }
  return { ...initialPlaylistState, playNonce: initialPlaylistState.playNonce + 1 }; // Ensure initial nonce is different from 0 if no storage
}

// --- 5. PlaylistProvider Component ---
interface PlaylistProviderProps {
  children: ReactNode;
}

export function PlaylistProvider({ children }: PlaylistProviderProps) {
  const [playlistState, setPlaylistState] = useState<PlaylistState>(getInitialState);

  // Save to localStorage whenever relevant parts of the state change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stateToPersist = {
          originalPlaylist: playlistState.originalPlaylist,
          currentSongIndex: playlistState.isShuffled && playlistState.currentSong ?
                              playlistState.songs.findIndex(s => s.id === playlistState.currentSong!.id)
                              : playlistState.currentSongIndex,
          isShuffled: playlistState.isShuffled,
          repeatMode: playlistState.repeatMode,
          playNonce: playlistState.playNonce,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
      } catch (error) {
        console.error('Error saving playlist to localStorage:', error);
      }
    }
  }, [playlistState.originalPlaylist, playlistState.currentSongIndex, playlistState.isShuffled, playlistState.repeatMode, playlistState.currentSong, playlistState.songs, playlistState.playNonce]); // Added songs and currentSong for robust index saving

  const loadPlaylist = useCallback((newSongs: Song[], startIndex: number = 0, startShuffled: boolean = false, startPlaying: boolean = true) => {
    const playable = newSongs.filter(song => song.audioUrl && song.audioUrl.length > 0);
    if (playable.length === 0) {
      setPlaylistState(prev => ({ ...initialPlaylistState, playNonce: prev.playNonce + 1 }));
      return;
    }
    const validStartIndex = Math.max(0, Math.min(startIndex, playable.length - 1));

    let songsToPlay = playable;
    let finalCurrentSongIndex = validStartIndex;
    let finalShuffledSongs: Song[] = [];

    if (startShuffled) {
      // Fisher-Yates shuffle
      finalShuffledSongs = [...playable];
      for (let i = finalShuffledSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalShuffledSongs[i], finalShuffledSongs[j]] = [finalShuffledSongs[j], finalShuffledSongs[i]];
      }
      songsToPlay = finalShuffledSongs;
      // If starting shuffled, the startIndex usually means the first song of the shuffled list
      // Or, if a specific song was intended via startIndex on original list, find it in shuffled.
      // For simplicity now: if startShuffled, startIndex is for the shuffled list (so usually 0)
      finalCurrentSongIndex = Math.max(0, Math.min(startIndex, finalShuffledSongs.length - 1));
    }

    setPlaylistState(prev => ({
      ...prev,
      originalPlaylist: newSongs, 
      songs: playable, // Always store the original order of playable songs
      shuffledSongs: startShuffled ? finalShuffledSongs : (prev.isShuffled ? prev.shuffledSongs : []), // Keep existing shuffle if not starting new shuffle
      currentSong: songsToPlay[finalCurrentSongIndex],
      currentSongIndex: finalCurrentSongIndex,
      isPlaying: startPlaying,
      isShuffled: startShuffled ? true : prev.isShuffled, // Set shuffle state
      playNonce: prev.playNonce + 1,
    }));
  }, []);

  const playSongAtIndex = useCallback((index: number) => {
    setPlaylistState(prev => {
      const currentList = prev.isShuffled ? prev.shuffledSongs : prev.songs;
      if (index < 0 || index >= currentList.length) {
        console.warn(`playSongAtIndex: Invalid index ${index} for list of length ${currentList.length}`);
        return prev;
      }
      return {
        ...prev,
        currentSong: currentList[index],
        currentSongIndex: index,
        isPlaying: true,
        playNonce: prev.playNonce + 1,
      };
    });
  }, []);

  const togglePlayPause = useCallback(() => {
    setPlaylistState(prev => {
      if (!prev.currentSong) return prev; // No song to play/pause
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  const playNextSong = useCallback(() => {
    setPlaylistState(prev => {
      if (!prev.currentSong || prev.songs.length === 0) return prev;

      const currentList = prev.isShuffled ? prev.shuffledSongs : prev.songs;
      if (currentList.length === 0) return prev; // Should not happen if currentSong exists from songs

      let nextIndex = prev.currentSongIndex;

      if (prev.repeatMode === 'one' && prev.isPlaying) {
        return { 
          ...prev, 
          isPlaying: true, 
          playNonce: prev.playNonce + 1
        }; 
      }

      nextIndex = (prev.currentSongIndex + 1);

      if (nextIndex >= currentList.length) {
        if (prev.repeatMode === 'all') {
          nextIndex = 0; // Loop back to start
        } else {
          // Repeat mode 'none', end of playlist
          return {
            ...prev,
            currentSong: currentList[currentList.length -1], // Keep last song highlighted
            currentSongIndex: currentList.length -1,
            isPlaying: false, // Stop playback
          };
        }
      }
      
      return {
        ...prev,
        currentSong: currentList[nextIndex],
        currentSongIndex: nextIndex,
        isPlaying: true,
        playNonce: prev.playNonce + 1,
      };
    });
  }, []);

  const playPrevSong = useCallback(() => {
    setPlaylistState(prev => {
      if (!prev.currentSong || prev.songs.length === 0) return prev;

      const currentList = prev.isShuffled ? prev.shuffledSongs : prev.songs;
      if (currentList.length === 0) return prev;

      let prevIndex = (prev.currentSongIndex - 1 + currentList.length) % currentList.length;
      
      // If repeatMode is 'one' and playing, prev usually just restarts or goes to actual prev based on UX.
      // For now, standard prev logic.
      
      return {
        ...prev,
        currentSong: currentList[prevIndex],
        currentSongIndex: prevIndex,
        isPlaying: true,
        playNonce: prev.playNonce + 1,
      };
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlaylistState(prev => {
      if (prev.songs.length === 0) return prev;
      const newIsShuffled = !prev.isShuffled;
      let newCurrentSongIndex = -1;
      let newShuffledSongs: Song[] = [];

      if (newIsShuffled) {
        newShuffledSongs = [...prev.songs]; // Shuffle from the master 'songs' list
        for (let i = newShuffledSongs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newShuffledSongs[i], newShuffledSongs[j]] = [newShuffledSongs[j], newShuffledSongs[i]];
        }
        if (prev.currentSong) {
          newCurrentSongIndex = newShuffledSongs.findIndex(s => s.id === prev.currentSong!.id);
        } else if (newShuffledSongs.length > 0) {
          newCurrentSongIndex = 0; // Default to first song if no current song but list exists
        }
      } else {
        // Reverting to original order
        if (prev.currentSong) {
          newCurrentSongIndex = prev.songs.findIndex(s => s.id === prev.currentSong!.id);
        } else if (prev.songs.length > 0) {
          newCurrentSongIndex = 0; // Default to first song
        }
      }
      
      // Ensure currentSong is updated if index is valid, otherwise it might become null
      const listForCurrentSong = newIsShuffled ? newShuffledSongs : prev.songs;
      const newCurrentSong = newCurrentSongIndex !== -1 && listForCurrentSong[newCurrentSongIndex] ? listForCurrentSong[newCurrentSongIndex] : null;

      return {
        ...prev,
        isShuffled: newIsShuffled,
        shuffledSongs: newIsShuffled ? newShuffledSongs : [],
        currentSongIndex: newCurrentSongIndex !== -1 ? newCurrentSongIndex : prev.currentSongIndex, // Fallback to old index if new one is bad
        currentSong: newCurrentSong, // Update currentSong based on new index and list
      };
    });
  }, []);

  const setRepeatMode = useCallback((mode: RepeatMode) => {
    setPlaylistState(prev => ({ ...prev, repeatMode: mode }));
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setPlaylistState(prev => {
      const modes: RepeatMode[] = ['none', 'all', 'one']; // Order: none -> all -> one -> none
      const currentModeIndex = modes.indexOf(prev.repeatMode);
      const nextModeIndex = (currentModeIndex + 1) % modes.length;
      return { ...prev, repeatMode: modes[nextModeIndex] };
    });
  }, []);

  const clearPlaylist = useCallback(() => {
    // Implementation needed
    console.log('clearPlaylist called');
    setPlaylistState(initialPlaylistState);
  }, []);

  const contextValue: PlaylistContextType = {
    ...playlistState,
    loadPlaylist,
    playSongAtIndex,
    togglePlayPause,
    playNextSong,
    playPrevSong,
    toggleShuffle,
    setRepeatMode,
    cycleRepeatMode,
    clearPlaylist,
  };

  return (
    <PlaylistContext.Provider value={contextValue}>
      {children}
    </PlaylistContext.Provider>
  );
}

// --- 6. usePlaylist Custom Hook ---
export function usePlaylist(): PlaylistContextType {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
} 