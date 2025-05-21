# Plan for Transitioning to SSR and Server Components

This plan details the steps to refactor the main application pages (`HomePage`, `CategoryPage`, `SongPage`) to leverage Next.js Server Components and SSR, reducing client-side JavaScript and improving SEO.

## I. Refactor `HomePage` (`app/page.tsx` and `components/home-page.tsx`)

**Goal:** Make `app/page.tsx` a Server Component that fetches initial data and passes it to smaller Client Components where necessary. Inline `HomePage` component logic into `app/page.tsx`.

1.  **Identify Client-Side Interactive Parts in `components/home-page.tsx`:**
    *   **Search Bar & Results:** The search input, state (`searchTerm`, `searchResults`), and `useEffect` for filtering `allSongs` are client-side.
    *   **Theme Toggle:** `useTheme()` and `toggleDarkMode` are client-side.
    *   **Navigation:** `useRouter()` for `handleSongClick` and `handleCategoryClick` is client-side.
    *   **Featured Songs Randomization:** `getFeaturedSongs()` called in `useEffect` and stored in state (`featuredSongs`) is client-side logic to ensure it runs once per visit.
2.  **Convert `app/page.tsx` to a Server Component:**
    *   Remove the `HomePage` import and inline its structure.
    *   Directly fetch/prepare data that can be server-rendered:
        *   `siteName`: Already available.
        *   `categories`: Already available.
        *   `getFeaturedSongs()`: Call this function directly on the server to get the initial set of featured songs.
3.  **Extract Client Components from `components/home-page.tsx`:**
    *   **`HeaderClientActions` (New Component):**
        *   Will contain the theme toggle button and logic (`useTheme`, `toggleDarkMode`).
        *   Props: None initially.
        *   Marked with `"use client"`.
    *   **`SearchBar` (New Component):**
        *   Will contain the search input field, `searchTerm` state, `searchResults` state, and the `useEffect` logic for filtering `allSongs`.
        *   Props: `allSongs` (passed from the Server Component `app/page.tsx`).
        *   `handleSongClick` logic (using `useRouter`) will be part of this or a sub-component if results are interactive.
        *   Marked with `"use client"`.
    *   **`CategoryNavigation` (New or Modified Component):**
        *   The mapping of `categories` and the `onClick` handler (`handleCategoryClick` using `useRouter`) needs to be client-side if immediate navigation is desired without a full page reload (though links would also work for SSR). If we keep `useRouter`, this part becomes a client component.
        *   Props: `categories` (passed from Server Component).
        *   Marked with `"use client"`.
    *   **`FeaturedSongNavigation` (New or Modified Component):**
        *   Similar to `CategoryNavigation`, if `handleSongClick` using `useRouter` is kept for featured songs.
        *   Props: `featuredSongs` (passed from Server Component).
        *   Marked with `"use client"`.
4.  **Structure of the new `app/page.tsx` (Server Component):**
    ```typescript
    // app/page.tsx (Server Component)
    import { categories as staticCategories, getFeaturedSongs as staticGetFeaturedSongs, allSongs as staticAllSongs } from "@/lib/data/songs";
    import { siteName as staticSiteName } from "@/lib/config/site";
    import Footer from '@/components/Footer'; // Assuming Footer can be a Server Component or is already a Client Component

    // Import newly created Client Components:
    // import HeaderClientActions from '@/components/header-client-actions';
    // import SearchBar from '@/components/search-bar';
    // import CategoryNavigation from '@/components/category-navigation';
    // import FeaturedSongNavigation from '@/components/featured-song-navigation';
    // Import necessary UI elements (Button, Input, Icons) that are used by the server part of the page.

    export default async function Home() {
      const siteName = staticSiteName;
      const categories = staticCategories;
      const featuredSongs = staticGetFeaturedSongs(); // Fetch on server
      const allSongsForSearch = staticAllSongs; // Pass to client SearchBar

      return (
        // Main layout structure from old HomePage
        // ...
        // <header>
        //   <h1>{siteName}</h1>
        //   <nav>...</nav> // Static nav links or a client component for interactive parts
        //   <HeaderClientActions />
        // </header>
        // <main>
        //   <SearchBar allSongs={allSongsForSearch} />
        //   <CategoryNavigation categories={categories} />
        //   <FeaturedSongNavigation featuredSongs={featuredSongs} />
        // </main>
        // <Footer />
        // ...
      );
    }
    ```
5.  **Delete `components/home-page.tsx`** after its logic is moved and refactored.

## II. Refactor `CategoryPage` (`app/category/[letter]/page.tsx` and `components/client/category-song-list.tsx`)

**Goal:** Make `app/category/[letter]/page.tsx` a Server Component that handles search filtering. Convert `CategorySongList` into a Server Component, extracting individual song interactions into a new Client Component.

1.  **Modify `app/category/[letter]/page.tsx` (Server Component):**
    *   The page component will accept an optional `search` query parameter from the URL (e.g., `searchParams.search`).
    *   Fetch `category` details based on `params.letter`.
    *   Fetch all `songs` for that category.
    *   If a `search` query parameter is present, filter the songs on the server before passing them to the `CategorySongList` component. Filtering logic should match previous client-side: title, author, code.
    *   Pass the (potentially filtered) songs and the current `search` term to `CategorySongList`.
    *   Continue to render the header (using `HeaderClientActions`), footer, and static category information (title, number of songs).

2.  **Create `components/client/song-item-controls.tsx` (New Client Component):**
    *   Marked with `"use client"`.
    *   Props: `song: Song`.
    *   Uses `useTheme()` for dark mode styling.
    *   Manages its own state for:
        *   `isPlayingPreview` (for that specific song's audio preview).
        *   `isFavorite` (for that specific song).
    *   Renders:
        *   Play/Pause button for audio preview (if `song.hasAudio`).
        *   `WaveformPreview` component (if `song.hasAudio`), passing `isDarkMode`.
        *   Favorite button.
    *   Handles `handlePlayPause` and `toggleFavorite` for the individual song.

3.  **Refactor `CategorySongList` to be a Server Component (from `components/client/category-song-list.tsx` to `components/category-song-list.tsx`):**
    *   Remove `"use client"`. This component will be moved from `components/client/` to `components/`.
    *   Remove client-side hooks: `useRouter`, `useTheme`, `useState` for `searchTerm`, `filteredSongs`, `playingSong` (list-wide), `favorites` (list-wide), `isLoading`.
    *   Remove `framer-motion` for list animations.
    *   Props:
        *   `songs: Song[]` (the pre-filtered list from the page component).
        *   `categoryName: string`.
        *   `currentSearchTerm?: string` (to pre-fill the search input).
    *   Render:
        *   A simple HTML `<form>` for the search input. The input field should be pre-filled with `currentSearchTerm`.
            *   The form's `method` should be "GET" and `action` can be empty (to submit to the current URL). The search input should have a `name` (e.g., "search").
        *   Iterate over the `songs` prop:
            *   Display static song information (code, title, author).
            *   Use a Next.js `<Link>` component to navigate to the full song page (`/song/[id]`).
            *   Include the `<SongItemControls song={song} />` client component for interactive elements.
        *   Display a "No songs found" message if the `songs` array is empty, considering if `currentSearchTerm` was present.

4.  **Update Imports and Cleanup:**
    *   Modify `app/category/[letter]/page.tsx` to import `CategorySongList` from its new location (`@/components/category-song-list`).
    *   Delete the old `components/client/category-song-list.tsx` file *after* its logic has been successfully refactored and the new server component `components/category-song-list.tsx` is created and working.

**Implications:**
*   The in-category song search will now trigger a page reload/navigation.
*   Client-side list animations from `framer-motion` in `CategorySongList` will be removed.
*   The core list display becomes server-rendered, while individual song actions remain client-rendered.

## III. Refactor `SongPage` (`app/song/[id]/page.tsx` and `components/song-lyrics-viewer.tsx`)

**Goal:** Make `app/song/[id]/page.tsx` a Server Component.

1.  **Identify Client-Side Interactive Parts in `components/song-lyrics-viewer.tsx`:**
    *   **Theme Toggle:** `useTheme()`.
    *   **Navigation:** `useRouter()` for back button and previous/next song.
    *   **Audio Player Controls:** `isPlaying`, `currentTime` state, `transpose` state, and all handlers related to playback and transpose control. Waveform interaction.
2.  **Convert `app/song/[id]/page.tsx` to a Server Component:**
    *   Fetch song details (including lyrics, title, author, code) on the server based on `params.id`. This will require modifying `lib/data/songs.ts` to include a function like `getSongById(id: string): Song | undefined`.
    *   Import and use `siteName`.
3.  **Extract Client Components from `components/song-lyrics-viewer.tsx`:**
    *   **`SongViewerHeaderClientActions` (New Component):**
        *   Theme toggle, back button.
        *   Props: `siteName`.
        *   Marked with `"use client"`.
    *   **`LyricsPlayerInteractive` (New Component):**
        *   Transpose controls, waveform, play/pause, skip buttons, time display. All related state and handlers.
        *   Props: Song details like `id`, `hasAudio`, mock waveform data (or actual if implemented), initial `transpose` value (can be 0).
        *   The `SONG_LYRICS` constant itself (if it remains static per song) can be passed as a prop from the server component. If lyrics are dynamic per song, they are fetched on the server and passed.
        *   Marked with `"use client"`.
4.  **Structure of `app/song/[id]/page.tsx` (Server Component):**
    ```typescript
    // app/song/[id]/page.tsx (Server Component)
    // Assume getSongById is added to lib/data/songs.ts
    import { getSongById as staticGetSongById } from "@/lib/data/songs"; 
    import { siteName as staticSiteName } from "@/lib/config/site";
    // import SongViewerHeaderClientActions from '@/components/song-viewer-header-client-actions';
    // import LyricsPlayerInteractive from '@/components/lyrics-player-interactive';
    import Footer from '@/components/Footer';

    export default async function SongPage({ params }: { params: { id: string } }) {
      const siteName = staticSiteName;
      const song = staticGetSongById(params.id); // Fetch on server

      if (!song) { /* Handle not found */ }

      return (
        // Main layout structure from old SongLyricsViewer
        // ...
        // <SongViewerHeaderClientActions siteName={siteName} />
        // <main>
        //   <h2>{song.title}</h2>
        //   <h3>{song.author}</h3>
        //   <LyricsPlayerInteractive song={song} /> // Pass necessary song details
        //   <div>{song.lyrics}</div> // Lyrics can be rendered directly by server component
        // </main>
        // <Footer />
        // ...
      );
    }
    ```
5.  **Delete `components/song-lyrics-viewer.tsx`** after refactoring.
6.  **Add `getSongById` to `lib/data/songs.ts`:**
    ```typescript
    // lib/data/songs.ts
    // ... (allSongs definition) ...
    export function getSongById(id: string): Song | undefined {
      return allSongs.find(song => song.id === id);
    }
    ```

## IV. General Considerations & Helper Components

*   **`Footer.tsx`:** Ensure `Footer` is either a Server Component or a self-contained Client Component that doesn't rely on props that would prevent its parent from being a Server Component. If it uses `useTheme` or other client hooks, it needs `"use client"`.
*   **Styling:** Tailwind classes will continue to work in both Server and Client Components.
*   **Data Fetching:** For this phase, we're assuming data (`allSongs`, `categories`) is still sourced from `lib/data/songs.ts`. If this data were to come from an external API or database, data fetching in Server Components would use `async/await` with `fetch`.
*   **`useTheme` context:** Client components that need the theme will continue to use `useTheme()`. Server components cannot use context directly. If a server-rendered part needs to be aware of the theme (e.g., for initial HTML class), this would typically be handled at the root layout level. For now, client components will manage their theme-dependent styles.
*   **Error Handling and Loading States:** For Server Components, consider `error.tsx` and `loading.tsx` conventions in Next.js. Client components will manage their own loading/error states for client-side operations.
