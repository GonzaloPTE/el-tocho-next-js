// Update to use getCategoryBySlug and getSongsByCategory
import { getCategoryBySlug, getSongsByCategory, searchSongs } from "@/lib/data/songs"; 
import Footer from "@/components/Footer";
import { CategorySongList } from "@/components/category-song-list";
import { notFound } from 'next/navigation';
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Metadata, ResolvingMetadata } from 'next';

interface CategoryPageProps {
  // Update params to use categorySlug
  params: { categorySlug: string }; 
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { params }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const categorySlug = params.categorySlug;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Categoría no encontrada",
      description: "La categoría de canciones que buscas no existe."
    };
  }

  const pageTitle = `Canciones de ${category.description} - Acordes y Letras | El Tocho`;
  const pageDescription = `Descubre letras y acordes de canciones de ${category.description}. Encuentra música para cada momento de la celebración en el cantoral El Tocho.`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com";
  // Assuming a generic category image or site logo if specific category images aren't available
  const imageUrl = `${baseUrl}/images/logo-1x1-1k.png`; 

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${baseUrl}/categorias/${categorySlug}`,
      siteName: "Cantoral El Tocho",
      images: [
        {
          url: imageUrl,
          width: 1024, // Replace with your image's width
          height: 1024, // Replace with your image's height
          alt: `Canciones de ${category.description}`,
        },
      ],
      type: "website", // or "object" or a more specific type if applicable
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/categorias/${categorySlug}`,
    },
  };
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
    songsForCategory = searchSongs(searchTerm, {
      songsToSearch: songsForCategory, // Search within the already filtered category songs
      priorityFields: ['title', 'author', 'lyrics', 'code']
      // No limit, show all matches within the category
    });
  }

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <PageHeader showBackButton={true} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Breadcrumb 
            items={[{ label: 'Inicio', href: '/' }, { label: 'Categorías', href: '/categorias' }, { label: category.description }]}
            showBackButton={true}
          />
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
              sortBy="code"
              sortOrder="asc"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 