'use client'

import React from 'react';
import { ArrowLeft, Rewind, Play, Pause, FastForward, BookOpen, SkipBack, SkipForward, Moon, Sun, Plus, Minus, Music } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Waveform } from "@/components/ui/waveform"
import Footer from '@/components/footer';
import { SITE_NAME } from "@/components/constants"
import { TransposeControl } from "@/components/ui/transpose-control"
import { useTheme } from '@/lib/theme-context'

// Example song lyrics
const SONG_LYRICS = `
FA            DO                  re
ABRE TU TIENDA AL SEÑOR, 
    SIb       FA
RECÍBELE DENTRO, 
DO
ESCUCHA SU VOZ.
FA           DO                   re
ABRE TU TIENDA AL SEÑOR,
    SIb            FA
PREPARA TU FUEGO
    DO7            FA
QUE LLEGA EL AMOR.


                    re
El adviento es esperanza,
            SIb            FA
la esperanza salvación;
                        DO
ya se acerca el Señor.
        FA                re
Preparemos los caminos,
        SIb             FA
los caminos del amor,
        DO7          FA
escuchemos su voz.

`

interface SongLyricsViewerProps {
  songId: string
}

// Mock waveform data
const MOCK_WAVEFORM_DATA = Array(100).fill(0).map(() => Math.random());

export function SongLyricsViewer({ songId }: SongLyricsViewerProps) {
  const router = useRouter()
  const [transpose, setTranspose] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration] = React.useState(190) // 3:10 in seconds
  const { isDarkMode, toggleDarkMode } = useTheme();

  const isLongSong = SONG_LYRICS.split('\n').length > 20

  const lyricsClassName = `whitespace-pre-wrap font-medium text-lg leading-relaxed ${
    isLongSong ? 'columns-1 md:columns-2 gap-8' : ''
  } ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleWaveformClick = (time: number) => {
    setCurrentTime(time);
  };

  const handleTranspose = (newValue: number) => {
    setTranspose(newValue);
  };

  const getNoteFromSemitones = (semitones: number) => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return notes[(semitones + 12) % 12];
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode ? 'bg-stone-900 text-stone-100' : 'bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 text-stone-800'
    } font-inter`}>
      <header className={`border-b py-4 shadow-md sticky top-0 z-10 backdrop-blur-sm ${
        isDarkMode ? 'bg-stone-800/90 border-stone-700' : 'bg-white/90 border-stone-200'
      }`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-merriweather font-bold flex items-center">
            <BookOpen className="mr-2" size={28} /> {SITE_NAME}
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              className={`font-medium ${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className={`mx-auto space-y-6 ${isLongSong ? 'max-w-6xl' : 'max-w-3xl'}`}>
          <div className={`rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border space-y-6 ${
            isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                  isDarkMode ? 'bg-stone-700' : 'bg-stone-800'
                }`}>
                  <span className="text-2xl">A2</span>
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-merriweather font-bold leading-tight">ABRE TU TIENDA AL SEÑOR</h2>
                  <h3 className={`text-lg font-merriweather ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Carmelo Erdozáin</h3>
                </div>
              </div>
              <div className="flex justify-end sm:justify-start">
                <TransposeControl
                  value={transpose}
                  onChange={setTranspose}
                  min={-11}
                  max={11}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>

            <div className="space-y-2 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
              <div className="relative">
                <Waveform
                  currentTime={currentTime}
                  duration={duration}
                  waveformData={MOCK_WAVEFORM_DATA}
                  onClick={handleWaveformClick}
                  isDarkMode={isDarkMode}
                />
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm font-medium">
                  <span className={`${isDarkMode ? 'text-stone-400' : 'text-stone-600'} absolute left-0 sm:left-2 md:left-4 lg:left-6 xl:left-10 bottom-[-1.5rem]`}>
                    {formatTime(currentTime)}
                  </span>
                  <span className={`${isDarkMode ? 'text-stone-400' : 'text-stone-600'} absolute right-0 sm:right-2 md:right-4 lg:right-6 xl:right-10 bottom-[-1.5rem]`}>
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            <div className={`flex justify-center items-center space-x-4`}>
              <Button
                variant="ghost"
                size="icon"
                className={`${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
                onClick={() => router.push(`/song/${parseInt(songId) - 1}`)}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
              >
                <Rewind className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-800 hover:bg-stone-700'} text-white`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
                onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
              >
                <FastForward className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
                onClick={() => router.push(`/song/${parseInt(songId) + 1}`)}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className={`${lyricsClassName} mt-6 px-2 sm:px-4 md:px-6 lg:px-8`}>
              {SONG_LYRICS}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}