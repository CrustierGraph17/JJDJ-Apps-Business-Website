"use client";

/* ------------------------------------------------------------------ *
 *  A very small event bus for the two things that genuinely need to talk
 *  across the tree without a context provider: opening the command palette
 *  and requesting a theme toggle (the "T" shortcut).
 * ------------------------------------------------------------------ */

const PALETTE_EVENT = "jjdj:open-palette";
const THEME_EVENT = "jjdj:toggle-theme";

export function openCommandPalette(options?: { scope?: "all" | "help" }) {
  window.dispatchEvent(
    new CustomEvent(PALETTE_EVENT, { detail: options ?? { scope: "all" } }),
  );
}

export function onOpenCommandPalette(
  handler: (options: { scope: "all" | "help" }) => void,
) {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<{ scope?: "all" | "help" }>).detail;
    handler({ scope: detail?.scope ?? "all" });
  };
  window.addEventListener(PALETTE_EVENT, listener);
  return () => window.removeEventListener(PALETTE_EVENT, listener);
}

export function requestThemeToggle() {
  window.dispatchEvent(new CustomEvent(THEME_EVENT));
}

export function onThemeToggleRequest(handler: () => void) {
  window.addEventListener(THEME_EVENT, handler);
  return () => window.removeEventListener(THEME_EVENT, handler);
}

/** Copy text and raise a toast. */
export async function copyWithToast(
  text: string,
  message = "Copied to clipboard",
) {
  const { copyToClipboard } = await import("@/lib/utils");
  const ok = await copyToClipboard(text);
  const { toast } = await import("sonner");
  if (ok) toast.success(message, { description: text });
  else toast.error("Couldn't copy", { description: "Copy it manually instead." });
  return ok;
}
