"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** True once the component has mounted on the client. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Subscribe to a media query. Always false during SSR. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * True only for devices with a precise pointer.
 * The custom cursor uses this so it never appears on touch screens.
 */
export function useFinePointer() {
  return useMediaQuery("(pointer: fine) and (hover: hover)");
}

/**
 * True when the site is in dark mode — i.e. `<html>` carries the `dark`
 * class that globals.css uses for its second theme.
 *
 * Canvas-based effects such as <DotField> need to read the theme in JS so
 * they can pick the right palette. This watches the class list, so it
 * stays correct whether the class is set on first paint, toggled later by
 * a theme switcher, or changed through a view transition.
 *
 * Always false during SSR and on the first client render.
 */
export function useIsDarkTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.classList.contains("dark"));
    read();

    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

/** True when the viewport is at or below `max` (mobile-first breakpoints). */
export function useIsMobile(max = 767) {
  return useMediaQuery(`(max-width: ${max}px)`);
}

/** Reads and writes a sessionStorage key, safely and without SSR warnings. */
export function useSessionStorage<T>(
  key: string,
  initial: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* storage blocked — fall back to the in-memory value */
    }
  }, [key]);

  const update = useCallback(
    (next: T) => {
      setValue(next);
      try {
        window.sessionStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  return [value, update];
}

/**
 * Locks body scroll (used by modals, the mobile menu and the lightbox)
 * without fighting Lenis — Lenis is stopped separately via its instance.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

/** Debounces a rapidly changing value — used by the search inputs. */
export function useDebounced<T>(value: T, delay = 180) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Calls `handler` when Escape is pressed while `active`. */
export function useEscapeKey(active: boolean, handler: () => void) {
  const ref = useRef(handler);
  // Keep the latest handler without re-binding the listener. Written in an
  // effect rather than during render; events always fire after effects.
  useEffect(() => {
    ref.current = handler;
  }, [handler]);
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") ref.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);
}

/**
 * Remembers the tab's previous scroll position so returning to a list
 * (products → detail → back) feels right.
 */
export function useLockedScrollRestore(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    const key = `scroll:${window.location.pathname}`;
    const saved = Number(window.sessionStorage.getItem(key) ?? "0");
    if (saved > 0) window.scrollTo({ top: saved, behavior: "auto" });
  }, [ready]);
}
