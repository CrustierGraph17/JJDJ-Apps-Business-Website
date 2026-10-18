"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * The oversized JJDJ wordmark that closes the page.
 *
 * It sits at the very bottom of the viewport and reveals itself as the footer
 * scrolls in: the letters rise slightly and fade from 0 to full while a
 * gradient mask softens the baseline. Transform + opacity only, so it costs
 * nothing to composite.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [64, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0.52, 1]);

  /*
   * One tree for everyone. Reduced motion is settled in CSS (see the
   * footer-wordmark rule in globals.css) because the reveal is driven by
   * inline styles the server also renders — a separate static span here would
   * hydrate against a different element shape.
   */
  return (
    <div ref={ref} className="pointer-events-none select-none" aria-hidden="true">
      <motion.span
        data-footer-wordmark=""
        className="block text-center font-display text-[clamp(4.5rem,21vw,15rem)] font-black leading-none tracking-[-0.05em] text-foreground/10"
        style={{ y, opacity }}
      >
        JJDJ
      </motion.span>
    </div>
  );
}
