/**
 * Writes the JJDJ brand assets into /public/brand and the favicon.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * The mark is a 2×2 tile grid in a 104×104 viewBox:
 *   tile 1  top-left      the teal play triangle (no tile behind it)
 *   tile 2  top-right     flat tile
 *   tile 3  bottom-left   flat tile
 *   tile 4  bottom-right  flat tile carrying the JJDJ wordmark in teal
 *
 * Two colour versions exist because the mark inverts with the background:
 *   "on light" → near-black tiles, teal accents
 *   "on dark"  → off-white tiles, teal accents
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = join(root, "public", "brand");
const appDir = join(root, "app");

/* ---------- palette (must match app/globals.css) ---------- */
const INK = "#0A0A0A"; // light-theme tile colour
const PAPER = "#F5F5F2"; // dark-theme tile colour
const TEAL = "#14B8A6";

/* ---------- geometry ---------- */
const TILE = 48;
const OFFSET = 56;
const RADIUS = 14;
const PLAY_PATH = "M 9.5 8.5 L 39.5 24 L 9.5 39.5 Z";

const WORDMARK_FONT =
  "Nunito Sans, Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

/** The four tiles, in reading order. */
function tiles(tileColor, base = 0) {
  return `
  <g transform="translate(${base} 0)">
    <path d="${PLAY_PATH}" fill="${TEAL}" stroke="${TEAL}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="${OFFSET}" y="0" width="${TILE}" height="${TILE}" rx="${RADIUS}" fill="${tileColor}"/>
    <rect x="0" y="${OFFSET}" width="${TILE}" height="${TILE}" rx="${RADIUS}" fill="${tileColor}"/>
    <rect x="${OFFSET}" y="${OFFSET}" width="${TILE}" height="${TILE}" rx="${RADIUS}" fill="${tileColor}"/>
    <text x="${OFFSET + TILE / 2}" y="${OFFSET + TILE / 2 + 0.5}" text-anchor="middle" dominant-baseline="central"
          fill="${TEAL}" font-family="${WORDMARK_FONT}" font-size="16.5" font-weight="900" letter-spacing="-0.035em">JJDJ</text>
  </g>`;
}

function mark(tileColor, { size = 512 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 104" width="${size}" height="${size}" role="img" aria-label="JJDJ">${tiles(
    tileColor,
  )}
</svg>
`;
}

function lockup(tileColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 238 104" width="476" height="208" role="img" aria-label="JJDJ Apps">${tiles(
    tileColor,
  )}
  <text x="118" y="48" textLength="120" lengthAdjust="spacingAndGlyphs" fill="${TEAL}"
        font-family="${WORDMARK_FONT}" font-size="66" font-weight="900" letter-spacing="-0.04em">JJDJ</text>
</svg>
`;
}

/** A single-colour mark, for places where the teal cannot be reproduced. */
function markMono(color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 104" width="512" height="512" role="img" aria-label="JJDJ">
  <path d="${PLAY_PATH}" fill="${color}" stroke="${color}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="${OFFSET}" y="0" width="${TILE}" height="${TILE}" rx="${RADIUS}" fill="${color}"/>
  <rect x="0" y="${OFFSET}" width="${TILE}" height="${TILE}" rx="${RADIUS}" fill="${color}"/>
  <rect x="${OFFSET}" y="${OFFSET}" width="${TILE}" height="${TILE}" rx="${RADIUS}" fill="${color}"/>
</svg>
`;
}

const files = {
  "jjdj-mark-on-light.svg": mark(INK),
  "jjdj-mark-on-dark.svg": mark(PAPER),
  "jjdj-lockup-on-light.svg": lockup(INK),
  "jjdj-lockup-on-dark.svg": lockup(PAPER),
  "jjdj-mark-mono-black.svg": markMono(INK),
  "jjdj-mark-mono-white.svg": markMono("#FFFFFF"),
};

await mkdir(brandDir, { recursive: true });
for (const [name, contents] of Object.entries(files)) {
  await writeFile(join(brandDir, name), contents, "utf8");
  console.log("brand:", name);
}

/**
 * Favicon. Black tiles so it reads on a light browser chrome; a second
 * file handles dark chrome via a `media` query in the metadata icons.
 */
await writeFile(join(appDir, "icon.svg"), mark(INK), "utf8");
await writeFile(
  join(brandDir, "favicon-on-dark.svg"),
  mark(PAPER),
  "utf8",
);

console.log("brand: app/icon.svg");
console.log("brand: favicon-on-dark.svg");
console.log("\nDone. 8 files written.");
