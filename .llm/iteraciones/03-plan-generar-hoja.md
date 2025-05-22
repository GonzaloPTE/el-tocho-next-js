# Plan: Printable Favorites Sheet

## 1. Objective

Create a dedicated, printable web page (`/hoja-favoritos`) that displays a list of the user's favorited songs. The page should be optimized for A4 paper printing, allowing users to generate a physical song sheet.

## 2. Trigger & Navigation

*   A new button, "Imprimir Hoja de Favoritos" (or similar), will be added to the "Canciones Favoritas" section on the homepage (`app/page.tsx`).
*   Clicking this button will navigate the user to the `/hoja-favoritos` route.

## 3. `/hoja-favoritos` Page (`app/hoja-favoritos/page.tsx`)

*   **Client Component:** This page must be a client component (`"use client"`) because it needs to:
    *   Access `localStorage` to retrieve the list of favorite song IDs.
    *   Potentially manage client-side state for song reordering.
    *   Trigger `window.print()`.
*   **Data Fetching & Display:**
    *   On mount, it will read favorite song IDs from `localStorage` (using `getFavoriteSongIdsFromStorage` from `lib/client-utils.ts`).
    *   It will then need access to `allSongs` data to filter and get the details of these favorited songs. This could be achieved by:
        *   Fetching `allSongs` within this client component (if small enough or if a client-side data store is implemented).
        *   A more robust approach might involve a new API route that accepts song IDs and returns song details, but for simplicity, we can try to make `allSongs` available client-side if not too large or filter from a global context if available. For now, assume we can filter `allSongs` data that's made available to the component.
    *   It will render a list of these songs using a new `PrintableSongItem` component.
*   **Layout & Styling:**
    *   **No Header/Footer:** The standard `PageHeader` and `Footer` components will be omitted to maximize printable area (achieved by not including them in `app/hoja-favoritos/page.tsx`).
    *   **Print-Optimized:** Styles will focus on readability and A4 paper constraints.
        *   Use Tailwind CSS `print:` variants extensively (e.g., `print:hidden`, `print:text-black`, `print:bg-white`).
        *   Font sizes, margins, and line spacing will be adjusted for print.
        *   CSS for multi-column lyrics will be adapted for A4 width (e.g., fixed 2 columns for long songs).
    *   **Page Breaks:** CSS `break-after: auto;` and `break-inside: avoid;` are used in `PrintableSongItem`.
*   **Controls (Hidden on Print):**
    *   **"Imprimir" Button:** Triggers `window.print()`. Hidden via `print:hidden`.
    *   **Reorder Controls (Optional - Phase 2):** If implemented, these would allow users to drag-and-drop or use "move up/down" buttons to change the song order. These controls would also be `print:hidden`. For Phase 1, songs can be listed by a default order (e.g., order they were favorited or alphabetical).
    *   **Back Button:** A simple link to navigate back to the homepage or the previous page. Hidden via `print:hidden`.

## 4. New Components

*   **`components/client/printable-song-item.tsx`:**
    *   Receives a `song: Song` object as a prop.
    *   Displays song `code`, `title`, and `author` prominently at the top.
    *   Renders the `lyrics` using a multi-column layout for longer songs, optimized for A4 width. This logic will be adapted from `LyricsViewerInteractive` but simplified (no interactive features like transpose).
    *   Uses `font-mono` for lyrics for consistent character spacing and chord alignment.
    *   Styled for maximum clarity and ink-saving (e.g., no unnecessary backgrounds or colors for the printed version).
    *   Will have a root `div` with `break-inside: avoid;` and potentially `break-after: auto;` to help with page flow.

*   **`app/hoja-favoritos/layout.tsx` (Optional but Recommended - Phase 2):**
    *   A dedicated layout for the `/hoja-favoritos` route.
    *   This layout would be extremely minimal, essentially just rendering `{children}` within a `<html>` and `<body>` tag.
    *   It would *not* include the `ThemeProvider` or global styles meant for the main site if they interfere with print styles. Or, it could have its own minimal `ThemeProvider` if absolutely necessary for basic dark/light mode consistency *before* print.
    *   This ensures that global styles from the main `app/layout.tsx` (like backgrounds, complex font loading for screen) don't interfere with the print view.
    *   Alternatively, if a separate layout is too much, ensure the `app/hoja-favoritos/page.tsx` itself overrides any conflicting global styles for print.

## 5. Modifications to Existing Components

*   **`components/client/featured-song-navigation.tsx`:**
    *   Add a new "Imprimir Hoja de Favoritos" button.
    *   This button will be a Next.js `<Link href="/hoja-favoritos">` or use `router.push('/hoja-favoritos')`.
    *   It should only be visible if there are favorite songs.

## 6. Styling for A4 Print

*   **Page Size:** Standard A4 dimensions (210mm x 297mm). Browsers handle this with `@media print`.
*   **Margins:** Rely on browser defaults or set minimal margins using `@page` CSS rule if necessary.
    ```css
    @page {
      size: A4;
      margin: 15mm; /* Example margin */
    }
    ```
*   **Typography:**
    *   Serif or sans-serif fonts that are highly legible (e.g., Times New Roman, Arial for general text if not using existing fonts).
    *   Monospaced font for lyrics and chords (already using `font-mono`).
    *   Appropriate font sizes (e.g., 10pt-12pt for main text, larger for titles).
*   **Columns for Lyrics:**
    *   For long songs, lyrics split into 2 columns. Test width carefully.
    *   CSS: `column-count: 2; column-gap: 1cm;` (example).
*   **Ink Saving:**
    *   Ensure all text is black (`print:text-black`).
    *   Ensure all backgrounds are white (`print:bg-white`).
    *   Avoid shadows or complex visual effects in the print version.

## 7. Data Handling for `allSongs` on Client-Side Page

*   The `app/hoja-favoritos/page.tsx` needs `allSongs`.
*   **Option 1 (Simpler for now):** Import `allSongs` directly from `@/lib/data/songs`. This is feasible if `allSongs` is not excessively large and is structured as a simple array export. This avoids needing a new API route for this specific feature initially.
*   **Option 2 (More Scalable - Phase 2):** Create an API route `app/api/songs/route.ts` that can return all songs or specific songs by ID. The client page would then fetch from this. This is better for larger datasets or if data fetching needs to be more dynamic.
*   **Decision for Phase 1:** Attempt direct import of `allSongs`.

## 8. Development Phases

*   **Phase 1 (Core Functionality) - COMPLETED:**
    1.  **DONE:** Create basic `app/hoja-favoritos/page.tsx` (client component).
    2.  **DONE:** Implement logic to get favorite IDs from localStorage and filter `allSongs` (direct import).
    3.  **DONE:** Create `components/client/printable-song-item.tsx` for basic song display (title, author, lyrics - single column initially).
    4.  **DONE:** Integrate `PrintableSongItem` into `hoja-favoritos/page.tsx`.
    5.  **DONE:** Add "Imprimir Hoja de Favoritos" button to `FeaturedSongNavigation`.
    6.  **DONE:** Basic print styling: hide non-print elements, ensure text is black/bg white. Add `window.print()` button. Added global print styles to `globals.css`.
    7.  **DONE:** Implement multi-column layout for long lyrics in `PrintableSongItem` for A4.
    8.  **DONE:** Basic page break management (`break-after: auto; break-inside: avoid;`).
*   **Phase 2 (Enhancements - Optional):**
    1.  Implement song reordering on `/hoja-favoritos` page (e.g., drag-and-drop).
    2.  Refine print styles further (margins, precise font control using `@page`).
    3.  Add a dedicated minimal `app/hoja-favoritos/layout.tsx`.
    4.  Consider API route for fetching song data if direct import becomes problematic.


This plan provides a structured approach to developing the printable favorites sheet.
