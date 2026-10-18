import { icons } from "@/lib/icons";

export function Icon({ name, className }: { name: keyof typeof icons; className?: string }) {
  const Component = icons[name];
  if (!Component) return null;
  return (
    <Component className={className} aria-hidden="true" />
  );
}
