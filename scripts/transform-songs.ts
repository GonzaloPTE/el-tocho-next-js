import fs from 'fs/promises';
import path from 'path';
import { slugifyText } from '../lib/utils'; // Removed .ts extension
import type { Song } from '../types/song'; // Removed .ts extension

// Define interfaces for the raw data structures for clarity
interface RawSong {
  id: number;
  inicial?: string;
  numero?: number;
  titulo?: string;
  autor?: string;
  letra?: string;
}

interface RawEnlace {
  id: number; // This seems to be a unique ID for the enlace itself
  idCantoral: number; // This links to RawSong.id
  audioURL?: string;
  videoURL?: string;
}

async function readJsonlFile<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[]; 
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(`Error: File not found at ${filePath}. Please ensure the raw data files exist.`);
      process.exit(1);
    }
    console.error(`Error reading or parsing JSONL file ${filePath}:`, error);
    throw error;
  }
}

async function transformSongs(): Promise<void> {
  try {
    const rawSongsPath = path.resolve(process.cwd(), 'lib/data/cantoral-raw.jsonl');
    const rawEnlacesPath = path.resolve(process.cwd(), 'lib/data/enlaces-raw.jsonl');
    // Update output path to .jsonl
    const outputPath = path.resolve(process.cwd(), 'lib/data/cantoral.jsonl'); 

    const rawSongs: RawSong[] = await readJsonlFile<RawSong>(rawSongsPath);
    const rawEnlaces: RawEnlace[] = await readJsonlFile<RawEnlace>(rawEnlacesPath);

    console.log(`Read ${rawSongs.length} songs from cantoral-raw.jsonl`);
    console.log(`Read ${rawEnlaces.length} enlaces from enlaces-raw.jsonl`);

    const enlacesMap = new Map<number, RawEnlace>();
    for (const enlace of rawEnlaces) {
      enlacesMap.set(enlace.idCantoral, enlace);
    }

    const transformedSongsLines: string[] = rawSongs.map((rawSong: RawSong) => {
      const enlace = enlacesMap.get(rawSong.id);
      const audioUrl = enlace?.audioURL || undefined;
      const videoUrl = enlace?.videoURL || undefined;

      const songTitle = rawSong.titulo || 'Sin Título';
      // If rawSong.autor is falsy (null, undefined, empty string), set author to empty string
      const songAuthor = rawSong.autor || ''; 

      const newSong: Song = {
        id: String(rawSong.id),
        code: `${rawSong.inicial || 'X'}${rawSong.numero || '00'}`,
        title: songTitle,
        author: songAuthor, 
        category: rawSong.inicial || 'X',
        slug: slugifyText(`${songTitle} ${songAuthor}`.trim()), // Trim in case author is empty
        lyrics: rawSong.letra || '',
        audioUrl: audioUrl,
        videoUrl: videoUrl,
      };
      return JSON.stringify(newSong); // Stringify each song object
    });

    // Join each stringified song with a newline for JSONL format
    await fs.writeFile(outputPath, transformedSongsLines.join('\n')); 
    console.log(`Successfully transformed ${transformedSongsLines.length} songs.`);
    console.log(`Output written to ${outputPath}`);

  } catch (error) {
    console.error('Error during song transformation process:', error);
    process.exit(1);
  }
}

transformSongs(); 