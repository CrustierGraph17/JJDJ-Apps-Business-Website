import { cn } from "@/lib/utils";

/**
 * A keyboard key, styled like a real keycap.
 *
 * Deliberately a server component: keycaps appear in help articles and docs
 * where there is nothing to hydrate.
 */
export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] px-1.5",
        "border border-border bg-card text-muted-foreground",
        "shadow-[0_1px_0_var(--border-strong)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/** Renders a shortcut from an array of key labels: ["⌘","K"]. */
export function Shortcut({
  keys,
  className,
}: {
  keys: readonly string[];
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </span>
  );
}
