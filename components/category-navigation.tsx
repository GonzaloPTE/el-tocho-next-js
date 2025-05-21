import React from 'react';
import Link from 'next/link';
import { Category } from "@/types/song";

interface CategoryNavigationProps {
  categories: Category[];
}

export function CategoryNavigation({ categories }: CategoryNavigationProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {categories.map((category: Category) => (
        <Link 
          key={category.letter} 
          href={`/category/${category.letter}`}
          className="flex flex-col items-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 cursor-pointer bg-white border-stone-200 hover:bg-stone-50 dark:bg-stone-800 dark:border-stone-700 dark:hover:bg-stone-700"
        >
          <span className="text-4xl font-bold mb-4 text-stone-700 dark:text-stone-100">{category.letter}</span>
          <p className="text-center text-sm text-stone-600 dark:text-stone-300">{category.description}</p>
        </Link>
      ))}
    </div>
  );
} 