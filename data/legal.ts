/* ------------------------------------------------------------------ *
 *  Legal documents
 *
 *  These cover this website only. Notle has its own privacy, terms,
 *  cookie and refund pages, and those govern the app.
 *
 *  Structured prose rather than JSX, so the wording can be revised without
 *  touching a component.
 * ------------------------------------------------------------------ */

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  /** One-sentence plain-English summary, shown above the prose. */
  summary: string;
  lastUpdated: string;
  /** Estimated reading time in minutes. */
  readingTime: number;
  sections: LegalSection[];
};

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  summary:
    "This website keeps a theme preference and a cookie-notice setting in your browser. It has no analytics, no advertising and no accounts.",
  lastUpdated: "2026-10-17",
  readingTime: 3,
  sections: [
    {
      heading: "The short version",
      bullets: [
        "This website has no sign-in, no analytics and no advertising.",
        "It stores two preferences in your browser; neither is sent to us.",
        "Notle is a separate application with its own privacy policy.",
        "We do not sell, share or rent personal information.",
      ],
    },
    {
      heading: "What this website stores",
      paragraphs: [
        "Your browser stores your chosen colour theme and whether you dismissed the cookie notice. Both are local storage keys on your own device. The intro animation records that you have seen it for the current browser session.",
        "There is no contact form, newsletter, account or tracking script on this website, so there is no other information for us to collect here.",
      ],
    },
    {
      heading: "Hosting",
      paragraphs: [
        "Like any website, the server that delivers these pages receives the request needed to send them — the address you asked for, your browser's request headers and the time. Those requests are used to serve the site and keep it working.",
      ],
    },
    {
      heading: "Notle",
      paragraphs: [
        "Notle is the app we make. It handles accounts, documents, lecture audio and AI requests, so it has a fuller privacy policy of its own.",
        "Read it at notle-staging.vercel.app/privacy. That policy describes the providers Notle uses, what is stored in your browser, what is stored in your account, and how to delete it.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "This website is not directed at children. Notle accounts are intended for people aged 13 or older, as described in Notle's own policy.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        "If what this website stores changes, this page will be updated before the change ships.",
      ],
    },
  ],
};

export const termsOfService: LegalDocument = {
  slug: "terms",
  title: "Terms of Service",
  summary:
    "This website is information about JJDJ and Notle. Using Notle itself is covered by Notle's own terms.",
  lastUpdated: "2026-10-17",
  readingTime: 3,
  sections: [
    {
      heading: "This website",
      paragraphs: [
        "JJDJ is a two-person studio in Perth, Western Australia. This website describes who we are and what we are building. By using it you agree to use it lawfully and not to interfere with it.",
      ],
    },
    {
      heading: "Notle",
      paragraphs: [
        "Notle is our first app. Accounts, subscriptions, uploads and AI features are governed by Notle's own terms of use, not by this page.",
        "Read them at notle-staging.vercel.app/terms. Prices, allowances and refund terms for Notle are published on its pricing and refund pages.",
      ],
    },
    {
      heading: "Accuracy",
      paragraphs: [
        "We keep this site to facts we can stand behind. Product details can still change while Notle is being finished, and the Notle website is the authoritative source for how the app works today.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The JJDJ name, logo and the words and design of this website belong to JJDJ. Notle and its content belong to their respective owners. You may quote short passages with attribution, and you may use the logo files in our press kit to write about us accurately.",
      ],
    },
    {
      heading: "Consumer rights",
      paragraphs: [
        "Nothing on this page excludes, restricts or modifies any right or guarantee you have under the Australian Consumer Law or any other law that cannot be excluded.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of Western Australia, Australia.",
      ],
    },
  ],
};

export const cookiePolicy: LegalDocument = {
  slug: "cookies",
  title: "Cookie Policy",
  summary:
    "This site sets no cookies. It uses three browser storage keys to remember your theme, your notice choice and the intro animation.",
  lastUpdated: "2026-10-17",
  readingTime: 2,
  sections: [
    {
      heading: "What this site stores",
      bullets: [
        "jjdj-theme — remembers whether you chose light, dark or system. Local storage.",
        "jjdj:consent — remembers that you dismissed the cookie notice. Local storage.",
        "jjdj:intro — remembers that you have seen the intro animation this session. Session storage.",
      ],
      paragraphs: [
        "These are browser storage keys rather than cookies, but they serve the same purpose and are covered by the same rules. None of them identify you, and none are sent to us.",
      ],
    },
    {
      heading: "What we do not use",
      paragraphs: [
        "There is no advertising cookie, no analytics product, no pixel, no session recording and no social media embed that tracks you. There is nothing to consent to beyond remembering your own settings.",
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        "You can clear these keys at any time from your browser's site data settings. The site will keep working; you will simply be asked about the theme and the notice again.",
      ],
    },
    {
      heading: "Notle",
      paragraphs: [
        "Notle uses its own storage and sign-in cookies. Its Cookie Policy at notle-staging.vercel.app/cookies describes them.",
      ],
    },
  ],
};

export const legalDocuments = [privacyPolicy, termsOfService, cookiePolicy];

export function getLegalDocument(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}
