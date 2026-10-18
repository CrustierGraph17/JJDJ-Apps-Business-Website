import Image from "next/image";
import Link from "next/link";
import { editorScreenshots, type NotleEditor } from "@/data/screenshots";
import { cn } from "@/lib/utils";

const ORDER: NotleEditor[] = ["dox", "point", "exceed", "draft"];

const LABEL: Record<NotleEditor, string> = {
  dox: "Notle Dox",
  point: "Notle Point",
  exceed: "Notle Exceed",
  draft: "Notle Draft",
};

/**
 * The four editor captures as a single row — a quick look at the workspace
 * on the home page, linking through to the editor section of the product page.
 */
export function NotleEditorStrip({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)}>
      {ORDER.map((editor) => {
        const shot = editorScreenshots[editor];

        return (
          <li key={editor}>
            <Link
              href="/products/notle#editors"
              className="group surface-card block overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="relative block aspect-[2/1] overflow-hidden bg-[#0A0A0A]">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 1024px) 23vw, 48vw"
                  className="object-cover object-top transition-transform duration-500 ease-brand group-hover:scale-[1.02]"
                />
              </span>
              <span className="flex items-center justify-between gap-3 border-t border-border px-3.5 py-2.5">
                <span className="font-mono text-[0.6875rem] tracking-[0.04em] text-foreground uppercase">
                  {LABEL[editor]}
                </span>
                <span
                  aria-hidden="true"
                  className="text-accent transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
