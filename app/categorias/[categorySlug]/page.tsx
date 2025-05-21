import { BookOpen } from "lucide-react";
// Update to use getCategoryBySlug and getSongsByCategory
import { getCategoryBySlug, getSongsByCategory } from "@/lib/data/songs"; 
import { siteName } from "@/lib/config/site";
import Footer from "@/components/Footer";
import { HeaderClientActions } from "@/components/client/header-client-actions";
import { CategorySongList } from "@/components/category-song-list";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { PageHeader } from "@/components/page-header";

interface CategoryPageProps {
  // Update params to use categorySlug
  params: { categorySlug: string }; 
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Update to use categorySlug
  const { categorySlug } = params; 
  const searchTerm = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  // Use getCategoryBySlug
  const category = getCategoryBySlug(categorySlug); 
  if (!category) {
    notFound();
  }

  // Update basePath
  const basePath = `/categorias/${categorySlug}`; 

  // Get songs using category.letter
  let songsForCategory = getSongsByCategory(category.letter); 

  if (searchTerm) {
    songsForCategory = songsForCategory.filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.author && song.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      song.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <PageHeader showBackButton={true} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="rounded-2xl shadow-xl p-6 border bg-white border-stone-200 dark:bg-stone-800 dark:border-stone-700">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-lg bg-stone-800 dark:bg-stone-600">
                {/* Display category letter or perhaps something derived from slug if needed */}
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
              basePath={basePath}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 