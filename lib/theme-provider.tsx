"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { useCallback, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

/* ------------------------------------------------------------------ *
 *  Theming
 *
 *  next-themes handles the hard parts: it follows the system setting by
 *  default, remembers an explicit choice, and injects a tiny blocking script
 *  into <head> that applies the class before first paint. That last part is
 *  what stops the wrong theme flashing on load — there is no React state
 *  involved in the initial decision.
 * ------------------------------------------------------------------ */

export const THEME_STORAGE_KEY = "jjdj-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      storageKey={THEME_STORAGE_KEY}
      // Let our own transitions run; next-themes' blanket transition killer
      // would also kill the tile flip and the circular reveal.
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}

/** Minimal typing for the View Transitions API where TS lib may not have it. */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

export type ThemeOrigin = { x: number; y: number };

/**
 * Toggles the theme with a circular reveal that spreads out from the point
 * that was clicked.
 *
 * The reveal is a View Transition: the browser snapshots the page before and
 * after the class changes and we clip the "after" snapshot to a growing
 * circle. `flushSync` is required because next-themes applies the class in a
 * React effect — without it the snapshot would be taken before the DOM
 * actually changed and the transition would have nothing to reveal.
 *
 * Where the API is unavailable (Safari before 18, older Firefox) it falls
 * back to an instant switch, and it is skipped entirely for reduced motion.
 */
export function useThemeTransition() {
  const { resolvedTheme, setTheme } = useTheme();
  const reduce = useReducedMotion();

  const toggleTheme = useCallback(
    (
      origin?: ThemeOrigin,
      /**
       * The button whose four logo tiles should flip in 3D. The marker
       * attribute is added here and removed once the transition settles, so
       * only one element in the document ever carries the tile names.
       */
      flipTilesOn?: HTMLElement | null,
    ) => {
      const next = resolvedTheme === "dark" ? "light" : "dark";
      const doc = document as ViewTransitionDocument;

      if (reduce || typeof doc.startViewTransition !== "function") {
        setTheme(next);
        return;
      }

      const x = origin?.x ?? window.innerWidth - 96;
      const y = origin?.y ?? 72;

      flipTilesOn?.setAttribute("data-vt-tiles", "true");

      let transition: { ready: Promise<void>; finished: Promise<void> };
      try {
        transition = doc.startViewTransition(() => {
          flushSync(() => setTheme(next));
        });
      } catch {
        flipTilesOn?.removeAttribute("data-vt-tiles");
        setTheme(next);
        return;
      }

      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const cleanup = () => flipTilesOn?.removeAttribute("data-vt-tiles");

      void transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: DURATION.section * 1000,
            easing: `cubic-bezier(${EASE.join(", ")})`,
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });

      void transition.finished.then(cleanup, cleanup);
    },
    [reduce, resolvedTheme, setTheme],
  );

  return useMemo(
    () => ({
      toggleTheme,
      resolvedTheme,
      isDark: resolvedTheme === "dark",
    }),
    [resolvedTheme, toggleTheme],
  );
}
