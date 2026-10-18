"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Tile } from "@/components/brand/logo-grid";
import { EASE, springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  The 404 puzzle.
 *
 *  Four logo tiles start scattered and can be dragged with real physics —
 *  Framer's drag has momentum and a springy bounce at the edges. Drag one
 *  close enough to its home cell and it snaps in and locks. Snap all four and
 *  a "Take me home" button appears.
 *
 *  Under reduced motion the tiles are not draggable at all: the grid is already
 *  assembled, the tilt is gone, and the way home is offered immediately. A
 *  puzzle is not a reasonable thing to insist on.
 * ------------------------------------------------------------------ */

const TILE_SIZE = 84;
const GAP = 10;
const BOARD = TILE_SIZE * 2 + GAP; // 178px

/** Where each tile belongs, in reading order. */
const HOME = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

/** Where each tile starts, and how it is tilted. */
const SCATTER = [
  { x: -78, y: -58, rotate: -9 },
  { x: 86, y: -74, rotate: 8 },
  { x: -94, y: 62, rotate: 6 },
  { x: 72, y: 84, rotate: -7 },
];

const VARIANTS = ["play", "flat", "flat", "wordmark"] as const;

/** How close a tile must be dragged before it snaps home. */
const SNAP_RADIUS = 60;
/** Keeps a flung tile inside the puzzle area, with a soft bounce at the edge. */
const BOUNDS = { left: -104, right: 104, top: -104, bottom: 104 };

function DragTile({
  index,
  placed,
  onPlaced,
}: {
  index: number;
  placed: boolean;
  onPlaced: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const scatter = SCATTER[index]!;

  const x = useMotionValue(reduce ? 0 : scatter.x);
  const y = useMotionValue(reduce ? 0 : scatter.y);
  const rotate = useMotionValue(reduce ? 0 : scatter.rotate);

  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      const distance = Math.hypot(info.offset.x, info.offset.y);
      if (distance > SNAP_RADIUS) return;

      // Snap home on the brand spring, and straighten the tilt as it lands.
      onPlaced(index);
      void animate(x, 0, springSoft);
      void animate(y, 0, springSoft);
      void animate(rotate, 0, springSoft);
    },
    [index, onPlaced, rotate, x, y],
  );

  const cell = HOME[index]!;

  return (
    <div
      className="absolute"
      // The home cell is positioned by layout; the motion values handle the
      // scatter offset. Keeping these separate matters: Framer writes
      // `transform`, so putting the offset in the same transform would erase
      // the tile's position the moment it was dragged.
      style={{
        left: cell.x * (TILE_SIZE + GAP),
        top: cell.y * (TILE_SIZE + GAP),
        zIndex: placed ? 1 : 10,
      }}
    >
      <Tile
        size={TILE_SIZE}
        variant={VARIANTS[index]}
        className={cn(
          "select-none rounded-[14px]",
          placed ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        )}
        style={{ x, y, rotate }}
        data-cursor={placed ? undefined : "Drag"}
        {...(reduce || placed
          ? {}
          : {
              drag: true,
              dragConstraints: BOUNDS,
              dragElastic: 0.22,
              dragMomentum: true,
              dragTransition: {
                bounceStiffness: 300,
                bounceDamping: 30,
                power: 0.32,
                timeConstant: 210,
              },
              whileDrag: { scale: 1.06, rotate: 0 },
              onDragEnd: handleDragEnd,
            })}
      />
    </div>
  );
}

export function LostTiles() {
  const reduce = useReducedMotion();
  const [placed, setPlaced] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const markPlaced = useCallback((index: number) => {
    setPlaced((current) =>
      current[index] ? current : current.map((value, i) => (i === index ? true : value)),
    );
  }, []);

  const count = reduce ? 4 : placed.filter(Boolean).length;
  const allPlaced = count === 4;

  return (
    <div className="flex flex-col items-center">
      {/* Padding gives the scattered tiles somewhere to live without
          overlapping the surrounding copy. */}
      <div
        className="relative p-24 sm:p-28"
        style={{ width: BOARD + 200, maxWidth: "100%" }}
      >
        <div className="relative mx-auto" style={{ width: BOARD, height: BOARD }}>
          {/* Empty slots */}
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2"
            style={{ gap: GAP }}
          >
            {HOME.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "rounded-[14px] border border-dashed transition-colors duration-300",
                  placed[index] ? "border-transparent" : "border-border-strong",
                )}
              />
            ))}
          </div>

          {/* Tiles */}
          {HOME.map((_, index) => (
            <DragTile
              key={index}
              index={index}
              placed={reduce ? true : placed[index]!}
              onPlaced={markPlaced}
            />
          ))}
        </div>
      </div>

      {/* Progress + the way home */}
      <div className="mt-2 flex min-h-[5rem] flex-col items-center gap-5">
        <p
          className="font-mono text-[0.6875rem] tracking-[0.12em] text-subtle-foreground uppercase"
          aria-live="polite"
        >
          {allPlaced
            ? "All four tiles accounted for"
            : `${count} of 4 tiles back in place — drag them home`}
        </p>

        <motion.div
          initial={false}
          animate={{ opacity: allPlaced ? 1 : 0, y: allPlaced ? 0 : 8 }}
          transition={{ duration: 0.45, ease: EASE }}
          className={allPlaced ? undefined : "pointer-events-none"}
          aria-hidden={!allPlaced}
        >
          <Link
            href="/"
            tabIndex={allPlaced ? 0 : -1}
            className={cn(
              "inline-flex h-13 items-center gap-2 rounded-pill bg-accent px-7",
              "font-medium text-accent-contrast",
              "shadow-[0_10px_30px_-14px_var(--accent-glow)] transition-colors duration-200",
              "hover:bg-accent-hover",
            )}
          >
            Take me home
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
