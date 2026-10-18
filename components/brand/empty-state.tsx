"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { LogoGrid } from "@/components/brand/logo-grid";
import { EASE, springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Empty states reuse the 4-tile motif.
 *
 * `TileEmptyState` is the bare animated mark — four tiles gently breathing
 * out of phase. It is used inside the command palette's no-results state and
 * anywhere a list can legitimately be empty.
 */
export function TileEmptyState({
  className,
  size = 72,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      <motion.span
        animate={{ scale: [1, 1.04, 1], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 3.6, ease: EASE, repeat: Infinity }}
      >
        <LogoGrid size={size} label={null} />
      </motion.span>
    </span>
  );
}

/**
 * A full empty state: the tiles, a headline, a sentence and an action.
 * Used by filtered product lists and help search.
 */
export function EmptyState({
  title,
  description,
  action,
  className,
  tileSize = 84,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  tileSize?: number;
}) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col items-center px-8 py-16 text-center",
        className,
      )}
      role="status"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springSoft}
      >
        <LogoGrid size={tileSize} label={null} />
      </motion.div>

      <h3 className="mt-7 font-display text-[1.25rem] font-black tracking-[-0.02em] text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-[42ch] text-[0.9375rem] text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
