# JJDJ

The marketing site for JJDJ — a two-person studio in Perth, Western Australia,
run by Joash Jackson (CTO) and Darryl Lopez (CEO). It describes the studio and
its first app, **Notle**, which launches on 10 November 2025.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**,
**Framer Motion** and **Lenis**. Every route is statically rendered; there is no
server code and no database.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

No environment variables are required. If you set `NEXT_PUBLIC_SITE_URL`
(defaults to `https://jjdj.app`) it is used for canonical URLs, the sitemap and
JSON-LD.

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run dev:secrets` | Same, with secrets injected by Infisical — see [INFISICAL.md](INFISICAL.md) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `node scripts/generate-brand-assets.mjs` | Rewrites the logo SVGs in `public/brand` and the favicon |

---

## What is where

```
app/
  page.tsx                 home: hero, what Notle does, the two of us, launch CTA
  products/                index and the Notle detail page, plus OG images
  about/                   the story and the two founders
  help/                    hub, article pages, four categories
  press/                   logos, palette, typefaces and boilerplate
  docs/                    developer docs: the index of published reference
  privacy/  terms/  cookies/    legal pages rendered from data/legal.ts
  not-found.tsx            the IDE 404, with its looping search terminal
  sitemap.ts  robots.ts  manifest.ts  icon.svg  apple-icon.tsx
  globals.css              design tokens, utilities, keyframes

components/
  brand/       LogoGrid (four separately animatable tiles), app icons, 404 art
  motion/      Reveal, Magnetic, MaskText, Spotlight, TiltCard, CountUp,
               ScrollProgress, Appear, DotField, TechText, page loader
  layout/      navbar, mobile menu, footer, command palette, preloader,
               theme toggle, cookie banner
  sections/    hero, Notle tiles, bento grid, team grid, brand wordmark, CTA,
               the 404 editor and its terminal actions
  product/     the Notle detail hero, the screenshot viewer and the
               editor and study-tool screenshot cards
  team/        the age component (derives an age from a birthday)
  help/        search and article table of contents
  ui/          shadcn-style primitives: dialog, dropdown menu, accordion,
               button, badge, field, kbd, toaster

data/      products, help articles & categories, team, site nav, home copy,
           legal documents
lib/       motion constants, theme provider, icons, JSON-LD builders, metadata
           helpers, OG template, scroll and shared-element utilities
public/    brand/ (SVG marks, both colour versions), notle/ (app screenshots)
```

The data layer is the only place content lives. Pages, navigation, search, the
sitemap, OG images and structured data all read from it.

---

## Facts, not filler

Everything published here has to be true, so a few rules are worth keeping:

- **Ages are derived, never stored.** `data/team.ts` holds a birthday and
  `components/team/age.tsx` works the age out at render time, so nobody has to
  remember to update a number each year.
- **The product record is real or it is absent.** Notle's features, plans and
  limits in [`data/products.ts`](data/products.ts) are taken from what the app
  actually does. There are no invented versions, downloads or ratings.
- **Screenshots are captures, never mockups.** The images in
  `public/notle/` are real captures of the app and the copy that goes with them
  lives in [`data/screenshots.ts`](data/screenshots.ts). Each editor card looks
  its picture up by `editor` (Dox, Point, Exceed, Draft), so an editor can
  never end up beside another one's screenshot.
- **Dates come from `site.launch`** in [`data/site.ts`](data/site.ts), so the
  launch date is written once.

## Editing the content

- **The studio and the launch date** — [`data/site.ts`](data/site.ts).
- **The founders** — [`data/team.ts`](data/team.ts). Change a birthday and the
  age changes with it.
- **Notle** — [`data/products.ts`](data/products.ts): summary, features, the
  four workspace editors, plans, requirements and FAQs.
- **Notle screenshots** — `public/notle/` holds the captures and
  [`data/screenshots.ts`](data/screenshots.ts) holds their titles, captions and
  alt text. `editorScreenshots` maps each editor to its own capture;
  `studyScreenshots` is the tab order of the viewer on the home page and the
  product page hero.
- **Home page cards** — [`data/home.ts`](data/home.ts). Six cards fill the
  bento grid; the layout in `components/sections/bento-grid.tsx` is written for
  exactly six, so swap rather than add.
- **Help articles** — [`data/help.ts`](data/help.ts). Sections build the table
  of contents from their `heading`; the `updated` date, reading time and
  category chips come from these fields, so nothing is kept in sync by hand.
  Categories live in `helpCategories` (and the `HelpCategorySlug` union).
- **Legal pages** — [`data/legal.ts`](data/legal.ts). These cover this website;
  Notle's own policies govern the app, and are linked from them.

---

## The design system

**Colour** lives entirely in CSS variables in [`app/globals.css`](app/globals.css),
swapped by a `.dark` class on `<html>`. Components use semantic names —
`background`, `surface`, `card`, `foreground`, `muted-foreground`,
`subtle-foreground`, `border`, `accent` — so a theme change is one block of
variables, not a sweep through components. Dark mode is `#0A0A0A` on `#141414`
with `#1A1A1A` cards; light is a warm paper `#F7F7F4` rather than pure white.

**Type** is Nunito Sans for display, Inter for body copy and JetBrains Mono for
labels and dates, loaded with `next/font` and exposed as CSS variables.

**The signature move** is the four-tile logo. `components/brand/logo-grid.tsx`
builds it from four separate tiles so each can animate on its own: it drops into
place on first load, a slow navigation assembles the same mark in the middle of
the screen with a loading hairline beneath it (see
`components/motion/page-loader.tsx`), and flipping the theme flips the tiles in
3D inside a circular reveal that spreads from the toggle.

**Motion** is centralised in `lib/motion.ts` — durations, easings and spring
presets. `Reveal` is the one scroll-reveal primitive used across the site, and
`Magnetic` drives the primary CTAs. All of it is opt-out-able:
`prefers-reduced-motion` is respected per component.

---

## Accessibility and SEO

- Skip link, semantic landmarks, one `h1` per page, labelled controls.
- Modal dialogs (command palette, mobile menu) trap focus, close on Escape and
  return focus to where they were opened.
- Full keyboard navigation, including `⌘K`/`Ctrl K` for the palette and `/` for
  help search.
- Contrast-checked text tokens in both themes; focus rings are always visible.
- Per-page metadata, canonical URLs, `Organization` JSON-LD, a
  `SoftwareApplication` entry for Notle, `FAQPage` where FAQs exist, plus
  `BreadcrumbList` on product and article pages.
- `sitemap.xml` and `robots.txt` are generated from the data files; every page
  has a generated OG image.

## Deployment

Any host that runs Next.js works; the whole site prerenders. See
[DEPLOY.md](DEPLOY.md) for a Vercel walkthrough — including the warning about
building from a OneDrive folder, which is slow and locks files mid-build.
