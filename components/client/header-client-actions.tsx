"use client";

import React from 'react';
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { useRouter } from 'next/navigation';
import { BackButton } from './back-button';

interface HeaderClientActionsProps {
  showBackButton?: boolean;
}

export function HeaderClientActions({ showBackButton = false }: HeaderClientActionsProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      {showBackButton && <BackButton />}
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