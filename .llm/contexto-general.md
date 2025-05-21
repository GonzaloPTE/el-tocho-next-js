# Project Overview

## Project Goal

This project is a digital songbook (cantoral) application for Christian music in Spanish. It aims to provide users with access to song lyrics, chords, and potentially audio recordings or links to them.

## Project Structure Overview

### Root Level

The project root contains standard Next.js configuration files and directories:

*   **Configuration Files:**
    *   `next.config.mjs`: Next.js configuration.
    *   `package.json`: Project dependencies and scripts.
    *   `package-lock.json`: Exact versions of dependencies.
    *   `tsconfig.json`: TypeScript configuration.
    *   `tailwind.config.ts`: Tailwind CSS configuration.
    *   `postcss.config.mjs`: PostCSS configuration.
    *   `eslint.config.mjs`: ESLint configuration (using the new flat config format).
    *   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
    *   `components.json`: Likely for Shadcn UI configuration.
    *   `next-env.d.ts`: TypeScript declarations for Next.js.
*   **Core Directories:**
    *   `app/`: Contains the application's routes, pages, and layouts (App Router).
    *   `components/`: Likely for reusable UI components.
    *   `lib/`: For utility functions, configuration, and data modules.
    *   `public/`: Static assets (though not explicitly listed, it's a standard Next.js directory, I'll confirm its presence later if needed).
    *   `types/`: TypeScript type definitions.
*   **Development & Build Directories:**
    *   `.next/`: Next.js build output.
    *   `node_modules/`: Project dependencies.
*   **Version Control:**
    *   `.git/`: Git repository data.
*   **Other:**
    *   `.llm/`: Likely for LLM-related context or configuration (contains this file).
    *   `README.md`: Project documentation.
    *   `.cursorrules`: Configuration for the Cursor editor.
    *   `requirements/`: Contains project requirement documents.
        *   `ui-style-guide.md`: A markdown file detailing UI style guidelines.

### `app/` Directory

The `app/` directory, central to the Next.js App Router, contains the following:

*   **Root Layout:**
    *   `layout.tsx`: Defines the main layout for the entire application.
*   **Root Page:**
    *   `page.tsx`: The main entry page for the `/` route.
*   **Styling:**
    *   `globals.css`: Global CSS styles.
*   **Static Assets:**
    *   `favicon.ico`: The application's favicon.
*   **Sub-directories (Routes):**
    *   `category/`: Represents a route segment, likely for `/category/...`.
    *   `song/`: Represents a route segment, likely for `/song/...`.
    *   `fonts/`: Contains local font files.
        *   `GeistVF.woff`: Variable font file.
        *   `GeistMonoVF.woff`: Monospaced variable font file.
        These are likely being used with `next/font/local` for optimized font loading.

#### `app/category/` Route

*   Contains a dynamic route segment: `[letter]/`. This suggests routes like `/category/a`, `/category/b`, etc., where `letter` is a parameter.
    *   `app/category/[letter]/page.tsx`: The page component for displaying content for a specific letter category.

#### `app/song/` Route

*   Contains a dynamic route segment: `[id]/`. This indicates routes like `/song/123`, `/song/abc`, etc., where `id` is a unique identifier for a song.
    *   `app/song/[id]/page.tsx`: The page component for displaying details of a specific song.

### `components/` Directory

This directory houses the reusable React components:

*   **Page-Specific Components:**
    *   `home-page.tsx`: Component likely used for the main home page (`app/page.tsx`).
    *   `category-songs.tsx`: Component probably used to display songs within a specific category, likely related to the `app/category/` route.
    *   `song-lyrics-viewer.tsx`: Component for displaying song lyrics, likely related to the `app/song/` route.
*   **Layout Components:**
    *   `Footer.tsx`: A common footer component.
*   **Sub-directory:**
    *   `ui/`: This directory likely contains generic, reusable UI elements, potentially Shadcn UI components or other custom base UI components.

#### `components/ui/` Sub-directory

This sub-directory contains generic UI components, likely based on Shadcn UI or a similar library:

*   `button.tsx`: A button component.
*   `input.tsx`: An input field component.
*   `select.tsx`: A select (dropdown) component.
*   `slider.tsx`: A slider component.
*   `custom-slider.tsx`: Possibly a variation or extension of the standard slider.
*   `transpose-control.tsx`: A UI control related to transposing, likely musical notes.
*   `waveform.tsx`: A component for displaying waveforms (e.g., audio).
*   `waveform-preview.tsx`: A component likely for a smaller preview of a waveform.

### `lib/` Directory

The `lib/` directory contains shared utilities, configuration, data modules, and potentially application-wide logic:

*   `utils.ts`: A common place for utility functions used across the application. This is likely where the `cn` utility function for Tailwind class merging (often used with Shadcn UI) would be defined.
*   `theme-context.tsx`: Suggests the implementation of a theme (e.g., light/dark mode) using React Context.

#### `lib/config/` Sub-directory
*   `site.ts`: Contains site-wide configuration constants, like `siteName`.

#### `lib/data/` Sub-directory
*   `songs.ts`: Contains application data related to songs, such as `categories`, `allSongs`, and the function `getFeaturedSongs()` which randomly selects featured songs.

### `types/` Directory

This directory holds TypeScript type definitions for the application:

*   `song.ts`: Contains type definitions related to "song" data structures (e.g., `Song`, `Category`). The redundant `FeaturedSong` interface was removed.
