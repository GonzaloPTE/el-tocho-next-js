'use client'

import React from 'react';
import { ArrowLeft, Rewind, Play, FastForward, BookOpen } from "lucide-react"
import { useRouter } from 'next/navigation'
import { CustomSlider } from "@/components/ui/custom-slider"
import { Button } from "@/components/ui/button"
import Footer from '@/components/footer';
import { SITE_NAME } from "@/components/constants"

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

// ... (rest of the lyrics)
`

interface SongLyricsViewerProps {
  songId: string
}

export function SongLyricsViewer({ songId }: SongLyricsViewerProps) {
  const router = useRouter()
  const [transpose, setTranspose] = React.useState(0)

  // Function to determine if the lyrics should be displayed in two columns
  const shouldUseTwoColumns = (lyrics: string): boolean => {
    const lineCount = lyrics.split('\n').length;
    return lineCount > 20; // Adjust this threshold as needed
  }

  const isLongSong = shouldUseTwoColumns(SONG_LYRICS)

  const lyricsClassName = `whitespace-pre-wrap font-medium text-stone-700 text-lg leading-relaxed ${
    isLongSong ? 'columns-1 md:columns-2 gap-8' : ''
  }`

  return (
    <div className="bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 text-stone-800 font-inter min-h-screen flex flex-col">
      <header className="border-b border-stone-200 py-4 bg-white shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-merriweather font-bold text-stone-800 flex items-center">
            <BookOpen className="mr-2 text-stone-600" size={28} /> {SITE_NAME}
          </h1>
          <Button
            variant="ghost"
            className="text-stone-600 hover:text-stone-800 transition-colors font-medium"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-16">
        <div className={`mx-auto space-y-12 ${isLongSong ? 'max-w-6xl' : 'max-w-3xl'}`}>
          <div className="flex items-center justify-center space-x-8">
            <div className="w-24 h-24 bg-stone-800 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              <span className="text-4xl">A2</span>
            </div>
            <div className="text-left">
              <h2 className="text-4xl font-merriweather font-bold mb-2 text-stone-800">ABRE TU TIENDA AL SEÑOR</h2>
              <h3 className="text-xl font-merriweather text-stone-600">Carmelo Erdozáin</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-200 space-y-8">
            <div className="flex items-center space-x-4">
              <label htmlFor="transpose" className="text-sm font-medium text-stone-600 whitespace-nowrap">
                Transponer:
              </label>
              <div className="flex-grow">
                <CustomSlider
                  value={transpose}
                  onChange={setTranspose}
                  min={-12}
                  max={12}
                  step={1}
                />
              </div>
              <span className="text-sm font-medium text-stone-600 whitespace-nowrap">
                {transpose} semitonos
              </span>
            </div>

            <div className="flex justify-center space-x-6">
              {['Rewind', 'Play', 'FastForward'].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors shadow-md hover:shadow-lg"
                >
                  {action === 'Rewind' && <Rewind className="h-6 w-6 text-stone-700" />}
                  {action === 'Play' && <Play className="h-6 w-6 text-stone-700" />}
                  {action === 'FastForward' && <FastForward className="h-6 w-6 text-stone-700" />}
                </Button>
              ))}
            </div>
            
            <div className={lyricsClassName}>
              {SONG_LYRICS}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
