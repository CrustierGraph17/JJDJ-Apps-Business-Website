"use client";

import type Lenis from "lenis";
import { useEffect } from "react";

/* ------------------------------------------------------------------ *
 *  Lenis is instantiated once in <SmoothScroll>. Everything that needs to
 *  pause it (modals, the mobile menu, the lightbox, the command palette)
 *  or drive it (skip links, in-page anchors) goes through this module, so
 *  no component has to hold a reference or a context.
 * ------------------------------------------------------------------ */

let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** Pause smooth scrolling — pair with `unlockScroll`. */
export function lockScroll() {
  instance?.stop();
  document.documentElement.dataset.scrollLocked = "true";
}

export function unlockScroll() {
  // Guard against a double-unlock from two overlapping overlays.
  if (document.documentElement.dataset.scrollLocked !== "true") return;
  delete document.documentElement.dataset.scrollLocked;
  instance?.start();
}

/** Smooth-scroll to a selector or element, falling back to native scrolling. */
export function scrollTo(target: string | HTMLElement, offset = 96) {
  const element =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;

  if (instance) {
    instance.scrollTo(element as HTMLElement, { offset: -offset });
  } else {
    const top =
      element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function scrollToTop(immediate = false) {
  if (instance) instance.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

/**
 * Locks scrolling for as long as `locked` is true, pausing Lenis *and*
 * setting overflow so touch devices behave too.
 */
export function useLenisLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockScroll();
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      unlockScroll();
    };
  }, [locked]);
}
