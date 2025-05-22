import { categories } from "@/lib/data/songs";
import Footer from "@/components/Footer";
import { CategoryNavigation } from "@/components/category-navigation";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Categorías de Cantos Litúrgicos | El Tocho",
  description: "Explora las categorías de cantos de El Tocho. Encuentra música para cada momento de la misa, organizada temáticamente para facilitar tu selección.",
  openGraph: {
    title: "Categorías de Cantos Litúrgicos | El Tocho",
    description: "Explora las categorías de cantos de El Tocho. Encuentra música para cada momento de la misa, organizada temáticamente para facilitar tu selección.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/categorias`,
    siteName: "Cantoral El Tocho",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/images/logo-1x1-1k.png`, 
        width: 1024, 
        height: 1024, 
        alt: "Categorías de Cantos El Tocho",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Categorías de Cantos Litúrgicos | El Tocho",
    description: "Explora las categorías de cantos de El Tocho. Encuentra música para cada momento de la misa, organizada temáticamente para facilitar tu selección.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/images/logo-1x1-1k.png`], 
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/categorias`,
  },
};

export default async function CategoriasPage() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Categorías" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <PageHeader />

      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          <Breadcrumb items={breadcrumbItems} />
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-merriweather font-bold mb-4 text-stone-800 dark:text-stone-100">
              Categorías de Cantos
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto sm:mx-0 text-stone-600 dark:text-stone-300">
              Explora todas las categorías de cantos litúrgicos. Cada sección corresponde a un momento específico de la celebración, facilitando la selección de la música adecuada para cada parte de la misa.
            </p>
          </div>

          <CategoryNavigation categories={categories} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
