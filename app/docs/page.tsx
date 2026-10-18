import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/brand/icon";
import { Button } from "@/components/ui/button";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { helpArticles, helpCategories } from "@/data/help";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/page-metadata";
import { icons } from "@/lib/icons";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Developer docs",
  description:
    "The documentation index for JJDJ apps: every published reference, what Notle does today, and the status of public API access.",
  path: "/docs",
});

/**
 * Docs.
 *
 * The 404 links here, so it has to be a real page rather than a stub. It is an
 * index of what has actually been written — the help centre is the reference
 * today — plus a plain statement that there is no public API to document yet.
 * When one exists, this is where it goes.
 */
export default function DocsPage() {
  /** Newest first, so a freshly written article floats to the top. */
  const articles = [...helpArticles].sort((a, b) => b.updated.localeCompare(a.updated));

  return (
    <>
      <PageHeader
        eyebrow="Docs"
        title="The reference for what we have shipped."
        description="Written from the code, not from a roadmap. Notle is the only app so far, and every feature it has is documented below."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Docs", href: "/docs" },
        ]}
        actions={
          <Button asChild size="lg" shine>
            <Link href="/help">
              Open the help centre
              <icons.arrowRight />
            </Link>
          </Button>
        }
      />

      {/* ---------- By area ---------- */}
      <section aria-labelledby="areas" className="container-page pb-20">
        <SectionHeading
          id="areas"
          eyebrow="Browse by area"
          title="Four places to start"
          description="Each area collects the articles that describe how the app behaves, including the parts that are easy to get wrong."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {helpCategories.map((category, index) => (
            <Reveal key={category.slug} delay={Math.min(index * 0.05, 0.2)} as="li">
              <Link
                href={`/help/category/${category.slug}`}
                className="surface-card flex h-full flex-col p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/35"
              >
                <span className="grid size-10 place-items-center rounded-[12px] border border-border bg-card text-accent">
                  <Icon name={category.icon} className="size-[1.05rem]" />
                </span>
                <h3 className="mt-5 text-[1.0625rem] font-bold text-foreground">
                  {category.title}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- Every published article ---------- */}
      <section aria-labelledby="articles" className="container-page pb-20">
        <SectionHeading
          id="articles"
          eyebrow="Full index"
          title="Every published article"
          description={`${articles.length} articles, reviewed ${
            articles[0] ? formatDate(articles[0].updated) : site.launch.label
          } and updated whenever the app changes.`}
        />

        <ul className="mt-10 divide-y divide-border border-y border-border">
          {articles.map((article, index) => (
            <Reveal key={article.slug} delay={Math.min(index * 0.04, 0.16)} as="li">
              <Link
                href={`/help/${article.slug}`}
                className="group flex flex-col gap-2 py-6 transition-colors sm:flex-row sm:items-baseline sm:gap-8"
              >
                <span className="font-mono text-[0.6875rem] text-subtle-foreground sm:w-[11rem] sm:shrink-0">
                  {article.category.replace(/-/g, " ")}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-3">
                    <span className="text-[1.0625rem] font-semibold text-foreground group-hover:text-accent-text">
                      {article.title}
                    </span>
                    {article.popular ? <Badge variant="accent">Popular</Badge> : null}
                  </span>
                  <span className="mt-1.5 block max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {article.description}
                  </span>
                </span>
                <span className="mt-1 flex shrink-0 items-center gap-3 font-mono text-[0.6875rem] text-subtle-foreground sm:ml-auto">
                  {article.readingTime} min
                  <icons.arrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- API status ---------- */}
      <section aria-labelledby="api" className="container-page pb-24">
        <div className="surface-card relative overflow-hidden p-8 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-accent-wash blur-3xl"
          />
          <div className="relative max-w-[58ch]">
            <Eyebrow>Public API</Eyebrow>
            <h2 id="api" className="text-subsection mt-5 text-foreground">
              There is no public API yet.
            </h2>
            <p className="mt-4 text-[1rem] leading-relaxed text-muted-foreground">
              Notle is an app, not a platform: the editors run locally, and the cloud
              features go through our own server. Nothing is open for third-party
              requests, so there are no keys to issue and no endpoints to document. If
              that changes, the reference lands on this page first.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/products/notle">
                  What Notle does today
                  <icons.arrowRight />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/contact">
                  Ask us about access
                  <icons.mail />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
