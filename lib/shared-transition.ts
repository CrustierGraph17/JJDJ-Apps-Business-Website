"use client";

/* ------------------------------------------------------------------ *
 *  Shared-element transition
 *
 *  When a product card is clicked, the card's icon and screenshot "fly" from
 *  where they were on the grid into the detail hero.
 *
 *  True cross-document `view-transition-name` matching is not usable here: the
 *  products grid passes through a client-side route change with the page
 *  loader over it, and the destination geometry does not exist until the new
 *  route has painted. So instead the source rectangle is captured on click and stored in
 *  memory; the detail page reads it on mount and animates a fixed-position
 *  clone from the old rectangle to the hero's real one before revealing the
 *  live element.
 *
 *  Everything is one-shot: the store is cleared as soon as the clone has
 *  landed, so a refresh or a back-navigation never shows a stale ghost.
 * ------------------------------------------------------------------ */

export type SharedRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type SharedElement = {
  /** Which product the rect belongs to, so a mismatched page ignores it. */
  slug: string;
  icon?: SharedRect;
  image?: SharedRect;
};

let pending: SharedElement | null = null;

function toRect(element: Element): SharedRect {
  const box = element.getBoundingClientRect();
  return { top: box.top, left: box.left, width: box.width, height: box.height };
}

/** Capture the source rectangles from a product card, just before navigating. */
export function captureSharedElement(root: HTMLElement | null, slug: string) {
  if (!root) return;
  const icon = root.querySelector<HTMLElement>("[data-shared-icon]");
  const image = root.querySelector<HTMLElement>("[data-shared-image]");

  pending = {
    slug,
    icon: icon ? toRect(icon) : undefined,
    image: image ? toRect(image) : undefined,
  };
}

/**
 * Take the pending transition — but only if it belongs to this slug. Consuming
 * it clears it, so it can never replay.
 */
export function consumeSharedElement(slug: string): SharedElement | null {
  if (!pending || pending.slug !== slug) {
    pending = null;
    return null;
  }
  const value = pending;
  pending = null;
  return value;
}

/** Drop a pending transition without using it (e.g. on an aborted click). */
export function clearSharedElement() {
  pending = null;
}
