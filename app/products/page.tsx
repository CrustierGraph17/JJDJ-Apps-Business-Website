import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { NotleTiles } from "@/components/sections/notle-tiles";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/brand/icon";
import { NotleMark } from "@/components/brand/notle-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProduct } from "@/data/products";
import { site } from "@/data/site";
import { JsonLd, breadcrumbJsonLd, productListJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-metadata";
import { icons } from "@/lib/icons";

export const metadata: Metadata = pageMetadata({
  title: "Notle",
  description:
    "Notle is our first app: a workspace for study, documents, presentations, spreadsheets and PDFs. It launches on 10 November 2026.",
  path: "/products",
});

export default function ProductsPage() {
  const product = getProduct("notle");

  if (!product) return null;

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="One app, for now."
        description="We would rather finish one app properly than start eight. Notle is the first thing we have built."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
        ]}
        actions={
          <Button asChild shine>
            <Link href="/products/notle">
              Explore Notle
              <icons.arrowRight />
            </Link>
          </Button>
        }
      />

      <section aria-labelledby="notle" className="container-page pb-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Reveal>
            <div className="flex items-center gap-4">
              <NotleMark size={56} />
              <div>
                <h2
                  id="notle"
                  className="font-display text-[2rem] leading-none font-black tracking-[-0.03em] text-foreground"
                >
                  {product.name}
                </h2>
                <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.08em] text-accent-text uppercase">
                  {product.category} · Launches {site.launch.label}
                </p>
              </div>
            </div>

            <p className="mt-6 font-display text-[1.375rem] font-extrabold tracking-[-0.02em] text-foreground">
              {product.tagline}
            </p>
            <p className="mt-4 max-w-[48ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
              {product.summary}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {product.features.map((feature) => (
                <Badge key={feature.title} variant="outline" size="md">
                  {feature.title}
                </Badge>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/products/notle">
                  Read more
                  <icons.arrowRight />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <a href={site.launch.href} target="_blank" rel="noreferrer noopener">
                  Open Notle
                  <icons.externalLink />
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <NotleTiles />
          </Reveal>
        </div>

        <div className="mt-24">
          <SectionHeading
            eyebrow="What's inside"
            title="Built around the work, not the app."
            description="Six things Notle actually does today. No roadmap promises."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature, index) => (
              <Reveal key={feature.title} delay={Math.min(index * 0.05, 0.25)} as="li">
                <article className="surface-card h-full p-6">
                  <span className="grid size-10 place-items-center rounded-[12px] border border-border bg-card text-accent">
                    <Icon name={feature.icon} className="size-[1.05rem]" />
                  </span>
                  <h3 className="mt-5 font-display text-[1.0625rem] font-black tracking-[-0.02em] text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
        ])}
      />
      <JsonLd data={productListJsonLd([product])} />
    </>
  );
}
