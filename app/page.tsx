import { allSongs, categories } from "@/lib/data/songs";
import Footer from "@/components/Footer";
import { SearchBar } from "@/components/client/search-bar";
import { CategoryNavigation } from "@/components/category-navigation";
import { FeaturedSongNavigation } from "@/components/client/featured-song-navigation";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";

// NOTE: ThemeProvider and useTheme are client-side.
// The root layout (app/layout.tsx) should wrap children in ThemeProvider.
// Individual server components *cannot* directly access isDarkMode or toggleDarkMode.
// Client components that need theme information (like SearchBar or HeaderClientActions)
// will use the useTheme() hook themselves.

export default async function HomePage() {
  // Fetch data on the server
  const songs = allSongs; // Assuming allSongs is already the data, not a function to call

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
        <div className="max-w-5xl mx-auto">
          {/* SearchBar is a client component */}
          <div className="mt-24 mb-8">
            <SearchBar />
          </div>

          {/* Help section - static title, client component for navigation */}
          <div className="mb-16 text-right relative max-w-2xl mx-auto">
            <p className="text-base font-medium text-stone-600 dark:text-stone-300">
                <span className="mx-2">¿Quieres simplemente explorar?</span>
                <Link 
                href="/canciones" 
                className="text-base font-medium text-stone-600 hover:text-sky-600 dark:text-stone-300 dark:hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-stone-900 dark:focus:ring-sky-400"
                >
                Ver todo el cancionero →
                </Link>
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
