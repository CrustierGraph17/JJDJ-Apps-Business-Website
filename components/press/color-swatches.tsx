"use client";

import { useState } from "react";
import { toast } from "sonner";
import { copyToClipboard, cn } from "@/lib/utils";

export type BrandColor = {
  name: string;
  hex: string;
  usage: string;
  /** Render the swatch label in dark ink (for light swatches). */
  darkInk?: boolean;
  /** A hairline outline, for swatches that would disappear on white. */
  outline?: boolean;
};

/**
 * Brand colour swatches.
 *
 * Clicking one copies the hex. The whole grid is a list of buttons rather than
 * a set of divs so it is reachable by keyboard and announced as interactive —
 * a colour picker people cannot tab to is not much of a reference.
 */
export function ColorSwatches({ colors }: { colors: BrandColor[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(color: BrandColor) {
    const ok = await copyToClipboard(color.hex);
    if (!ok) {
      toast.error("Couldn't copy", { description: color.hex });
      return;
    }
    setCopied(color.hex);
    toast.success(`${color.name} copied`, { description: color.hex });
    window.setTimeout(() => setCopied((value) => (value === color.hex ? null : value)), 2000);
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {colors.map((color) => (
        <li key={color.name}>
          <button
            type="button"
            onClick={() => copy(color)}
            aria-label={`Copy ${color.name}, ${color.hex}`}
            className={cn(
              "group/swatch w-full overflow-hidden rounded-card border border-border text-left",
              "transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-accent/40",
            )}
          >
            <span
              className={cn(
                "flex h-28 items-end justify-between p-4",
                color.outline && "border-b border-border",
              )}
              style={{ backgroundColor: color.hex }}
            >
              <span
                className={cn(
                  "font-mono text-[0.6875rem] tracking-[0.08em]",
                  color.darkInk ? "text-black/60" : "text-white/60",
                )}
              >
                {color.hex.toUpperCase()}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "font-mono text-[0.625rem] tracking-[0.1em] uppercase transition-opacity duration-200",
                  color.darkInk ? "text-black/45" : "text-white/45",
                  "opacity-0 group-hover/swatch:opacity-100",
                )}
              >
                {copied === color.hex ? "Copied" : "Copy"}
              </span>
            </span>
            <span className="block bg-card p-4">
              <span className="block text-[0.875rem] font-medium text-foreground">
                {color.name}
              </span>
              <span className="mt-1 block font-mono text-[0.6875rem] leading-relaxed text-subtle-foreground">
                {color.usage}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
