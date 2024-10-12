import React from 'react';
import { SITE_NAME } from './constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-stone-600 text-sm">
            © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-stone-600 hover:text-stone-800 text-sm transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-stone-600 hover:text-stone-800 text-sm transition-colors">
                  Términos de uso
                </a>
              </li>
              <li>
                <a href="#" className="text-stone-600 hover:text-stone-800 text-sm transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
