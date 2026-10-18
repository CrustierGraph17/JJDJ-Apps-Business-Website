import Link from "next/link";
import { NotleTiles } from "@/components/sections/notle-tiles";
import { AmbientDots } from "@/components/motion/ambient-dots";
import { Appear } from "@/components/motion/appear";
import { Magnetic } from "@/components/motion/magnetic";
import { MaskText } from "@/components/motion/mask-text";
import { Spotlight } from "@/components/motion/spotlight";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { site } from "@/data/site";
import { icons } from "@/lib/icons";

/**
 * Home hero.
 *
 * A server component: only the dot field, the spotlight and the buttons need
 * to be interactive, so the headline and story are static HTML that streams
 * immediately.
 */
export function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24"
      aria-labelledby="hero-heading"
    >
      {/* Background: dot field + accent wash + fade into the page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <AmbientDots
          dotRadius={1.3}
          dotSpacing={18}
          gradientFrom="var(--accent)"
          gradientTo="var(--fg-subtle)"
          glowColor="var(--accent-hover)"
          cursorRadius={280}
          bulgeStrength={0.5}
          glowRadius={200}
          glowIntensity={0.7}
          baseOpacity={0.4}
          maxDevicePixelRatio={1.75}
        />
        <div className="absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(60%_60%_at_50%_0%,var(--accent-wash),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-background" />
      </div>

      <Spotlight className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-16">
          {/* ---------- Left: copy ---------- */}
          <div className="relative z-10 max-w-[38rem]">
            <Appear direction="fade">
              <Link
                href="/products/notle#launch"
                className="group inline-flex items-center gap-2.5 rounded-pill border border-border bg-card/70 py-1.5 pr-3 pl-2.5 backdrop-blur-sm transition-colors duration-200 hover:border-accent/40"
              >
                <Badge variant="accent">Launching</Badge>
                <span className="text-[0.8125rem] text-muted-foreground">
                  {site.launch.product} arrives {site.launch.label}
                </span>
                <span
                  aria-hidden="true"
                  className="text-accent transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </Appear>

            <h1 id="hero-heading" className="text-hero mt-7 text-foreground">
              <MaskText
                text="Two high schoolers, one app."
                accent={["one", "app"]}
                delay={0.1}
                stagger={0.075}
              />
            </h1>

            <Appear delay={0.35} className="mt-6">
              <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted-foreground md:text-[1.125rem]">
                We&rsquo;re Joash and Darryl, two high schoolers in Perth,
                Western Australia. We started JJDJ because we wanted to help
                others with the problems we face every day. Our first app is
                Notle.
              </p>
            </Appear>

            <Appear delay={0.45} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button asChild size="lg" shine>
                  <Link href="/products/notle">
                    Explore Notle
                    <icons.arrowRight />
                  </Link>
                </Button>
              </Magnetic>

              <Button asChild size="lg" variant="secondary">
                <Link href="/about">Meet the team</Link>
              </Button>
            </Appear>

            <Appear delay={0.55} className="mt-10">
              <dl className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-7">
                {[
                  { label: "Based in", value: "Perth, WA" },
                  { label: "The team", value: "2 people" },
                  { label: "Apps", value: "1" },
                  { label: "Launch", value: site.launch.label },
                ].map((fact) => (
                  <div key={fact.label}>
                    <dt className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 font-mono text-[0.9375rem] text-foreground">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Appear>
          </div>

          {/* ---------- Right: the four Notle editors ---------- */}
          <Appear direction="scale" delay={0.25} className="relative z-10">
            <NotleTiles className="mx-auto max-w-[34rem] lg:max-w-none" />
            <p className="mt-4 flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              One workspace · four editors
            </p>
          </Appear>
        </div>
      </Spotlight>
    </section>
  );
}
