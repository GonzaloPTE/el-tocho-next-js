"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DebouncedCategorySearchInputProps {
  initialSearchTerm?: string;
  categoryName: string;
  basePath: string; 
  debounceMs?: number;
}

export function DebouncedCategorySearchInput({
  initialSearchTerm = '',
  categoryName,
  basePath,
  debounceMs = 500,
}: DebouncedCategorySearchInputProps) {
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const router = useRouter();

  // Debounce logic using useCallback to stabilize the function
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      const params = new URLSearchParams(window.location.search);
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim());
      } else {
        params.delete('search');
      }
      const queryString = params.toString();
      router.push(`${basePath}${queryString ? `?${queryString}` : ''}`);
    },
    [router, basePath] 
  );

  useEffect(() => {
    // Update inputValue if initialSearchTerm changes (e.g., from URL directly)
    setInputValue(initialSearchTerm);
  }, [initialSearchTerm]);

  useEffect(() => {
    // Effect for debouncing
    if (inputValue === initialSearchTerm) {
        // Avoid triggering a navigation if the input value is the same as the initial (URL) term
        return;
    }

    const timerId = setTimeout(() => {
      debouncedSearch(inputValue);
    }, debounceMs);

    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue, initialSearchTerm, debounceMs, debouncedSearch]);

  return (
    <div className="mb-6 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 dark:text-stone-500" size={20} />
      <Input
        type="text"
        placeholder={`Buscar en ${categoryName}...`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-lg border bg-stone-100 border-stone-300 focus:ring-2 focus:ring-stone-400 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-100 dark:focus:ring-stone-500 rounded-full"
      />
    </div>
  );
} 