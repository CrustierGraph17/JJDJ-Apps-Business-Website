import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Two people in Perth.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "About JJDJ",
    title: "Two people in Perth.",
    description:
      "Joash Jackson and Darryl Lopez, building Notle while still at school.",
    path: "jjdj.app/about",
  });
}
