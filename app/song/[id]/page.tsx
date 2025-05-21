import { BookOpen } from "lucide-react";
import { getSongById } from "@/lib/data/songs";
import { siteName } from "@/lib/config/site";
import Footer from "@/components/Footer";
import { HeaderClientActions } from "@/components/client/header-client-actions";
import { LyricsViewerInteractive } from "@/components/client/lyrics-viewer-interactive";
import Link from "next/link";
import { notFound } from 'next/navigation';

interface SongPageProps {
  params: { id: string };
}

export default async function SongPage({ params }: SongPageProps) {
  const { id } = params;
  const song = getSongById(id);

  if (!song) {
    notFound();
  }

  // Determine if the song lyrics are long to adjust layout in the server component
  // This is purely for structural layout, text styling itself is within the client component
  const isLongSongLayout = song.lyrics.split('\n').length > 20;

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <header className="border-b py-4 shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/90 border-stone-200 dark:bg-stone-800/90 dark:border-stone-700">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link href="/" className="text-3xl font-merriweather font-bold flex items-center text-stone-800 dark:text-stone-100">
            <BookOpen className="mr-2" size={28} /> {siteName}
          </Link>
          <HeaderClientActions showBackButton={true} />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Adjust max-width based on lyrics length for better readability */}
        <div className={`mx-auto space-y-6 ${isLongSongLayout ? 'max-w-6xl' : 'max-w-4xl'}`}>
          <LyricsViewerInteractive song={song} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
