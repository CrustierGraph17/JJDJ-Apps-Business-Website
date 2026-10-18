"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useFinePointer, useMounted } from "@/lib/hooks";
import { springSoftOptions, springTrailOptions } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Custom cursor
 *
 *  A small teal dot with a ring trailing behind it on a lazier spring.
 *  The ring grows over interactive elements and can show a label read from
 *  a `data-cursor` attribute, such as "View" over a tile.
 *
 *  Only mounted for fine pointers (never on touch), and never mounted at
 *  all when the visitor prefers reduced motion — in that case the native
 *  cursor stays exactly as it is.
 * ------------------------------------------------------------------ */

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary';

export function CustomCursor() {
  const mounted = useMounted();
  const finePointer = useFinePointer();
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  // The ring lags; the dot is nearly instant. That difference in stiffness
  // is what makes the cursor feel like it has weight.
  const dotX = useSpring(0, springSoftOptions);
  const dotY = useSpring(0, springSoftOptions);
  const ringX = useSpring(0, springTrailOptions);
  const ringY = useSpring(0, springTrailOptions);
  const scale = useMotionValue(1);

  const reduced =
    mounted &&
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const active = mounted && finePointer && !reduced;

  // Tell CSS to hide the native cursor while ours is running.
  useEffect(() => {
    if (!active) {
      document.documentElement.removeAttribute("data-custom-cursor");
      return;
    }
    document.documentElement.setAttribute("data-custom-cursor", "true");
    return () => document.documentElement.removeAttribute("data-custom-cursor");
  }, [active]);

  useEffect(() => {
    if (!active) return;

    function onMove(event: PointerEvent) {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      ringX.set(event.clientX);
      ringY.set(event.clientY);
      setVisible(true);

      const target = event.target as Element | null;
      const interactive = target?.closest?.(INTERACTIVE) as HTMLElement | null;
      const labelled = target?.closest?.("[data-cursor]") as HTMLElement | null;

      setHovering(Boolean(interactive));
      setLabel(labelled?.dataset.cursor ?? null);
    }

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [active, dotX, dotY, ringX, ringY]);

  useEffect(() => {
    const target = label ? 2.9 : hovering ? 1.55 : 1;
    scale.set(pressed ? target * 0.82 : target);
  }, [hovering, label, pressed, scale]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-[110] transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Trailing ring / label holder */}
      <motion.div
        className="absolute top-0 left-0 grid place-items-center"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className={cn(
            "grid size-9 place-items-center rounded-full",
            "border border-foreground/35 backdrop-blur-[1px]",
            "transition-[background-color,border-color,color] duration-200",
            (hovering || label) && "border-accent/60 bg-accent/10",
          )}
          style={{ scale, translateX: "-50%", translateY: "-50%" }}
        >
          {label ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-[0.5rem] tracking-[0.1em] text-accent-text uppercase"
            >
              {label}
            </motion.span>
          ) : null}
        </motion.div>
      </motion.div>

      {/* Dot */}
      <motion.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-accent"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          scale: label ? 0 : 1,
        }}
      />
    </div>
  );
}
