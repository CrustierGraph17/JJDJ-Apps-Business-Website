import type { Metadata } from "next";
import Link from "next/link";
import { EmailPanel } from "@/components/contact/email-panel";
import { PageHeader } from "@/components/sections/page-header";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/data/site";
import { breadcrumbJsonLd, JsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-metadata";
import { icons } from "@/lib/icons";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Email JJDJ at ${site.email}. One inbox, read by Joash and Darryl — no support queue, no ticket system.`,
  path: "/contact",
});

/** The two places worth trying before writing to us. */
const SHORTCUTS = [
  {
    title: "Notle help",
    body: "Setup, plans, the editors and the study tools, answered in one place.",
    href: "/help",
    cta: "Open the help centre",
    icon: "lifeBuoy" as const,
  },
  {
    title: "Press kit",
    body: "Logos, the exact palette, the typefaces and boilerplate you can paste.",
    href: "/press",
    cta: "Open the press kit",
    icon: "download" as const,
  },
];

const INCLUDE = [
  "Which app or page you were using, and what you expected to happen.",
  "What actually happened — a screenshot is worth three paragraphs.",
  "Whether you are on the free plan or a paid one, if it is about Notle.",
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            One inbox,
            <span className="text-accent"> two people</span>.
          </>
        }
        description="There is no support queue behind JJDJ. Mail reaches Joash and Darryl directly, so write the way you would to a person — that is who is reading it."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <section aria-labelledby="email-us" className="container-page pb-24">
        <h2 id="email-us" className="sr-only">
          Email us
        </h2>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Reveal className="h-full">
            <EmailPanel email={site.email} locationLine={site.locationLine} />
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {SHORTCUTS.map((item, index) => {
              const Icon = icons[item.icon];

              return (
                <Reveal
                  key={item.href}
                  delay={0.06 + index * 0.06}
                  className="h-full"
                >
                  <article className="surface-card flex h-full flex-col p-6">
                    <span className="grid size-9 place-items-center rounded-[11px] border border-border bg-card text-accent">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-[1.0625rem] font-black tracking-[-0.02em] text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] text-accent-text link-underline"
                    >
                      {item.cta}
                      <icons.arrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.1} className="mt-5">
          <div className="rounded-panel border border-border bg-surface/60 p-6 sm:p-7">
            <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
              What to include
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {INCLUDE.map((line) => (
                <li
                  key={line}
                  className="flex gap-2.5 text-[0.875rem] leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-accent"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-border pt-4 font-mono text-[0.6875rem] tracking-[0.04em] text-subtle-foreground">
              {site.email} · {site.locationLine}
            </p>
          </div>
        </Reveal>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />
    </>
  );
}
