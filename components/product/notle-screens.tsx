"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { studyScreenshots } from "@/data/screenshots";
import { cn } from "@/lib/utils";

/**
 * The screenshot viewer used to show Notle off on the home and product pages.
 *
 * Every screen is rendered in place and cross-fades, so switching tabs never
 * flashes an empty frame. The tab list is a real tablist: arrow keys, Home and
 * End move between screens, and only the selected tab is in the tab order.
 */
export function NotleScreens({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeShot = studyScreenshots[active];

  function moveTo(index: number) {
    const next = (index + studyScreenshots.length) % studyScreenshots.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        moveTo(active + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        moveTo(active - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(studyScreenshots.length - 1);
        break;
    }
  }

  return (
    <div
      className={cn(
        "grid gap-5 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:gap-6",
        className,
      )}
    >
      <figure className="overflow-hidden rounded-panel border border-white/10 bg-[#0A0A0A] shadow-raised">
        {/* A small browser chrome so the capture reads as the product, not art. */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-[#111111] px-4 py-2.5">
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
          </span>
          <span className="ml-1 truncate rounded-pill border border-white/10 bg-white/5 px-3 py-1 font-mono text-[0.625rem] text-white/45">
            notle.app{activeShot.slug === "home" ? "" : `/${activeShot.slug}`}
          </span>
          <span className="ml-auto hidden font-mono text-[0.625rem] tracking-[0.12em] text-white/30 uppercase sm:block">
            Notle
          </span>
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="relative aspect-[2/1] bg-[#0A0A0A]"
        >
          {studyScreenshots.map((shot, index) => {
            const isActive = index === active;
            return (
              <div
                key={shot.slug}
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-0",
                  reduce ? "" : "transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              >
                <Image
                  src={shot.src}
                  alt={isActive ? shot.alt : ""}
                  fill
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  priority={index === 0}
                  className="object-cover object-top"
                />
              </div>
            );
          })}
        </div>

        <figcaption className="flex flex-col gap-1 border-t border-white/10 bg-[#111111] px-4 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-5">
          <span className="font-display text-[0.9375rem] font-black tracking-[-0.02em] text-[#F5F5F2]">
            {activeShot.title}
          </span>
          <span className="text-[0.8125rem] leading-relaxed text-white/50 sm:text-right">
            {activeShot.caption}
          </span>
        </figcaption>
      </figure>

      <div className="flex min-w-0 flex-col">
        <p className="mb-2.5 font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
          Jump to
        </p>

        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Notle screens"
          onKeyDown={handleKeyDown}
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {studyScreenshots.map((shot, index) => {
            const isActive = index === active;
            return (
              <button
                key={shot.slug}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`${baseId}-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-left transition-colors duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isActive
                    ? "border-accent/40 bg-accent-wash text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-surface hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[0.625rem]",
                    isActive ? "text-accent-text" : "text-subtle-foreground",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[0.875rem] font-black tracking-[-0.01em]">
                  {shot.title}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 hidden text-[0.8125rem] leading-relaxed text-subtle-foreground lg:block">
          Screenshots of the app, not mockups.
        </p>
      </div>
    </div>
  );
}
