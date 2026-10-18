"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  CornerDownLeft,
  Moon,
  Search,
  Sun,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { helpArticles } from "@/data/help";
import { products } from "@/data/products";
import { primaryNav, site } from "@/data/site";
import { DialogOverlay } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { TileEmptyState } from "@/components/brand/empty-state";
import { onOpenCommandPalette, requestThemeToggle } from "@/lib/events";
import { icons } from "@/lib/icons";
import { useLenisLock } from "@/lib/scroll";
import { useThemeTransition } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Command palette — ⌘K / Ctrl+K
 *
 *  Searches products, help articles and pages, and offers quick actions.
 *  Results are grouped, navigable with the arrow keys, and the selected row
 *  gets the teal highlight.
 *
 *  Opening is driven by a window event (see lib/events) rather than a
 *  context, so the navbar button, the mobile menu and the keyboard shortcut
 *  can all trigger it without threading a provider through the tree.
 * ------------------------------------------------------------------ */

type Group = "Products" | "Help" | "Pages" | "Actions";

type PaletteItem = {
  id: string;
  group: Group;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  /** Extra words that should match a query but are not displayed. */
  keywords?: string;
  run: () => void;
};

const GROUP_ORDER: Group[] = ["Products", "Help", "Pages", "Actions"];

/** Cheap relevance score: prefix matches beat word starts, word starts beat substring. */
function score(item: PaletteItem, query: string) {
  const haystack = `${item.title} ${item.subtitle ?? ""} ${item.keywords ?? ""}`.toLowerCase();
  const needle = query.toLowerCase().trim();
  if (!needle) return 1;

  const title = item.title.toLowerCase();
  if (title.startsWith(needle)) return 100;
  if (title.includes(` ${needle}`)) return 70;
  if (title.includes(needle)) return 50;
  if (haystack.includes(needle)) return 25;

  // Loose subsequence match, so "gtst" finds "Getting started".
  let cursor = 0;
  for (const char of needle) {
    cursor = haystack.indexOf(char, cursor);
    if (cursor === -1) return 0;
    cursor += 1;
  }
  return 8;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<"all" | "help">("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { isDark } = useThemeTransition();

  useLenisLock(open);

  /* ---------- open/close wiring ---------- */

  const openPalette = useCallback((nextScope: "all" | "help" = "all") => {
    setScope(nextScope);
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  useEffect(() => onOpenCommandPalette(({ scope: s }) => openPalette(s)), [openPalette]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette("all");
        return;
      }

      // "/" jumps straight into help search, like a docs site. On the help
      // pages a dedicated search field is already on screen, so it takes the
      // shortcut instead — the nearest search box should always win.
      if (event.key === "/" && !typing) {
        if (document.querySelector("[data-help-search]")) return;
        event.preventDefault();
        openPalette("help");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPalette]);

  /* ---------- the index ---------- */

  const items = useMemo<PaletteItem[]>(() => {
    const close = () => setOpen(false);
    const go = (href: string) => () => {
      close();
      router.push(href);
    };

    const productItems: PaletteItem[] = products.map((product) => ({
      id: `product-${product.slug}`,
      group: "Products",
      title: product.name,
      subtitle: product.tagline,
      icon: icons[product.icon],
      keywords: `${product.category} ${product.platforms.join(" ")} ${product.tagline}`,
      run: go(`/products/${product.slug}`),
    }));

    const helpItems: PaletteItem[] = helpArticles.map((article) => ({
      id: `help-${article.slug}`,
      group: "Help",
      title: article.title,
      subtitle: article.description,
      icon: article.product ? icons[products.find((p) => p.slug === article.product)?.icon ?? "lifeBuoy"] : icons.lifeBuoy,
      keywords: `${article.category} ${article.sections.map((s) => s.heading).join(" ")}`,
      run: go(`/help/${article.slug}`),
    }));

    const pageItems: PaletteItem[] = [
      ...primaryNav.map((item) => ({
        id: `page-${item.href}`,
        group: "Pages" as const,
        title: item.label,
        subtitle: item.description,
        icon: icons[item.icon],
        run: go(item.href),
      })),
      {
        id: "page-home",
        group: "Pages" as const,
        title: "Home",
        subtitle: "Back to the front page",
        icon: icons.layers,
        run: go("/"),
      },
      {
        id: "page-press",
        group: "Pages" as const,
        title: "Press kit",
        subtitle: "Logos, brand colours and fonts",
        icon: icons.download,
        run: go("/press"),
      },
      {
        id: "page-contact",
        group: "Pages" as const,
        title: "Contact",
        subtitle: `Email ${site.email}`,
        icon: icons.mail,
        run: go("/contact"),
      },
      {
        id: "page-privacy",
        group: "Pages" as const,
        title: "Privacy policy",
        icon: icons.lock,
        run: go("/privacy"),
      },
      {
        id: "page-terms",
        group: "Pages" as const,
        title: "Terms of service",
        icon: icons.fileText,
        run: go("/terms"),
      },
    ];

    const actionItems: PaletteItem[] = [
      {
        id: "action-theme",
        group: "Actions",
        title: `Switch to ${isDark ? "light" : "dark"} theme`,
        subtitle: "Toggles the theme from anywhere",
        icon: isDark ? Sun : Moon,
        keywords: "dark light colour color mode",
        run: () => {
          close();
          requestThemeToggle();
        },
      },
      {
        id: "action-notle",
        group: "Actions",
        title: "Open Notle",
        subtitle: `Our first app · launches ${site.launch.label}`,
        icon: icons.externalLink,
        keywords: "app product launch",
        run: () => {
          close();
          window.open(site.launch.href, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "action-help",
        group: "Actions",
        title: "Notle help",
        subtitle: "Audio, study tools, plans and data",
        icon: icons.lifeBuoy,
        run: go("/help"),
      },
      {
        id: "action-email",
        group: "Actions",
        title: "Email JJDJ",
        subtitle: site.email,
        icon: icons.mail,
        keywords: "contact support message address",
        run: () => {
          close();
          window.location.assign(`mailto:${site.email}`);
        },
      },
    ];

    const all = [...productItems, ...helpItems, ...pageItems, ...actionItems];
    return scope === "help"
      ? [...helpItems, ...pageItems, ...actionItems]
      : all;
  }, [isDark, router, scope]);

  const results = useMemo(() => {
    const scored = items
      .map((item) => ({ item, value: score(item, query) }))
      .filter((entry) => entry.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, query ? 18 : 12);

    return scored.map((entry) => entry.item);
  }, [items, query]);

  // Keep the highlight inside the result set as it shrinks.
  useEffect(() => setActive(0), [query, scope]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        (index) => (index - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1),
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      results[active]?.run();
    }
  }

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    entries: results.filter((item) => item.group === group),
  })).filter((bucket) => bucket.entries.length > 0);

  let flatIndex = -1;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          aria-label="Command palette"
          className={cn(
            "fixed top-[12vh] left-1/2 z-80 w-[min(94vw,40rem)] -translate-x-1/2",
            "overflow-hidden rounded-panel border border-border bg-surface shadow-raised",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none",
          )}
          onKeyDown={onKeyDown}
        >
          {/* Search row */}
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Search className="size-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                scope === "help"
                  ? "Search the help centre…"
                  : "Search apps, help and pages…"
              }
              className={cn(
                "h-6 flex-1 bg-transparent text-[0.9375rem] text-foreground",
                "placeholder:text-subtle-foreground focus:outline-none",
              )}
              aria-label="Search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <Kbd>Esc</Kbd>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            className="max-h-[min(58vh,26rem)] overflow-y-auto overscroll-contain p-2"
            role="listbox"
            aria-label="Results"
          >
            {grouped.length === 0 ? (
              <div className="grid place-items-center gap-4 px-6 py-12 text-center">
                <TileEmptyState />
                <div>
                  <p className="font-display text-[1.0625rem] font-bold text-foreground">
                    Nothing matched “{query}”
                  </p>
                  <p className="mt-1 text-[0.875rem] text-muted-foreground">
                    Try a help topic, or open the{" "}
                    <Link
                      href="/help"
                      className="text-accent-text link-underline"
                      onClick={() => setOpen(false)}
                    >
                      Notle help centre
                    </Link>
                    .
                  </p>
                </div>
              </div>
            ) : (
              grouped.map((bucket) => (
                <div key={bucket.group} className="mb-1.5">
                  <p className="px-3 pt-2 pb-1.5 font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                    {bucket.group}
                  </p>
                  {bucket.entries.map((item) => {
                    flatIndex += 1;
                    const index = flatIndex;
                    const selected = index === active;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={index}
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => item.run()}
                        className={cn(
                          "flex w-full items-center gap-3.5 rounded-[12px] px-3 py-2.5 text-left",
                          "transition-colors duration-150",
                          selected
                            ? "bg-accent-wash text-accent-text"
                            : "text-foreground hover:bg-accent-wash/60",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-[9px] border",
                            selected
                              ? "border-accent/30 bg-accent/10 text-accent"
                              : "border-border bg-card text-muted-foreground",
                          )}
                        >
                          <Icon className="size-[0.9rem]" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.875rem] font-medium">
                            {item.title}
                          </span>
                          {item.subtitle ? (
                            <span
                              className={cn(
                                "block truncate text-[0.8125rem]",
                                selected ? "text-accent-text/80" : "text-muted-foreground",
                              )}
                            >
                              {item.subtitle}
                            </span>
                          ) : null}
                        </span>
                        {selected ? (
                          <CornerDownLeft className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
                        ) : (
                          <ArrowUpRight className="size-3.5 shrink-0 opacity-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer hints */}
          <div className="flex items-center justify-between gap-4 border-t border-border bg-card/60 px-4 py-3">
            <span className="flex items-center gap-3 font-mono text-[0.6875rem] text-subtle-foreground">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <Kbd>↵</Kbd> open
              </span>
            </span>
            <span className="font-mono text-[0.6875rem] text-subtle-foreground">
              {scope === "help" ? "/ for help search" : "⌘K anywhere"}
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
