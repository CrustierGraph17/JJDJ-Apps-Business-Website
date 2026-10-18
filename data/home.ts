import type { IconName } from "@/lib/icons";

/* ------------------------------------------------------------------ *
 *  Home page content.
 *  All of it is data — no copy lives inside a component.
 * ------------------------------------------------------------------ */

/**
 * The looping micro-animation rendered inside a bento card.
 *
 * Each name is the thing its card actually talks about — formats being saved,
 * a draft staying in the browser, an audio-retention switch, keyboard focus,
 * a free plan, two builders — so the picture never argues with the sentence.
 */
export type MicroAnimation =
  | "formats"
  | "local"
  | "privacy"
  | "focus"
  | "free"
  | "duo";

export type BentoCard = {
  title: string;
  description: string;
  icon: IconName;
  animation: MicroAnimation;
  /** Grid footprint. The 6 cards are laid out on a 4-column grid. */
  span: "large" | "wide" | "tall" | "small";
};

/**
 * Six principles, in the original layout order.
 *
 * Each card describes how we work or what Notle actually does today — no
 * performance figures, release cadences or infrastructure claims we cannot
 * stand behind.
 */
export const bentoCards: BentoCard[] = [
  {
    title: "Built to last",
    description:
      "One app finished properly beats eight half-built. Notle opens and saves the formats you already use, so your work is never trapped in it.",
    icon: "fileText",
    animation: "formats",
    span: "large",
  },
  {
    title: "Local by default",
    description:
      "Free drafts are held in your browser, so writing, slides, sheets and PDF markup do not wait on a round trip to a server.",
    icon: "monitor",
    animation: "local",
    span: "wide",
  },
  {
    title: "Privacy-first",
    description:
      "Free drafts stay on your device. Audio retention is a setting you control, and paid cloud copies stay private to your account.",
    icon: "lock",
    animation: "privacy",
    span: "tall",
  },
  {
    title: "Thoughtful details",
    description:
      "Keyboard-operable controls, labelled fields and visible focus styles across the editors and the study tools.",
    icon: "keyboard",
    animation: "focus",
    span: "small",
  },
  {
    title: "Free to start",
    description:
      "The four editors, focus sessions and on-device English transcription cost nothing. Paid plans add cloud saves, cloud transcription and AI.",
    icon: "wallet",
    animation: "free",
    span: "small",
  },
  {
    title: "Made by two people",
    description:
      "JJDJ is Joash and Darryl. There is no support queue behind Notle — what you use is built by the two of us.",
    icon: "users",
    animation: "duo",
    span: "wide",
  },
];
