# Plan: Playlist Feature Implementation

## I. Core Audio Player Component (`components/client/audio-player.tsx`) - FULLY TESTED & COMPLETE

1.  **Define Props Interface (`AudioPlayerProps`):** - COMPLETE
    *   `song: Song | null` (current song; null if no song is loaded)
    *   `audioSrcOverride?: string` (optional: to directly provide an audio URL if `song.audioUrl` isn't the source)
    *   `showWaveform?: boolean` (default: `true`)
    *   `showSongInfo?: boolean` (default: `true` - displays title, author, code, category)
    *   `showPlaybackControls?: boolean` (default: `true` - play/pause, rewind, ffwd)
    *   `showNavigationControls?: boolean` (default: `true` - prev/next song in playlist)
    *   `showShuffleButton?: boolean` (default: `false`)
    *   `showRepeatButton?: boolean` (default: `false`)
    *   `onPlay?: (song: Song) => void`
    *   `onPause?: (song: Song) => void`
    *   `onEnded?: (song: Song) => void` (critical for auto-advancing in playlist)
    *   `onNextSong?: () => void` (called when user clicks next)
    *   `onPrevSong?: () => void` (called when user clicks prev)
    *   `onTimeUpdate?: (currentTime: number, duration: number) => void`
    *   `className?: string`
    *   `waveformColor?: string`
    *   `waveformProgressColor?: string`

2.  **Internal State (`useAudioPlayer` hook or local state):** - COMPLETE
    *   `isPlaying: boolean`
    *   `currentTime: number`
    *   `duration: number`
    *   `audioElementRef: React.RefObject<HTMLAudioElement>`
    *   `isLoading: boolean` (for when audio is loading)
    *   `error: string | null` (for audio playback errors)
    *   `isMuted: boolean`
    *   `volume: number`

3.  **Core Functionality:** - COMPLETE
    *   Initialize `AudioElement` with `song.audioUrl` or `audioSrcOverride`.
    *   Handle audio events: `loadedmetadata`, `timeupdate`, `ended`, `error`, `stalled`, `waiting`, `playing`, `canplay`.
    *   Implement playback controls: `play()`, `pause()`, `seek(time)`, `rewind(seconds)`, `fastForward(seconds)`, `volume`, `mute`.
    *   Conditionally render UI elements based on props.
    *   Use `useTheme` for styling.
    *   **Media Session API Integration:** - COMPLETE
        *   On song play, update `navigator.mediaSession.metadata` with title, artist, album (can use category or a site-wide name), and artwork (if available, e.g., a default site logo or category-specific icon).
        *   Set up `navigator.mediaSession.setActionHandler` for `play`, `pause`, `previoustrack`, `nexttrack`. These handlers will call the corresponding `AudioPlayer` or `PlaylistStore` actions.

4.  **UI Elements:** - COMPLETE
    *   Song Info: Title, Author, Code, Category.
    *   Playback: Play/Pause, Rewind, Fast Forward buttons.
    *   Navigation: Next Song, Previous Song buttons.
    *   Shuffle & Repeat Buttons (with active state indication).
    *   Time Display: Current time / Total duration.
    *   Waveform: Reuse or adapt `Waveform` component.
    *   Volume Control: Mute button and volume slider.
    *   Error Display.
    *   Loading Indicator (on play button).
    *   Message for unavailable audio.

## II. Playlist Management (`components/client/playlist-context.tsx`) - FULLY TESTED & COMPLETE

1.  **Define Context and Provider:** - COMPLETE
    *   Create `PlaylistContext` using `React.createContext()`.
    *   Create `PlaylistProvider` component.

2.  **State (`PlaylistState` within `PlaylistProvider`):** - COMPLETE
    *   `songs: Song[]` (the current playlist of playable songs - those with `audioUrl`)
    *   `originalPlaylist: Song[]` (if `songs` can be a subset, e.g., filtered favorites)
    *   `currentSong: Song | null`
    *   `currentSongIndex: number` (-1 if no song, or index within `songs`)
    *   `isPlaying: boolean` (global playback state for the playlist)
    *   `isShuffled: boolean`
    *   `shuffledSongs: Song[]` (the shuffled version of `songs` if `isShuffled` is true)
    *   `repeatMode: 'none' | 'one' | 'all'` (default: `'none'`)
    *   `playNonce: number` (to trigger re-renders in AudioPlayer for same song replay)
    *   **Persistence:** State (`currentSongIndex`, `isShuffled`, `repeatMode`, `playNonce`, `originalPlaylist`) saved to `localStorage` and rehydrated. - COMPLETE

3.  **Actions (Functions exposed via context value in `PlaylistProvider`):** - COMPLETE
    *   `loadPlaylist(newSongs: Song[], startIndex?: number): void`
    *   `playSongAtIndex(index: number): void`
    *   `togglePlayPause(): void`
    *   `playNextSong(): void`
    *   `playPrevSong(): void`
    *   `toggleShuffle(): void`
    *   `setRepeatMode(mode: 'none' | 'one' | 'all'): void`
    *   `cycleRepeatMode(): void`
    *   `clearPlaylist(): void`

4.  **Custom Hook (`usePlaylist`):** - COMPLETE
    *   `const context = useContext(PlaylistContext);`
    *   `if (!context) throw new Error('usePlaylist must be used within a PlaylistProvider');`
    *   `return context;`

## III. Refactor `LyricsViewerInteractive` (`components/client/lyrics-viewer-interactive.tsx`)

1.  **Remove Direct Audio Logic:** Delete `audioRef`, state for `isPlaying`, `currentTime`, `duration`, and associated `useEffect` hooks and event handlers.
2.  **Integrate `AudioPlayer`:**
    *   Instance the `<AudioPlayer />` component.
    *   Pass the current `song` to it.
    *   Configure `AudioPlayer` props:
        *   `showSongInfo={false}` (as song info is already in `LyricsViewerInteractive`)
        *   `onEnded`: If part of a playlist managed by `usePlaylist`, call `playlist.nextSong()`. Otherwise, no-op or reset.
        *   `onNextSong`/`onPrevSong`: Connect to `playlist.nextSong()` / `playlist.prevSong()` if playlist is active. Disable if no playlist context. The current `handleNextSong`/`handlePrevSong` logic based on `song.id` is brittle and should be replaced or used as a fallback if not in a playlist.
3.  **Lyrics Display:** Keep `displayLyrics` and `lyricsClassName` logic.

## IV. Update `FeaturedSongNavigation` (`components/client/featured-song-navigation.tsx`)

1.  **Playlist Initiation:**
    *   Add "Play All" and "Shuffle All" buttons.
    *   These buttons will call `playlist.loadPlaylist(favoriteSongsWithAudio, isShuffled ? 0 : undefined)` and `playlist.playSongAtIndex(0)`.
2.  **Individual Song Play:**
    *   When a favorite song with an `audioUrl` is clicked (not the link to its page, but a new play icon perhaps):
        *   Call `playlist.loadPlaylist([song], 0)` (to play just this song) OR
        *   If a playlist is already active, consider "Play Next" or "Add to Queue" options.
        *   For MVP, clicking a song in "Favorites" could start a playlist of *all* favorites starting from that song.
3.  **Displaying Currently Playing Song:**
    *   Visually indicate which song in the list is currently playing if it's from the favorites list (requires `usePlaylist` to get `currentSong`).

## V. Global Audio Player UI (Persistent Player Bar)

1.  **Create `GlobalAudioPlayerBar` Component (`components/client/global-audio-player-bar.tsx`):**
    *   Uses `usePlaylist` to get `currentSong`, `isPlaying`, etc.
    *   Instances the `<AudioPlayer />` component.
    *   Passes `playlist.currentSong` to `AudioPlayer`.
    *   Connects `AudioPlayer`'s `onNextSong`, `onPrevSong`, `onEnded` to `playlist.nextSong`, `playlist.prevSong`.
    *   Controls for shuffle and repeat that call `playlist.toggleShuffle`, `playlist.setRepeatMode`.
    *   Displays minimal song info and playback controls.
    *   This bar would be fixed at the bottom of the screen or similar.
2.  **Integrate into `app/layout.tsx`:**
    *   Wrap `children` with `PlaylistProvider`.
    *   Render `<GlobalAudioPlayerBar />` conditionally if `playlist.currentSong` exists.

## VI. Iteration and Refinements

1.  **Error Handling:** Robust error handling for audio loading and playback in `AudioPlayer`.
2.  **Loading States:** Visual feedback for when audio is loading.
3.  **Accessibility:** Ensure all controls are accessible (ARIA attributes, keyboard navigation).
4.  **Shuffle Logic:** Implement proper shuffle (e.g., Fisher-Yates) and ensure "unshuffle" restores original order.
5.  **Queue Management:** Advanced features like adding to queue, reordering queue.
6.  **Performance:** Memoization, avoiding unnecessary re-renders.
7.  **Styling:** Ensure dark mode compatibility and a polished look and feel.
8.  **Media Session Artwork:** Design or select appropriate artwork for different categories or a default one to show in the media session notification.
9.  **LocalStorage Management:** Ensure robust saving/loading from localStorage, handling potential parsing errors or version changes.
