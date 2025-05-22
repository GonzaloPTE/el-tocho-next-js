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

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <PageHeader showBackButton={true} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className={`mx-auto space-y-6 ${isLongSongLayout ? 'max-w-6xl' : 'max-w-4xl'}`}>
          <Breadcrumb 
            items={[{ label: 'Inicio', href: '/' }, { label: 'Categorías', href: '/categorias' }, { label: categories.find(c => c.letter === song.category)?.description || '', href: `/categorias/${categories.find(c => c.letter === song.category)?.slug}` }, { label: song.title }]}
            showBackButton={true}
          />
          <LyricsViewerInteractive song={song} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
