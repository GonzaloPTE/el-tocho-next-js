import { BookOpen } from "lucide-react";
import { allSongs, categories, getFeaturedSongs } from "@/lib/data/songs";
import { siteName } from "@/lib/config/site";
import Footer from "@/components/Footer";
import { HeaderClientActions } from "@/components/client/header-client-actions";
import { SearchBar } from "@/components/client/search-bar";
import { CategoryNavigation } from "@/components/client/category-navigation";
import { FeaturedSongNavigation } from "@/components/client/featured-song-navigation";

// NOTE: ThemeProvider and useTheme are client-side.
// The root layout (app/layout.tsx) should wrap children in ThemeProvider.
// Individual server components *cannot* directly access isDarkMode or toggleDarkMode.
// Client components that need theme information (like SearchBar or HeaderClientActions)
// will use the useTheme() hook themselves.

export default async function HomePage() {
  // Fetch data on the server
  const songs = allSongs; // Assuming allSongs is already the data, not a function to call
  const featuredSongs = getFeaturedSongs(); // This is a function call

  return (
    // The main div's theme-dependent classes will be handled by ThemeProvider in layout.tsx
    // We can't use isDarkMode here directly.
    // A common approach is to have a ThemeWrapper client component if specific server-rendered
    // elements need to change based on theme *before* hydration, but that adds complexity.
    // For now, assuming ThemeProvider in layout.tsx handles the body/root styles.
    <div className="min-h-screen flex flex-col font-inter">
      {/* Header is mostly static, client actions are in HeaderClientActions */}
      <header className="border-b py-4 shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/90 border-stone-200 dark:bg-stone-800/90 dark:border-stone-700">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-3xl font-merriweather font-bold flex items-center text-stone-800 dark:text-stone-100">
            <BookOpen className="mr-2" size={28} /> {siteName}
          </div>
          <HeaderClientActions />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-24">
          {/* SearchBar is a client component */}
          <SearchBar allSongs={songs} />

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
          <div>
            <h2 className="text-4xl font-merriweather font-bold mb-8 text-stone-800 dark:text-stone-100">
              Canciones Destacadas
            </h2>
            {/* FeaturedSongNavigation is a client component */}
            <FeaturedSongNavigation featuredSongs={featuredSongs} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// No more "use client" at the top-level page component.
// The old HomePage component (components/home-page.tsx) can now be deleted.
