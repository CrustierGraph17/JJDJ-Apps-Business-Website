"use client";

import { motion, useScroll, useSpring, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A hairline teal reading-progress bar pinned to the top of the viewport.
 * Used on help articles; the offset keeps it clear of the navbar.
 */
export function ScrollProgress({
  className,
  offset = "0px",
}: {
  className?: string;
  offset?: string;
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "fixed top-0 left-0 z-60 h-[2px] w-full origin-left bg-accent",
        className,
      )}
      style={{ scaleX, top: offset }}
    />
  );
}

/**
 * Tracks how far a section has been scrolled through.
 * Returns the ref to attach and the raw 0→1 progress value.
 */
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return { ref, progress: scrollYProgress as MotionValue<number> };
}
