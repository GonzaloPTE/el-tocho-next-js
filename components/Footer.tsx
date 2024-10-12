import React from 'react';
import { SITE_NAME } from '@/components/constants';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-800 text-stone-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-white">{SITE_NAME}</h2>
            <p className="mt-2">Tu compañero musical para la liturgia</p>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <a href="#" className="hover:text-white transition-colors">Acerca de</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
            <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-stone-700 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.</p>
          <a 
            href="https://github.com/yourusername/your-repo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center mt-4 md:mt-0 hover:text-white transition-colors"
          >
            <Github className="mr-2" size={20} />
            Ver en GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
