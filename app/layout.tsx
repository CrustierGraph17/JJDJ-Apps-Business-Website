import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { absoluteUrl } from "@/lib/utils";
import { organizationJsonLd } from "@/lib/json-ld";
import { site } from "@/data/site";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TabTitle } from "@/components/layout/tab-title";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: absoluteUrl("/") }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "JJDJ",
    "Notle",
    "Perth",
    "Western Australia",
    "study app",
    "student software",
    "lecture transcription",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: absoluteUrl("/"),
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  // Light and dark favicons, so the mark reads against either browser chrome.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      {
        url: "/brand/favicon-on-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F7F4" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

/**
 * Runs before first paint.
 *
 * Marks a returning visitor — or anyone who prefers reduced motion — so the
 * intro preloader is hidden by CSS before React hydrates. That is what stops
 * the overlay flashing on every navigation, given it has to be rendered on the
 * server to avoid a flash of the hero instead.
 *
 * (The theme class itself is handled by next-themes' own blocking script.)
 */
const bootScript = `
(function () {
  try {
    var root = document.documentElement;
    var seen = false;
    try { seen = window.sessionStorage.getItem('jjdj:intro') === 'seen'; } catch (e) {}
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || calm) root.setAttribute('data-preloader', 'seen');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" dir="ltr" suppressHydrationWarning className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          // Organization + WebSite, shared by every page.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <TabTitle />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
