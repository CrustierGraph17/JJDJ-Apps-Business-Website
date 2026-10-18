import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { HelpSearch } from "@/components/help/help-search";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/brand/icon";
import { NotleMark } from "@/components/brand/notle-logo";
import { Button } from "@/components/ui/button";
import { Badge, Eyebrow } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getArticlesForProduct,
  helpArticles,
  helpCategories,
  helpFaqs,
  popularArticles,
} from "@/data/help";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { faqJsonLd, JsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-metadata";
import { icons } from "@/lib/icons";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Notle help",
  description:
    "How Notle works: recording lectures, study formats, the four editors, plans and billing, and what happens to your data.",
  path: "/help",
});

export default function HelpPage() {
  /** Products that actually have articles, so we never show an empty card. */
  const productCategories = products
    .map((product) => ({
      product,
      articles: getArticlesForProduct(product.slug),
    }))
    .filter((entry) => entry.articles.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Notle help"
        title="How can we help?"
        description="Plain answers about how Notle works, written from what the app actually does."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Help", href: "/help" },
        ]}
      >
        <div className="mt-10 max-w-[46rem]">
          <HelpSearch />
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-2 font-mono text-[0.6875rem] text-subtle-foreground">
              <icons.command className="size-3.5" aria-hidden="true" />
              ⌘K searches everything · / searches help
            </span>
            <span className="font-mono text-[0.6875rem] text-subtle-foreground">
              Notle launches {site.launch.label}
            </span>
          </div>
        </div>
      </PageHeader>

      {/* ---------- Categories ---------- */}
      <section aria-labelledby="categories" className="container-page pb-20">
        <h2 id="categories" className="sr-only">
          Browse by category
        </h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {helpCategories.map((category, index) => {
            const articles = helpArticles.filter(
              (article) => article.category === category.slug,
            );
            return (
              <Reveal key={category.slug} delay={Math.min(index * 0.05, 0.2)} as="li">
                <Link
                  href={`/help/category/${category.slug}`}
                  className="surface-card flex h-full flex-col p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/35"
                >
                  <span className="grid size-10 place-items-center rounded-[12px] border border-border bg-card text-accent">
                    <Icon name={category.icon} className="size-[1.05rem]" />
                  </span>
                  <h3 className="mt-5 font-display text-[1.0625rem] font-black tracking-[-0.02em] text-foreground">
                    {category.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="mt-5 font-mono text-[0.6875rem] text-subtle-foreground">
                    {articles.length} {articles.length === 1 ? "article" : "articles"}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-14">
          <Eyebrow>By app</Eyebrow>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {productCategories.map(({ product, articles }, index) => (
              <Reveal key={product.slug} delay={Math.min(index * 0.04, 0.2)} as="li">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex items-center gap-3.5 rounded-card border border-border bg-card p-4 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent/35"
                >
                  <NotleMark size={36} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] font-medium text-foreground">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[0.6875rem] text-subtle-foreground">
                      {articles.length}{" "}
                      {articles.length === 1 ? "guide" : "guides"} ·{" "}
                      {product.platforms.join(" · ")}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-accent">
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Popular ---------- */}
      <section className="border-y border-border bg-surface/40 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Popular articles"
            title="Where most people start."
          />
          <ul className="mt-10 grid gap-3 lg:grid-cols-3">
            {popularArticles.map((article, index) => (
              <Reveal key={article.slug} delay={Math.min(index * 0.05, 0.2)} as="li">
                <Link
                  href={`/help/${article.slug}`}
                  className="group flex h-full flex-col justify-between rounded-card border border-border bg-card p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent/35"
                >
                  <span>
                    <span className="block font-display text-[1rem] font-bold tracking-[-0.01em] text-foreground">
                      {article.title}
                    </span>
                    <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-muted-foreground">
                      {article.description}
                    </span>
                  </span>
                  <span className="mt-4 flex items-center justify-between font-mono text-[0.6875rem] text-subtle-foreground">
                    {article.readingTime} min read · updated{" "}
                    {formatDate(article.updated)}
                    <span
                      aria-hidden="true"
                      className="text-accent transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section aria-labelledby="help-faq" className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <SectionHeading
            id="help-faq"
            eyebrow="Common questions"
            title="The things people actually ask."
          />

          <Accordion type="single" collapsible className="border-t border-border">
            {helpFaqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`help-faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ---------- Still stuck ---------- */}
      <section className="container-page pb-24">
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-panel border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="accent" size="md">
                Notle support
              </Badge>
              <p className="mt-4 max-w-[46ch] font-display text-[1.25rem] font-black tracking-[-0.02em] text-foreground">
                Support details live on the Notle website.
              </p>
              <p className="mt-2 max-w-[52ch] text-[0.875rem] leading-relaxed text-muted-foreground">
                Notle&rsquo;s support page is the place for account, billing and
                data requests.
              </p>
            </div>
            <Button asChild shine className="shrink-0">
              <a
                href={`${site.launch.href}/support`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Open Notle support
                <icons.externalLink />
              </a>
            </Button>
          </div>
        </Reveal>
      </section>

      <JsonLd data={faqJsonLd(helpFaqs)} />
    </>
  );
}
