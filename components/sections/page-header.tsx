import type { ReactNode } from "react";
import { Appear } from "@/components/motion/appear";
import { Eyebrow } from "@/components/ui/badge";
import { Breadcrumbs, type Crumb } from "@/components/sections/breadcrumbs";
import { cn } from "@/lib/utils";

/**
 * The header every inner page opens with.
 *
 * Same anatomy as the home page's section headings — eyebrow, tight display
 * heading, one supporting paragraph — plus breadcrumbs so the structure of the
 * site is legible from any page.
 *
 * The entrance is <Appear>, not <Reveal>: this is the first screenful of every
 * inner page, and a Framer reveal ships it as `opacity: 0; filter: blur(6px)`,
 * so the heading only appeared once React had hydrated. On a fresh load of
 * /products or /help that reads as a blank page. The CSS path paints it with
 * the first frame, on a hard navigation and a client-side one alike — and it
 * takes a client component out of every inner page's bundle while it is at it.
 * Scroll reveals further down the page keep using <Reveal>.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  actions,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative pt-32 pb-14 md:pt-40 md:pb-16",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dotted-grid opacity-60" />
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,var(--accent-wash),transparent_70%)]" />
      </div>

      <div className="container-page">
        {crumbs ? (
          <Appear direction="fade" className="mb-7">
            <Breadcrumbs trail={crumbs} />
          </Appear>
        ) : null}

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[52rem]">
            {eyebrow ? (
              <Appear direction="fade">
                <Eyebrow>{eyebrow}</Eyebrow>
              </Appear>
            ) : null}

            <Appear delay={0.06}>
              <h1 className="text-section mt-5 text-foreground">{title}</h1>
            </Appear>

            {description ? (
              <Appear delay={0.12}>
                <p className="mt-5 max-w-[48rem] text-[1.0625rem] leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </Appear>
            ) : null}

            {children}
          </div>

          {actions ? (
            <Appear delay={0.18} className="shrink-0">
              {actions}
            </Appear>
          ) : null}
        </div>
      </div>
    </header>
  );
}
