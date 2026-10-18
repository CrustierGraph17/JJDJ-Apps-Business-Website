"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { registerLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling.
 *
 * Mounted once, near the root. It is skipped entirely when the visitor
 * prefers reduced motion — in that case the browser's own scrolling is
 * left alone, which is the accessible default.
 *
 * The instance is published through lib/scroll so modals can pause it and
 * skip links can drive it without threading a context through the tree.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      registerLenis(null);
      return;
    }

    const lenis = new Lenis({
      // Slightly longer than the 1s default: reads as weight, not lag.
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
      autoRaf: false,
    });

    registerLenis(lenis);

    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      registerLenis(null);
    };
  }, [reduce]);

  return null;
}
