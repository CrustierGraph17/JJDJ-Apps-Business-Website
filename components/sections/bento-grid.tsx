import { SectionHeading } from "@/components/sections/section-heading";
import { BentoAnimation } from "@/components/sections/bento-animations";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { Icon } from "@/components/brand/icon";
import { bentoCards } from "@/data/home";
import { eyebrows } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * "Why JJDJ" bento grid.
 *
 * Six cards on a 4-column grid at desktop, each with its own footprint. The
 * layout is placed explicitly (col-start / row-start) rather than left to
 * auto-flow, so there is never a hole.
 */

/**
 * Placement, keyed by the card's index in data/home.ts.
 *
 * The opening card is wide; the closing row puts its wide card in the middle,
 * so the longest copy ("Free to start") gets room to breathe and the two-person
 * card that follows stays compact. Nothing spans a second row — with copy this
 * short, a two-row card is mostly empty space.
 */
const LAYOUT = [
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1 lg:col-span-2",
  "sm:col-span-2 lg:col-span-1",
];

export function BentoGrid() {
  return (
    <section
      aria-labelledby="why-jjdj"
      className="container-page py-24 md:py-32"
    >
      <SectionHeading
        id="why-jjdj"
        eyebrow={eyebrows.why}
        title={
          <>
            Software you keep, not software you
            <span className="text-accent"> tolerate</span>.
          </>
        }
        description="Six principles that decide what we build, what we refuse to build, and what happens after you pay for it."
      />

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bentoCards.map((card, index) => (
          <Reveal
            key={card.title}
            delay={Math.min(index * 0.06, 0.3)}
            className={cn("min-h-[15rem]", LAYOUT[index])}
          >
            <TiltCard className="h-full">
              <article className="surface-card relative flex h-full flex-col overflow-hidden p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 place-items-center rounded-[12px] border border-border bg-card text-accent">
                    <Icon name={card.icon} className="size-[1.05rem]" />
                  </span>
                  <span className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-[1.1875rem] font-black tracking-[-0.02em] text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {card.description}
                </p>

                <div className="mt-6 flex flex-1 items-center">
                  <BentoAnimation name={card.animation} />
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
