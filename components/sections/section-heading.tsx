import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Every section on the site opens the same way: a mono eyebrow with a teal
 * dot, a tight display heading, then one supporting paragraph. Keeping it in
 * one component is what makes the pages feel like one site.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
  id,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  id?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center"
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-[46rem]", align === "center" && "text-center")}>
        {eyebrow ? (
          <Reveal direction="fade">
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
        ) : null}

        <Reveal delay={0.06}>
          <Heading id={id} className="text-section mt-5 text-foreground">
            {title}
          </Heading>
        </Reveal>

        {description ? (
          <Reveal delay={0.12}>
            <p
              className={cn(
                "mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground",
                align === "center" && "mx-auto max-w-[42rem]",
              )}
            >
              {description}
            </p>
          </Reveal>
        ) : null}
      </div>

      {action ? (
        <Reveal delay={0.16} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
