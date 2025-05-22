"use client";

import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center text-sm text-stone-600 hover:text-sky-600 dark:text-stone-400 dark:hover:text-sky-400 transition-colors"
    >
      <ArrowLeft className="mr-1 h-4 w-4" /> Volver
    </button>
  );
} 