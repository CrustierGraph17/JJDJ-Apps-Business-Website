"use client";

import { useEffect } from "react";
import { onThemeToggleRequest } from "@/lib/events";
import { useThemeTransition } from "@/lib/theme-provider";

/**
 * Global keyboard shortcuts.
 *
 *   T   toggle the theme (the palette can also request it via an event)
 *   /   search the help centre — handled in the command palette
 *   ⌘K  open the command palette — handled in the command palette
 *
 * Every shortcut is ignored while the visitor is typing into a field, so it
 * can never eat a character.
 */
export function Shortcuts() {
  const { toggleTheme } = useThemeTransition();

  useEffect(() => {
    function toggleFromButtonOrigin() {
      const button = document.querySelector<HTMLElement>(
        "[data-theme-toggle-button]",
      );
      const rect = button?.getBoundingClientRect();
      toggleTheme(
        rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined,
        button,
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        toggleFromButtonOrigin();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    const off = onThemeToggleRequest(toggleFromButtonOrigin);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      off();
    };
  }, [toggleTheme]);

  return null;
}
