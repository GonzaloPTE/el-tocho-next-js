import React from 'react';
import { siteName } from '@/lib/config/site';
import Link from 'next/link';

const Footer: React.FC = () => {
  const pdfUrl = process.env.NEXT_PUBLIC_PDF_URL || '#'; // Fallback to # if undefined

  return (
    <footer className="py-8 bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-t border-stone-200 dark:border-stone-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="inline-flex items-center">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mr-2 my-4">{siteName}</h2>
            <p className="text-sm">by Coro9</p>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="text-center">
              <Link 
                href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" 
                target="_blank" 
                rel="noopener noreferrer license"
                aria-label="Creative Commons Attribution-ShareAlike 4.0 International License Badge"
              >
                <img 
                  src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
                  alt="Creative Commons Attribution-ShareAlike 4.0 International License Badge"
                  style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  width="88"
                  height="31"
                />
              </Link>
              <p className="text-xs text-stone-500 dark:text-stone-400 my-2">
                <Link 
                  href="https://creativecommons.org/licenses/by-sa/4.0/deed.es"
                  target="_blank"
                  rel="noopener noreferrer license" 
                  className="underline hover:text-stone-700 dark:hover:text-stone-200"
                >
                  Creative Commons Attribution-ShareAlike 4.0 International License
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
