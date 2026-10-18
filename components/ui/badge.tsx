import { cva, type VariantProps } from "class-variance-authority";
import { platformIcons } from "@/lib/icons";
import type { Platform } from "@/data/products";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill border font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        /** Teal wash — "New", "Updated". */
        accent: "border-accent/25 bg-accent-wash text-accent-text",
        neutral: "border-border bg-card text-muted-foreground",
        outline: "border-border-strong bg-transparent text-foreground",
        /** Screen-reader style for the eyebrow chips. */
        subtle: "border-transparent bg-foreground/5 text-muted-foreground",
      },
      size: {
        sm: "h-6 px-2.5 text-[0.6875rem]",
        md: "h-7 px-3 text-[0.75rem]",
        lg: "h-8 px-3.5 text-[0.8125rem]",
      },
    },
    defaultVariants: { variant: "neutral", size: "sm" },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

/**
 * The small uppercase mono label that sits above every section heading,
 * with the little teal dot in front — "● NEW THIS WEEK".
 */
export function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span className={cn("eyebrow", className)}>
      {dot ? (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-accent"
        />
      ) : null}
      {children}
    </span>
  );
}

/** A pulsing teal dot plus a label — the status pill in the footer. */
export function StatusPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-pill border border-border bg-card px-3.5 py-2",
        "font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="relative grid size-2 place-items-center">
        <span className="absolute size-2 rounded-full bg-accent" />
        <span className="absolute size-2 animate-dot-pulse rounded-full bg-accent" />
      </span>
      {children}
    </span>
  );
}

/** A tiny platform chip with its lucide icon. */
export function PlatformBadge({
  platform,
  className,
}: {
  platform: Platform;
  className?: string;
}) {
  const Icon = platformIcons[platform];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[6px] border border-border px-1.5 py-0.5",
        "font-mono text-[0.625rem] tracking-[0.04em] text-muted-foreground",
        className,
      )}
      title={platform}
    >
      <Icon className="size-3" aria-hidden="true" />
      {platform}
    </span>
  );
}

/** New/Updated badge, driven by the product data. */
export function ReleaseBadge({
  badge,
  className,
}: {
  badge: "New" | "Updated";
  className?: string;
}) {
  return (
    <Badge variant={badge === "New" ? "accent" : "neutral"} className={className}>
      {badge === "New" ? (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      ) : (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current opacity-50" />
      )}
      {badge}
    </Badge>
  );
}

/** Category tag used on product cards and in the products header. */
export function CategoryTag({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase",
        className,
      )}
    >
      {category}
    </span>
  );
}
