"use client";

import React from 'react';
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { useRouter } from 'next/navigation';

interface HeaderClientActionsProps {
  showBackButton?: boolean;
}

export function HeaderClientActions({ showBackButton = false }: HeaderClientActionsProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      {showBackButton && (
        <Button
          variant="ghost"
          className={`font-medium ${
            isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'
          }`}
          onClick={() => router.back()}
          aria-label="Volver"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className={isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  );
} 