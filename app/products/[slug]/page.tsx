import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/brand/icon";
import { ProductDetailHero } from "@/components/product/product-detail-hero";
import { NotleEditorCards } from "@/components/product/notle-editor-cards";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Badge, PlatformBadge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getProduct, products } from "@/data/products";
import { site } from "@/data/site";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, productJsonLd } from "@/lib/json-ld";
import { formatDate } from "@/lib/utils";
import { icons } from "@/lib/icons";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "App not found" };

  return {
    title: product.name,
    description: `${product.tagline} ${product.summary}`.slice(0, 300),
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "article",
      title: `${product.name} — ${product.tagline}`,
      description: product.summary,
      url: `/products/${product.slug}`,
      siteName: site.name,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${product.tagline}`,
      description: product.summary,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const trail = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: product.name, href: `/products/${product.slug}` },
  ];

  return (
    <>
      <div className="container-page pt-32 md:pt-40">
        <Breadcrumbs trail={trail} />
      </div>

      <ProductDetailHero product={product} />

      {/* ---------- What it does ---------- */}
      <section
        aria-labelledby="overview-heading"
        className="border-y border-border bg-surface/40 py-20"
      >
        <div className="container-page">
          <SectionHeading
            id="overview-heading"
            eyebrow="What it does"
            title="Study, write, present, model and annotate."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {product.description.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-[1rem] leading-[1.72] text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ---------- The four editors ---------- */}
      <section
        id="editors"
        aria-labelledby="editors-heading"
        className="container-page scroll-mt-32 py-20"
      >
        <SectionHeading
          id="editors-heading"
          eyebrow="The workspace"
          title="Four focused editors."
          description="Documents, presentations, spreadsheets and PDFs, in the same place you study."
        />

        <NotleEditorCards apps={product.workspaceApps} className="mt-12" />
      </section>

      {/* ---------- Plans ---------- */}
      <section
        id="plans"
        aria-labelledby="plans-heading"
        className="scroll-mt-32 border-y border-border bg-surface/40 py-20"
      >
        <div className="container-page">
          <SectionHeading
            id="plans-heading"
            eyebrow="Plans"
            title="Free to start."
            description="Prices are in USD. Taxes and any local currency conversion are shown at checkout, and billing runs through Whop."
          />

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {product.plans.map((plan, index) => (
              <Reveal key={plan.name} delay={Math.min(index * 0.05, 0.2)} as="li">
                <article className="surface-card flex h-full flex-col p-6">
                  <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-2 gap-y-2">
                    <h3 className="font-display text-[1.0625rem] font-black tracking-[-0.02em] text-foreground">
                      {plan.name}
                    </h3>
                    {plan.recommended ? (
                      <Badge variant="accent">Recommended</Badge>
                    ) : null}
                  </div>
                  <p className="mt-3 font-display text-[1.5rem] leading-none font-black tracking-[-0.03em] text-foreground">
                    {plan.price}
                  </p>
                  {plan.period ? (
                    <p className="mt-1 font-mono text-[0.6875rem] text-subtle-foreground">
                      {plan.period}
                    </p>
                  ) : null}
                  <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-muted-foreground">
                    {plan.detail}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-8">
            <div className="flex flex-col items-start gap-4 rounded-card border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[64ch] text-[0.875rem] leading-relaxed text-muted-foreground">
                Yearly billing is also offered, with savings of 17%, 20% and
                25%. The Notle+ trial is available once per eligible customer
                and renews automatically unless cancelled before it ends.
              </p>
              <Button asChild variant="secondary" className="shrink-0">
                <a
                  href={`${site.launch.href}/pricing`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Current plans
                  <icons.externalLink />
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Launch + requirements ---------- */}
      <section
        id="launch"
        aria-labelledby="launch-heading"
        className="container-page scroll-mt-32 py-20"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Reveal>
            <article className="surface-card flex h-full flex-col justify-between p-7">
              <div>
                <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                  Launch
                </p>
                <h2
                  id="launch-heading"
                  className="mt-3 max-w-[18ch] font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.06] font-black tracking-[-0.03em] text-foreground"
                >
                  Notle launches on {site.launch.label}.
                </h2>
                <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-muted-foreground">
                  Until then, the app is available on its staging site. That is
                  also where the current features, plans and policies live.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild shine>
                  <a
                    href={site.launch.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Open Notle
                    <icons.externalLink />
                  </a>
                </Button>
                <span className="font-mono text-[0.6875rem] text-subtle-foreground">
                  {formatDate(product.launchDate)}
                </span>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.06}>
            <article className="surface-card h-full p-7">
              <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                What you need
              </p>
              <dl className="mt-5 divide-y divide-border">
                {product.requirements.map((requirement) => (
                  <div
                    key={requirement.label}
                    className="flex items-baseline justify-between gap-6 py-3"
                  >
                    <dt className="text-[0.875rem] text-muted-foreground">
                      {requirement.label}
                    </dt>
                    <dd className="max-w-[60%] text-right font-mono text-[0.8125rem] text-foreground">
                      {requirement.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-5">
                {product.platforms.map((platform) => (
                  <PlatformBadge key={platform} platform={platform} />
                ))}
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                  Guides
                </p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/help" className="text-[0.875rem] text-accent-text link-underline">
                      All Notle help
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/help/recording-and-uploading-a-lecture"
                      className="text-[0.875rem] text-accent-text link-underline"
                    >
                      Recording and uploading a lecture
                    </Link>
                  </li>
                </ul>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section
        aria-labelledby="product-faq"
        className="border-y border-border bg-surface/40 py-20"
      >
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <SectionHeading
            id="product-faq"
            eyebrow="FAQ"
            title="Questions about Notle."
            description={
              <>
                Everything else is in the{" "}
                <Link href="/help" className="text-accent-text link-underline">
                  help centre
                </Link>
                .
              </>
            }
          />

          <Accordion type="single" collapsible className="border-t border-border">
            {product.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={faqJsonLd(product.faqs)} />
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
