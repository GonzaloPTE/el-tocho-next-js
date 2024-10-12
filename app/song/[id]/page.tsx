import { SongLyricsViewer } from "@/components/song-lyrics-viewer"

export default function SongPage({ params }: { params: { id: string } }) {
  return <SongLyricsViewer songId={params.id} />
}
