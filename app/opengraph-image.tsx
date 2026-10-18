import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Two high schoolers in Perth, building useful apps.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "JJDJ · Perth, WA",
    title: "One app. Built properly.",
    description:
      "JJDJ is Joash and Darryl. Our first app, Notle, launches 10 November 2026.",
    path: "jjdj.app",
  });
}
