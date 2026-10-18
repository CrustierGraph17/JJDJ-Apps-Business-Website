import { TechText } from "@/components/motion/tech-text";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/badge";
import { eyebrows, site } from "@/data/site";

/**
 * The wordmark band.
 *
 * A full-width canvas rendering of the JJDJ wordmark: letters trace as vector
 * outlines under the cursor, label themselves with their own metrics, drag off
 * the baseline and spring home, and kick when clicked. See
 * `components/motion/tech-text.tsx`.
 *
 * Canvas colours can't resolve CSS custom properties, so the accent is passed
 * as a literal. `--accent` is #14b8a6 in both themes, so it stays correct in
 * light and dark; the letters themselves take the ink from `currentColor` and
 * the font from the wrapper, so this band needs no theme props at all.
 */
const ACCENT = "#14b8a6";

export function BrandWordmark() {
  return (
    <section
      aria-labelledby="wordmark-heading"
      className="container-page py-24 md:py-32"
    >
      <Reveal direction="fade">
        <Eyebrow>{eyebrows.wordmark}</Eyebrow>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 id="wordmark-heading" className="sr-only">
          The JJDJ wordmark
        </h2>
        <p className="text-section mt-5 max-w-[24ch] text-foreground">
          Four letters,
          <span className="text-accent"> drawn</span>.
        </p>
      </Reveal>

      {/* The wordmark measures its own container, so the box simply has to
          exist. `font-display` is what it reads to pick up Nunito Sans. */}
      <div className="font-display mt-10 h-[38vh] max-h-[380px] min-h-[220px] w-full">
        <TechText
          text={site.shortName}
          fontWeight={900}
          fontSize={300}
          letterSpacing={-0.03}
          accentColor={ACCENT}
          intro="metrics"
          introDuration={2.2}
          guides
          specks={15}
          reveal="letter"
          align="center"
        />
      </div>

      <p className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
        Hover to trace the outlines · drag a letter · click to kick it
      </p>
    </section>
  );
}
