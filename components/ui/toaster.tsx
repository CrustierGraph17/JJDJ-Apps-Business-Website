"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Toast host.
 *
 * Colours are passed explicitly rather than via CSS variables because
 * sonner renders in a portal outside the themed subtree in some cases, and
 * an explicit palette guarantees the light/dark switch is instant.
 *
 * It lives in its own module so that `Kbd` — used all over the help centre and
 * in server components — does not drag sonner into every page that shows a
 * keycap.
 */
export function Toaster() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  return (
    <SonnerToaster
      position="bottom-center"
      offset={20}
      gap={10}
      duration={2600}
      theme={dark ? "dark" : "light"}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            "flex w-[min(92vw,22rem)] items-center gap-3 rounded-[14px] px-4 py-3.5",
            "border shadow-raised backdrop-blur-xl",
            dark
              ? "border-white/10 bg-[#1a1a1a]/95 text-[#f5f5f2]"
              : "border-black/8 bg-white/95 text-[#0a0a0a]",
          ),
          title: "text-[0.875rem] font-medium",
          description: "text-[0.8125rem] text-current/70",
          actionButton:
            "rounded-pill bg-accent px-3 py-1 text-[0.75rem] font-medium text-[#08100f]",
          cancelButton:
            "rounded-pill border border-current/20 px-3 py-1 text-[0.75rem]",
          icon: "shrink-0",
        },
      }}
    />
  );
}
