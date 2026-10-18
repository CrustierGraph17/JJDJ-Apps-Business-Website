"use client";

import { useRef } from "react";
import { useMounted } from "@/lib/hooks";
import { useThemeTransition } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";

/**
 * The theme toggle.
 *
 * The control *is* the logo: a 26px four-tile mark. Clicking it flips each
 * tile in 3D, one after the other, while the whole page changes theme with a
 * circular reveal spreading out from the button (see the view-transition
 * block in globals.css and useThemeTransition).
 *
 * Built from HTML rather than SVG on purpose — a `view-transition-name` is
 * set per tile so the flip can run at the same time as the root wipe, and
 * named view transitions on SVG children are not reliably supported.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const mounted = useMounted();
  const { toggleTheme, isDark } = useThemeTransition();

  function handleClick() {
    const rect = ref.current?.getBoundingClientRect();
    toggleTheme(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : undefined,
      ref.current,
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} theme`
          : "Switch theme"
      }
      title={mounted ? "Toggle theme (T)" : undefined}
      className={cn(
        "group relative grid size-10 place-items-center rounded-[12px]",
        "border border-border bg-card text-foreground",
        "transition-colors duration-200 hover:border-border-strong",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      {/* Four tiles on a 2×2 grid, each with its own data-tile index. */}
      <span aria-hidden="true" className="grid grid-cols-2 gap-[3px]">
        {/* Tile 1 — the play triangle. */}
        <span
          data-tile="0"
          className="grid size-[9px] place-items-center rounded-[3px] bg-accent"
        >
          <svg viewBox="0 0 10 10" className="size-[7px]" focusable="false">
            <path
              d="M 2 1.4 L 8.2 5 L 2 8.6 Z"
              fill="var(--accent-contrast)"
              stroke="var(--accent-contrast)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span data-tile="1" className="size-[9px] rounded-[3px] bg-tile" />
        <span data-tile="2" className="size-[9px] rounded-[3px] bg-tile" />
        <span data-tile="3" className="size-[9px] rounded-[3px] bg-tile" />
      </span>
    </button>
  );
}
