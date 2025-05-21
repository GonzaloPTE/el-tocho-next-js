"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Category } from "@/types/song";
import { useTheme } from "@/lib/theme-context";

interface CategoryNavigationProps {
  categories: Category[];
}

export function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleCategoryClick = (categoryLetter: string) => {
    router.push(`/category/${categoryLetter}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {categories.map((category: Category) => (
        <div 
          key={category.letter} 
          className={`flex flex-col items-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 cursor-pointer ${isDarkMode ? 'bg-stone-800 border-stone-700 hover:bg-stone-700' : 'bg-white border-stone-200 hover:bg-stone-50'}`}
          onClick={() => handleCategoryClick(category.letter)}
        >
          <span className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-stone-100' : 'text-stone-700'}`}>{category.letter}</span>
          <p className={`text-center text-sm ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>{category.description}</p>
        </div>
      ))}
    </div>
  );
} 