"use client";

import { useAnimate, useReducedMotion } from "framer-motion";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogoGrid } from "@/components/brand/logo-grid";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  PageLoader
 *
 *  What a visitor sees while a route is being fetched: the JJDJ mark
 *  assembling itself in the middle of a full-screen sheet. No panels,
 *  no quadrants — one sheet, one mark, and a hairline that travels
 *  underneath it for as long as the wait lasts.
 *
 *  The mark is the loading animation: its four tiles fly in from their
 *  corners one after another, then the grid breathes gently until the
 *  route lands, at which point the whole thing fades and the new page
 *  is already painted underneath.
 *
 *  Imperative (cover / reveal) so the router, the command palette and
 *  any other caller can drive it. Under prefers-reduced-motion it does
 *  nothing at all and navigation is a plain push.
 * ------------------------------------------------------------------ */

export type PageLoaderHandle = {
  /** Bring the loader in. Resolves once it is fully on screen. */
  cover: () => Promise<void>;
  /** Take the loader away. Resolves once it is fully clear. */
  reveal: () => Promise<void>;
  isCovered: () => boolean;
};

const SHEET_IN = 0.24;
const SHEET_OUT = 0.34;
const MARK_IN = 0.4;
const TILE_IN = 0.36;
const TILE_STAGGER = 0.05;
const TILE_OUT = 0.2;

/** The corner each logo tile flies in from, in viewBox units, reading order. */
const TILE_FROM = [
  { x: -34, y: -34 },
  { x: 34, y: -34 },
  { x: -34, y: 34 },
  { x: 34, y: 34 },
] as const;

/**
 * How long the loader stays readable before it is allowed to leave. A route
 * that resolves in 150ms would otherwise produce a one-frame flash of a logo,
 * which reads as a glitch rather than as feedback.
 */
const MIN_VISIBLE_MS = 340;

/**
 * Escape hatch: the sheet covers the viewport, so if its fade cannot finish —
 * throttled tab, paused compositor — the visitor would be left staring at it.
 * Force it clear from a timer instead of trusting animation frames.
 */
const REVEAL_GUARD_MS = 1400;

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export const PageLoader = forwardRef<PageLoaderHandle, { className?: string }>(
  function PageLoader({ className }, ref) {
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const reduce = useReducedMotion();
    const coveredRef = useRef(false);
    const shownAtRef = useRef(0);
    // Bumped by every sweep, so a slow reveal knows it has been overtaken by a
    // newer cover and must not clear the overlay out from under it.
    const generationRef = useRef(0);
    const controlsRef = useRef<{ stop: () => void }[]>([]);

    const stopAll = useCallback(() => {
      controlsRef.current.forEach((controls) => controls.stop());
      controlsRef.current = [];
    }, []);

    /** Hide the overlay by writing styles, for when animation frames are gone. */
    const forceClear = useCallback(() => {
      scope.current
        ?.querySelectorAll<HTMLElement>("[data-loader-sheet], [data-loader-mark]")
        .forEach((el) => {
          el.style.opacity = "0";
        });
    }, [scope]);

    const cover = useCallback(async () => {
      if (reduce || coveredRef.current) return;

      coveredRef.current = true;
      shownAtRef.current = performance.now();
      const generation = ++generationRef.current;

      // A reveal may still be in flight from a previous click; stop it so the
      // two are not animating the same opacity at once.
      stopAll();

      const controls = [
        animate(
          "[data-loader-sheet]",
          { opacity: [0, 1] },
          { duration: SHEET_IN, ease: EASE },
        ),
        animate(
          "[data-loader-mark]",
          { opacity: [0, 1], scale: [0.88, 1] },
          { duration: MARK_IN, ease: EASE, delay: 0.04 },
        ),
        ...TILE_FROM.map((from, index) =>
          animate(
            `[data-loader-mark] [data-tile="${index}"]`,
            {
              x: [from.x, 0],
              y: [from.y, 0],
              scale: [0.45, 1],
              opacity: [0, 1],
            },
            {
              duration: TILE_IN,
              ease: EASE,
              delay: 0.1 + index * TILE_STAGGER,
            },
          ),
        ),
      ];
      controlsRef.current = controls;
      await Promise.all(controls);
      if (generation !== generationRef.current) return;

      // Assembled and waiting: breathe, and let the hairline travel.
      controlsRef.current = [
        animate(
          "[data-loader-breathe]",
          { scale: [1, 1.05, 1] },
          { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        ),
        animate(
          "[data-loader-bar]",
          { x: ["-120%", "320%"] },
          { duration: 1.15, repeat: Infinity, ease: "linear" },
        ),
      ];
    }, [animate, reduce, stopAll]);

    const reveal = useCallback(async () => {
      if (!coveredRef.current) return;

      // Let the mark be read before it leaves.
      const elapsed = performance.now() - shownAtRef.current;
      if (elapsed < MIN_VISIBLE_MS) {
        await wait(MIN_VISIBLE_MS - elapsed);
        if (!coveredRef.current) return;
      }

      const generation = ++generationRef.current;
      stopAll();

      const guard = window.setTimeout(() => {
        if (generation !== generationRef.current) return;
        stopAll();
        forceClear();
        coveredRef.current = false;
      }, REVEAL_GUARD_MS);

      const controls = [
        animate(
          "[data-loader-mark]",
          { opacity: [1, 0], scale: [1, 0.94] },
          { duration: TILE_OUT, ease: EASE },
        ),
        animate(
          "[data-loader-sheet]",
          { opacity: [1, 0] },
          { duration: SHEET_OUT, ease: EASE, delay: 0.05 },
        ),
        ...TILE_FROM.map((from, index) =>
          animate(
            `[data-loader-mark] [data-tile="${index}"]`,
            { x: from.x * 0.7, y: from.y * 0.7, opacity: [1, 0] },
            { duration: TILE_OUT, ease: EASE, delay: index * 0.02 },
          ),
        ),
      ];
      controlsRef.current = controls;
      await Promise.all(controls);
      window.clearTimeout(guard);

      // A newer cover has taken over: leave the overlay where it put it.
      if (generation !== generationRef.current) return;
      forceClear();
      coveredRef.current = false;
    }, [animate, forceClear, stopAll]);

    useImperativeHandle(
      ref,
      () => ({ cover, reveal, isCovered: () => coveredRef.current }),
      [cover, reveal],
    );

    useEffect(() => stopAll, [stopAll]);

    return (
      <div
        ref={scope}
        data-page-loader=""
        aria-hidden="true"
        className={cn("pointer-events-none fixed inset-0 z-95", className)}
      >
        {/* One sheet. It fades; nothing slides across in quadrants. */}
        <div
          data-loader-sheet
          className="absolute inset-0 bg-background opacity-0"
        />

        <div
          data-loader-mark
          className="absolute inset-0 grid place-items-center opacity-0"
        >
          <div className="flex flex-col items-center gap-6">
            <div data-loader-breathe>
              <LogoGrid size={92} label={null} />
            </div>

            {/* The progress hairline: a teal segment on a 1px track. */}
            <span className="relative block h-px w-[7.5rem] overflow-hidden bg-border">
              <span
                data-loader-bar
                className="absolute inset-y-0 left-0 w-1/3 bg-accent"
              />
            </span>
          </div>
        </div>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ *
 *  PageTransition
 *
 *  Wraps the app and intercepts internal link clicks. A document-level
 *  listener means every <Link> gets the transition for free.
 *
 *  The order matters, and it used to be the wrong way round. Covering the
 *  screen first and asking the router for the route second meant every click
 *  — including the ones whose payload was already prefetched and could paint
 *  in a frame — sat behind an opaque overlay for the length of a full wipe.
 *  On a fast route that is a blank screen with nothing to look at, which
 *  reads as a loading screen rather than a transition.
 *
 *  So the route is requested immediately and the cover waits a beat. If the
 *  new page arrives first, the loader never appears at all and navigation
 *  feels instant; if it doesn't, the mark assembles and leaves once the route
 *  renders. Two timers make sure a stalled navigation can never leave the
 *  visitor behind the sheet, and every cover that starts is allowed to finish
 *  before the reveal — a half-finished sweep reversing direction looks like a
 *  glitch.
 * ------------------------------------------------------------------ */

/** How long a navigation may take before the loader appears. */
const COVER_AFTER_MS = 220;
/** How long to keep waiting for a route after the loader is up. */
const COVER_HOLD_MS = 1600;

type TransitionContextValue = { navigate: (href: string) => void };

const PageTransitionContext = createContext<TransitionContextValue | null>(null);

/** Navigate with the logo loader. Falls back to a plain push outside the provider. */
export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  const router = useRouter();
  return {
    navigate: (href: string) => {
      if (context) context.navigate(href);
      else router.push(href);
    },
  };
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const loaderRef = useRef<PageLoaderHandle>(null);

  /**
   * The navigation in flight, if any.
   *
   * `ready` means the new route has rendered; `coverFinished` means the
   * loader has swept in and is worth sweeping back out. Between them they
   * decide whether the visitor ever sees it.
   */
  const pendingRef = useRef<{
    coverStarted: boolean;
    coverFinished: boolean;
    ready: boolean;
    coverTimer: number | null;
    giveUpTimer: number | null;
  } | null>(null);

  /** Forget the navigation, lifting the loader if it is up. */
  const settle = useCallback(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    pendingRef.current = null;
    if (pending.coverTimer) window.clearTimeout(pending.coverTimer);
    if (pending.giveUpTimer) window.clearTimeout(pending.giveUpTimer);
    if (pending.coverStarted) void loaderRef.current?.reveal();
  }, []);

  /**
   * Push the route now, cover only if it is slow. Used by every internal link
   * (a document-level listener) and by the command palette.
   */
  const navigate = useCallback(
    (href: string) => {
      const target = new URL(href, window.location.href);
      const sameRoute =
        target.pathname === window.location.pathname &&
        target.search === window.location.search;

      if (sameRoute) {
        router.push(href);
        return;
      }

      if (reduce || !loaderRef.current) {
        router.push(href);
        return;
      }

      // A second click while the first is still settling: lift the loader and
      // start again, rather than orphaning a cover we can no longer see.
      settle();

      const pending = {
        coverStarted: false,
        coverFinished: false,
        ready: false,
        coverTimer: null as number | null,
        giveUpTimer: null as number | null,
      };
      pendingRef.current = pending;

      pending.coverTimer = window.setTimeout(() => {
        if (pendingRef.current !== pending || pending.ready) return;
        pending.coverStarted = true;
        void loaderRef.current?.cover().then(() => {
          pending.coverFinished = true;
          // The route landed while the loader was appearing: the visitor
          // has seen the cover, so let it lift.
          if (pending.ready && pendingRef.current === pending) settle();
        });
      }, COVER_AFTER_MS);

      // However slow the route, the loader is never the last thing on screen.
      pending.giveUpTimer = window.setTimeout(() => {
        if (pendingRef.current === pending) settle();
      }, COVER_AFTER_MS + COVER_HOLD_MS);

      router.push(target.pathname + target.search + target.hash);
    },
    [reduce, router, settle],
  );

  // The new route has rendered.
  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return;

    pending.ready = true;

    // The common case: the route painted before we had to cover anything, so
    // there is nothing to undo and nothing to show.
    if (!pending.coverStarted) {
      pendingRef.current = null;
      if (pending.coverTimer) window.clearTimeout(pending.coverTimer);
      if (pending.giveUpTimer) window.clearTimeout(pending.giveUpTimer);
      return;
    }

    // The loader is on screen. If it has finished appearing, lift it — two
    // frames so the new route has certainly painted underneath it first.
    // Otherwise the cover's own callback reveals once it lands.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        if (pending.coverFinished && pendingRef.current === pending) settle();
      });
    });

    return () => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
    };
  }, [pathname, settle]);

  // Intercept internal link clicks anywhere in the app.
  useEffect(() => {
    if (reduce) return;

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      // Leave modified clicks (new tab, download, save) to the browser.
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.dataset.noWipe === "true") return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("blob:")
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page — let the browser handle in-page anchors and scrolling.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      event.preventDefault();
      void navigate(url.pathname + url.search + url.hash);
    }

    /*
     * Capture phase is essential: next/link calls preventDefault() from its own
     * handler on the React root, which runs before anything on `document` in
     * the bubble phase. Listening in capture means we win the race, call
     * preventDefault ourselves (which makes next/link stand down), and own the
     * navigation until the loader has covered the screen.
     */
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate, reduce]);

  // Belt and braces: clear any outstanding timers on unmount.
  useEffect(() => {
    return () => {
      const pending = pendingRef.current;
      if (!pending) return;
      if (pending.coverTimer) window.clearTimeout(pending.coverTimer);
      if (pending.giveUpTimer) window.clearTimeout(pending.giveUpTimer);
      pendingRef.current = null;
    };
  }, []);

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}
      <PageLoader ref={loaderRef} />
    </PageTransitionContext.Provider>
  );
}
