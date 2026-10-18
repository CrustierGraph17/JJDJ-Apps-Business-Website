"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { forwardRef, useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  Form primitives.
 *
 *  Inputs use floating labels: the label sits inside the control and
 *  shrinks to the top edge once the field is focused or filled. Purely CSS
 *  (peer-placeholder-shown + peer-focus), so it never fights React state and
 *  works with react-hook-form's uncontrolled register().
 * ------------------------------------------------------------------ */

export const Label = forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-[0.8125rem] font-medium tracking-[-0.005em] text-foreground",
        className,
      )}
      {...props}
    />
  );
});

const controlBase = [
  "w-full rounded-[12px] border border-border bg-card text-[0.9375rem] text-foreground",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "placeholder:text-subtle-foreground",
  "hover:border-border-strong",
  "focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15",
  "disabled:cursor-not-allowed disabled:opacity-55",
].join(" ");

/** Plain input, used where a floating label would be overkill. */
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input ref={ref} className={cn(controlBase, "h-12 px-4", className)} {...props} />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(controlBase, "min-h-32 resize-y px-4 py-3.5 leading-relaxed", className)}
      {...props}
    />
  );
});

/**
 * A field with a floating label, an optional hint and an inline error.
 * The label floats because of `peer-placeholder-shown` — the input must have
 * a placeholder of a single space for the resting state to register.
 */
export function FloatingField({
  label,
  error,
  hint,
  id,
  className,
  children,
}: {
  label: string;
  error?: string;
  hint?: ReactNode;
  id?: string;
  className?: string;
  children: (props: { id: string; placeholder: string }) => ReactNode;
}) {
  const generated = useId();
  const fieldId = id ?? generated;
  const errorId = `${fieldId}-error`;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="relative">
        {children({ id: fieldId, placeholder: " " })}
        <label
          htmlFor={fieldId}
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2",
            "origin-left bg-card px-1 text-[0.9375rem] text-muted-foreground",
            "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            // Float up when focused or filled.
            "peer-focus:top-0 peer-focus:text-[0.6875rem] peer-focus:font-medium",
            "peer-focus:tracking-[0.06em] peer-focus:text-accent-text peer-focus:uppercase",
            "peer-[:not(:placeholder-shown)]:top-0",
            "peer-[:not(:placeholder-shown)]:text-[0.6875rem]",
            "peer-[:not(:placeholder-shown)]:tracking-[0.06em]",
            "peer-[:not(:placeholder-shown)]:uppercase",
            error ? "text-[#e88]" : undefined,
          )}
        >
          {label}
        </label>
      </div>
      <div className="flex items-start justify-between gap-4">
        {error ? (
          <p id={errorId} role="alert" className="text-[0.8125rem] text-[#e2705f]">
            {error}
          </p>
        ) : (
          <span />
        )}
        {hint ? (
          <span className="font-mono text-[0.6875rem] text-subtle-foreground">{hint}</span>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- select ---------- */

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(function SelectTrigger({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        controlBase,
        "flex h-12 items-center justify-between gap-3 px-4 text-left",
        "data-[placeholder]:text-subtle-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

export const SelectContent = forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent({ className, children, position = "popper", ...props }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(
          "z-90 max-h-72 overflow-hidden rounded-[14px] border border-border bg-surface p-1.5",
          "shadow-raised",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="max-h-64 overflow-y-auto">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectItem = forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2.5 rounded-[10px] py-2.5 pr-9 pl-3",
        "text-[0.875rem] text-foreground outline-none transition-colors duration-150",
        "data-[highlighted]:bg-accent-wash data-[highlighted]:text-accent-text",
        "data-[state=checked]:font-medium",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3 grid size-4 place-items-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-3.5 text-accent" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
});
