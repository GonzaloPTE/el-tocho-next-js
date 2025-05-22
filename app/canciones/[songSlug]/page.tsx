import { categories, getSongBySlug } from "@/lib/data/songs";
import Footer from "@/components/Footer";
import { LyricsViewerInteractive } from "@/components/client/lyrics-viewer-interactive";
import { notFound } from 'next/navigation';
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/Breadcrumb";

interface SongPageProps {
  params: { songSlug: string };
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
