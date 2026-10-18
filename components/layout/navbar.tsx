"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo-grid";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { primaryNav } from "@/data/site";
import { openCommandPalette } from "@/lib/events";
import { icons } from "@/lib/icons";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Navbar
 *
 *  Sticky and frosted. After 40px of scroll it tightens up and gains a
 *  shadow; scrolling down hides it, scrolling up brings it straight back.
 *
 *  A single teal "pill" travels between links — it follows whichever link is
 *  hovered, and rests on the current section when nothing is hovered. Framer's
 *  shared layout animation moves it, so it glides rather than cutting.
 * ------------------------------------------------------------------ */

const HIDE_AFTER = 160; // never hide before this much scroll

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeIndex = primaryNav.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
  const pillIndex = hovered ?? (activeIndex >= 0 ? activeIndex : null);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 40);
    if (menuOpen) return;

    const goingDown = current > previous && current > HIDE_AFTER;
    const goingUp = current < previous - 4;
    setHidden(goingDown && !goingUp);
  });

  // Opening the menu always restores the bar so the logo is reachable.
  useEffect(() => {
    if (menuOpen) setHidden(false);
  }, [menuOpen]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      {/* Skip link — first focusable thing on the page. */}
      <a
        href="#main"
        className={cn(
          "sr-only rounded-pill bg-accent px-4 py-2 font-medium text-accent-contrast",
          "focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-90",
        )}
      >
        Skip to content
      </a>

      <motion.header
        className={cn(
          "fixed top-0 right-0 left-0 z-50",
          "border-b transition-[background-color,border-color,box-shadow,padding] duration-300",
          "backdrop-blur-xl backdrop-saturate-150",
          scrolled
            ? "border-border bg-background/80 shadow-nav"
            : "border-transparent bg-background/55",
        )}
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-105%" : "0%" }}
        transition={{ duration: DURATION.base, ease: EASE }}
      >
        <div
          className={cn(
            "container-page flex items-center gap-4 transition-[height] duration-300",
            scrolled ? "h-15" : "h-18",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            data-navbar-logo=""
            aria-label="JJDJ — home"
            className="shrink-0 rounded-[10px] transition-opacity hover:opacity-85"
          >
            <Logo size={scrolled ? 30 : 34} wordmark className="transition-all duration-300" />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
            <ul
              className="flex items-center gap-1"
              onMouseLeave={() => setHovered(null)}
            >
              {primaryNav.map((item, index) => {
                const active = activeIndex === index;
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHovered(index)}
                      onFocus={() => setHovered(index)}
                      onBlur={() => setHovered(null)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex items-center rounded-pill px-3.5 py-2 text-[0.875rem]",
                        "transition-colors duration-200",
                        active || pillIndex === index
                          ? "text-accent-text"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {pillIndex === index ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-pill bg-accent-wash"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right-hand controls */}
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <button
              type="button"
              onClick={() => openCommandPalette()}
              aria-label="Search everything"
              className={cn(
                "hidden items-center gap-3 rounded-pill border border-border bg-card/80 py-2 pr-2 pl-3.5",
                "text-[0.8125rem] text-muted-foreground transition-colors duration-200",
                "hover:border-border-strong hover:text-foreground md:flex",
              )}
            >
              <icons.search className="size-3.5" aria-hidden="true" />
              <span>Search</span>
              <span className="flex items-center gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
            </button>

            {/* Search icon only, on narrow screens */}
            <button
              type="button"
              onClick={() => openCommandPalette()}
              aria-label="Search everything"
              className={cn(
                "grid size-10 place-items-center rounded-[12px] border border-border bg-card",
                "text-muted-foreground transition-colors hover:text-foreground md:hidden",
              )}
            >
              <icons.search className="size-4" aria-hidden="true" />
            </button>

            <ThemeToggle className="hidden sm:grid" />

            <Button asChild size="md" className="hidden lg:inline-flex" shine>
              <Link href="/products/notle">Meet Notle</Link>
            </Button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "grid size-10 place-items-center rounded-[12px] border border-border bg-card",
                "text-foreground transition-colors lg:hidden",
              )}
            >
              <span className="grid gap-[3px]" aria-hidden="true">
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-2.5 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
