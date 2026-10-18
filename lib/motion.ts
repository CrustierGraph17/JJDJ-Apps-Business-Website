import type { Transition, Variants } from "framer-motion";

/* ------------------------------------------------------------------ *
 *  One shared motion language.
 *
 *  Every animation on the site reads from these values so timing feels
 *  consistent: quick micro-interactions, generous section reveals, and
 *  springs for anything that follows the cursor or gets dragged.
 * ------------------------------------------------------------------ */

/** The brand easing. Used for almost everything. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Seconds. Micro-interactions stay under 250ms. */
export const DURATION = {
  micro: 0.18,
  base: 0.35,
  section: 0.6,
  wipe: 0.5,
  overlay: 0.45,
} as const;

/** Bare spring options — for useSpring(), which takes no `type` field. */
export const springSoftOptions = {
  stiffness: 300,
  damping: 30,
  mass: 0.9,
} as const;

/** The cursor ring — a touch lazier, so it trails pleasingly. */
export const springTrailOptions = {
  stiffness: 220,
  damping: 26,
  mass: 0.6,
} as const;

/** Anything dragged or cursor-following. */
export const springSoft: Transition = {
  type: "spring",
  ...springSoftOptions,
};

export const springTrail: Transition = {
  type: "spring",
  ...springTrailOptions,
};

/** Layout animations (grid tile expansion, filter reflow). */
export const springLayout: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 32,
};

export const easeTransition: Transition = { duration: DURATION.base, ease: EASE };
export const sectionTransition: Transition = {
  duration: DURATION.section,
  ease: EASE,
};

/* ---------- scroll reveal ----------
 * Fade up 24px while a 6px blur clears. Reveals stagger 60–80ms and are
 * configured to run once only. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const revealDown: Variants = {
  hidden: { opacity: 0, y: -16, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

/** Stagger container. Children inherit the 70ms beat. */
export function stagger(staggerChildren = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

/** Slide a line of text up from behind a mask. */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

/** Word-by-word highlight (the About mission statement). */
export const wordHighlight: Variants = {
  hidden: { opacity: 0.22 },
  visible: { opacity: 1 },
};

/** Overlay/backdrop fade used by every dialog. */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.micro, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DURATION.micro, ease: EASE } },
};

export const panelVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: DURATION.base, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.99,
    filter: "blur(4px)",
    transition: { duration: DURATION.micro, ease: EASE },
  },
};

