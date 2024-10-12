'use client'

import { ArrowLeft, Play, Rewind, FastForward } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { SONG_LYRICS } from "./constants"

export function SongLyricsViewer() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-inter">
      <header className="border-b border-stone-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-merriweather font-medium text-stone-600">Letras de Canciones</h1>
          <button className="text-stone-400 hover:text-stone-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-merriweather font-semibold mb-2 text-stone-800">A.2 ABRE TU TIENDA AL SEÑOR</h2>
          <h3 className="text-lg font-merriweather text-stone-500 mb-8">Carmelo Erdozáin</h3>
          
          <div className="mb-6">
            <label htmlFor="transpose" className="block text-sm font-medium text-stone-600 mb-2">
              Transponer: 0 semitonos
            </label>
            <Slider
              id="transpose"
              min={-12}
              max={12}
              step={1}
              defaultValue={[0]}
              className="w-full"
            />
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <button className="p-2 rounded-full bg-stone-200 hover:bg-stone-300 transition-colors">
              <Rewind className="w-6 h-6 text-stone-600" />
            </button>
            <button className="p-2 rounded-full bg-stone-200 hover:bg-stone-300 transition-colors">
              <Play className="w-6 h-6 text-stone-600" />
            </button>
            <button className="p-2 rounded-full bg-stone-200 hover:bg-stone-300 transition-colors">
              <FastForward className="w-6 h-6 text-stone-600" />
            </button>
          </div>
          
          <div className="whitespace-pre-wrap font-medium text-stone-700 bg-white p-6 rounded-lg shadow-sm">
            {SONG_LYRICS}
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-stone-500 text-sm">
            <p className="mb-2 md:mb-0">&copy; 2024 Letras de Canciones. Todos los derechos reservados.</p>
            <nav className="flex space-x-4">
              <a href="#" className="hover:text-stone-700 transition-colors">Términos</a>
              <a href="#" className="hover:text-stone-700 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-stone-700 transition-colors">Contacto</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}