import Link from 'next/link';
import { siteName } from '@/lib/config/site';
import { HeaderClientActions } from '@/components/client/header-client-actions';

interface PageHeaderProps {
  showBackButton?: boolean;
}

export function PageHeader({ showBackButton = false }: PageHeaderProps) {
  return (
    <header className="border-b py-4 shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/90 border-stone-200 dark:bg-stone-800/90 dark:border-stone-700">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-3xl font-merriweather font-bold flex items-center text-stone-800 dark:text-stone-100">
          {siteName}
        </Link>
        <HeaderClientActions showBackButton={showBackButton} />
      </div>
    </header>
  );
} 