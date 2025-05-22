"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { siteName } from '@/lib/config/site';
import { HeaderClientActions } from '@/components/client/header-client-actions';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface PageHeaderProps {
  showBackButton?: boolean;
}

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Categorías', href: '/categorias' },
  { label: 'Cantoral', href: '/canciones' },
  { label: 'Descargas', href: '/descargas' },
  { label: 'Acerca de', href: '/acerca-de' },
];

export function PageHeader({ showBackButton = false }: PageHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on pathname change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="border-b py-3 shadow-md sticky top-0 z-50 backdrop-blur-md bg-stone-50/80 border-stone-200 dark:bg-stone-900/80 dark:border-stone-700">
      <div className="container mx-auto flex justify-between items-center px-4 h-14">
        <Link href="/" className="text-2xl md:text-3xl font-merriweather font-bold flex items-center text-stone-800 dark:text-stone-100 z-20">
          {siteName}
        </Link>

        {/* Desktop Navigation & Client Actions */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={`desktop-${item.label}`}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-stone-900 dark:hover:text-stone-50",
                pathname === item.href
                  ? "text-stone-900 dark:text-stone-50"
                  : "text-stone-600 dark:text-stone-400",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block ml-6"> {/* Margin left to space from nav items */}
          <HeaderClientActions showBackButton={showBackButton} />
        </div>

        {/* Mobile Header Actions & Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <HeaderClientActions showBackButton={showBackButton} />
          <button 
            className="p-2 rounded-md text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-500 z-20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 inset-x-0 min-h-screen pt-16 px-2 pb-4 bg-stone-50 dark:bg-stone-900 z-10 flex flex-col">
          <nav className="flex flex-col space-y-3 px-2 pt-2 pb-3">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.label}`}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-stone-200 text-stone-900 dark:bg-stone-700 dark:text-stone-50"
                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-stone-50"
                )}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {/* Client actions removed from here as they are now in the header bar for mobile */}
        </div>
      )}
    </header>
  );
} 