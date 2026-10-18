import type { IconName } from "@/lib/icons";
import type { NotleEditor } from "@/data/screenshots";

/* ------------------------------------------------------------------ *
 *  Products
 *
 *  We make one app. Everything on this page comes from what Notle
 *  actually does today — no invented versions, ratings or downloads.
 * ------------------------------------------------------------------ */

export const productCategories = [
  "Productivity",
  "Utilities",
  "Creative",
  "Developer",
  "Education",
] as const;

export type ProductCategory = (typeof productCategories)[number];

export const platforms = ["Web", "iOS", "Android", "Windows", "macOS"] as const;
export type Platform = (typeof platforms)[number];

export type ProductFeature = {
  title: string;
  description: string;
  icon: IconName;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductLink = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type ProductPlan = {
  name: string;
  price: string;
  period?: string;
  detail: string;
  recommended?: boolean;
};

export type WorkspaceApp = {
  name: string;
  description: string;
  href: string;
  /** Which editor screenshot belongs to this app. */
  editor: NotleEditor;
};

export type Product = {
  slug: string;
  name: string;
  /** One line, used on cards and in meta descriptions. */
  tagline: string;
  /** Two or three sentences for the detail hero. */
  summary: string;
  description: string[];
  category: ProductCategory;
  platforms: Platform[];
  icon: IconName;
  /** ISO date. The one date we are allowed to publish. */
  launchDate: string;
  price: { label: string; note?: string };
  features: ProductFeature[];
  workspaceApps: WorkspaceApp[];
  plans: ProductPlan[];
  requirements: { label: string; value: string }[];
  faqs: ProductFaq[];
  links: ProductLink[];
};

export const products: Product[] = [
  {
    slug: "notle",
    name: "Notle",
    tagline: "A quieter place to make your course material make sense.",
    summary:
      "Notle is a workspace for ideas and documents. Bring in a lecture recording and get key points, a study guide or flashcards — then write, present, model data and annotate PDFs in the same place.",
    description: [
      "Notle starts with the material your class already gave you. Upload an audio recording up to 25 MB or record a lecture directly, then choose one way to work with it: a readable summary of key points, a study guide that goes topic by topic, or flashcards you can flip through.",
      "The same workspace holds four focused editors: Dox for Word documents, Point for presentations, Exceed for spreadsheets and Draft for adding text to PDF pages. Drafts and exports happen in your browser; paid plans add cloud saves, cloud transcription and AI study tools.",
    ],
    category: "Education",
    platforms: ["Web"],
    icon: "graduationCap",
    launchDate: "2026-11-10",
    price: {
      label: "Free plan",
      note: "Paid plans from $12.99 USD / 30 days",
    },
    features: [
      {
        title: "Key points",
        description:
          "A readable summary beside the source transcript — just the main ideas and the context to revisit them.",
        icon: "bookOpen",
      },
      {
        title: "Study guide",
        description:
          "Each topic gets its own path: what to learn, why it matters, and small steps to help you work through it.",
        icon: "graduationCap",
      },
      {
        title: "Flashcards",
        description:
          "Flip through questions and answers, switch hints on when you want them, and leave the timer off if you prefer.",
        icon: "refresh",
      },
      {
        title: "Four focused editors",
        description:
          "Write documents, design slides, work across spreadsheets and place text on PDFs without leaving the workspace.",
        icon: "layers",
      },
      {
        title: "Record or upload",
        description:
          "Bring in MP3, WAV or M4A files up to 25 MB, or record a lecture from your microphone.",
        icon: "playCircle",
      },
      {
        title: "Your account, your call",
        description:
          "Audio retention is controlled in Settings, and saved notes stay in your private account until you delete them.",
        icon: "lock",
      },
    ],
    workspaceApps: [
      {
        name: "Notle Dox",
        description: "Write and shape multi-page Word documents.",
        href: "/workspace/dox",
        editor: "dox",
      },
      {
        name: "Notle Point",
        description:
          "Design themed slides, add images and presenter notes, then export to PowerPoint.",
        href: "/workspace/point",
        editor: "point",
      },
      {
        name: "Notle Exceed",
        description:
          "Work across multiple sheets with common formulas and Excel or CSV export.",
        href: "/workspace/exceed",
        editor: "exceed",
      },
      {
        name: "Notle Draft",
        description:
          "Place text on PDF pages, preview changes, undo edits and save a copy.",
        href: "/workspace/draft",
        editor: "draft",
      },
    ],
    plans: [
      {
        name: "Notle Free",
        price: "Free",
        detail:
          "Dox, Point, Exceed and Draft work locally. Manually build knowledge maps, run focus sessions and transcribe English audio on your device.",
      },
      {
        name: "Notle+",
        price: "$12.99 USD",
        period: "every 30 days",
        detail:
          "200 AI credits, 2 hours of cloud transcription and 1 GB cloud storage per usage month. Local editors included.",
      },
      {
        name: "Notle Student",
        price: "$24.99 USD",
        period: "every 30 days after a 3-day trial",
        detail:
          "600 AI credits, 5 hours of cloud transcription and 5 GB cloud storage per usage month. Local editors included.",
        recommended: true,
      },
      {
        name: "Notle Max",
        price: "$39.99 USD",
        period: "every 30 days",
        detail:
          "1,000 AI credits, 10 hours of cloud transcription and 15 GB cloud storage per usage month. Local editors included.",
      },
    ],
    requirements: [
      { label: "Browser", value: "Any modern browser" },
      { label: "Audio", value: "MP3, WAV or M4A · up to 25 MB" },
      { label: "Account", value: "For people aged 13 and over" },
      {
        label: "Free plan",
        value: "Local editors and on-device English transcription",
      },
      {
        label: "Paid plans",
        value: "Cloud saves, cloud transcription and AI study tools",
      },
    ],
    faqs: [
      {
        question: "What is Notle?",
        answer:
          "Notle is a workspace for study and documents. It turns lecture audio into key points, study guides and flashcards, and includes editors for documents, presentations, spreadsheets and PDFs.",
      },
      {
        question: "What audio can I bring in?",
        answer:
          "MP3, WAV and M4A files up to 25 MB, or a recording made from your microphone. Only record or share material you have permission to use.",
      },
      {
        question: "Does the free plan work without paying?",
        answer:
          "Yes. The free plan includes the local editors, manual knowledge maps, focus sessions and English transcription on your device. Document cloud saves and AI features need a paid plan.",
      },
      {
        question: "Where does my audio go?",
        answer:
          "Free transcription runs on your device. Paid cloud transcription sends audio to AssemblyAI, and study notes are generated with OpenAI. You can control audio retention in Settings.",
      },
      {
        question: "How much do the paid plans cost?",
        answer:
          "Notle+ is $12.99 USD every 30 days, Notle Student is $24.99 USD every 30 days after a 3-day trial, and Notle Max is $39.99 USD every 30 days. Yearly options are also available. Taxes and any local currency conversion are shown at checkout.",
      },
      {
        question: "Can I use Notle on my phone?",
        answer:
          "Notle runs in the browser, so it works on a phone, tablet or computer with a modern browser.",
      },
      {
        question: "Is the AI always right?",
        answer:
          "No. AI-generated summaries and study guides can omit or misstate details. Compare them with your source material and do not rely on them as a replacement for authoritative course or professional advice.",
      },
      {
        question: "When does Notle launch?",
        answer: "Notle launches on 10 November 2026.",
      },
    ],
    links: [
      {
        label: "Open Notle",
        href: "https://notle-staging.vercel.app",
        variant: "primary",
      },
      {
        label: "See plans",
        href: "https://notle-staging.vercel.app/pricing",
        variant: "secondary",
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 *  Helpers used across the app.
 * ------------------------------------------------------------------ */

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductSlugs(): string[] {
  return products.map((product) => product.slug);
}
