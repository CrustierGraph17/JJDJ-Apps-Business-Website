"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Button.
 *
 * Accent buttons are teal with near-black text. That pairing is deliberate:
 * white on #14B8A6 only reaches about 2.3:1, while near-black reaches 7.7:1,
 * so the brand teal stays exactly as specified in the logo and still passes
 * WCAG AA in both themes.
 */
const buttonVariants = cva(
  [
    "relative inline-flex select-none items-center justify-center gap-2",
    "whitespace-nowrap rounded-pill font-medium",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-200",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-contrast shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_30px_-14px_var(--accent-glow)] hover:bg-accent-hover",
        secondary:
          "border border-border bg-card text-foreground shadow-card hover:border-border-strong hover:bg-surface",
        ghost:
          "border border-transparent text-foreground hover:bg-accent-wash hover:text-accent-text",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:border-accent hover:text-accent-text",
        invert:
          "bg-foreground text-background hover:opacity-90",
        link: "h-auto gap-1 rounded-none p-0 text-accent-text underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem] [&_svg]:size-4",
        md: "h-11 px-5 text-[0.9375rem] [&_svg]:size-4",
        lg: "h-13 px-7 text-base [&_svg]:size-[1.15rem]",
        icon: "size-11 [&_svg]:size-[1.15rem]",
        "icon-sm": "size-9 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the child element instead of a <button>. */
    asChild?: boolean;
    /** Sweep a soft highlight across the button on hover. */
    shine?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, size, asChild = false, shine = false, ...props },
    ref,
  ) {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          shine && "shine",
          className,
        )}
        {...props}
      />
    );
  },
);

export { buttonVariants };
