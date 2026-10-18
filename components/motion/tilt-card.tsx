"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { springSoftOptions } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the corners. */
  max?: number;
  /** Strength of the teal light sweep that follows the cursor. */
  glare?: number;
  /** Raise the card slightly on hover. */
  lift?: boolean;
};

/**
 * A card that tilts in 3D towards the cursor with a soft light reflection
 * gliding across its surface.
 *
 * The reflection position is written to two CSS custom properties on the
 * element directly, so moving the pointer never causes a React re-render.
 */
export function TiltCard({
  children,
  className,
  max = 6,
  glare = 0.16,
  lift = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rotateX = useSpring(0, springSoftOptions);
  const rotateY = useSpring(0, springSoftOptions);
  const glareOpacity = useMotionValue(0);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    rotateX.set((0.5 - py) * max * 2);
    rotateY.set((px - 0.5) * max * 2);
    glareOpacity.set(1);

    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  }

  function handleLeave() {
    if (reduce) return;
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  }

  /*
   * The same markup for every motion preference — the reduced case just never
   * receives a rotation, so the card stays flat. Swapping in a plain <div>
   * changed the server's tree and cost a full re-render on hydration.
   */
  return (
    <div className="h-full [perspective:1200px]">
      <motion.div
        ref={ref}
        className={cn("group/tilt relative h-full rounded-card", className)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        whileHover={!reduce && lift ? { y: -4 } : undefined}
        transition={springSoftOptions}
      >
        {children}
        {/* Moving light reflection */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(20,184,166,${glare}), transparent 62%)`,
          }}
        />
      </motion.div>
    </div>
  );
}
