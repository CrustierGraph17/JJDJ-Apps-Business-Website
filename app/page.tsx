import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { BentoGrid } from "@/components/sections/bento-grid";
import { TeamGrid } from "@/components/sections/team-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { BrandWordmark } from "@/components/sections/brand-wordmark";
import { FinalCta } from "@/components/sections/final-cta";
import { NotleScreens } from "@/components/product/notle-screens";
import { NotleEditorStrip } from "@/components/product/notle-editor-strip";
import { Button } from "@/components/ui/button";
import { story } from "@/data/team";
import { helpFaqs } from "@/data/help";
import { faqJsonLd, JsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/utils";
import { icons } from "@/lib/icons";

export const metadata: Metadata = {
  title: "JJDJ — Two high schoolers in Perth, building useful apps.",
  description:
    "JJDJ is Joash Jackson and Darryl Lopez, two high schoolers in Perth, Western Australia. Their first app, Notle, launches on 10 November 2026.",
  alternates: { canonical: "/" },
  openGraph: {
    url: absoluteUrl("/"),
    title: "JJDJ — Two high schoolers in Perth, building useful apps.",
    description:
      "We started JJDJ to help others with the problems we face every day. Our first app is Notle.",
  },
};

/**
 * Home page.
 *
 * Every section is its own component and every word of copy comes from
 * /data, so the page file stays a table of contents rather than a document.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ---------- Inside Notle ---------- */}
      <section
        aria-labelledby="inside-notle"
        className="border-y border-border bg-surface/40 py-24 md:py-32"
      >
        <div className="container-page">
          <SectionHeading
            id="inside-notle"
            eyebrow="Inside Notle"
            title={
              <>
                The app, before you
                <span className="text-accent"> sign up</span>.
              </>
            }
            description="Real screenshots of Notle: a study workspace that turns lecture audio into notes, then keeps the documents, slides, sheets and PDFs in the same place."
            action={
              <Button asChild variant="secondary">
                <Link href="/products/notle">
                  Explore Notle
                  <icons.arrowRight />
                </Link>
              </Button>
            }
          />

          <Reveal className="mt-12">
            <NotleScreens />
          </Reveal>

          <div className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                Four editors, one workspace
              </p>
              <Link
                href="/products/notle#editors"
                className="text-[0.8125rem] text-accent-text link-underline"
              >
                Meet the editors
              </Link>
            </div>
            <NotleEditorStrip className="mt-4" />
          </div>
        </div>
      </section>

      <BentoGrid />

      {/* ---------- The two of us ---------- */}
      <section
        aria-labelledby="team-heading"
        className="border-y border-border bg-surface/40 py-24 md:py-32"
      >
        <div className="container-page">
          <SectionHeading
            id="team-heading"
            eyebrow="The two of us"
            title={
              <>
                Two people, both still at
                <span className="text-accent"> school</span>.
              </>
            }
            description={story}
          />

          <div className="mt-14">
            <TeamGrid />
          </div>

          <Reveal className="mt-10">
            <Button asChild variant="secondary">
              <Link href="/about">
                Why we started
                <icons.arrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <BrandWordmark />
      <FinalCta />

      <JsonLd data={faqJsonLd(helpFaqs)} />
    </>
  );
}
