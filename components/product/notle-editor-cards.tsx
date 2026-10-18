import Image from "next/image";
import type { WorkspaceApp } from "@/data/products";
import type { NotleScreenshot } from "@/data/screenshots";
import { editorScreenshots } from "@/data/screenshots";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * The four Notle editors, each beside the screenshot of itself.
 *
 * The screenshot is looked up by `app.editor`, so renaming an editor or
 * reordering the list can never pair Dox with the Point capture.
 */
export function NotleEditorCards({
  apps,
  className,
}: {
  apps: WorkspaceApp[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {apps.map((app, index) => {
        const shot: NotleScreenshot = editorScreenshots[app.editor];

        return (
          <li key={app.name} className="h-full">
            <Reveal delay={Math.min(index * 0.05, 0.2)} className="h-full">
              <a
                href={`${site.launch.href}${app.href}`}
                target="_blank"
                rel="noreferrer noopener"
                className="group surface-card flex h-full flex-col overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="relative aspect-[2/1] overflow-hidden border-b border-border bg-[#0A0A0A]">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 640px) 46vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 ease-brand group-hover:scale-[1.02]"
                  />
                  <span className="absolute top-3 left-3 rounded-pill border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.04em] text-white/70 backdrop-blur-sm">
                    {shot.title}
                  </span>
                </div>

                <div className="flex flex-1 items-start justify-between gap-6 p-6">
                  <span>
                    <span className="block font-display text-[1.125rem] font-black tracking-[-0.02em] text-foreground">
                      {app.name}
                    </span>
                    <span className="mt-2 block max-w-[42ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {app.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </a>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
