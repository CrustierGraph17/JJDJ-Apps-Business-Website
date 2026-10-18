"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type CountUpProps = {
  value: number;
  /** Decimal places to display. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. */
  duration?: number;
  /** Thousands separators. */
  separator?: boolean;
  className?: string;
};

/**
 * Counts a number up when it scrolls into view.
 *
 * The value is driven by a MotionValue rendered straight into a
 * `motion.span`, so the counter never triggers a React re-render per
 * frame — it is written to the DOM by Framer on the animation frame.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.7,
  separator = true,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  // Always starts at zero, on the server and on the client alike, so the
  // rendered text hydrates cleanly. Reduced motion jumps to the total in one
  // step rather than counting.
  const count = useMotionValue(0);

  const text = useTransform(count, (latest) => {
    const formatted = separator
      ? latest.toLocaleString("en-AU", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : latest.toFixed(decimals);
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [count, duration, inView, reduce, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <motion.span aria-hidden="true">{text}</motion.span>
      {/* The final value, always available to assistive tech. */}
      <span className="sr-only">
        {prefix}
        {value.toLocaleString("en-AU")}
        {suffix}
      </span>
    </span>
  );
}
