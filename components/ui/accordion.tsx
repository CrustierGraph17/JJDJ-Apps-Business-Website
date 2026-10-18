"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Accordion — shadcn/ui shape, styled for JJDJ.
 *
 * The height animation comes from Radix's --radix-accordion-content-height
 * custom property, which is why the body can grow to its natural size rather
 * than a guessed max-height. The indicator rotates 45° so the plus becomes a
 * cross — a small detail, but it reads instantly.
 */

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        "border-b border-border last:border-b-0",
        className,
      )}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "group flex flex-1 items-start justify-between gap-6 py-5 text-left",
          "font-display text-[1.0625rem] font-bold tracking-[-0.01em] text-foreground",
          "transition-colors duration-200 hover:text-accent-text",
          className,
        )}
        {...props}
      >
        <span className="pt-0.5">{children}</span>
        <span
          className={cn(
            "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-border",
            "text-muted-foreground transition-[transform,color,border-color,background-color] duration-300",
            "ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover:border-accent group-hover:text-accent",
            "group-data-[state=open]:rotate-45 group-data-[state=open]:border-accent group-data-[state=open]:bg-accent-wash group-data-[state=open]:text-accent",
          )}
        >
          <Plus className="size-3.5" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div
        className={cn(
          "max-w-[62ch] pr-10 pb-6 text-[0.9375rem] leading-relaxed text-muted-foreground",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
});
