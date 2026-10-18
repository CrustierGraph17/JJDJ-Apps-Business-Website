import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundActions, NotFoundIde } from "@/components/sections/not-found-ide";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "This page didn't ship",
  description:
    "That page does not exist — our own search script gave up trying to find it. Head home, read the docs, or open a support ticket.",
  // A 404 has no business in an index.
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * An editor that is just as lost as the visitor: the explorer shows the
 * project, the main pane is the one file that was supposed to find this page,
 * and the terminal runs it on a loop until it gives up in public. The way out
 * is a row of terminal actions, rendered from the first paint so nobody has to
 * wait for the joke to finish.
 */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dotted-grid opacity-60" />
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(55%_100%_at_50%_0%,var(--accent-wash),transparent_70%)]" />
      </div>

      <div className="container-page">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] xl:items-end xl:gap-12">
          {/* Copy */}
          <div className="max-w-[40rem]">
            <Reveal direction="fade">
              <Eyebrow>Error 404</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-4">
                {/* The number is the headline; the readable name is for assistive tech. */}
                <span className="sr-only">404 — page not found</span>
                <span
                  aria-hidden="true"
                  className="block font-display text-[clamp(8rem,24vw,13rem)] leading-[0.76] font-black tracking-[-0.06em] text-foreground"
                >
                  4<span className="text-accent-text">0</span>4
                </span>
                <span
                  aria-hidden="true"
                  className="mt-4 flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.42em] text-muted-foreground uppercase sm:text-[0.75rem]"
                >
                  <span aria-hidden="true" className="h-px w-8 bg-border-strong" />
                  page not found
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-subsection mt-6 text-foreground">
                This page didn&rsquo;t ship.
              </p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">
                The URL you asked for is not in this build. So we wrote a script to hunt it
                down — it scans ports, checks under the server floorboards, and gives up
                loudly every single time. You can watch it fail below, or just pick a way
                out.
              </p>
            </Reveal>
          </div>

          {/* The way out, rendered from the first paint. */}
          <Reveal direction="fade" delay={0.18} className="xl:pb-1">
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-subtle-foreground uppercase">
              {"// pick a destination"}
            </p>
            <NotFoundActions className="mt-4 xl:flex-col" />
          </Reveal>
        </div>

        {/* The editor, and the loop it is stuck in */}
        <div className="paint-reveal paint-up mt-10 md:mt-14" style={{ animationDelay: "120ms" }}>
          <NotFoundIde />
        </div>

        <p className="mt-8 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          Still stuck? The{" "}
          <Link href="/help" className="text-accent-text link-underline">
            help centre
          </Link>{" "}
          covers how Notle works, and there is a{" "}
          <Link href="/contact" className="text-accent-text link-underline">
            real person
          </Link>{" "}
          at the end of every ticket.
        </p>
      </div>
    </section>
  );
}
