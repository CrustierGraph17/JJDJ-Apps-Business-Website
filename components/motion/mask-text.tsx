"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { EASE, DURATION } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type MaskTextProps = {
  /** The sentence to animate, one word at a time. */
  text: string;
  /** Words (matched case-insensitively, punctuation ignored) to paint teal. */
  accent?: string[];
  className?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Animate when scrolled into view rather than immediately. */
  onView?: boolean;
};

/**
 * Slides each word up from behind a mask, one after another.
 *
 * The mask is an `overflow-hidden` wrapper on an inline-block word; the
 * inner span is translated from 110% to 0. The wrapper carries a small
 * bottom padding (with a matching negative margin) so descenders in
 * "beautifully" are not clipped.
 */
export function MaskText({
  text,
  accent = [],
  className,
  delay = 0,
  stagger = 0.07,
  onView = false,
}: MaskTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const accentSet = new Set(accent.map((word) => word.toLowerCase()));

  /*
   * Above-the-fold headline: the words animate from CSS alone, so the h1 is
   * painted (and is the LCP candidate) before hydration instead of sitting at
   * translateY(110%) until React attaches.
   *
   * There is deliberately no separate reduced-motion tree here. The CSS
   * animation only exists inside `prefers-reduced-motion: no-preference`, so
   * the same markup simply rests at its final position — and keeping one tree
   * means the headline hydrates instead of being thrown away and rebuilt.
   */
  if (!onView) {
    return (
      <span className={cn("inline", className)}>
        {words.map((word, index) => {
          const isAccent = accentSet.has(word.replace(/[^a-z]/gi, "").toLowerCase());
          const style = {
            "--reveal-delay": `${Math.round((delay + index * stagger) * 1000)}ms`,
          } as CSSProperties;

          return (
            <span key={`${word}-${index}`} className="mask-word">
              <span
                className={cn("mask-word-inner", isAccent && "text-accent")}
                style={style}
              >
                {word}
              </span>
              {index < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
            </span>
          );
        })}
      </span>
    );
  }

  return (
    <span className={cn("inline", className)}>
      {words.map((word, index) => {
        const isAccent = accentSet.has(word.replace(/[^a-z]/gi, "").toLowerCase());
        return (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden pb-[0.14em] align-bottom [margin-bottom:-0.14em]"
          >
            <motion.span
              className={cn("inline-block", isAccent && "text-accent")}
              variants={{
                hidden: { y: "110%" },
                visible: { y: "0%" },
              }}
              transition={{
                duration: reduce ? 0 : 0.72,
                ease: EASE,
                delay: reduce ? 0 : delay + index * stagger,
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              {word}
            </motion.span>
            {index < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Highlights a paragraph word by word as it scrolls past — the About
 * mission statement. Words start at 22% opacity and resolve to full.
 */
export function ScrollHighlight({
  text,
  className,
  accent = [],
}: {
  text: string;
  className?: string;
  accent?: string[];
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const accentSet = new Set(accent.map((word) => word.toLowerCase()));

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.035 } } }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className={cn(
            "inline-block",
            accentSet.has(word.replace(/[^a-z]/gi, "").toLowerCase()) && "text-accent",
          )}
          variants={{ hidden: { opacity: 0.22 }, visible: { opacity: 1 } }}
          transition={{ duration: reduce ? 0 : DURATION.base, ease: EASE }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}
