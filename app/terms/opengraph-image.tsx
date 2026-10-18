import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Terms of service";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Legal",
    title: "Terms of service",
    description: "Plain-language terms for this website and for Notle.",
    path: "jjdj.app/terms",
  });
}
