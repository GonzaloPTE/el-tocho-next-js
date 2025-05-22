"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteName } from '@/lib/config/site';
import { HeaderClientActions } from '@/components/client/header-client-actions';
import { cn } from '@/lib/utils';

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

  return (
    <header className="border-b py-3 shadow-md sticky top-0 z-50 backdrop-blur-md bg-stone-50/80 border-stone-200 dark:bg-stone-900/80 dark:border-stone-700">
      <div className="container mx-auto flex justify-between items-center px-4 h-14">
        <Link href="/" className="text-2xl md:text-3xl font-merriweather font-bold flex items-center text-stone-800 dark:text-stone-100">
          {siteName}
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
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

        <div className="flex items-center">
          <HeaderClientActions showBackButton={showBackButton} />
        </div>
      </div>
    </header>
  );
} 