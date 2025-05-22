import { allSongs, categories, searchSongs } from "@/lib/data/songs";
import Footer from "@/components/Footer";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CategorySongList } from "@/components/category-song-list";
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Cancionero Completo - Todas las Canciones | El Tocho",
  description: "Explora el cancionero completo de El Tocho. Encuentra letras y acordes de todas nuestras canciones cristianas, organizadas y listas para usar.",
  openGraph: {
    title: "Cancionero Completo - Todas las Canciones | El Tocho",
    description: "Explora el cancionero completo de El Tocho. Encuentra letras y acordes de todas nuestras canciones cristianas, organizadas y listas para usar.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/canciones`,
    siteName: "El Tocho Cancionero",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/images/logo-1x1-1k.png`, 
        width: 1024, 
        height: 1024, 
        alt: "Cancionero Completo El Tocho",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cancionero Completo - Todas las Canciones | El Tocho",
    description: "Explora el cancionero completo de El Tocho. Encuentra letras y acordes de todas nuestras canciones cristianas, organizadas y listas para usar.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/images/logo-1x1-1k.png`], 
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/canciones`,
  },
};

interface CancionesPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CancionesPage({ searchParams }: CancionesPageProps) {
  const searchTerm = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const isSearching = !!searchTerm;

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Cancionero Completo" },
  ];

  const totalSongs = allSongs.length;
  const totalCategories = categories.length;

  let songsToDisplay = allSongs;

  if (searchTerm) {
    songsToDisplay = searchSongs(searchTerm, {
      songsToSearch: allSongs, 
      priorityFields: ['title', 'author', 'lyrics', 'code'] 
      // No limit, show all matches
    });
  }

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <PageHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-merriweather font-bold mb-3 text-stone-800 dark:text-stone-100">
                Cancionero Completo
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-300">
                Descubre nuestro extenso repertorio de {totalSongs} cantos, cuidadosamente organizados en {totalCategories} secciones temáticas. 
                Explora libremente o utiliza el buscador para encontrar piezas específicas por título, autor o parte de la letra.
              </p>
              <div className="my-12 text-right">
                <p className="text-base font-medium text-stone-600 dark:text-stone-300">
                    <span className="mx-2">¿Necesitas ayuda para encontrar una canción?</span>
                    <Link 
                    href="/categorias" 
                    className="text-base font-medium text-stone-600 hover:text-sky-600 dark:text-stone-300 dark:hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-stone-900 dark:focus:ring-sky-400"
                    >
                    Explora por Categoría →
                    </Link>
                </p>
              </div>
            </div>

            <CategorySongList
              songs={songsToDisplay}
              categoryName="el cancionero" // Used for the search input placeholder e.g., "Buscar en el cancionero"
              currentSearchTerm={searchTerm}
              basePath="/canciones" // Base path for search URLs
              sortBy="code"
              sortOrder="asc"
              isSearching={isSearching}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
  