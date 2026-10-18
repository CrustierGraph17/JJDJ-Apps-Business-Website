import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "fade" | "scale";

export type AppearProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the entrance starts. */
  delay?: number;
  /** Entrance direction. Defaults to a 24px fade-up with a clearing blur. */
  direction?: Direction;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
  /** Distance in px for the up/down directions. */
  distance?: number;
};

/**
 * Paint-time reveal — the above-the-fold twin of <Reveal>.
 *
 * It renders a plain server component and hands the animation to CSS, so the
 * hero is readable on the first paint instead of waiting for React to hydrate
 * (Framer's `initial` state ships as `opacity: 0` in the HTML). Use this for
 * anything visible before the visitor scrolls; keep <Reveal> for sections
 * that enter from below, where a hidden initial state costs nothing.
 */
export function Appear({
  children,
  className,
  delay = 0,
  direction = "up",
  as: Tag = "div",
  distance,
}: AppearProps) {
  const style: Record<string, string> = {
    "--reveal-delay": `${Math.round(delay * 1000)}ms`,
  };
  if (distance !== undefined) style["--reveal-distance"] = `${distance}px`;

  return (
    <Tag
      className={cn("paint-reveal", `paint-${direction}`, className)}
      style={style as CSSProperties}
    >
      {children}
    </Tag>
  );
}
