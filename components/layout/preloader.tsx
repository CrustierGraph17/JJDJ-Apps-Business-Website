"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoGrid } from "@/components/brand/logo-grid";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Intro preloader — first visit in a session only, under 1.2s, skippable.
 *
 *  Beat 1  (0ms)      four tiles drop into a 2×2 grid with a stagger — drawn
 *                     in CSS, so it is moving on the first paint
 *  Beat 2  (380ms)    the play tile "presses play"
 *  Beat 3  (760ms)    the grid scales and glides into its place in the
 *                     navbar logo while the overlay fades away
 *  Beat 4  (~1.2s)    unmounted, sessionStorage remembers
 *
 *  Those times are measured from the start of the page load, not from the
 *  moment React hydrates, so a slow load sees the intro finish early instead
 *  of holding the hero hostage until the bundle arrives.
 *
 *  The whole sequence is kept short on purpose: it is the one thing on the
 *  site that stands between the visitor and the hero, so every beat is timed
 *  to the point where it reads, not to the point where it feels leisurely.
 *
 *  It is rendered on the server so it is the very first thing painted: a
 *  returning visitor is spared the flash by an inline script in <head> that
 *  sets data-preloader="seen", which hides the overlay through CSS before
 *  React has even hydrated. Anyone who prefers reduced motion skips it too.
 * ------------------------------------------------------------------ */

const SESSION_KEY = "jjdj:intro";
const MARKER = "seen";

const GRID_SIZE = 104;

/**
 * Beat times, in milliseconds **since the document started loading**.
 *
 * Deliberately not "since React mounted". The overlay is a flourish on top of
 * a page that is already painted, so its beats belong to the load, not to
 * hydration: on a cold cache or a slow device the tiles have long since
 * dropped by the time JavaScript arrives, and making the visitor watch the
 * play button press while the hero sits ready underneath it is exactly the
 * lag this timing avoids.
 */
const BEAT = { play: 380, fly: 760, backstop: 1200 } as const;

export function Preloader() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"drop" | "play" | "fly" | "done">("drop");
  const [armed, setArmed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  /** Stop for good and remember that we have. */
  const finish = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    try {
      window.sessionStorage.setItem(SESSION_KEY, MARKER);
    } catch {
      /* storage blocked — the intro simply plays again next time */
    }
    setPhase("done");
  }, []);

  /** Beat 3: measure the navbar logo and glide into it. */
  const fly = useCallback(async () => {
    setPhase("fly");

    const target = document.querySelector<HTMLElement>(
      "[data-navbar-logo] [data-logo-grid]",
    );
    const from = gridRef.current?.getBoundingClientRect();

    if (target && from && from.width > 0) {
      const to = target.getBoundingClientRect();
      const targetScale = to.width / from.width;

      await Promise.all([
        animate(
          x,
          to.left + to.width / 2 - (from.left + from.width / 2),
          { duration: 0.38, ease: EASE },
        ),
        animate(y, to.top + to.height / 2 - (from.top + from.height / 2), {
          duration: 0.38,
          ease: EASE,
        }),
        animate(scale, targetScale, { duration: 0.38, ease: EASE }),
      ]);
    } else {
      await animate(scale, 0.85, { duration: 0.3, ease: EASE });
    }

    finish();
  }, [finish, scale, x, y]);

  useEffect(() => {
    // Hand the overlay over from CSS to JavaScript: from here on the beats
    // below drive it, and the failsafe exit animation in globals.css cancels.
    rootRef.current?.setAttribute("data-preloader-armed", "");

    const hidden =
      document.documentElement.getAttribute("data-preloader") === MARKER ||
      reduce;
    if (hidden) {
      setPhase("done");
      return;
    }
    setArmed(true);
  }, [reduce]);

  useEffect(() => {
    if (!armed) return;

    // How much of the intro has already happened by the time we get here.
    const elapsed = performance.now(); // ms since navigation start
    const remaining = (at: number) => Math.max(0, at - elapsed);

    const push = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    // Everything the visitor should have seen is behind us: leave now rather
    // than replaying the intro over a page that is already ready.
    if (elapsed >= BEAT.fly) {
      void fly();
      return;
    }

    push(() => setPhase("play"), remaining(BEAT.play));
    push(() => void fly(), remaining(BEAT.fly));
    push(finish, remaining(BEAT.backstop)); // backstop: never trap the visitor

    // Skippable by click, key or scroll.
    const skip = () => void fly();
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, [armed, finish, fly]);

  if (phase === "done") return null;

  return (
    <div
      ref={rootRef}
      data-preloader-root=""
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-100 grid place-items-center bg-background",
        "transition-opacity duration-400",
        phase === "fly" ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{ transitionTimingFunction: `cubic-bezier(${EASE.join(", ")})` }}
    >
      <motion.div ref={gridRef} style={{ x, y, scale }}>
        <motion.div
          animate={
            phase === "play" || phase === "fly"
              ? { scale: [1, 1.06, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.42, ease: EASE }}
        >
          <LogoGrid
            size={GRID_SIZE}
            animated={phase === "drop"}
            dropStyle="css"
            stagger={0.06}
            label={null}
          />
        </motion.div>
      </motion.div>

      {/* Faint teal underline that fills as the intro runs. */}
      <motion.span
        className="absolute bottom-[38%] h-px bg-accent"
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: phase === "drop" ? GRID_SIZE * 1.4 : GRID_SIZE * 1.6,
          opacity: phase === "drop" ? 0.9 : 0,
        }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      />
    </div>
  );
}
