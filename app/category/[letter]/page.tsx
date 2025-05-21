import { BookOpen } from "lucide-react";
import { getCategoryByLetter, getSongsByCategory } from "@/lib/data/songs";
import { siteName } from "@/lib/config/site";
import Footer from "@/components/Footer";
import { HeaderClientActions } from "@/components/client/header-client-actions";
import { CategorySongList } from "@/components/category-song-list";
import Link from "next/link";
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: { letter: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { letter } = params;
  const searchTerm = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const category = getCategoryByLetter(letter);
  if (!category) {
    notFound();
  }

  let songsForCategory = getSongsByCategory(letter);

  if (searchTerm) {
    songsForCategory = songsForCategory.filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.author && song.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      song.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <header className="border-b py-4 shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/90 border-stone-200 dark:bg-stone-800/90 dark:border-stone-700">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link href="/" className="text-3xl font-merriweather font-bold flex items-center text-stone-800 dark:text-stone-100">
            <BookOpen className="mr-2" size={28} /> {siteName}
          </Link>
          <div className="flex items-center space-x-4">
            <HeaderClientActions showBackButton={true} />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="rounded-2xl shadow-xl p-6 border bg-white border-stone-200 dark:bg-stone-800 dark:border-stone-700">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-lg bg-stone-800 dark:bg-stone-600">
                <span className="text-4xl">{category.letter.toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-3xl font-merriweather font-bold mb-2 text-stone-800 dark:text-stone-100">
                  {category.description}
                </h2>
                <p className="text-xl text-stone-600 dark:text-stone-400">
                  {songsForCategory.length} {songsForCategory.length === 1 ? "canción encontrada" : "canciones encontradas"}
                  {searchTerm && ` para "${searchTerm}"`}
                  {!searchTerm && (songsForCategory.length === 1 ? " en esta categoría" : " en esta categoría")}
                </p>
              </div>
            </div>
            <CategorySongList 
              songs={songsForCategory}
              categoryName={category.description} 
              currentSearchTerm={searchTerm}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
