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

## II. Refactor `CategoryPage` (`app/category/[letter]/page.tsx`) and related components

**Goal:** Make `app/category/[letter]/page.tsx` a Server Component that handles search filtering. `CategorySongList` is also a Server Component, with a dedicated Client Component for debounced search input, and another for individual song item controls.

1.  **Modify `app/category/[letter]/page.tsx` (Server Component):**
    *   Accepts an optional `search` query parameter (`searchParams.search`).
    *   Fetches `category` details using `getCategoryByLetter(params.letter)` and all `songs` for that category using `getSongsByCategory(category.name)`.
    *   Filters songs on the server based on `searchParams.search` if present. The search should be case-insensitive and match against song titles or authors.
    *   Constructs `basePath` (e.g., `/category/E`).
    *   Passes the (potentially filtered) `songs`, `category.description`, `category.name` (as `categoryName`), `searchParams.search` (as `currentSearchTerm`), and `basePath` to the `CategorySongList` server component.
    *   Renders the main page structure, including `HeaderClientActions` (with `showBackButton={true}`), static category information (title, description), the `CategorySongList` component, and `Footer`.

2.  **Create `components/client/debounced-category-search-input.tsx` (New Client Component):**
    *   Marked with `"use client"`.
    *   Props: `initialSearchTerm?: string`, `categoryName: string`, `basePath: string`, `debounceMs?: number` (defaults to 300ms).
    *   Manages input state (`inputValue`) with `useState`, initialized with `initialSearchTerm`.
    *   Uses `useEffect` and `setTimeout` for debouncing the search input.
    *   Uses `useRouter()` from `next/navigation` to update the URL with the new search term (e.g., `basePath + '?search=' + debouncedValue`), triggering a server-side re-render of `app/category/[letter]/page.tsx`.
    *   Renders an `Input` field styled appropriately for search.

3.  **Create `components/client/song-item-controls.tsx` (New Client Component):**
    *   Marked with `"use client"`.
    *   Props: `song: Song`.
    *   Uses `useTheme()` from `../../lib/theme-context` to get `isDarkMode`.
    *   Manages state for `isPlayingPreview` (`useState<boolean>(false)`) and `isFavorite` (`useState<boolean>(false)`) for the specific song.
    *   Renders:
        *   A "Play Preview" / "Pause Preview" `Button` (conditionally rendered based on `song.hasAudio`).
        *   `WaveformPreview` component (if `song.hasAudio`), passing `isPlayingPreview` and `isDarkMode`.
        *   A "Favorite" / "Unfavorite" `Button` (icon-only).
    *   Handles `handlePlayPausePreview` to toggle `isPlayingPreview`.
    *   Handles `toggleFavorite` to toggle `isFavorite`.

4.  **Refactor `CategorySongList` to be a Server Component (moved to `components/category-song-list.tsx`):**
    *   No `"use client"` directive. This is a Server Component.
    *   Props: `songs: Song[]`, `categoryName: string`, `currentSearchTerm?: string`, `basePath: string`.
    *   Includes the `<DebouncedCategorySearchInput ... />` client component, passing `currentSearchTerm`, `categoryName`, and `basePath`.
    *   Iterates over the `songs` array passed from the page:
        *   For each song, displays static information: code, title, author.
        *   Uses Next.js `<Link href={/song/${song.id}}>` to navigate to the individual song page.
        *   Includes the `<SongItemControls song={song} />` client component for interactive elements (play/pause, favorite) for each song.
    *   Displays a "No songs found matching your search." message if the `songs` array is empty and `currentSearchTerm` is present, or a generic "No songs in this category." if `songs` is empty and no search term.

5.  **Helper Functions in `lib/data/songs.ts`:**
    *   `getCategoryByLetter(letter: string): Category | undefined`: Returns category details.
    *   `getSongsByCategory(categoryName: string): Song[]`: Returns songs for a category.

6.  **Cleanup:**
    *   The original `components/client/category-song-list.tsx` was refactored into the new server component `components/category-song-list.tsx`. The old client version is effectively gone.
    *   The `components/category-songs.tsx` file was deleted in earlier refactoring steps.

**Implications:**
*   In-category song search is "search as you type" with debouncing. User input triggers a URL change, causing `app/category/[letter]/page.tsx` to re-render on the server with the new search filter.
*   Client-side list animations from `framer-motion` (if any were in the original `CategorySongList`) are removed, as the list is now server-rendered.
*   The core list display and filtering logic are server-rendered. Search input handling (debouncing, URL update) and individual song actions (play/pause, favorite) are client-rendered by dedicated small components.

## III. Refactor `SongPage` (`app/song/[id]/page.tsx` and `components/song-lyrics-viewer.tsx`)

**Goal:** Make `app/song/[id]/page.tsx` a Server Component that fetches song data and passes it to a client component for interactive lyrics viewing and controls.

1.  **Identify Client-Side Interactive Parts in the original `components/song-lyrics-viewer.tsx`:**
    *   Theme state and toggle (`useTheme`).
    *   Navigation (`useRouter` for back, previous/next song - though prev/next song logic might be removed or re-evaluated for SSR).
    *   Audio playback controls: `isPlaying`, `currentTime` state, `transpose` state. Handlers for play, pause, seeking (if any), and transpose.
    *   Waveform interaction.
2.  **Convert `app/song/[id]/page.tsx` to a Server Component:**
    *   Fetch song details (lyrics, title, author, code, hasAudio, audioSrc, duration etc.) on the server using `getSongById(params.id)`.
    *   If the song is not found, use `notFound()` from `next/navigation`.
    *   Render the main page structure: `HeaderClientActions` (with `showBackButton={true}`), song title, author, and the `LyricsViewerInteractive` client component.
    *   Pass the fetched `song` object as a prop to `LyricsViewerInteractive`.
    *   Include `Footer`.

3.  **Create `components/client/lyrics-viewer-interactive.tsx` (Client Component):**
    *   Marked with `"use client"`.
    *   Props: `song: Song`.
    *   Uses `useTheme()` for `isDarkMode`.
    *   Manages all client-side state for interactivity:
        *   `transpose: number`
        *   `isPlaying: boolean`
        *   `currentTime: number` (if manual seeking/progress is displayed)
        *   Other states related to audio playback.
    *   Contains all event handlers for:
        *   Transpose controls (`handleTransposeChange`).
        *   Play/pause button (`togglePlayPause`).
        *   Audio events (`onTimeUpdate`, `onEnded`, etc. from the `<audio>` element if directly managed).
    *   Renders:
        *   Transpose controls (`TransposeControl` component).
        *   Play/Pause button.
        *   `Waveform` component, passing `isPlaying`, `isDarkMode`, `audioSrc`, `duration`.
        *   The song lyrics (e.g., `<pre>{song.lyrics}</pre>`).
    *   Handles audio playback logic, potentially using an HTML `<audio>` element directly or via a helper hook if complexity grows.

4.  **Supporting Components (Client, as they use hooks or manage state):**
    *   `components/ui/transpose-control.tsx`: Likely remains a client component if it has internal state or complex event handlers. Props: `transpose`, `onTransposeChange`, `isDarkMode`.
    *   `components/ui/waveform.tsx`: Client component. Props: `audioSrc`, `isPlaying`, `isDarkMode`, `duration`, `onTimeUpdate` (callback), `onSeek` (callback).

5.  **Update `types/song.ts`:**
    *   Ensure the `Song` interface includes all necessary fields like `id`, `title`, `author`, `code`, `lyrics`, `hasAudio`, `audioSrc` (if applicable directly, or derived), and an optional `duration?: number`.

6.  **Delete `components/song-lyrics-viewer.tsx`** after its logic is fully refactored into `app/song/[id]/page.tsx` (for structure and data fetching) and `components/client/lyrics-viewer-interactive.tsx` (for client-side interactions).

7.  **Helper function `getSongById` in `lib/data/songs.ts`:**
    *   Ensured this function exists and returns a `Song` object or `undefined`.

**Clarification on `LyricsViewerInteractive`:** This component *must* be a client component because it handles user interactions, manages state with `useState` and `useEffect` (for audio, transpose), and uses the `useTheme` client hook. The parent `app/song/[id]/page.tsx` is the Server Component responsible for fetching the song data and passing it down.

## IV. General Considerations & Helper Components

*   **`Footer.tsx`:** Ensure `Footer` is either a Server Component or a self-contained Client Component that doesn't rely on props that would prevent its parent from being a Server Component. If it uses `useTheme` or other client hooks, it needs `"use client"`.
*   **Styling:** Tailwind classes will continue to work in both Server and Client Components.
*   **Data Fetching:** For this phase, we're assuming data (`allSongs`, `categories`) is still sourced from `lib/data/songs.ts`. If this data were to come from an external API or database, data fetching in Server Components would use `async/await` with `fetch`.
*   **`useTheme` context:** Client components that need the theme will continue to use `useTheme()`. Server components cannot use context directly. If a server-rendered part needs to be aware of the theme (e.g., for initial HTML class), this would typically be handled at the root layout level. For now, client components will manage their theme-dependent styles.
*   **Error Handling and Loading States:** For Server Components, consider `error.tsx` and `loading.tsx` conventions in Next.js. Client components will manage their own loading/error states for client-side operations.
