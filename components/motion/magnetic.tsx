"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { springSoftOptions } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Maximum travel, in pixels, at the very edge of the element. */
  strength?: number;
  /** Scale applied while hovered. */
  hoverScale?: number;
};

/**
 * Magnetises its child towards the cursor.
 *
 * Used on the primary CTAs. Falls back to a plain wrapper — no listeners,
 * no springs — when the user prefers reduced motion.
 */
export function Magnetic({
  children,
  className,
  strength = 14,
  hoverScale = 1.02,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, springSoftOptions);
  const y = useSpring(0, springSoftOptions);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    // Normalise the pointer to -1…1 across the element's box.
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * strength);
    y.set(Math.max(-1, Math.min(1, dy)) * strength);
  }

  function reset() {
    if (reduce) return;
    x.set(0);
    y.set(0);
  }

  /*
   * One tree for everybody. Returning a plain <div> under reduced motion
   * looked harmless, but it changed the markup the server sent — React then
   * discarded the hero and rebuilt it. Reduced motion simply gets springs
   * that never move and no hover scale.
   */
  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      // Keep the props present even under reduced motion: Framer derives a
      // tabIndex from them, and dropping them changed the server's markup.
      whileHover={{ scale: reduce ? 1 : hoverScale }}
      whileTap={{ scale: reduce ? 1 : 0.98 }}
      transition={springSoftOptions}
    >
      {children}
    </motion.div>
  );
}
