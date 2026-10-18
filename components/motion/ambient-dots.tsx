"use client";

import dynamic from "next/dynamic";
import type { DotFieldProps } from "@/components/motion/dot-field";

/**
 * The hero's WebGL dot field, loaded after the page is interactive.
 *
 * DotField is a few hundred lines of shader and canvas code that paints a
 * decorative background. Splitting it out means the headline and the product
 * grid hydrate first and the field fades in a moment later, instead of the
 * field's setup sitting in front of everything else on the main thread.
 *
 * It renders on the client only — the canvas draws nothing on the server
 * anyway — and the wrapper keeps `ssr: false` out of the server component
 * that composes the hero.
 */
const DotField = dynamic(
  () => import("@/components/motion/dot-field").then((mod) => mod.DotField),
  { ssr: false },
);

export function AmbientDots(props: DotFieldProps) {
  return <DotField {...props} />;
}
