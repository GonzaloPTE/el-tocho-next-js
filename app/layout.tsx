import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from '@/lib/theme-context'
import { PlaylistProvider } from '@/components/client/playlist-context';
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: "Cantoral El Tocho - Acordes y Letras de Canciones Cristianas",
    template: `%s | Cantoral El Tocho`,
  },
  description: "Encuentra acordes y letras de miles de canciones cristianas en español. Explora nuestro cancionero digital El Tocho y toca tus canciones favoritas.",
  // Basic OpenGraph and Twitter metadata, can be overridden by specific pages
  openGraph: {
    title: "Cantoral El Tocho - Acordes y Letras de Canciones Cristianas",
    description: "Encuentra acordes y letras de miles de canciones cristianas en español.",
    url: siteBaseUrl,
    siteName: "Cantoral El Tocho",
    images: [
      {
        url: `${siteBaseUrl}/images/logo-1x1-1k.png`, // Default OG image
        width: 1024,
        height: 1024,
        alt: "Cantoral El Tocho Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cantoral El Tocho - Acordes y Letras de Canciones Cristianas",
    description: "Encuentra acordes y letras de miles de canciones cristianas en español.",
    images: [`${siteBaseUrl}/images/logo-1x1-1k.png`], // Default Twitter image
  },
  // Add other metadata like icons, manifest, etc. here if needed
  icons: { icon: '/favicon.ico' },
  // manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cantoral El Tocho",
    "url": siteBaseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteBaseUrl}/canciones?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-21GHD2R9W8"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-21GHD2R9W8');
        `}
      </Script>
      <ThemeProvider>
        <PlaylistProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100`}
          >
            {children}
          </body>
        </PlaylistProvider>
      </ThemeProvider>
    </html>
  );
}
