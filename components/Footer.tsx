import React from 'react';
import { siteName } from '@/lib/config/site';
import Link from 'next/link';

const Footer: React.FC = () => {
  const pdfUrl = process.env.NEXT_PUBLIC_PDF_URL || '#'; // Fallback to # if undefined

  return (
    <footer className="py-8 bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-t border-stone-200 dark:border-stone-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href={pdfUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Descarga el Tocho 7 en PDF
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">{siteName}</h2>
            <p className="mt-2">by Coro9</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
