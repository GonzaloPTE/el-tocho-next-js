# Plan de Optimización SEO para El Tocho Next.js

Este documento detalla las estrategias y acciones para mejorar el posicionamiento en buscadores (SEO) de la aplicación de cancionero digital "El Tocho Next.js".

## 1. Optimización de la Estructura de URLs (Slugs)

**Objetivo:** Reemplazar los URLs basados en IDs por slugs descriptivos y amigables para SEO, tanto para categorías como para canciones, utilizando segmentos de URL en español y plural.

*   **Categorías:**
    *   Formato actual (ejemplo): `/category/A`
    *   Nuevo formato (ejemplo): `/categorias/canciones-infantiles`, `/categorias/coros-cristianos`
    *   El segmento de ruta cambiará de `app/category/[letter]/page.tsx` a `app/categorias/[categorySlug]/page.tsx`.
*   **Canciones:**
    *   Formato actual (ejemplo): `/song/123`
    *   Nuevo formato (ejemplo): `/canciones/la-bamba-ritchie-valens`, `/canciones/cielito-lindo-quirino-mendoza`
    *   El segmento de ruta cambiará de `app/song/[id]/page.tsx` a `app/canciones/[songSlug]/page.tsx`.

**Pautas para Slugs:**
*   Generados a partir del título (y autor para canciones, si es necesario para unicidad).
*   En minúsculas.
*   Palabras separadas por guiones (`-`).
*   Eliminar caracteres especiales y acentos (o transliterar a equivalentes sin acento).
*   Asegurar unicidad. Se puede añadir un sufijo numérico incremental si hay colisiones (ej. `mi-cancion-2`).

**Pasos de Implementación para Slugs:**

1.  **Definir Función de "Slugify":**
    *   Crear o importar una función en `lib/utils.ts` (e.g., `slugify(text: string): string`) que convierta texto a formato slug (lowercase, guiones, sin acentos/especiales). Una librería como `slugify` puede ser útil.
2.  **Actualizar Tipos de Datos:**
    *   Añadir `slug: string` a las interfaces `Song` y `Category` en `types/index.ts` o `types/song.ts` y `types/category.ts`.
3.  **Actualizar Datos Existentes:**
    *   Modificar `lib/data/songs.ts`:
        *   Añadir un campo `slug` a cada objeto `category` en el array `categories`.
        *   Añadir un campo `slug` a cada objeto `song` en el array `allSongs`. Generar estos slugs usando la función `slugify`.
4.  **Modificar Funciones de Acceso a Datos:**
    *   En `lib/data/songs.ts`:
        *   Crear `getSongBySlug(slug: string): Song | undefined`.
        *   Crear `getCategoryBySlug(slug: string): Category | undefined`.
        *   Actualizar las funciones que devuelven listas si es necesario para que también incluyan slugs si se usan para generar links.
        *   Reemplazar usos de `getSongById` y `getCategoryByLetter` por las nuevas funciones basadas en slug.
5.  **Actualizar Rutas Dinámicas de Next.js:**
    *   Renombrar `app/song/[id]/page.tsx` a `app/canciones/[songSlug]/page.tsx`. Actualizar `params.id` a `params.songSlug`.
    *   Renombrar `app/category/[letter]/page.tsx` a `app/categorias/[categorySlug]/page.tsx`. Actualizar `params.letter` a `params.categorySlug`.
6.  **Actualizar Enlaces Internos:**
    *   Revisar todos los componentes `<Link href=\"...\">` y `router.push()` para que usen las nuevas rutas con slugs.
    *   Ej: `<Link href={/canciones/${song.slug}} />`
    *   Ej: `<Link href={/categorias/${category.slug}} />`
7.  **Generación de Rutas Estáticas (si aplica con `generateStaticParams`):**
    *   Si se usa `generateStaticParams` en las páginas de categoría o canción, actualizarla para que genere `params` con `songSlug` y `categorySlug` respectivamente.

## 2. Metadatos Dinámicos y Específicos por Página

**Objetivo:** Proveer a los motores de búsqueda y redes sociales información precisa y atractiva sobre cada página.

*   **Títulos (`<title>`):**
    *   Utilizar la API `metadata` de Next.js en cada `page.tsx`.
    *   **Homepage:** `El Tocho Cancionero - Acordes y Letras de Canciones`
    *   **Página de Categoría:** `Canciones de [Nombre de Categoría] - Acordes y Letras | El Tocho`
    *   **Página de Canción:** `[Título de Canción] - [Autor] - Acordes y Letras | El Tocho`
*   **Meta Descripciones (`<meta name=\"description\">`):**
    *   Únicas y persuasivas para cada página (aprox. 155-160 caracteres).
    *   **Homepage:** "Encuentra acordes y letras de miles de canciones en español e inglés. Explora nuestro cancionero digital y toca tus canciones favoritas."
    *   **Página de Categoría:** "Descubre letras y acordes de canciones de [Nombre de Categoría]. Encuentra [Ejemplo Canción 1], [Ejemplo Canción 2] y más en El Tocho."
    *   **Página de Canción:** "Letra y acordes de '[Título de Canción]' por [Autor]. Aprende a tocar [Título de Canción] en guitarra, piano u otro instrumento."
*   **Open Graph (para Facebook, LinkedIn, etc.):**
    *   `og:title`: Título de la página.
    *   `og:description`: Descripción de la página.
    *   `og:image`: URL a una imagen representativa (logo del sitio, imagen de categoría, imagen relacionada con la canción si es posible).
    *   `og:url`: URL canónica de la página.
    *   `og:type`: `website` para homepage, `article` o `music.song` para canciones.
    *   `og:site_name`: `El Tocho Cancionero`
*   **Twitter Cards:**
    *   `twitter:card`: `summary_large_image`
    *   `twitter:title`: Título de la página.
    *   `twitter:description`: Descripción de la página.
    *   `twitter:image`: URL a una imagen representativa.
*   **URL Canónica (`<link rel=\"canonical\">`):**
    *   Next.js suele manejar esto bien, pero verificar que se genere la URL canónica correcta, especialmente con la introducción de slugs y las nuevas rutas (`/canciones/...`, `/categorias/...`).

## 3. Datos Estructurados (Schema.org)

**Objetivo:** Mejorar la forma en que los motores de búsqueda entienden y muestran el contenido en los resultados de búsqueda (Rich Snippets).

*   Implementar JSON-LD en las páginas relevantes:
    *   **`WebSite` (en `layout.tsx` o `app/page.tsx`):**
        *   Nombre del sitio, URL.
        *   Potencial para `SearchAction` (Sitelinks Search Box).
    *   **`BreadcrumbList` (en `page.tsx` de categoría y canción):**
        *   Para mostrar la ruta de navegación en los resultados de búsqueda.
        *   Ej: Inicio > Categorias > [Nombre Categoría] > Canciones > [Nombre Canción]. (Adaptar a la estructura final)
    *   **`MusicComposition` o `Song` (en `app/canciones/[songSlug]/page.tsx`):**
        *   `@type`: `Song` (subtipo de `MusicComposition`)
        *   `name`: Título de la canción.
        *   `byArtist`: Nombre del artista/autor.
        *   `lyrics`: La letra de la canción (puede ser un objeto `CreativeWork`).
        *   `inLanguage`: Código del idioma (ej. "es", "en").
        *   `url`: URL de la página de la canción (ej. `https://tusitio.com/canciones/[songSlug]`)
    *   **`ItemList` (en `app/categorias/[categorySlug]/page.tsx`):**
        *   Para listar las canciones dentro de una categoría.
        *   Cada `itemListElement` puede ser un `ListItem` que referencie una `Song`.

## 4. Contenido y SEO On-Page

**Objetivo:** Asegurar que el contenido de la página esté bien estructurado y optimizado.

*   **Jerarquía de Encabezados:**
    *   Un solo `<h1>` por página (título principal).
    *   Uso correcto de `<h2>`, `<h3>`, etc., para subsecciones.
*   **Optimización de Imágenes:**
    *   `alt` text descriptivo para todas las imágenes (logo, íconos si son significativos). (Ya cubierto en parte por WebP y optimización de tamaño).
*   **Enlaces Internos:**
    *   Asegurar una buena estructura de enlaces internos.
    *   Desde la homepage a categorías.
    *   Desde categorías a canciones.
    *   Desde canciones a otras canciones relacionadas (si aplica, ej. \"otras canciones de [Autor]\").
    *   Breadcrumbs ayudan a esto.
*   **Calidad del Contenido de Letras:**
    *   Asegurar que las letras sean precisas y bien formateadas.

## 5. Sitemap XML

**Objetivo:** Facilitar a los motores de búsqueda el descubrimiento de todas las páginas indexables.

*   Generar un `sitemap.xml` dinámico usando las capacidades de Next.js.
*   Incluir:
    *   Homepage.
    *   Todas las páginas de categorías (con URLs de slug, ej. `/categorias/[categorySlug]`).
    *   Todas las páginas de canciones (con URLs de slug, ej. `/canciones/[songSlug]`).
*   Asegurar que el sitemap se actualice cuando se añadan/modifiquen canciones o categorías.

## 6. Archivo `robots.txt`

**Objetivo:** Indicar a los crawlers qué partes del sitio pueden o no rastrear.

*   Crear/revisar `public/robots.txt`.
*   Permitir el rastreo de todas las páginas de contenido importantes (homepage, categorías, canciones).
    \`\`\`
    User-agent: *
    Allow: /
    Disallow: /api/ # Ejemplo, si hay rutas de API que no deben ser indexadas
    Sitemap: [URL completa a sitemap.xml]
    \`\`\`
*   Considerar si hay URLs parametrizadas que no deberían indexarse (aunque con el filtrado SSR en `CategoryPage`, esto es menos problemático).

## 7. Rendimiento y Accesibilidad (A11y)

**Objetivo:** Mantener y mejorar el rendimiento y la accesibilidad, factores indirectos de SEO.

*   **Core Web Vitals (LCP, CLS, FID):** Continuar optimizando. El refactor a SSR es un gran paso.
*   **Accesibilidad:** Asegurar que el sitio sea navegable y usable por todos, incluyendo el uso de atributos ARIA donde sea necesario.

Este plan proporciona una hoja de ruta completa para mejorar significativamente el SEO del sitio.
