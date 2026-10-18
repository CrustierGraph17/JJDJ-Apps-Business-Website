import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { TeamGrid } from "@/components/sections/team-grid";
import { Reveal } from "@/components/motion/reveal";
import { ScrollHighlight } from "@/components/motion/mask-text";
import { Button } from "@/components/ui/button";
import { NotleMark } from "@/components/brand/notle-logo";
import { site } from "@/data/site";
import { story } from "@/data/team";
import { getProduct } from "@/data/products";
import { pageMetadata } from "@/lib/page-metadata";
import { icons } from "@/lib/icons";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "JJDJ is Joash Jackson and Darryl Lopez, two high schoolers in Perth, Western Australia. We started it to help others with the problems we face every day.",
  path: "/about",
});

export default function AboutPage() {
  const product = getProduct("notle");

  return (
    <>
      <PageHeader
        eyebrow="About JJDJ"
        title="Two people in Perth."
        description="We're Joash and Darryl. JJDJ is the studio we started while still at school."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
        actions={
          <div className="flex flex-col items-start gap-3">
            <span className="flex items-center gap-2 rounded-pill border border-border bg-card px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground uppercase">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              {site.location} · {site.founded}
            </span>
            <span className="font-mono text-[0.6875rem] text-subtle-foreground">
              Two employees · one app
            </span>
          </div>
        }
      />

      {/* ---------- Why we started ---------- */}
      <section aria-labelledby="story" className="container-page pb-24">
        <h2 id="story" className="sr-only">
          Why we started
        </h2>
        <ScrollHighlight
          text={story}
          accent={["help", "others"]}
          className="max-w-[24ch] font-display text-[clamp(1.875rem,5.4vw,4rem)] leading-[1.08] font-black tracking-[-0.035em] text-foreground md:max-w-[30ch]"
        />

        <div className="mt-12 grid max-w-[64rem] gap-6 md:grid-cols-2">
          <Reveal>
            <p className="text-[1.0625rem] leading-[1.72] text-muted-foreground">
              We&rsquo;re two high schoolers in Perth, Western Australia. Joash
              is the CTO and Darryl is the CEO. Everything here is made by the
              two of us, while we are still at school.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[1.0625rem] leading-[1.72] text-muted-foreground">
              We started JJDJ because we wanted to help others with the problems
              we face every day. Our first app, Notle, launches on{" "}
              {site.launch.label}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Team ---------- */}
      <section
        id="team"
        aria-labelledby="team-heading"
        className="scroll-mt-32 border-y border-border bg-surface/40 py-24"
      >
        <div className="container-page">
          <SectionHeading
            id="team-heading"
            eyebrow="The team"
            title="Two employees."
            description="That is the whole company. No account managers, no support queue and no one else to blame."
          />

          <div className="mt-14">
            <TeamGrid />
          </div>
        </div>
      </section>

      {/* ---------- What we're building ---------- */}
      <section aria-labelledby="building" className="container-page py-24">
        <div className="relative isolate overflow-hidden rounded-panel border border-border bg-card p-8 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(45%_100%_at_20%_0%,var(--accent-wash),transparent_70%)]"
          />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                What we&rsquo;re building
              </p>
              <h2
                id="building"
                className="mt-4 font-display text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.06] font-black tracking-[-0.03em] text-foreground"
              >
                One app, for now.
              </h2>
              <p className="mt-4 max-w-[48ch] text-[1rem] leading-relaxed text-muted-foreground">
                {product?.summary}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/products/notle">
                    Explore Notle
                    <icons.arrowRight />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <a
                    href={site.launch.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Open the app
                    <icons.externalLink />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-card border border-border bg-surface/70 p-6">
              <NotleMark size={56} />
              <div>
                <p className="font-display text-[1.25rem] font-black tracking-[-0.02em] text-foreground">
                  {product?.name}
                </p>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {product?.tagline}
                </p>
                <p className="mt-3 font-mono text-[0.6875rem] tracking-[0.06em] text-accent-text uppercase">
                  Launches {site.launch.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
