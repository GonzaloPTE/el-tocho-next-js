'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface SongPreviewContextType {
  activePreviewSongId: string | null;
  togglePreview: (songId: string) => void;
}

const SongPreviewContext = createContext<SongPreviewContextType | undefined>(undefined);

export function SongPreviewProvider({ children }: { children: React.ReactNode }) {
  const [activePreviewSongId, setActivePreviewSongId] = useState<string | null>(null);

  const togglePreview = useCallback((songId: string) => {
    setActivePreviewSongId(currentId => (currentId === songId ? null : songId));
  }, []);

  return (
    <SongPreviewContext.Provider value={{ activePreviewSongId, togglePreview }}>
      {children}
    </SongPreviewContext.Provider>
  );
}

export function useSongPreview() {
  const context = useContext(SongPreviewContext);
  if (context === undefined) {
    throw new Error('useSongPreview must be used within a SongPreviewProvider');
  }
  return context;
} 