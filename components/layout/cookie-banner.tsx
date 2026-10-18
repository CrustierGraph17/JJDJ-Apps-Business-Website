"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "jjdj:consent";

/**
 * Cookie consent.
 *
 * Deliberately small and honest: the only things this site stores are a theme
 * preference and this decision. Remembered in localStorage, never re-shown.
 */
export function CookieBanner() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return; // storage blocked → don't nag on every page
    }
    // Wait a beat so the banner never competes with the intro.
    const timer = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  function decide(value: "all" | "essential") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          className={cn(
            "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-70 w-[min(94vw,42rem)] -translate-x-1/2",
            "rounded-panel border border-border bg-surface p-4 shadow-raised",
            "sm:p-5",
          )}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: DURATION.base, ease: EASE }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.875rem] text-muted-foreground">
              We store two settings in your browser: your theme and whether you
              have seen this notice. No cookies, no advertising, no cross-site
              tracking.{" "}
              <Link href="/cookies" className="text-accent-text link-underline">
                Read the policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" onClick={() => decide("all")}>
                Got it
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
