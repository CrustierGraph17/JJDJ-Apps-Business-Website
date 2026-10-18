"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { scrollTo } from "@/lib/scroll";

/**
 * Article table of contents.
 *
 * Tracks which section you are reading with an IntersectionObserver rather
 * than a scroll listener, so it costs nothing while you read and updates the
 * moment a heading crosses the reading line.
 *
 * Clicking an entry scrolls through Lenis when it is running, so the movement
 * matches the rest of the page.
 */
export function ArticleToc({
  sections,
  className,
}: {
  /** Section headings, in document order. */
  sections: { id: string; heading: string }[];
  className?: string;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the reading line that is currently visible.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        // A band across the upper third of the viewport counts as "reading".
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className={className}>
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
        On this page
      </p>
      <ul className="mt-4 space-y-0.5">
        {sections.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollTo(`#${section.id}`)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative block w-full py-1.5 pl-4 text-left text-[0.8125rem]",
                  "transition-colors duration-200",
                  active
                    ? "text-accent-text"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1/2 left-0 h-px w-2 -translate-y-1/2 transition-all duration-300",
                    active ? "w-3 bg-accent" : "bg-border-strong",
                  )}
                />
                {section.heading}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
