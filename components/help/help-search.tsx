"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { TileEmptyState } from "@/components/brand/empty-state";
import { Kbd } from "@/components/ui/kbd";
import { helpSearchIndex, popularArticles } from "@/data/help";
import { icons } from "@/lib/icons";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Help search
 *
 *  Instant, entirely client-side: the index is small enough that filtering on
 *  every keystroke is faster than any network round trip. It searches titles,
 *  descriptions and section headings, so "audio retention" finds the upload
 *  guide and "whop" finds the billing article.
 *
 *  Pressing "/" anywhere on the help pages focuses this field. The command
 *  palette deliberately stands down for "/" when a help search is on screen —
 *  the nearest search box should win.
 * ------------------------------------------------------------------ */

type Scored = { slug: string; title: string; description: string; score: number };

function score(entry: (typeof helpSearchIndex)[number], needle: string): number {
  const title = entry.title.toLowerCase();
  const description = entry.description.toLowerCase();
  const headings = entry.headings.join(" ").toLowerCase();

  if (title.startsWith(needle)) return 120;
  if (title.includes(` ${needle}`)) return 100;
  if (title.includes(needle)) return 80;
  if (headings.includes(needle)) return 55;
  if (description.includes(needle)) return 40;

  // Loose subsequence match: "recrdng" finds "Recording and uploading a lecture".
  const haystack = `${title} ${headings} ${description}`;
  let cursor = 0;
  for (const char of needle) {
    cursor = haystack.indexOf(char, cursor);
    if (cursor === -1) return 0;
    cursor += 1;
  }
  return 10;
}

export function HelpSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);

  const trimmed = query.trim().toLowerCase();

  const results = useMemo<Scored[]>(() => {
    if (trimmed.length < 2) return [];
    return helpSearchIndex
      .map((entry) => ({ ...entry, score: score(entry, trimmed) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [trimmed]);

  // "/" focuses this field — but never while the visitor is typing elsewhere.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(slug: string) {
    setFocused(false);
    inputRef.current?.blur();
    router.push(`/help/${slug}`);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        (index) => (index - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1),
      );
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active]!.slug);
    } else if (event.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
    }
  }

  const showPanel = focused && (trimmed.length >= 2 || query.length === 0);

  return (
    <div className="relative">
      {/* The input */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-panel border bg-card px-5 py-4",
          "transition-[border-color,box-shadow] duration-200",
          focused
            ? "border-accent shadow-[0_0_0_4px_var(--accent-wash)]"
            : "border-border hover:border-border-strong",
        )}
      >
        <icons.search
          className="size-5 shrink-0 text-subtle-foreground"
          aria-hidden="true"
        />
        <label htmlFor="help-search" className="sr-only">
          Search the help centre
        </label>
        <input
          ref={inputRef}
          id="help-search"
          data-help-search=""
          type="search"
          role="combobox"
          aria-expanded={showPanel && results.length > 0}
          aria-controls="help-search-results"
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Search guides, troubleshooting and billing…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            // Delay so a click on a result still lands.
            window.setTimeout(() => setFocused(false), 140);
          }}
          onKeyDown={onKeyDown}
          className="h-7 flex-1 bg-transparent text-[1.0625rem] text-foreground placeholder:text-subtle-foreground focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="shrink-0 rounded-full p-1 text-subtle-foreground transition-colors hover:text-foreground"
            aria-label="Clear the search"
          >
            <icons.x className="size-4" />
          </button>
        ) : (
          <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <Kbd>/</Kbd>
            <span className="font-mono text-[0.6875rem] text-subtle-foreground">
              to search
            </span>
          </span>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {showPanel ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={cn(
              "absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden",
              "rounded-panel border border-border bg-surface shadow-raised",
            )}
          >
            <div className="max-h-[min(21rem,max(8rem,calc(100dvh-33rem)))] overflow-y-auto p-2">
              {query.length === 0 ? (
                <>
                  <p className="px-3 pt-2 pb-1.5 font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                    Popular right now
                  </p>
                  {popularArticles.map((article) => (
                    <ResultRow
                      key={article.slug}
                      title={article.title}
                      description={article.description}
                      active={false}
                      onSelect={() => go(article.slug)}
                    />
                  ))}
                </>
              ) : results.length === 0 ? (
                <div className="grid place-items-center gap-4 px-6 py-10 text-center">
                  <TileEmptyState size={56} />
                  <div>
                    <p className="font-display text-[1rem] font-bold text-foreground">
                      No articles match “{query}”
                    </p>
                    <p className="mt-1 text-[0.875rem] text-muted-foreground">
                      Notle&rsquo;s support page covers account, billing and
                      data requests.
                    </p>
                    <a
                      href="https://notle-staging.vercel.app/support"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-block text-[0.875rem] text-accent-text link-underline"
                    >
                      Open Notle support →
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <p className="px-3 pt-2 pb-1.5 font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                    {results.length} {results.length === 1 ? "result" : "results"}
                  </p>
                  <div id="help-search-results" role="listbox">
                    {results.map((result, index) => (
                      <ResultRow
                        key={result.slug}
                        title={result.title}
                        description={result.description}
                        active={index === active}
                        onHover={() => setActive(index)}
                        onSelect={() => go(result.slug)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border bg-card/60 px-4 py-2.5">
              <span className="flex items-center gap-3 font-mono text-[0.6875rem] text-subtle-foreground">
                <span className="flex items-center gap-1">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> browse
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>↵</Kbd> open
                </span>
              </span>
              <span className="font-mono text-[0.6875rem] text-subtle-foreground">
                {helpSearchIndex.length} articles indexed
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ResultRow({
  title,
  description,
  active,
  onSelect,
  onHover,
}: {
  title: string;
  description: string;
  active: boolean;
  onSelect: () => void;
  onHover?: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3.5 rounded-[12px] px-3 py-3 text-left",
        "transition-colors duration-150",
        active ? "bg-accent-wash" : "hover:bg-accent-wash/60",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid size-7 shrink-0 place-items-center rounded-[8px] border",
          active
            ? "border-accent/30 bg-accent/10 text-accent"
            : "border-border bg-card text-muted-foreground",
        )}
      >
        <icons.fileText className="size-3.5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[0.9375rem] font-medium",
            active ? "text-accent-text" : "text-foreground",
          )}
        >
          {title}
        </span>
        <span className="mt-0.5 block text-[0.8125rem] text-muted-foreground">
          {description}
        </span>
      </span>
      {active ? (
        <span
          aria-hidden="true"
          className="mt-1.5 shrink-0 text-accent-text"
        >
          →
        </span>
      ) : null}
    </button>
  );
}
