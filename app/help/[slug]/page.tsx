import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleToc } from "@/components/help/article-toc";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Reveal } from "@/components/motion/reveal";
import { NotleMark } from "@/components/brand/notle-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getArticle,
  helpArticles,
  type HelpArticle,
} from "@/data/help";
import { getProduct } from "@/data/products";
import { site } from "@/data/site";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, JsonLd } from "@/lib/json-ld";
import { formatDate, slugifyHeading } from "@/lib/utils";
import { icons } from "@/lib/icons";

export function generateStaticParams() {
  return helpArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/help/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/help/${article.slug}`,
      siteName: site.name,
      locale: site.locale,
    },
  };
}

/**
 * Help article.
 *
 * A reading template: progress bar, a table of contents that tracks your
 * position, prose set at a 68-character measure, and a feedback widget at the
 * end. Section ids are generated from the headings with the same helper the
 * table of contents uses, so they can never drift apart.
 */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const product = article.product ? getProduct(article.product) : undefined;
  const sections = article.sections.map((section) => ({
    id: slugifyHeading(section.heading),
    heading: section.heading,
  }));

  const related = helpArticles
    .filter(
      (entry) =>
        entry.slug !== article.slug &&
        (entry.product === article.product || entry.category === article.category),
    )
    .slice(0, 3);

  const trail = [
    { name: "Home", href: "/" },
    { name: "Help", href: "/help" },
    { name: article.title, href: `/help/${article.slug}` },
  ];

  return (
    <>
      <ScrollProgress />

      <div className="container-page pt-32 md:pt-40">
        <Breadcrumbs trail={trail} />
      </div>

      <article className="container-page pb-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_15rem]">
          {/* ---------- Prose ---------- */}
          <div>
            <header className="max-w-[68ch]">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="neutral" size="md">
                  {article.category.replace(/-/g, " ")}
                </Badge>
                {product ? (
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-3 py-1 text-[0.75rem] text-muted-foreground transition-colors hover:border-accent/35 hover:text-accent-text"
                  >
                    <NotleMark size={18} label={null} />
                    {product.name}
                  </Link>
                ) : null}
              </div>

              <h1 className="text-section mt-6 text-foreground">{article.title}</h1>

              <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">
                {article.description}
              </p>

              <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 font-mono text-[0.6875rem] text-subtle-foreground">
                <span className="flex items-center gap-1.5">
                  <icons.clock className="size-3.5" aria-hidden="true" />
                  {article.readingTime} min read
                </span>
                <span>Updated {formatDate(article.updated)}</span>
                <span className="flex items-center gap-1.5">
                  <icons.badgeCheck className="size-3.5 text-accent" aria-hidden="true" />
                  Notle help
                </span>
              </p>
            </header>

            {/* Sections */}
            <div className="mt-12">
              {article.sections.map((section, index) => (
                <Reveal
                  key={section.heading}
                  delay={0.03}
                  className={index === 0 ? undefined : "mt-14"}
                >
                  <section
                    id={slugifyHeading(section.heading)}
                    className="max-w-[68ch] scroll-mt-32"
                  >
                    <h2 className="font-display text-[1.4375rem] font-black tracking-[-0.025em] text-foreground">
                      {section.heading}
                    </h2>

                    {section.paragraphs?.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="mt-4 text-[1rem] leading-[1.72] text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}

                    {section.bullets ? (
                      <ul className="mt-5 space-y-3">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3.5">
                            <span
                              aria-hidden="true"
                              className="mt-[0.62rem] size-1.5 shrink-0 rounded-full bg-accent"
                            />
                            <span className="text-[1rem] leading-[1.72] text-muted-foreground">
                              {bullet}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {section.code ? (
                      <figure className="mt-5 overflow-hidden rounded-card border border-border bg-card">
                        <figcaption className="flex items-center gap-2.5 border-b border-border bg-surface px-4 py-2.5">
                          <span
                            aria-hidden="true"
                            className="size-2.5 rounded-[3px] bg-accent"
                          />
                          <span className="font-mono text-[0.6875rem] text-muted-foreground">
                            {section.code.label}
                          </span>
                        </figcaption>
                        <pre className="overflow-x-auto px-4 py-4">
                          <code className="font-mono text-[0.8125rem] leading-relaxed whitespace-pre text-foreground">
                            {section.code.content}
                          </code>
                        </pre>
                      </figure>
                    ) : null}

                    {section.note ? (
                      <aside className="mt-5 flex gap-4 rounded-card border border-accent/25 bg-accent-wash p-5">
                        <icons.info
                          className="mt-0.5 size-4 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <p className="text-[0.9375rem] leading-relaxed text-foreground">
                          {section.note}
                        </p>
                      </aside>
                    ) : null}
                  </section>
                </Reveal>
              ))}
            </div>

            {/* Article FAQ */}
            {article.faqs && article.faqs.length > 0 ? (
              <Reveal className="mt-16 max-w-[68ch]">
                <h2 className="font-display text-[1.25rem] font-black tracking-[-0.025em] text-foreground">
                  Related questions
                </h2>
                <Accordion type="single" collapsible className="mt-5 border-t border-border">
                  {article.faqs.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`a-faq-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            ) : null}

            {/* Support */}
            <div className="mt-16 max-w-[68ch]">
              <div className="surface-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="font-display text-[1.125rem] font-black tracking-[-0.02em] text-foreground">
                    Still stuck?
                  </p>
                  <p className="mt-1.5 max-w-[46ch] text-[0.9375rem] text-muted-foreground">
                    Notle&rsquo;s support page is the place for account,
                    billing and data requests.
                  </p>
                </div>
                <Button asChild className="shrink-0" shine>
                  <a
                    href={`${site.launch.href}/support`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Notle support
                    <icons.externalLink />
                  </a>
                </Button>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 ? (
              <Reveal className="mt-16 max-w-[68ch]">
                <h2 className="font-display text-[1.25rem] font-black tracking-[-0.025em] text-foreground">
                  Read next
                </h2>
                <ul className="mt-5 space-y-3">
                  {related.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/help/${entry.slug}`}
                        className="group flex items-start justify-between gap-6 rounded-card border border-border bg-card p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent/35"
                      >
                        <span>
                          <span className="block font-display text-[0.9375rem] font-bold text-foreground">
                            {entry.title}
                          </span>
                          <span className="mt-1 block text-[0.875rem] text-muted-foreground">
                            {entry.description}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          {/* ---------- Side rail: table of contents ---------- */}
          <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <ArticleToc sections={sections} />
          </aside>
        </div>
      </article>

      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={breadcrumbJsonLd(trail)} />
      {article.faqs && article.faqs.length > 0 ? (
        <JsonLd data={faqJsonLd(article.faqs)} />
      ) : null}
    </>
  );
}

export type { HelpArticle };
