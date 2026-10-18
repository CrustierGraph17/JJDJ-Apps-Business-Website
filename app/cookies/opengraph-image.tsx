import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Cookie policy";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Legal",
    title: "Cookies, clearly.",
    description: "No cookies. Two browser settings and no tracking.",
    path: "jjdj.app/cookies",
  });
}
