"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Kbd } from "@/components/ui/kbd";
import { type MicroAnimation } from "@/data/home";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Bento micro-animations.
 *
 *  Six small looping diagrams, one per card — and each one draws the thing
 *  its card actually says: formats being saved out, a draft living in the
 *  browser, the audio-retention switch, keyboard focus moving through a
 *  form, what the free plan covers, and the two people behind it.
 *
 *  They are drawn inline (no images) and animate only transform, opacity
 *  and colour, so all six can loop at once without touching the main
 *  thread. Under reduced motion each diagram freezes on its finished
 *  frame — it still reads, it just stops moving.
 * ------------------------------------------------------------------ */

/** Shared frame so the six diagrams sit on the same optical centre. */
function Stage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("grid min-h-20 w-full place-items-center", className)}
    >
      {children}
    </div>
  );
}

/** "Built to last" — a document and the formats it opens and saves. */
const FORMATS = ["DOCX", "PDF", "PPTX"] as const;

function Formats({ frozen }: { frozen: boolean }) {
  return (
    <Stage>
      <div className="flex w-full max-w-[15rem] items-center gap-4">
        {/* The document. Lines are replaced by the saved-mark on the right. */}
        <div className="relative h-[68px] w-[52px] shrink-0 overflow-hidden rounded-[7px] border border-border bg-card p-2">
          <span className="block h-1 w-5 rounded-full bg-accent" />
          <span className="mt-2 block h-1 w-7 rounded-full bg-border-strong" />
          <span className="mt-1.5 block h-1 w-6 rounded-full bg-border-strong" />
          <span className="mt-1.5 block h-1 w-4 rounded-full bg-border-strong" />
          <motion.span
            className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-accent/20 to-transparent"
            animate={frozen ? { opacity: 0.5 } : { opacity: [0.15, 0.75, 0.15] }}
            transition={
              frozen
                ? undefined
                : { duration: 3.6, ease: "easeInOut", repeat: Infinity }
            }
          />
        </div>

        {/* Each format ticks in turn: the work leaves in the shape it came. */}
        <ul className="min-w-0 flex-1 space-y-1.5">
          {FORMATS.map((format, index) => (
            <li
              key={format}
              className="flex items-center justify-between gap-2 rounded-[6px] border border-border bg-surface py-[3px] pr-1.5 pl-2"
            >
              <span className="font-mono text-[0.625rem] tracking-[0.08em] text-muted-foreground uppercase">
                {format}
              </span>
              <motion.span
                className="grid size-3.5 place-items-center rounded-full bg-accent/15 text-accent"
                animate={
                  frozen
                    ? { opacity: 1, scale: 1 }
                    : { opacity: [0.3, 1, 1, 0.3], scale: [0.85, 1, 1, 0.85] }
                }
                transition={
                  frozen
                    ? undefined
                    : {
                        duration: 3.6,
                        ease: EASE,
                        repeat: Infinity,
                        times: [0, 0.18, 0.8, 1],
                        delay: index * 0.45,
                      }
                }
              >
                <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                  <path
                    d="M2.6 6.2 4.8 8.4 9.4 3.6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </li>
          ))}
        </ul>
      </div>
    </Stage>
  );
}

/** "Local by default" — a browser window saving to the device, no server. */
function Local({ frozen }: { frozen: boolean }) {
  return (
    <Stage>
      <div className="w-full max-w-[16rem] overflow-hidden rounded-[9px] border border-border bg-card">
        {/* Window chrome, so the draft reads as living in a browser tab. */}
        <div className="flex items-center gap-1.5 border-b border-border bg-surface px-2.5 py-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-1 rounded-full bg-border-strong" />
          ))}
          <span className="ml-1.5 rounded-full bg-background px-2 py-[1px] font-mono text-[0.5625rem] text-subtle-foreground">
            drafts
          </span>
        </div>

        <div className="px-3 py-2">
          <p className="text-[0.75rem] leading-none text-foreground">
            Essay draft
          </p>
          <span className="mt-2 flex items-center gap-1">
            <span className="h-1 w-16 rounded-full bg-border-strong" />
            <motion.span
              className="h-2.5 w-px bg-accent"
              animate={frozen ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
              transition={
                frozen
                  ? undefined
                  : {
                      duration: 1.2,
                      ease: "linear",
                      repeat: Infinity,
                      times: [0, 0.5, 0.5, 1],
                    }
              }
            />
          </span>
        </div>

        <div className="flex items-center gap-1.5 border-t border-border px-3 py-1.5">
          <motion.span
            className="size-1.5 rounded-full bg-accent"
            animate={frozen ? { opacity: 1 } : { opacity: [1, 0.35, 1] }}
            transition={
              frozen
                ? undefined
                : { duration: 2.4, ease: "easeInOut", repeat: Infinity }
            }
          />
          <span className="font-mono text-[0.625rem] tracking-[0.04em] text-muted-foreground">
            Saved on this device
          </span>
        </div>
      </div>
    </Stage>
  );
}

/** "Privacy-first" — the two settings the card names: audio and cloud copies. */
function Privacy({ frozen }: { frozen: boolean }) {
  return (
    <Stage>
      <div className="w-full max-w-[15rem] space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
            <span className="grid size-5 place-items-center rounded-[5px] bg-accent/12 text-accent">
              <svg viewBox="0 0 12 12" className="size-3" fill="none">
                <rect
                  x="2.2"
                  y="5.4"
                  width="7.6"
                  height="5"
                  rx="1.4"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
                <path
                  d="M4 5.4V4.1a2 2 0 0 1 4 0v1.3"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Keep audio
          </span>

          {/* A real switch: off, on, off. The visitor controls retention. */}
          <span className="relative h-5 w-9 shrink-0 rounded-full border border-border-strong">
            <motion.span
              className="absolute inset-0 rounded-full bg-accent"
              animate={frozen ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
              transition={
                frozen
                  ? undefined
                  : {
                      duration: 5.6,
                      ease: EASE,
                      repeat: Infinity,
                      times: [0, 0.2, 0.34, 0.78, 0.9],
                    }
              }
            />
            <motion.span
              className="absolute top-[3px] left-[3px] size-3 rounded-full bg-foreground shadow-card"
              animate={
                frozen
                  ? { x: 15 }
                  : { x: [0, 0, 15, 15, 0] }
              }
              transition={
                frozen
                  ? undefined
                  : {
                      duration: 5.6,
                      ease: EASE,
                      repeat: Infinity,
                      times: [0, 0.2, 0.34, 0.78, 0.9],
                    }
              }
            />
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5">
          <span className="text-[0.75rem] text-muted-foreground">
            Cloud copies
          </span>
          <motion.span
            className="rounded-full bg-accent-wash px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.1em] text-accent-text uppercase"
            animate={frozen ? { opacity: 1 } : { opacity: [0.55, 1, 0.55] }}
            transition={
              frozen
                ? undefined
                : { duration: 3.6, ease: "easeInOut", repeat: Infinity }
            }
          >
            Private
          </motion.span>
        </div>
      </div>
    </Stage>
  );
}

/** "Thoughtful details" — Tab moving a visible focus ring through a form. */
function Focus({ frozen }: { frozen: boolean }) {
  return (
    <Stage>
      <div className="w-full max-w-[14.5rem]">
        <p className="font-mono text-[0.5625rem] tracking-[0.14em] text-subtle-foreground uppercase">
          Title
        </p>
        <div className="relative mt-1 rounded-[6px] border border-border bg-card px-2 py-1.5 text-[0.75rem] text-foreground">
          Essay draft
          <motion.span
            className="pointer-events-none absolute -inset-[3px] rounded-[9px] border-2 border-accent"
            animate={
              frozen ? { opacity: 1 } : { opacity: [0, 1, 1, 0, 0] }
            }
            transition={
              frozen
                ? undefined
                : {
                    duration: 4.8,
                    ease: EASE,
                    repeat: Infinity,
                    times: [0, 0.12, 0.42, 0.54, 1],
                  }
            }
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="relative flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
            <span className="grid size-3.5 place-items-center rounded-[4px] border border-border bg-card">
              <span className="size-1.5 rounded-[2px] bg-accent" />
            </span>
            Focus mode
            <motion.span
              className="pointer-events-none absolute -inset-x-1.5 -inset-y-1 rounded-[6px] border-2 border-accent"
              animate={
                frozen ? { opacity: 1 } : { opacity: [0, 0, 0, 1, 1, 0] }
              }
              transition={
                frozen
                  ? undefined
                  : {
                      duration: 4.8,
                      ease: EASE,
                      repeat: Infinity,
                      times: [0, 0.42, 0.54, 0.62, 0.86, 0.94],
                    }
              }
            />
          </span>

          <motion.span
            className="inline-flex"
            animate={frozen ? { y: 0 } : { y: [0, 0, 1.5, 0, 0] }}
            transition={
              frozen
                ? undefined
                : {
                    duration: 4.8,
                    ease: EASE,
                    repeat: Infinity,
                    times: [0, 0.42, 0.5, 0.6, 1],
                  }
            }
          >
            <Kbd className="font-mono text-[0.5625rem]">Tab</Kbd>
          </motion.span>
        </div>
      </div>
    </Stage>
  );
}

/** "Free to start" — what zero dollars actually includes. */
const FREE_EDITORS = ["Write", "Slides", "Sheets", "PDF"] as const;

function Free({ frozen }: { frozen: boolean }) {
  return (
    <Stage>
      <div className="w-full max-w-[15rem]">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[1.5rem] leading-none font-black tracking-[-0.03em] text-foreground">
            $0
          </span>
          <span className="font-mono text-[0.5625rem] tracking-[0.12em] text-subtle-foreground uppercase">
            to start
          </span>
        </div>

        <div className="mt-2 grid grid-cols-4 gap-1">
          {FREE_EDITORS.map((name, index) => (
            <span
              key={name}
              className="relative grid h-6 place-items-center overflow-hidden rounded-[5px] border border-border bg-surface font-mono text-[0.5625rem] text-muted-foreground"
            >
              <motion.span
                className="absolute inset-0 bg-accent/15"
                animate={
                  frozen
                    ? { opacity: 1 }
                    : { opacity: [0, 1, 1, 0] }
                }
                transition={
                  frozen
                    ? undefined
                    : {
                        duration: 4,
                        ease: EASE,
                        repeat: Infinity,
                        times: [0, 0.15, 0.7, 0.9],
                        delay: index * 0.3,
                      }
                }
              />
              <span className="relative">{name}</span>
            </span>
          ))}
        </div>

        <p className="mt-2 font-mono text-[0.625rem] tracking-[0.02em] text-subtle-foreground">
          + focus sessions · transcription
        </p>
      </div>
    </Stage>
  );
}

/** "Made by two people" — Joash and Darryl, the whole company. */
const PEOPLE = [
  { name: "Joash", initial: "J" },
  { name: "Darryl", initial: "D" },
] as const;

function Duo({ frozen }: { frozen: boolean }) {
  return (
    <Stage>
      <div className="flex w-full max-w-[20rem] flex-wrap items-center gap-3">
        {PEOPLE.map((person, index) => (
          <div
            key={person.name}
            className="relative flex min-w-[7.5rem] flex-1 items-center gap-2.5 overflow-hidden rounded-[11px] border border-border bg-card py-2 pr-3 pl-2"
          >
            <motion.span
              className="absolute inset-0 bg-accent-wash"
              animate={
                frozen ? { opacity: 1 } : { opacity: [0.9, 0.9, 0.15, 0.9] }
              }
              transition={
                frozen
                  ? undefined
                  : {
                      duration: 4.4,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: index * 0.5,
                    }
              }
            />
            <span className="relative grid size-7 shrink-0 place-items-center rounded-full bg-accent/15 font-display text-[0.6875rem] font-black text-accent-text">
              {person.initial}
            </span>
            <span className="relative truncate text-[0.8125rem] text-foreground">
              {person.name}
            </span>
          </div>
        ))}
      </div>
    </Stage>
  );
}

const registry: Record<
  MicroAnimation,
  (props: { frozen: boolean }) => React.JSX.Element
> = {
  formats: Formats,
  local: Local,
  privacy: Privacy,
  focus: Focus,
  free: Free,
  duo: Duo,
};

export function BentoAnimation({ name }: { name: MicroAnimation }) {
  const reduce = useReducedMotion();
  const Component = registry[name];
  return <Component frozen={Boolean(reduce)} />;
}
