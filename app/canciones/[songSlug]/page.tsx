import { categories, getSongBySlug } from "@/lib/data/songs";
import Footer from "@/components/Footer";
import { LyricsViewerInteractive } from "@/components/client/lyrics-viewer-interactive";
import { notFound } from 'next/navigation';
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Metadata, ResolvingMetadata } from 'next';

interface SongPageProps {
  params: { songSlug: string };
}

export async function generateMetadata(
  { params }: SongPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const songSlug = params.songSlug;
  const song = getSongBySlug(songSlug);

  if (!song) {
    return {
      title: "Canción no encontrada",
      description: "La canción que buscas no existe o no está disponible."
    };
  }

  const pageTitle = `${song.title} - ${song.author || 'Autor desconocido'} - Acordes y Letras | Cantoral El Tocho`;
  const pageDescription = `Letra y acordes de '${song.title}' por ${song.author || 'Autor desconocido'}. Aprende a tocar ${song.title} en guitarra, piano u otro instrumento con Cantoral El Tocho.`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com";
  const imageUrl = `${baseUrl}/images/logo-1x1-1k.png`; 

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${baseUrl}/canciones/${songSlug}`,
      siteName: "Cantoral El Tocho",
      images: [
        {
          url: imageUrl,
          width: 1024, 
          height: 1024, 
          alt: `Letra y acordes de ${song.title}`,
        },
      ],
      type: "music.song", 
      /* // Potentially add more music specific metadata if available
      music: {
        musicians: song.author ? [{ name: song.author }] : [], // Example structure
        // album: { name: song.albumName, track: song.trackNumber },
        // duration: song.durationInSeconds,
      }
      */
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/canciones/${songSlug}`,
    },
  };
}

export default async function SongPage({ params }: SongPageProps) {
  const { songSlug } = params;
  const song = getSongBySlug(songSlug);

  if (!song) {
    notFound();
  }

  const isLongSongLayout = song.lyrics.split('\n').length > 20;
  const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com";
  const songCategory = categories.find(c => c.letter === song.category);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": `${siteBaseUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categorías",
        "item": `${siteBaseUrl}/categorias`
      },
      ...(songCategory ? [{
        "@type": "ListItem",
        "position": 3,
        "name": songCategory.description,
        "item": `${siteBaseUrl}/categorias/${songCategory.slug}`
      }] : []),
      {
        "@type": "ListItem",
        "position": songCategory ? 4 : 3,
        "name": song.title,
        "item": `${siteBaseUrl}/canciones/${songSlug}`
      }
    ]
  };
  
  const songSchema = {
    "@context": "https://schema.org",
    "@type": "Song", // or "Song"
    "name": song.title,
    "byArtist": {
      "@type": "Person", // or "MusicGroup"
      "name": song.author || "Autor Desconocido"
    },
    "lyrics": {
        "@type": "CreativeWork",
        "text": song.lyrics
    },
    // "inLanguage": "es", // Add if you have language info for songs
    "url": `${siteBaseUrl}/canciones/${songSlug}`
  };

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' }, 
    { label: 'Categorías', href: '/categorias' },
    ...(songCategory ? [{ label: songCategory.description, href: `/categorias/${songCategory.slug}` }] : []),
    { label: song.title }
  ];

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(songSchema) }}
      />
      <PageHeader showBackButton={true} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className={`mx-auto space-y-6 ${isLongSongLayout ? 'max-w-6xl' : 'max-w-4xl'}`}>
          <Breadcrumb 
            items={breadcrumbItems}
            showBackButton={true}
          />
          <LyricsViewerInteractive song={song} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
