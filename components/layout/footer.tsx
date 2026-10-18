import Link from "next/link";
import { Logo } from "@/components/brand/logo-grid";
import { SocialIcon } from "@/components/brand/social-icons";
import { FooterWordmark } from "@/components/layout/footer-wordmark";
import { Reveal } from "@/components/motion/reveal";
import { footerColumns, site, socialLinks } from "@/data/site";

/**
 * Footer.
 *
 * A server component. Sits on every page. No newsletter: only links that
 * go somewhere real — including the studio's official accounts, each with
 * its own platform mark. Contact lives on its own page, not buried in here.
 */
export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-surface/60">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          {/* Brand column */}
          <Reveal className="space-y-6">
            <Link href="/" aria-label="JJDJ — home" className="inline-flex rounded-[10px]">
              <Logo size={40} wordmark />
            </Link>
            <p className="max-w-[38ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
              {site.description}
            </p>

            <div className="inline-flex flex-wrap items-center gap-2 rounded-card border border-border bg-card px-3.5 py-3">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground uppercase">
                {site.launch.product} launches {site.launch.label}
              </span>
            </div>
          </Reveal>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerColumns.map((column, columnIndex) => (
              <Reveal key={column.title} delay={columnIndex * 0.05}>
                <h2 className="font-mono text-[0.6875rem] tracking-[0.12em] text-subtle-foreground uppercase">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[0.875rem] text-muted-foreground link-underline hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[0.875rem] text-muted-foreground link-underline hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Official accounts — one branded mark per platform */}
        <div className="mt-14 flex flex-col gap-5 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <h2 className="font-mono text-[0.6875rem] tracking-[0.12em] text-subtle-foreground uppercase">
            Find us on
          </h2>
          <ul className="flex flex-wrap items-center gap-2">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="me noreferrer noopener"
                  aria-label={`JJDJ on ${social.label} — ${social.handle}`}
                  title={`${social.label} · ${social.handle}`}
                  className="inline-flex size-10 items-center justify-center rounded-card border border-border bg-card text-muted-foreground transition-colors duration-200 hover:border-accent hover:bg-accent-wash hover:text-accent-text focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <SocialIcon name={social.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[0.6875rem] text-subtle-foreground">
            © {new Date().getFullYear()} JJDJ · {site.locationLine} ·
            independent
          </p>
          <p className="font-mono text-[0.6875rem] text-subtle-foreground">
            Two employees · one app
          </p>
        </div>
      </div>

      {/* Oversized wordmark, revealed on scroll */}
      <div className="overflow-hidden pb-2">
        <FooterWordmark />
      </div>
    </footer>
  );
}
