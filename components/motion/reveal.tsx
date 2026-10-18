"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ElementType, type ReactNode } from "react";
import { DURATION, EASE, revealUp, revealDown, scaleIn, fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "fade" | "scale";

const variantsByDirection: Record<Direction, Variants> = {
  up: revealUp,
  down: revealDown,
  fade: fadeIn,
  scale: scaleIn,
};

export type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before this element animates. */
  delay?: number;
  /** Reveal direction. Defaults to a 24px fade-up with a clearing blur. */
  direction?: Direction;
  /** Element to render. Defaults to a div — use "li", "section", "p", etc. */
  as?: ElementType;
  /** Distance in px for the up/down directions. */
  distance?: number;
  /** Fraction of the element that must be visible. */
  amount?: number;
  /** Disable the blur (cheaper on very large surfaces). */
  blur?: boolean;
};

/**
 * The single scroll-reveal primitive used across the site.
 *
 * Fades up 24px while a 6px blur clears, animates once, and falls back to
 * a plain fade when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
  distance,
  amount = 0.25,
  blur = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const custom =
    distance !== undefined && direction === "up"
      ? {
          hidden: { opacity: 0, y: distance, filter: blur ? "blur(6px)" : "none" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }
      : undefined;

  const base: Variants = custom ?? variantsByDirection[direction];

  /*
   * Only the *visible* values may depend on the motion preference.
   *
   * `hidden` is the state that gets server-rendered, and the server cannot
   * know the visitor's reduced-motion setting — if the client rendered a
   * smaller hidden state React would keep the server's transform instead of
   * patching it, and the content would stay 24px low and blurred forever.
   * So the hidden state is always the full one, and reduced motion instead
   * jumps to the resting position with the transform and filter explicitly
   * cleared.
   */
  const variants: Variants = reduce
    ? { hidden: base.hidden, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }
    : base;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={custom ?? variants}
      transition={{
        // Reduced motion is an instant change of state, not a shortened
        // animation — nothing travels, nothing has to settle.
        duration: reduce ? 0 : DURATION.section,
        ease: EASE,
        delay: reduce ? 0 : delay,
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Wrap a group of <Reveal> (or any variant-driven) children to inherit a
 * staggered 70ms beat instead of each manage its own delay.
 */
export function RevealGroup({
  children,
  className,
  staggerChildren = 0.07,
  delayChildren = 0,
  amount = 0.2,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  amount?: number;
  as?: ElementType;
}) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren, delayChildren } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** A child of <RevealGroup> that inherits the parent's stagger. */
export function RevealItem({
  children,
  className,
  direction = "up",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      variants={
        reduce
          ? {
              hidden: variantsByDirection[direction].hidden,
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }
          : variantsByDirection[direction]
      }
      transition={{ duration: reduce ? 0 : DURATION.section, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
