import Link from "next/link";
import { NotleMark } from "@/components/brand/notle-logo";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * The hero centrepiece: the four editors inside Notle, as a 2×2 tile grid
 * that echoes the logo. These are the real workspace apps — Dox, Point,
 * Exceed and Draft — not decorative mockups.
 */

const TILES = [
  {
    name: "Dox",
    description: "Word documents",
    icon: "fileText" as const,
  },
  {
    name: "Point",
    description: "Presentations",
    icon: "monitor" as const,
  },
  {
    name: "Exceed",
    description: "Spreadsheets",
    icon: "layers" as const,
  },
  {
    name: "Draft",
    description: "PDF markup",
    icon: "penLine" as const,
  },
];

export function NotleTiles({ className }: { className?: string }) {
  return (
    <div className={cn("surface-card overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-border bg-surface px-5 py-4">
        <span className="flex items-center gap-3">
          <NotleMark size={30} label={null} />
          <span>
            <span className="block font-display text-[0.9375rem] font-black tracking-[-0.02em] text-foreground">
              Notle
            </span>
            <span className="block font-mono text-[0.625rem] tracking-[0.1em] text-subtle-foreground uppercase">
              A workspace for ideas
            </span>
          </span>
        </span>
        <span className="rounded-pill border border-accent/30 bg-accent-wash px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.06em] text-accent-text uppercase">
          10 Nov 2026
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border">
        {TILES.map((tile) => {
          const Icon = icons[tile.icon];
          return (
          <Link
            key={tile.name}
            href="/products/notle#editors"
            className={cn(
              "group/tile flex min-h-[8.5rem] flex-col justify-between bg-card p-5",
              "transition-colors duration-300 hover:bg-surface",
              "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
            )}
          >
            <span className="grid size-10 place-items-center rounded-[12px] border border-border bg-surface text-accent">
              <Icon className="size-[1.05rem]" aria-hidden="true" />
            </span>
            <span>
              <span className="mt-6 block font-display text-[1.0625rem] font-black tracking-[-0.02em] text-foreground">
                Notle {tile.name}
              </span>
              <span className="mt-0.5 flex items-center justify-between gap-2 text-[0.8125rem] text-muted-foreground">
                {tile.description}
                <span
                  aria-hidden="true"
                  className="text-accent opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
                >
                  →
                </span>
              </span>
            </span>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
