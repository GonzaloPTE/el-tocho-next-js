"use client"

import React from 'react';
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CATEGORIAS, CANCIONES_DESTACADAS, TODAS_LAS_CANCIONES } from "@/components/constants"

const PaginaInicio: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Array<{ codigo: string; titulo: string; autor: string }>>([]);

  React.useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredResults = TODAS_LAS_CANCIONES.filter(cancion => 
        cancion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cancion.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="bg-stone-50 text-stone-800 font-inter">
      <header className="border-b border-stone-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-merriweather font-semibold text-stone-700">EL TOCHO</h1>
          <nav className="space-x-4">
            <a href="#" className="text-stone-600 hover:text-stone-800 transition-colors">Inicio</a>
            <a href="#" className="text-stone-600 hover:text-stone-800 transition-colors">Buscar</a>
            <a href="#" className="text-stone-600 hover:text-stone-800 transition-colors">Destacados</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="relative py-8">
            <div className="flex items-center">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={24} />
              <Input
                type="text"
                placeholder="Buscar canciones..."
                className="w-full pl-12 pr-12 py-3 text-lg border border-stone-300 focus:border-stone-500 focus:ring-2 focus:ring-stone-500 rounded-full shadow-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <X
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 cursor-pointer hover:text-stone-600"
                  size={20}
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute z-10 mt-4 w-full bg-white rounded-lg shadow-xl overflow-hidden">
                {searchResults.map((cancion, index) => (
                  <div key={index} className="p-4 hover:bg-stone-50 transition-colors cursor-pointer border-b border-stone-100 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center text-stone-700 font-semibold text-sm">
                        {cancion.codigo}
                      </div>
                      <div>
                        <p className="text-stone-800 font-semibold">{cancion.titulo}</p>
                        <p className="text-stone-500 text-sm">{cancion.autor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-merriweather font-semibold mb-6 text-stone-700">Categorías</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {CATEGORIAS.map((categoria: { letra: string; descripcion: string }) => (
                <div key={categoria.letra} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl font-semibold mb-2">{categoria.letra}</span>
                  <p className="text-center text-sm">{categoria.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-merriweather font-semibold mb-6 text-stone-700">Canciones Destacadas</h2>
            <div className="space-y-3">
              {CANCIONES_DESTACADAS.map((cancion: { codigo: string; titulo: string; artista: string }, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-stone-700 font-semibold text-sm">
                    {cancion.codigo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-stone-800">{cancion.titulo}</h3>
                    <p className="text-stone-500 text-sm">{cancion.artista}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaginaInicio
