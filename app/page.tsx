import { allSongs, categories } from "@/lib/data/songs";
import Footer from "@/components/Footer";
import { SearchBar } from "@/components/client/search-bar";
import { CategoryNavigation } from "@/components/category-navigation";
import { FeaturedSongNavigation } from "@/components/client/featured-song-navigation";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { Metadata } from 'next';
import { AudioPlayerTestWrapper } from '@/components/client/audio-player-test-wrapper';

// NOTE: ThemeProvider and useTheme are client-side.
// The root layout (app/layout.tsx) should wrap children in ThemeProvider.
// Individual server components *cannot* directly access isDarkMode or toggleDarkMode.
// Client components that need theme information (like SearchBar or HeaderClientActions)
// will use the useTheme() hook themselves.

export const metadata: Metadata = {
  title: "Cantoral El Tocho - Acordes y Letras de Canciones",
  description: "Encuentra acordes y letras de miles de canciones en español. Explora nuestro cancionero digital y toca tus canciones favoritas.",
  openGraph: {
    title: "Cantoral El Tocho - Acordes y Letras de Canciones",
    description: "Encuentra acordes y letras de miles de canciones cristianas en español. Explora nuestro cancionero digital y toca tus canciones favoritas.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com",
    siteName: "Cantoral El Tocho",
    // Assuming you have a general logo or image for the site in public/images/og-image.png
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/images/logo-1x1-1k.png`, 
        width: 1024, // Replace with your image's width
        height: 1024, // Replace with your image's height
        alt: "Cantoral El Tocho Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cantoral El Tocho - Acordes y Letras de Canciones",
    description: "Encuentra acordes y letras de miles de canciones cristianas en español. Explora nuestro cancionero digital y toca tus canciones favoritas.",
    // Assuming you have a general logo or image for Twitter cards in public/images/twitter-image.png
    images: [`${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/images/logo-1x1-1k.png`], 
  },
};

export default async function HomePage() {
  // Fetch data on the server
  const songs = allSongs; // Assuming allSongs is already the data, not a function to call
  const songForPlayer = songs.find(s => s.audioUrl && s.audioUrl.length > 0) || songs[0]; // Find a song with audio, or fallback to the first song
  const allCategories = categories; // Pass categories to the wrapper

  return (
    // The main div's theme-dependent classes will be handled by ThemeProvider in layout.tsx
    // We can't use isDarkMode here directly.
    // A common approach is to have a ThemeWrapper client component if specific server-rendered
    // elements need to change based on theme *before* hydration, but that adds complexity.
    // For now, assuming ThemeProvider in layout.tsx handles the body/root styles.
    <div className="min-h-screen flex flex-col font-inter">
      {/* Use the new PageHeader component */}
      <PageHeader />

      <main className="container mx-auto px-4 py-16">
        {/* TEST AUDIO PLAYER */}
        <div className="my-8 p-4 border border-dashed border-stone-400 dark:border-stone-600 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center text-stone-700 dark:text-stone-300">Audio Player Test</h2>
          <AudioPlayerTestWrapper 
            song={songForPlayer} 
            categories={allCategories} 
            allSongs={songs} // Pass all songs for navigation
          />
        </div>
        {/* END TEST AUDIO PLAYER */}

        <div className="max-w-5xl mx-auto">
          <div className="text-center pt-12 pb-8">
            <h1 className="text-5xl sm:text-6xl font-merriweather font-bold mb-6 text-stone-800 dark:text-stone-100">
              Cantoral EL TOCHO
            </h1>
            <p className="text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              Tu cancionero de acordes y letras para canciones cristianas en español. Explora, aprende y canta con nosotros.
            </p>
          </div>

          {/* SearchBar is a client component */}
          <div className="mt-8 mb-12">
            <SearchBar />
          </div>

          {/* Help section - static title, client component for navigation */}
          <div className="mb-16 text-right relative max-w-2xl mx-auto">
            <p className="text-base font-medium text-stone-600 dark:text-stone-300">
                <h2 className="mx-2">
                <Link 
                href="/canciones" 
                className="text-base font-medium text-stone-600 hover:text-sky-600 dark:text-stone-300 dark:hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-stone-900 dark:focus:ring-sky-400"
                >
                Explora todo el cancionero →
                </Link>
                </h2>
            </p>
          </div>

          {/* Categories section - static title, client component for navigation */}
          <div>
            <h2 className="text-4xl font-merriweather font-bold mb-6 text-stone-800 dark:text-stone-100">
              Categorías
            </h2>
            <p className="mb-8 leading-relaxed text-lg max-w-3xl text-stone-600 dark:text-stone-300">
              El Tocho organiza sus canciones según los momentos de la misa, desde la entrada hasta la salida. Cada categoría está representada por una letra en orden cronológico de la ceremonia.
            </p>
            {/* CategoryNavigation is a client component */}
            <CategoryNavigation categories={categories} />
          </div>

          {/* Featured songs section - static title, client component for navigation */}
          <div className="mt-16">
            <h2 className="text-4xl font-merriweather font-bold mb-8 text-stone-800 dark:text-stone-100">
              Canciones Favoritas
            </h2>
            {/* Pass allSongs to FeaturedSongNavigation */}
            <FeaturedSongNavigation allSongs={songs} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// No more "use client" at the top-level page component.
// The old HomePage component (components/home-page.tsx) can now be deleted.
