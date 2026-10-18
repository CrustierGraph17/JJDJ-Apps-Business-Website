"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { LogoGrid } from "@/components/brand/logo-grid";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { icons } from "@/lib/icons";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Closing CTA.
 *
 * A full-width near-black panel — the same near-black as the dark theme — with
 * the four-tile mark slowly breathing behind the headline. No email capture,
 * because there is no list: just the launch date and a link to Notle.
 */
export function FinalCta() {
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="final-cta" className="container-page pb-8">
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-panel border border-white/10",
          "bg-[#0A0A0A] px-6 py-20 text-center sm:px-12 md:py-28",
          "dark:bg-surface",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(20,184,166,0.20),transparent_70%)]"
        />

        <motion.div
          className="relative mx-auto grid w-fit place-items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
        >
          <span
            aria-hidden="true"
            className="absolute size-40 rounded-full bg-accent/12 blur-3xl"
          />
          <motion.div
            animate={reduce ? undefined : { scale: [1, 1.035, 1] }}
            transition={
              reduce ? undefined : { duration: 6, ease: "easeInOut", repeat: Infinity }
            }
          >
            <LogoGrid
              size={132}
              animated
              label="JJDJ"
              tileColor="#F5F5F2"
              className="relative"
            />
          </motion.div>
        </motion.div>

        <h2
          id="final-cta"
          className="relative mx-auto mt-10 max-w-[22ch] font-display text-[clamp(2.25rem,5.4vw,4rem)] leading-[1.02] font-black tracking-[-0.035em] text-[#F5F5F2]"
        >
          Notle launches on{" "}
          <span className="text-accent">{site.launch.label}</span>.
        </h2>

        <p className="relative mx-auto mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-white/65">
          One app, made by two people in Perth. Have a look at what it does.
        </p>

        <div className="relative mx-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" shine>
            <a href={site.launch.href} target="_blank" rel="noreferrer noopener">
              Open Notle
              <icons.externalLink />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="border-white/15 bg-white/5 text-[#F5F5F2] hover:bg-white/10"
          >
            <Link href="/products/notle">How Notle works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
