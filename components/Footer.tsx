import React from 'react';
import { siteName } from '@/lib/config/site';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-800 text-stone-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-white">{siteName}</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <p className="mt-2">by Coro9</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
