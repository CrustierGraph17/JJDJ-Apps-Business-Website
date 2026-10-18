import type { Metadata } from "next";
import { Logo, LogoGrid } from "@/components/brand/logo-grid";
import { NotleMark, NotleWordmark } from "@/components/brand/notle-logo";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { ColorSwatches, type BrandColor } from "@/components/press/color-swatches";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/page-metadata";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Press kit",
  description:
    "Downloadable JJDJ and Notle logos, the brand palette and typefaces, and an accurate short boilerplate for JJDJ and Notle.",
  path: "/press",
});

/** The brand palette, in the order it should be used. */
const BRAND_COLORS: BrandColor[] = [
  {
    name: "Teal",
    hex: "#14B8A6",
    usage: "The only accent. CTAs, active states, focus rings, the play triangle.",
    darkInk: true,
  },
  {
    name: "Teal hover",
    hex: "#2DD4BF",
    usage: "Hover and pressed states on teal surfaces.",
    darkInk: true,
  },
  {
    name: "Teal, deepened",
    hex: "#0E7C72",
    usage: "Body-size teal text on light backgrounds, so it clears WCAG AA.",
    darkInk: false,
  },
  {
    name: "Ink",
    hex: "#0A0A0A",
    usage: "Dark-theme background, light-theme tiles, primary body text on light.",
    darkInk: false,
    outline: true,
  },
  {
    name: "Paper",
    hex: "#F5F5F2",
    usage: "Dark-theme tiles and primary text. Warm, never pure white.",
    darkInk: true,
  },
  {
    name: "Warm white",
    hex: "#F7F7F4",
    usage: "Light-theme page background.",
    darkInk: true,
    outline: true,
  },
  {
    name: "Surface",
    hex: "#141414",
    usage: "Raised panels in the dark theme.",
    darkInk: false,
    outline: true,
  },
  {
    name: "Card",
    hex: "#1A1A1A",
    usage: "Cards and inputs in the dark theme.",
    darkInk: false,
    outline: true,
  },
  {
    name: "Muted",
    hex: "#A1A1A1",
    usage: "Secondary text in the dark theme.",
    darkInk: true,
    outline: true,
  },
];

/** Logo files, with the panel each one is designed to sit on. */
const LOGOS = [
  {
    file: "/brand/jjdj-mark-on-light.svg",
    name: "Tile grid",
    background: "light" as const,
    tileColor: "#0A0A0A",
    wordmark: false,
    note: "For light backgrounds. Tiles in ink, play triangle in teal.",
  },
  {
    file: "/brand/jjdj-mark-on-dark.svg",
    name: "Tile grid",
    background: "dark" as const,
    tileColor: "#F5F5F2",
    wordmark: false,
    note: "For dark backgrounds. Tiles in paper, play triangle in teal.",
  },
  {
    file: "/brand/jjdj-lockup-on-light.svg",
    name: "Lockup",
    background: "light" as const,
    tileColor: "#0A0A0A",
    wordmark: true,
    note: "Grid plus wordmark. Use this wherever there is room.",
  },
  {
    file: "/brand/jjdj-lockup-on-dark.svg",
    name: "Lockup",
    background: "dark" as const,
    tileColor: "#F5F5F2",
    wordmark: true,
    note: "The dark-theme lockup, for dark backgrounds.",
  },
  {
    file: "/brand/jjdj-mark-mono-black.svg",
    name: "Mono, black",
    background: "light" as const,
    tileColor: "#0A0A0A",
    wordmark: false,
    note: "Single colour. For stamps, embossing and one-colour print.",
  },
  {
    file: "/brand/jjdj-mark-mono-white.svg",
    name: "Mono, white",
    background: "dark" as const,
    tileColor: "#FFFFFF",
    wordmark: false,
    note: "Single colour, for photography and dark artwork.",
  },
];

const FONTS = [
  {
    name: "Nunito Sans",
    role: "Headings and the wordmark",
    weights: "800 · 900 · 1000",
    detail:
      "A rounded geometric sans. Set tight: -0.03em tracking, line-height 1.02.",
    href: "https://fonts.google.com/specimen/Nunito+Sans",
  },
  {
    name: "Inter",
    role: "Body copy",
    weights: "400 · 500 · 700",
    detail: "16–18px with a 1.6 line-height. Nothing clever, just legible.",
    href: "https://fonts.google.com/specimen/Inter",
  },
  {
    name: "JetBrains Mono",
    role: "Labels, versions, stats, shortcuts",
    weights: "400 · 500 · 700",
    detail:
      "Every uppercase eyebrow uses it at 0.12em letter-spacing, behind a small teal dot.",
    href: "https://fonts.google.com/specimen/JetBrains+Mono",
  },
];

export default function PressPage() {
  return (
    <>
      <PageHeader
        eyebrow="Press kit"
        title="Everything you need to write about us accurately."
        description="Logos in both colour versions, the exact palette with copyable values, the typefaces, and a boilerplate that sticks to the facts."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Press kit", href: "/press" },
        ]}
        actions={
          <Button asChild>
            <a href="/brand/jjdj-lockup-on-light.svg" download>
              <icons.download />
              Download the lockup
            </a>
          </Button>
        }
      />

      {/* ---------- Logos ---------- */}
      <section aria-labelledby="logos" className="container-page pb-24">
        <SectionHeading
          id="logos"
          eyebrow="Logos"
          title="Six files, two colour versions."
          description="All SVG, all on a 104 × 104 grid. Please do not recolour the tiles, rotate the grid, or place the mark on a busy photograph."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LOGOS.map((logo, index) => (
            <Reveal
              key={logo.file}
              delay={Math.min(index * 0.05, 0.25)}
              as="li"
            >
              <figure className="surface-card overflow-hidden">
                <div
                  className={cn(
                    "grid h-44 place-items-center p-8",
                    logo.background === "dark" ? "bg-[#0A0A0A]" : "bg-[#F7F7F4]",
                  )}
                >
                  {logo.wordmark ? (
                    <Logo
                      size={46}
                      wordmark
                      tileColor={logo.tileColor}
                      label="JJDJ"
                    />
                  ) : (
                    <LogoGrid size={62} tileColor={logo.tileColor} label="JJDJ" />
                  )}
                </div>

                <figcaption className="flex items-start justify-between gap-4 border-t border-border p-5">
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] font-medium text-foreground">
                      {logo.name}
                      <span className="ml-2 font-mono text-[0.6875rem] text-subtle-foreground">
                        {logo.background === "dark" ? "on dark" : "on light"}
                      </span>
                    </p>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {logo.note}
                    </p>
                  </div>
                  <a
                    href={logo.file}
                    download
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-[10px] border border-border",
                      "text-muted-foreground transition-colors duration-200",
                      "hover:border-accent/40 hover:text-accent-text",
                    )}
                    aria-label={`Download ${logo.name} for ${logo.background} backgrounds`}
                  >
                    <icons.download className="size-4" />
                  </a>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- Notle ---------- */}
      <section
        aria-labelledby="notle-logos"
        className="container-page pb-24"
      >
        <SectionHeading
          id="notle-logos"
          eyebrow="Notle"
          title="The app has its own mark."
          description="Notle is drawn in the same teal as the studio, so the two lockups can sit side by side. Use the mark for the app icon and small spaces, and the wordmark wherever the name has room."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {[
            {
              file: "/brand/notle-mark.svg",
              name: "Notle mark",
              note: "The boxed N with the pen through it. App icon, favicons and tight spaces.",
              artwork: <NotleMark size={92} label="Notle" />,
            },
            {
              file: "/brand/notle-wordmark.svg",
              name: "Notle wordmark",
              note: "The full lockup. Use it wherever the name can be read at 40px tall or more.",
              artwork: <NotleWordmark height={44} label="Notle" />,
            },
          ].map((logo, index) => (
            <Reveal key={logo.file} delay={index * 0.06} as="li">
              <figure className="surface-card overflow-hidden">
                <div className="grid h-44 place-items-center bg-background p-8">
                  {logo.artwork}
                </div>

                <figcaption className="flex items-start justify-between gap-4 border-t border-border p-5">
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] font-medium text-foreground">
                      {logo.name}
                      <span className="ml-2 font-mono text-[0.6875rem] text-subtle-foreground">
                        #14B8A6
                      </span>
                    </p>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {logo.note}
                    </p>
                  </div>
                  <a
                    href={logo.file}
                    download
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-[10px] border border-border",
                      "text-muted-foreground transition-colors duration-200",
                      "hover:border-accent/40 hover:text-accent-text",
                    )}
                    aria-label={`Download the ${logo.name}`}
                  >
                    <icons.download className="size-4" />
                  </a>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- Colours ---------- */}
      <section
        aria-labelledby="colours"
        className="border-y border-border bg-surface/40 py-24"
      >
        <div className="container-page">
          <SectionHeading
            id="colours"
            eyebrow="Colour"
            title="One accent, and a lot of grey."
            description="Teal is the only colour in the system. Everything else is near-black, off-white, or a grey in between — exactly like the logo. Click any swatch to copy its hex."
          />
          <div className="mt-12">
            <ColorSwatches colors={BRAND_COLORS} />
          </div>

          <Reveal className="mt-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-card border border-border bg-card px-5 py-4">
              <span className="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                Rules
              </span>
              <p className="max-w-[64ch] text-[0.875rem] text-muted-foreground">
                Teal is used sparingly: calls to action, active states,
                highlights, focus rings and the play triangle. Never as a
                background wash, never gradient-filled, and never for body text
                lighter than the deepened teal above.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Type ---------- */}
      <section aria-labelledby="typefaces" className="container-page py-24">
        <SectionHeading
          id="typefaces"
          eyebrow="Type"
          title="Three typefaces, and why each one."
        />

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {FONTS.map((font, index) => (
            <Reveal key={font.name} delay={Math.min(index * 0.06, 0.2)} as="li">
              <article className="surface-card flex h-full flex-col p-6">
                <p
                  className={cn(
                    "text-[2.5rem] leading-none text-foreground",
                    index === 0
                      ? "font-display font-black tracking-[-0.03em]"
                      : index === 2
                        ? "font-mono"
                        : "font-sans",
                  )}
                >
                  {index === 0 ? "JJDJ" : index === 2 ? "2.4.0" : "Aa"}
                </p>

                <h3 className="mt-6 font-display text-[1.0625rem] font-black tracking-[-0.02em] text-foreground">
                  {font.name}
                </h3>
                <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.08em] text-accent-text uppercase">
                  {font.role}
                </p>
                <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-muted-foreground">
                  {font.detail}
                </p>
                <p className="mt-5 border-t border-border pt-4 font-mono text-[0.75rem] text-subtle-foreground">
                  {font.weights}
                </p>
                <a
                  href={font.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] text-accent-text link-underline"
                >
                  Get it on Google Fonts
                  <icons.arrowUpRight className="size-3.5" />
                </a>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- Boilerplate ---------- */}
      <section aria-labelledby="boilerplate" className="container-page pb-24">
        <SectionHeading
          id="boilerplate"
          eyebrow="Words"
          title="Boilerplate you can paste."
          description="One sentence for a listing, one paragraph for a story. Please keep the spelling of “JJDJ”, the founders and the launch date accurate."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            {
              label: "One line",
              body: "JJDJ is a two-person studio in Perth, Western Australia, building Notle — a workspace for studying, writing, presenting, spreadsheets and PDFs.",
            },
            {
              label: "One paragraph",
              body: "JJDJ was started by Joash Jackson (CTO) and Darryl Lopez (CEO), two high schoolers in Perth, Western Australia. The studio began because they wanted to help others with the problems they face every day. Their first app, Notle, launches on 10 November 2026 and turns lecture audio into key points, study guides and flashcards alongside editors for documents, presentations, spreadsheets and PDFs.",
            },
            {
              label: "Facts",
              body: `Founded ${site.founded} · Perth, WA · two people · one app · Notle launches ${site.launch.label}.`,
            },
          ].map((block, index) => (
            <Reveal key={block.label} delay={index * 0.06}>
              <article className="surface-card h-full p-6">
                <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                  {block.label}
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {block.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-col items-start gap-5 rounded-panel border border-border bg-card p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-[1.125rem] font-black tracking-[-0.02em] text-foreground">
                Writing about Notle?
              </p>
              <p className="mt-1.5 max-w-[52ch] text-[0.9375rem] text-muted-foreground">
                The Notle website has the current feature, plan and policy
                details, so a story does not have to rely on this page.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <a
                href={site.launch.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                Open Notle
                <icons.externalLink />
              </a>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
