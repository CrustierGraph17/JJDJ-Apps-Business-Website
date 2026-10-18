import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Privacy policy";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Legal",
    title: "Privacy policy",
    description: "Two browser settings. No analytics, no advertising.",
    path: "jjdj.app/privacy",
  });
}
