"use client"

import React from 'react';
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CATEGORIAS, CANCIONES_DESTACADAS } from "@/components/constants"

export function PaginaInicio() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-inter">
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="relative">
            <div className="flex">
              <Input
                type="search"
                placeholder="Buscar canciones..."
                className="w-full pl-10 pr-4 py-3 border-stone-300 focus:border-stone-500 focus:ring-stone-500 rounded-r-none"
              />
              <Button className="bg-stone-700 hover:bg-stone-800 text-white rounded-l-none">
                Buscar
              </Button>
            </div>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
          </div>

          <div>
            <h2 className="text-xl font-merriweather font-semibold mb-4 text-stone-700">Categorías</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIAS.map((categoria: { letra: string; descripcion: string }) => (
                <div key={categoria.letra} className="flex flex-col items-center p-4 h-full bg-white rounded-lg shadow-sm transition-all duration-300 hover:bg-stone-100">
                  <span className="text-2xl font-semibold">{categoria.letra}</span>
                  <span className="w-8 h-0.5 bg-stone-400 my-2"></span>
                  <p className="text-center">{categoria.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-merriweather font-semibold mb-4 text-stone-700">Canciones Destacadas</h2>
            <div className="space-y-4">
              {CANCIONES_DESTACADAS.map((cancion: { codigo: string; titulo: string; artista: string }, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-stone-100 rounded-md flex items-center justify-center text-stone-700 font-semibold text-lg">
                    {cancion.codigo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800">{cancion.titulo}</h3>
                    <p className="text-stone-600">{cancion.artista}</p>
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
