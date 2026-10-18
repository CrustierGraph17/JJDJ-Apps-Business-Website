"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { springTrailOptions } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type SpotlightProps = {
  children?: ReactNode;
  className?: string;
  /** Diameter of the glow in pixels. */
  size?: number;
  /** Peak alpha of the teal glow. */
  intensity?: number;
};

/**
 * A soft teal spotlight that follows the cursor behind the hero.
 *
 * Sits above the dotted grid and below the content. Moves on a spring so
 * it lags the pointer very slightly, which reads as depth rather than
 * lag. Disabled entirely for reduced motion and touch devices — on touch
 * the glow simply rests in the upper centre.
 */
export function Spotlight({
  children,
  className,
  size = 680,
  intensity = 0.14,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, springTrailOptions);
  const y = useSpring(0, springTrailOptions);
  // Invisible until the pointer is actually seen. It is always rendered —
  // removing it for reduced motion would leave the server's markup with an
  // extra child and force React to throw the whole hero away on hydration.
  const opacity = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;

    // Respect coarse pointers: no spotlight on touch screens.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Park the glow in the upper centre. It stays invisible (opacity 0)
    // until the pointer first moves, so this never animates on screen.
    const rect = el.getBoundingClientRect();
    x.set(rect.width / 2);
    y.set(rect.height * 0.42);

    function onMove(event: PointerEvent) {
      if (!el) return;
      const box = el.getBoundingClientRect();
      x.set(event.clientX - box.left);
      y.set(event.clientY - box.top);
      opacity.set(1);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [opacity, reduce, x, y]);

  return (
    <div ref={ref} className={cn("relative isolate", className)}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[64px]"
        style={{
          x,
          y,
          width: size,
          height: size,
          opacity,
          background: `radial-gradient(circle, rgba(20,184,166,${intensity}) 0%, rgba(20,184,166,${intensity * 0.4}) 42%, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
