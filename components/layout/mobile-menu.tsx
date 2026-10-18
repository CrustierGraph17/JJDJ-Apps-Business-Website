"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/brand/logo-grid";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { primaryNav, site } from "@/data/site";
import { openCommandPalette } from "@/lib/events";
import { icons } from "@/lib/icons";
import { DURATION, EASE } from "@/lib/motion";
import { useLenisLock, scrollToTop } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Mobile menu
 *
 *  A single full-height sheet that rises into place and fades the content
 *  up behind it — no four-panel wipe, nothing that reads as a grid of
 *  blocks. Links are rows with an index, a glyph and a large label, so the
 *  menu looks like the rest of the site rather than a separate interface.
 *
 *  Under prefers-reduced-motion the sheet simply appears.
 * ------------------------------------------------------------------ */

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

/** The quieter routes — the same ones the footer carries. */
const SECONDARY_LINKS = [
  { label: "Contact", href: "/contact" },
  { label: "The team", href: "/about#team" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookie policy", href: "/cookies" },
] as const;

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  useLenisLock(open);

  // Close on route change.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Escape closes the sheet, the same as every other dialog on the site.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Sits above the cookie notice (z-70) and below the command palette (z-80).
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          className="fixed inset-0 z-[75] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.micro, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
        >
          <motion.div
            className="absolute inset-0 overflow-hidden bg-background"
            initial={reduce ? undefined : { y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: 14, opacity: 0 }}
            transition={{ duration: DURATION.overlay, ease: EASE }}
          >
            {/* A single soft glow instead of a hard-edged background. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -right-32 size-[22rem] rounded-full bg-accent/10 blur-3xl"
            />

            <motion.div
              className="relative flex h-full flex-col"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    delayChildren: reduce ? 0 : 0.12,
                    staggerChildren: reduce ? 0 : 0.05,
                  },
                },
              }}
            >
              {/* Header */}
              <motion.div
                variants={rowVariants}
                transition={{ duration: DURATION.base, ease: EASE }}
                className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-3.5"
              >
                <Link
                  href="/"
                  onClick={onClose}
                  aria-label="JJDJ — home"
                  className="rounded-[10px] transition-opacity hover:opacity-85"
                >
                  <Logo size={32} wordmark label="JJDJ" />
                </Link>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                      "grid size-10 place-items-center rounded-full",
                      "border border-border bg-card text-foreground",
                      "transition-colors duration-200 hover:border-border-strong hover:bg-surface",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    )}
                  >
                    <icons.x className="size-4" />
                    <span className="sr-only">Close menu</span>
                  </button>
                </div>
              </motion.div>

              {/* Links */}
              <nav
                aria-label="Mobile"
                className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-2"
              >
                <ul>
                  {primaryNav.map((item, index) => {
                    const Icon = icons[item.icon];
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                    return (
                      <motion.li
                        key={item.href}
                        variants={rowVariants}
                        transition={{ duration: DURATION.base, ease: EASE }}
                        className="border-b border-border last:border-b-0"
                      >
                        <Link
                          href={item.href}
                          onClick={onClose}
                          aria-current={active ? "page" : undefined}
                          className="group flex items-center gap-3.5 py-4"
                        >
                          <span
                            className={cn(
                              "w-5 font-mono text-[0.625rem] tracking-[0.08em]",
                              active
                                ? "text-accent-text"
                                : "text-subtle-foreground",
                            )}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <Icon
                            aria-hidden="true"
                            className="size-[1.15rem] shrink-0 text-accent"
                          />

                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block font-display text-[1.625rem] leading-tight font-black tracking-[-0.03em]",
                                "transition-colors duration-200",
                                active
                                  ? "text-accent-text"
                                  : "text-foreground group-hover:text-accent-text",
                              )}
                            >
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[0.75rem] text-balance text-muted-foreground">
                              {item.description}
                            </span>
                          </span>

                          <icons.arrowRight
                            aria-hidden="true"
                            className="size-4 shrink-0 text-subtle-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <motion.div
                  variants={rowVariants}
                  transition={{ duration: DURATION.base, ease: EASE }}
                  className="mt-6 border-t border-border pt-4"
                >
                  <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-subtle-foreground uppercase">
                    More
                  </p>
                  <ul className="mt-1 grid grid-cols-2 gap-x-5">
                    {SECONDARY_LINKS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="group flex items-center justify-between gap-2 border-b border-border/60 py-2.5 text-[0.8125rem] text-muted-foreground transition-colors duration-200 hover:text-foreground"
                        >
                          {item.label}
                          <icons.arrowUpRight className="size-3.5 text-subtle-foreground transition-colors group-hover:text-accent" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

              </nav>

              {/* Pinned above the footer: on a short phone the links scroll,
                  but the two primary actions never disappear below the fold. */}
              <motion.div
                variants={rowVariants}
                transition={{ duration: DURATION.base, ease: EASE }}
                className="shrink-0 space-y-2.5 px-5 pt-4 pb-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openCommandPalette();
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-pill",
                    "border border-border bg-card px-4 py-3",
                    "text-[0.9375rem] text-foreground",
                    "transition-colors duration-200 hover:border-border-strong",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <icons.search className="size-4 text-muted-foreground" />
                    Search everything
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </span>
                </button>

                <Button asChild size="lg" className="w-full" shine>
                  <Link href="/products/notle" onClick={onClose}>
                    Meet Notle
                    <icons.arrowRight />
                  </Link>
                </Button>
              </motion.div>

              {/* Footer */}
              <motion.div
                variants={rowVariants}
                transition={{ duration: DURATION.base, ease: EASE }}
                className="shrink-0 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
              >
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.625rem] tracking-[0.1em] text-subtle-foreground uppercase">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  {site.locationLine}
                  <span aria-hidden="true" className="mx-0.5 h-3 w-px bg-border" />
                  {site.launch.product} · {site.launch.label}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export { scrollToTop };
