"use client";

import { useEffect } from "react";

/**
 * Playful tab title.
 *
 * When the visitor switches away, the title becomes "Come back soon 👋" and
 * the original is restored the moment the tab is focused again. It never
 * touches the document title while the tab is visible, so search engines and
 * open tabs keep seeing the real page title.
 */
const AWAY_TITLE = "Come back soon 👋";

export function TabTitle() {
  useEffect(() => {
    let original = document.title;

    function onVisibilityChange() {
      if (document.hidden) {
        original = document.title;
        document.title = AWAY_TITLE;
      } else {
        document.title = original;
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return null;
}
