"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/lib/theme-provider";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { Preloader } from "@/components/layout/preloader";
import { PageTransition } from "@/components/motion/page-loader";
import { EASE } from "@/lib/motion";

/* ------------------------------------------------------------------ *
 *  Chrome that nobody needs in the first frame.
 *
 *  The command palette, the cookie banner, the toast host, the custom
 *  cursor and the keyboard-shortcut listener are all overlays: invisible
 *  until the visitor interacts. Loading them with `dynamic` keeps their
 *  code (and their dependencies — Radix dialog, sonner, three springs)
 *  out of the bundle the browser has to parse before the hero becomes
 *  interactive. They stream in immediately afterwards, in parallel.
 * ------------------------------------------------------------------ */

const CommandPalette = dynamic(
  () => import("@/components/layout/command-palette").then((mod) => mod.CommandPalette),
  { ssr: false },
);

const CookieBanner = dynamic(
  () => import("@/components/layout/cookie-banner").then((mod) => mod.CookieBanner),
  { ssr: false },
);

const CustomCursor = dynamic(
  () => import("@/components/layout/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

const Shortcuts = dynamic(
  () => import("@/components/layout/shortcuts").then((mod) => mod.Shortcuts),
  { ssr: false },
);

const Toaster = dynamic(
  () => import("@/components/ui/toaster").then((mod) => mod.Toaster),
  { ssr: false },
);

/**
 * Everything that has to run on the client, mounted once near the root.
 *
 * Reduced motion is handled per component with `useReducedMotion` rather than
 * MotionConfig's `reducedMotion="user"`. That global switch strips transform
 * and filter values from the client's inline styles only, which the server
 * cannot mirror — on hydration the server's transform would survive with no
 * animation left to clear it, leaving revealed content permanently offset and
 * blurred. Keeping the client's style map identical to the server's is what
 * makes the reveals settle correctly for everyone.
 *
 * The preloader stays server-rendered on purpose — it has to be the first
 * thing painted so the hero never flashes behind it.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig transition={{ duration: 0.35, ease: EASE }}>
        <SmoothScroll />
        <Preloader />
        <CustomCursor />
        <Shortcuts />

        <PageTransition>
          {children}
          <CookieBanner />
        </PageTransition>

        <CommandPalette />
        <Toaster />
      </MotionConfig>
    </ThemeProvider>
  );
}
