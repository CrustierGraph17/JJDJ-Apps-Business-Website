"use client";

import {
  motion,
  type MotionStyle,
  type SVGMotionProps,
  type Variants,
} from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { springSoft } from "@/lib/motion";

/* ------------------------------------------------------------------ *
 *  The JJDJ mark.
 *
 *  A 2×2 grid of rounded tiles. Three are flat; the top-left holds the
 *  teal play triangle and the bottom-right holds the "JJDJ" wordmark in
 *  teal. That identity — the grid, the teal, the play button — is the
 *  interface for the whole site.
 *
 *  Each tile is its own <g>, so it can be animated independently: drop
 *  in on first load, flip in 3D on theme change, scatter on the 404,
 *  breathe behind the final CTA.
 *
 *  IMPORTANT: tiles are positioned through the geometry of their own
 *  children (rect x/y, text x/y) rather than a `transform` attribute.
 *  A CSS transform — which is what Framer Motion writes — always wins
 *  over the SVG `transform` attribute, so putting the offset in the
 *  attribute would make a tile jump back to the origin the moment it
 *  was animated.
 * ------------------------------------------------------------------ */

/** Geometry, in viewBox units (104 × 104). */
const TILE = 48; // tile edge
const GAP = 8; // gutter between tiles
const RADIUS = 14; // corner radius — matches the rounded logo tiles
const OFFSET = TILE + GAP; // 56 — second row / second column origin
const CENTRE = TILE / 2; // 24 — tile centre, in tile-local units

export const VIEW_BOX = 2 * TILE + GAP; // 104

/**
 * The play triangle.
 *
 * In the mark the top-left tile is not a square with a triangle on top —
 * it *is* the triangle, drawn at roughly the same footprint as its three
 * square neighbours. That is what makes the logo read as a play button
 * rather than a set of app icons.
 *
 * The path is a hairline triangle inflated with a round stroke join,
 * which is the tidiest way to get soft corners that stay crisp at any
 * size. Inflated extents: x 7→42, y 6→42 in the 48-unit tile, so it
 * optically centres the way a play button should.
 */
const PLAY_PATH = "M 9.5 8.5 L 39.5 24 L 9.5 39.5 Z";
const PLAY_STROKE = 5;
const PLAY_FILL = "var(--accent)";
const PLAY_STROKE_COLOR = "var(--accent)";

/** Top-left, top-right, bottom-left, bottom-right — in reading order. */
export const TILE_ORIGINS = [
  { x: 0, y: 0 },
  { x: OFFSET, y: 0 },
  { x: 0, y: OFFSET },
  { x: OFFSET, y: OFFSET },
] as const;

export type LogoGridProps = {
  /** Rendered size of the 2×2 grid, in pixels. */
  size?: number;
  className?: string;
  /** Per-tile animation props, indexed 0–3 (reading order). */
  tileProps?: (Partial<SVGMotionProps<SVGGElement>> | undefined)[];
  /** When true the four tiles drop in with a springy stagger. */
  animated?: boolean;
  /**
   * How the drop-in is driven. `spring` (the default) hands it to Framer, so
   * the tiles start at `opacity: 0` in the HTML and only move once React has
   * hydrated. `css` runs the same entrance as a CSS keyframe from first paint,
   * which is what the intro overlay uses so a cold visit is never a blank
   * screen waiting for JavaScript.
   */
  dropStyle?: "spring" | "css";
  /** Rendered tile colour. Defaults to the theme-aware `--tile` token. */
  tileColor?: string;
  /** Accessible label. Pass `null` for a decorative mark. */
  label?: string | null;
  /** Delay before the entrance animation starts, in seconds. */
  delay?: number;
  /** Stagger between tiles for the `animated` entrance, in seconds. */
  stagger?: number;
  /** Corner radius in viewBox units — the preloader uses a softer 16. */
  radius?: number;
};

/** Springy stagger used by the preloader and by the navbar mark. */
export const tileDropVariants: Variants = {
  hidden: { y: -72, opacity: 0, scale: 0.6 },
  visible: { y: 0, opacity: 1, scale: 1 },
};

/**
 * Motion style plus the CSS custom property the CSS drop path reads.
 * Framer's `MotionStyle` has no room for custom properties, so the variable
 * is declared here rather than cast away at the call site.
 */
type TileStyle = MotionStyle & { "--tile-delay"?: string };

const tileStyle: TileStyle = {
  transformBox: "fill-box",
  transformOrigin: "center",
};

export const LogoGrid = forwardRef<SVGSVGElement, LogoGridProps>(
  function LogoGrid(
    {
      size = 40,
      className,
      tileProps = [],
      animated = false,
      dropStyle = "spring",
      tileColor = "var(--tile)",
      label = "JJDJ",
      delay = 0,
      stagger = 0.075,
      radius = RADIUS,
    },
    ref,
  ) {
    /** Shared props for a tile group; keeps the four tiles consistent. */
    const tile = (index: number, custom: number): SVGMotionProps<SVGGElement> => {
      const cssDrop = animated && dropStyle === "css";
      const staggerDelay = delay + custom * stagger;
      const dropStyleWithDelay: TileStyle = {
        ...tileStyle,
        "--tile-delay": `${Math.round(staggerDelay * 1000)}ms`,
      };

      return {
        // The CSS path only declares the `from` frame, so an unhydrated page
        // (or reduced motion) shows the finished mark rather than nothing.
        className: cssDrop ? "tile-drop" : undefined,
        variants: animated && !cssDrop ? tileDropVariants : undefined,
        initial: animated && !cssDrop ? "hidden" : undefined,
        animate: animated && !cssDrop ? "visible" : undefined,
        transition:
          animated && !cssDrop
            ? { ...springSoft, delay: staggerDelay }
            : undefined,
        style: cssDrop ? dropStyleWithDelay : tileStyle,
        ...tileProps[index],
      };
    };

    return (
      <svg
        ref={ref}
        data-logo-grid=""
        width={size}
        height={size}
        viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
        className={cn("shrink-0", className)}
        role={label ? "img" : "presentation"}
        aria-label={label ?? undefined}
        aria-hidden={label ? undefined : true}
        focusable="false"
      >
        {/* Tile 1 — top-left. The play triangle, always teal. */}
        <motion.g data-tile="0" {...tile(0, 0)}>
          <path
            d={PLAY_PATH}
            fill={PLAY_FILL}
            stroke={PLAY_STROKE_COLOR}
            strokeWidth={PLAY_STROKE}
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Tile 2 — top-right. Flat. */}
        <motion.g data-tile="1" {...tile(1, 1)}>
          <rect
            x={OFFSET}
            width={TILE}
            height={TILE}
            rx={radius}
            fill={tileColor}
          />
        </motion.g>

        {/* Tile 3 — bottom-left. Flat. */}
        <motion.g data-tile="2" {...tile(2, 2)}>
          <rect
            y={OFFSET}
            width={TILE}
            height={TILE}
            rx={radius}
            fill={tileColor}
          />
        </motion.g>

        {/* Tile 4 — bottom-right. Holds the wordmark. */}
        <motion.g data-tile="3" {...tile(3, 3)}>
          <rect
            x={OFFSET}
            y={OFFSET}
            width={TILE}
            height={TILE}
            rx={radius}
            fill={tileColor}
          />
          <text
            x={OFFSET + CENTRE}
            y={OFFSET + CENTRE + 0.5}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--accent)"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16.5,
              fontWeight: 900,
              letterSpacing: "-0.035em",
            }}
          >
            JJDJ
          </text>
        </motion.g>
      </svg>
    );
  },
);

/* ------------------------------------------------------------------ *
 *  Full lockup: the grid, optionally followed by the "JJDJ" wordmark.
 * ------------------------------------------------------------------ */

export type LogoProps = LogoGridProps & {
  /** Show the "JJDJ" wordmark beside the mark. */
  wordmark?: boolean;
  /** Wordmark height in pixels. Defaults to 0.7 × the grid size. */
  wordmarkHeight?: number;
  wrapperClassName?: string;
};

export function Logo({
  wordmark = false,
  wordmarkHeight,
  wrapperClassName,
  ...gridProps
}: LogoProps) {
  const size = gridProps.size ?? 40;
  const height = wordmarkHeight ?? Math.round(size * 0.7);

  return (
    <span className={cn("inline-flex items-center", wrapperClassName)}>
      <LogoGrid {...gridProps} />
      {wordmark ? (
        /* The wordmark sits in its own viewBox and is pinned to a fixed
           textLength, so it can never overflow or drift from the grid —
           whatever font ends up rendering it. */
        <svg
          width={height * 2.15}
          height={height}
          viewBox="0 0 86 40"
          aria-hidden="true"
          focusable="false"
          className={cn("shrink-0", size > 0 ? "ml-[0.42em]" : undefined)}
          style={{ fontSize: size }}
        >
          <text
            x={0}
            y={39}
            textLength={86}
            lengthAdjust="spacingAndGlyphs"
            fill="var(--accent)"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 900,
              letterSpacing: "-0.04em",
            }}
          >
            JJDJ
          </text>
        </svg>
      ) : null}
    </span>
  );
}

/**
 * A single tile on its own — for empty, loading and error states, and for the
 * draggable 404 puzzle.
 *
 * It is a `motion.svg`, so it accepts drag props, motion values and animation
 * props anywhere a plain tile is needed.
 */
export function Tile({
  size = 48,
  variant = "flat",
  className,
  radius = RADIUS,
  ...props
}: {
  size?: number;
  variant?: "flat" | "play" | "wordmark";
  className?: string;
  radius?: number;
} & SVGMotionProps<SVGSVGElement>) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${TILE} ${TILE}`}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {variant !== "play" ? (
        <rect width={TILE} height={TILE} rx={radius} fill="var(--tile)" />
      ) : (
        <path
          d={PLAY_PATH}
          fill={PLAY_FILL}
          stroke={PLAY_STROKE_COLOR}
          strokeWidth={PLAY_STROKE}
          strokeLinejoin="round"
        />
      )}
      {variant === "wordmark" ? (
        <text
          x={CENTRE}
          y={CENTRE + 0.5}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--accent)"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16.5,
            fontWeight: 900,
            letterSpacing: "-0.035em",
          }}
        >
          JJDJ
        </text>
      ) : null}
    </motion.svg>
  );
}
