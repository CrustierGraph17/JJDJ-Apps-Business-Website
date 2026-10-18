import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { Reveal } from "@/components/motion/reveal";
import type { LegalDocument } from "@/data/legal";
import { legalDocuments } from "@/data/legal";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Renders a legal document: header, a summary callout, the prose itself and a
 * cross-link between the three policies.
 *
 * Prose is deliberately plain — no clause numbering, no small print — and the
 * typography is set for reading: a 68-character measure, generous leading, and
 * only one heading level below the page title.
 */
export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  const others = legalDocuments.filter((item) => item.slug !== document.slug);

  return (
    <>
      <PageHeader
        eyebrow={`Legal · updated ${formatDate(document.lastUpdated)}`}
        title={document.title}
        description={document.summary}
        crumbs={[
          { name: "Home", href: "/" },
          { name: document.title, href: `/${document.slug}` },
        ]}
      />

      <div className="container-page pb-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_15rem]">
          {/* Prose */}
          <div className="max-w-[68ch]">
            <Reveal>
              <div className="grid grid-cols-2 gap-5 rounded-panel border border-border bg-card p-6 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                    Last updated
                  </p>
                  <p className="mt-1.5 font-mono text-[0.8125rem] text-foreground">
                    {formatDate(document.lastUpdated)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                    Reading time
                  </p>
                  <p className="mt-1.5 font-mono text-[0.8125rem] text-foreground">
                    {document.readingTime} min
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                    Notle
                  </p>
                  <a
                    href="https://notle-staging.vercel.app/privacy"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-1.5 block font-mono text-[0.8125rem] text-accent-text link-underline"
                  >
                    App policies
                  </a>
                </div>
              </div>
            </Reveal>

            {document.sections.map((section, index) => (
              <Reveal
                key={section.heading}
                delay={0.04}
                className="mt-12 scroll-mt-32"
              >
                <section id={slugify(section.heading)}>
                  <h2 className="font-display text-[1.375rem] font-black tracking-[-0.025em] text-foreground">
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
                            className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-accent"
                          />
                          <span className="text-[1rem] leading-[1.72] text-muted-foreground">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {index < document.sections.length - 1 ? (
                    <hr className="mt-12 border-border" />
                  ) : null}
                </section>
              </Reveal>
            ))}
          </div>

          {/* Side rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
              Other policies
            </p>
            <ul className="mt-4 space-y-2.5">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${item.slug}`}
                    className={cn(
                      "block rounded-[10px] border border-border bg-card px-3.5 py-3",
                      "text-[0.875rem] text-foreground transition-colors duration-200",
                      "hover:border-accent/35 hover:text-accent-text",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/press"
                  className="block rounded-[10px] border border-border bg-card px-3.5 py-3 text-[0.875rem] text-foreground transition-colors duration-200 hover:border-accent/35 hover:text-accent-text"
                >
                  Press kit
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}

/** "Sync and encryption" → "sync-and-encryption" for anchor links. */
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
