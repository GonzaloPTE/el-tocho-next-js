import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-stone-600 dark:text-stone-300">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg font-medium">Cargando canciones...</p>
      <p className="text-sm">Por favor, espera un momento.</p>
    </div>
  );
} 