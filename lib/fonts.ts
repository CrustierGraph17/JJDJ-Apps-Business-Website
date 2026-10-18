import { Inter, JetBrains_Mono, Nunito_Sans } from "next/font/google";

/**
 * Typography.
 *
 * Headings  → Nunito Sans (rounded geometric, up to weight 1000) so the page
 *             headings share the geometry of the JJDJ wordmark.
 * Body      → Inter, 16–18px, generous line-height.
 * Mono      → JetBrains Mono for eyebrows, version numbers and stats.
 *
 * All three are self-hosted by next/font at build time (no layout shift, no
 * render-blocking request to Google) and exposed as CSS variables that
 * globals.css maps into Tailwind's theme.
 */

export const display = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800", "900", "1000"],
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "menlo", "monospace"],
});

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
