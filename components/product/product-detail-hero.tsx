import Link from "next/link";
import { NotleMark } from "@/components/brand/notle-logo";
import { NotleTiles } from "@/components/sections/notle-tiles";
import { NotleScreens } from "@/components/product/notle-screens";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/components/ui/badge";
import type { Product } from "@/data/products";
import { site } from "@/data/site";
import { icons } from "@/lib/icons";
import { formatDate } from "@/lib/utils";

/**
 * Notle's product hero.
 *
 * The icon, the real summary, the launch date and the current plans, with the
 * four workspace editors as the visual — then real captures of the app, so the
 * first thing on the page is what Notle actually looks like.
 */
export function ProductDetailHero({ product }: { product: Product }) {
  return (
    <div className="container-page grid items-start gap-12 pt-10 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-16 lg:pt-6">
      {/* Left: identity */}
      <div>
        <NotleMark size={72} />

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <span className="eyebrow">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            {product.category}
          </span>
          <span className="rounded-pill border border-accent/30 bg-accent-wash px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.06em] text-accent-text uppercase">
            Launches {site.launch.label}
          </span>
        </div>

        <h1 className="text-section mt-4 text-foreground">{product.name}</h1>
        <p className="mt-3 font-display text-[1.375rem] font-extrabold tracking-[-0.02em] text-foreground">
          {product.tagline}
        </p>
        <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          {product.summary}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
          <div>
            <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
              Price
            </p>
            <p className="mt-1.5 font-display text-[1.5rem] font-black tracking-[-0.03em] text-foreground">
              {product.price.label}
            </p>
            {product.price.note ? (
              <p className="font-mono text-[0.6875rem] text-subtle-foreground">
                {product.price.note}
              </p>
            ) : null}
          </div>

          <div>
            <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
              Launch date
            </p>
            <p className="mt-1.5 font-mono text-[1.25rem] leading-tight text-foreground">
              {formatDate(product.launchDate)}
            </p>
            <p className="font-mono text-[0.6875rem] text-subtle-foreground">
              {site.location}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {product.links.map((link) => (
            <Button
              key={link.label}
              asChild
              variant={link.variant === "primary" ? "primary" : "secondary"}
              size="lg"
              shine={link.variant === "primary"}
            >
              <a href={link.href} target="_blank" rel="noreferrer noopener">
                {link.variant === "primary" ? <icons.externalLink /> : null}
                {link.label}
              </a>
            </Button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {product.platforms.map((platform) => (
            <PlatformBadge key={platform} platform={platform} />
          ))}
        </div>

        <p className="mt-6 flex items-center gap-2 font-mono text-[0.6875rem] text-subtle-foreground">
          <Link href="/help" className="text-accent-text link-underline">
            Notle help
          </Link>
          ·
          <Link href="/products/notle#plans" className="text-accent-text link-underline">
            Plans &amp; pricing
          </Link>
        </p>
      </div>

      {/* Right: the workspace */}
      <div className="relative">
        <NotleTiles />
        <p className="mt-3 font-mono text-[0.6875rem] text-subtle-foreground">
          Four editors, one workspace.
        </p>
      </div>

      {/* Below both columns: the app itself */}
      <div
        id="screens"
        className="scroll-mt-32 border-t border-border pt-10 lg:col-span-2 lg:mt-4"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="font-display text-[1.5rem] leading-tight font-black tracking-[-0.025em] text-foreground">
            Look inside Notle.
          </h2>
          <p className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
            Real screenshots of the app
          </p>
        </div>
        <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          Home, your lectures, the study desk, a study plan, knowledge maps,
          follow-up questions and the calendar — as they look today.
        </p>

        <Reveal className="mt-8">
          <NotleScreens />
        </Reveal>
      </div>
    </div>
  );
}
