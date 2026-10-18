import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/page-header";
import { HelpSearch } from "@/components/help/help-search";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/brand/icon";
import { helpCategories, getArticlesInCategory, type HelpCategorySlug } from "@/data/help";
import { getProduct, products } from "@/data/products";
import { pageMetadata } from "@/lib/page-metadata";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return helpCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = helpCategories.find((entry) => entry.slug === slug);
  if (!category) return { title: "Category not found" };

  return pageMetadata({
    title: category.title,
    description: `${category.description} ${category.title} guides for Notle.`,
    path: `/help/category/${category.slug}`,
  });
}

export default async function HelpCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = helpCategories.find((entry) => entry.slug === slug);
  if (!category) notFound();

  const articles = getArticlesInCategory(category.slug as HelpCategorySlug);

  return (
    <>
      <PageHeader
        eyebrow="Help centre"
        title={category.title}
        description={category.description}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Help", href: "/help" },
          { name: category.title, href: `/help/category/${category.slug}` },
        ]}
      >
        <div className="mt-9 max-w-[42rem]">
          <HelpSearch />
        </div>
      </PageHeader>

      <div className="container-page pb-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div>
            <ul className="space-y-3">
              {articles.map((article, index) => {
                const product = article.product ? getProduct(article.product) : undefined;
                return (
                  <Reveal key={article.slug} delay={Math.min(index * 0.04, 0.2)} as="li">
                    <Link
                      href={`/help/${article.slug}`}
                      className="group flex items-start gap-4 rounded-card border border-border bg-card p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent/35"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-border bg-surface text-accent">
                        <Icon name={category.icon} className="size-[1.05rem]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[1rem] font-bold tracking-[-0.01em] text-foreground">
                          {article.title}
                        </span>
                        <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-muted-foreground">
                          {article.description}
                        </span>
                        <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.6875rem] text-subtle-foreground">
                          <span>{article.readingTime} min read</span>
                          <span>Updated {formatDate(article.updated)}</span>
                          {product ? <span>{product.name}</span> : null}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>

            {articles.length === 0 ? (
              <p className="surface-card p-8 text-center text-[0.9375rem] text-muted-foreground">
                Nothing published in this category yet.{" "}
                <Link href="/help" className="text-accent-text link-underline">
                  Back to Notle help
                </Link>
                .
              </p>
            ) : null}
          </div>

          {/* Other categories */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
              Other categories
            </p>
            <ul className="mt-4 space-y-2">
              {helpCategories
                .filter((entry) => entry.slug !== category.slug)
                .map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/help/category/${entry.slug}`}
                      className="block rounded-[10px] border border-border bg-card px-3.5 py-3 text-[0.875rem] text-foreground transition-colors duration-200 hover:border-accent/35 hover:text-accent-text"
                    >
                      {entry.title}
                    </Link>
                  </li>
                ))}
              {products.slice(0, 3).map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="block rounded-[10px] border border-border bg-card px-3.5 py-3 text-[0.875rem] text-foreground transition-colors duration-200 hover:border-accent/35 hover:text-accent-text"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
