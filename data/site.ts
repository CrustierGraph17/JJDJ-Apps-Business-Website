import type { IconName } from "@/lib/icons";

/* ------------------------------------------------------------------ *
 *  Site-wide configuration.
 *
 *  Only facts we can stand behind belong in this file: who we are, where
 *  we are, and what we have actually shipped.
 * ------------------------------------------------------------------ */

export const site = {
  name: "JJDJ",
  shortName: "JJDJ",
  tagline: "Two high schoolers in Perth, building useful apps.",
  description:
    "JJDJ is a two-person studio in Perth, Western Australia, run by Joash Jackson and Darryl Lopez. We build apps that help with problems we face every day. Our first app is Notle, a workspace for studying, writing, presenting, spreadsheets and PDFs.",
  url: "https://jjdj.app",
  locale: "en_AU",
  founded: 2026,
  location: "Perth, WA",
  locationLine: "Made in Perth, WA",
  /** The one address that reaches both of us. */
  email: "JJDJ-Apps@proton.me",
  /** The one date that matters right now. */
  launch: {
    product: "Notle",
    date: "2026-11-10",
    label: "10 November 2026",
    href: "https://notle-staging.vercel.app",
  },
} as const;

/* ------------------------------------------------------------------ *
 *  Official accounts.
 *
 *  One entry per platform, each with the exact profile URL minus the
 *  tracking parameters the apps append when you share a link (utm_*,
 *  si, invite, mibextid). Five of the six handles are @jjdj_apps; the
 *  Facebook page is listed as "JJDJ Apps" and linked by share URL.
 * ------------------------------------------------------------------ */

export type SocialName =
  | "instagram"
  | "facebook"
  | "threads"
  | "youtube"
  | "x"
  | "tiktok";

export type SocialLink = {
  name: SocialName;
  /** Platform name, for the accessible label. */
  label: string;
  handle: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  {
    name: "instagram",
    label: "Instagram",
    handle: "@jjdj_apps",
    href: "https://www.instagram.com/jjdj_apps",
  },
  {
    name: "facebook",
    label: "Facebook",
    handle: "JJDJ Apps",
    href: "https://www.facebook.com/share/1K56JWn7Dm/",
  },
  {
    name: "threads",
    label: "Threads",
    handle: "@jjdj_apps",
    href: "https://www.threads.com/@jjdj_apps",
  },
  {
    name: "youtube",
    label: "YouTube",
    handle: "@jjdj-apps",
    href: "https://youtube.com/@jjdj-apps",
  },
  {
    name: "x",
    label: "X",
    handle: "@JJDJ_apps",
    href: "https://x.com/JJDJ_apps",
  },
  {
    name: "tiktok",
    label: "TikTok",
    handle: "@jjdj_apps",
    href: "https://www.tiktok.com/@jjdj_apps",
  },
];

export type NavItem = {
  label: string;
  href: string;
  /** Short description used by the command palette. */
  description: string;
  icon: IconName;
  /** Set for links that leave this site. */
  external?: boolean;
};

export const primaryNav: NavItem[] = [
  {
    label: "Notle",
    href: "/products/notle",
    description: "Our first app — launching 10 November 2026",
    icon: "layers",
  },
  {
    label: "About",
    href: "/about",
    description: "The two of us, and why we started",
    icon: "users",
  },
  {
    label: "Help",
    href: "/help",
    description: "How Notle works, answered plainly",
    icon: "lifeBuoy",
  },
  {
    label: "Press",
    href: "/press",
    description: "Logos, facts and a short boilerplate",
    icon: "fileText",
  },
];

export type FooterColumn = {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Notle", href: "/products/notle" },
      { label: "Launch date", href: "/products/notle#launch" },
      { label: "Notle help", href: "/help" },
      { label: "Developer docs", href: "/docs" },
      { label: "Notle website", href: site.launch.href, external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "The team", href: "/about#team" },
      { label: "Contact", href: "/contact" },
      { label: "Press kit", href: "/press" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Cookie policy", href: "/cookies" },
    ],
  },
];

/** "● SECTION" style eyebrows, used above section headings. */
export const eyebrows = {
  why: "Why JJDJ",
  featured: "Our first app",
  build: "Why we started",
  about: "About JJDJ",
  help: "Notle help",
  wordmark: "The wordmark",
} as const;

/** Keyboard shortcuts, surfaced in the palette and the footer. */
export const shortcuts = [
  { keys: ["⌘", "K"], label: "Open the command palette" },
  { keys: ["T"], label: "Toggle light and dark" },
  { keys: ["/"], label: "Search the help centre" },
  { keys: ["Esc"], label: "Close the current panel" },
] as const;
