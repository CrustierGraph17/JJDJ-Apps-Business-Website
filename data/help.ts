import type { IconName } from "@/lib/icons";

/* ------------------------------------------------------------------ *
 *  Notle help
 *
 *  Everything here describes how Notle actually works today: the audio it
 *  accepts, the four editors, the plans and the providers it uses. If a
 *  detail is not known, it is not written down.
 * ------------------------------------------------------------------ */

export type HelpCategorySlug =
  | "getting-started"
  | "study-tools"
  | "plans-and-billing"
  | "privacy-and-data";

export type HelpCategory = {
  slug: HelpCategorySlug;
  title: string;
  description: string;
  icon: IconName;
};

export const helpCategories: HelpCategory[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    description: "What Notle is, how to bring in a lecture, and where your work lives.",
    icon: "rocket",
  },
  {
    slug: "study-tools",
    title: "Study tools",
    description: "Key points, study guides, flashcards and the AI behind them.",
    icon: "graduationCap",
  },
  {
    slug: "plans-and-billing",
    title: "Plans & billing",
    description: "Free and paid plans, renewals, trials and refunds.",
    icon: "wallet",
  },
  {
    slug: "privacy-and-data",
    title: "Privacy & data",
    description: "What stays on your device, what goes to a provider, and how to delete it.",
    icon: "shield",
  },
];

export type HelpArticleSection = {
  /** Rendered as the section heading and used to build the table of contents. */
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Optional code sample with a filename label. */
  code?: { label: string; content: string };
  /** Optional note rendered as an inline callout. */
  note?: string;
};

export type HelpArticle = {
  slug: string;
  title: string;
  /** One line, shown in results and on the category pages. */
  description: string;
  category: HelpCategorySlug;
  /** Product slug when this article is about a specific app. */
  product?: string;
  updated: string;
  /** Minutes, rounded up. Stored so list views never have to measure. */
  readingTime: number;
  /** Surfaced in the "Popular articles" row. */
  popular?: boolean;
  sections: HelpArticleSection[];
  faqs?: { question: string; answer: string }[];
};

export const helpArticles: HelpArticle[] = [
  {
    slug: "getting-started-with-notle",
    title: "Getting started with Notle",
    description:
      "What Notle is, what the four editors do, and what you get on the free plan.",
    category: "getting-started",
    product: "notle",
    updated: "2026-10-17",
    readingTime: 4,
    popular: true,
    sections: [
      {
        heading: "What Notle is",
        paragraphs: [
          "Notle is a workspace for ideas and documents. It has two halves: study tools that turn lecture audio into key points, a study guide or flashcards, and four editors for the documents, presentations, spreadsheets and PDFs that move your work forward.",
          "You need a Notle account to use it. Accounts are intended for people aged 13 or older.",
        ],
      },
      {
        heading: "The four editors",
        bullets: [
          "Notle Dox — write and shape multi-page Word documents, and import or export .docx files.",
          "Notle Point — design themed slides, add images and presenter notes, then export to PowerPoint.",
          "Notle Exceed — work across multiple sheets with common formulas and Excel or CSV export.",
          "Notle Draft — place text on PDF pages, preview changes, undo edits and save a copy.",
        ],
        note: "Point and Exceed keep drafts in your browser. Draft holds an opened PDF in memory while the editor is open. Dox documents are saved on your device for free accounts.",
      },
      {
        heading: "Free and paid",
        paragraphs: [
          "The free plan includes the local editors, manual knowledge maps, focus sessions and English transcription on your device. Document cloud saves and AI features need a paid plan.",
          "Paid plans add a monthly allowance of AI credits, cloud transcription and cloud storage. The Plans & billing article lists the current prices and allowances.",
        ],
      },
      {
        heading: "Where to start",
        paragraphs: [
          "If you have a recording, start there: bring in the audio, choose key points, a study guide or flashcards, and read the result against the transcript. If you already have a document, open Dox instead. There is no wrong order.",
        ],
      },
    ],
  },
  {
    slug: "recording-and-uploading-a-lecture",
    title: "Recording and uploading a lecture",
    description:
      "Supported audio, the 25 MB limit, and the difference between Stop & summarize and Stop & save only.",
    category: "getting-started",
    product: "notle",
    updated: "2026-10-17",
    readingTime: 4,
    popular: true,
    sections: [
      {
        heading: "What you can bring in",
        paragraphs: [
          "You can upload an audio recording up to 25 MB, or record a lecture directly from your microphone. MP3, WAV and M4A files are supported.",
          "Only record, upload or share another person's voice or material when you have the permission and legal authority required where the people involved are located.",
        ],
      },
      {
        heading: "Stop & summarize, or stop & save only",
        paragraphs: [
          "Both options keep the transcript. Stop & summarize also sends the transcript to OpenAI to create a short lecture title and the study format you selected. Stop & save only stores the transcript and the recording without AI processing.",
          "If you add more speech later, it is appended to the same lecture.",
        ],
      },
      {
        heading: "Resuming and editing",
        paragraphs: [
          "In My Lectures you can summarise a lecture later, resume it in the Study Desk, edit its title, download the summary, transcript or audio, or delete it after confirming.",
        ],
      },
      {
        heading: "Audio retention",
        paragraphs: [
          "Audio retention is controlled in Settings. When retention is off, Notle removes uploaded audio after transcription. When it is on, the recording stays with the lecture until you remove it.",
          "Unlinked staged audio is scheduled for cleanup after 24 hours.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is there a file size limit?",
        answer: "Yes — audio uploads are capped at 25 MB per recording.",
      },
      {
        question: "Does recording work offline?",
        answer:
          "Free transcription runs an English Whisper model on your device after the model files download. Paid cloud transcription streams audio to AssemblyAI and needs a connection.",
      },
    ],
  },
  {
    slug: "study-formats-and-ai",
    title: "Study formats and AI",
    description:
      "How key points, study guides and flashcards are made, which providers are used, and why you should check the output.",
    category: "study-tools",
    product: "notle",
    updated: "2026-10-17",
    readingTime: 4,
    popular: true,
    sections: [
      {
        heading: "Three ways into the material",
        bullets: [
          "Key points — a readable summary beside the source transcript.",
          "Study guide — each topic gets its own path: what to learn, why it matters, and small steps to work through it.",
          "Flashcards — questions and answers you can flip through, with optional hints and an optional timer.",
        ],
      },
      {
        heading: "Which providers are involved",
        paragraphs: [
          "Paid cloud transcription uses AssemblyAI (Universal-3.5-Pro for live streaming, with Universal-2 as a fallback for uploaded audio). Study material and AI responses are generated with OpenAI (gpt-6-luna).",
          "Free accounts transcribe English audio on the device instead, using a Whisper model that downloads on first use.",
        ],
      },
      {
        heading: "AI output can be wrong",
        paragraphs: [
          "Summaries, guides and cards can omit or misstate details. Compare them with your source material. Notle does not guarantee academic results, factual correctness or a replacement for authoritative course or professional advice.",
        ],
        note: "You can ask follow-up questions about your material in the workspace. Turning workspace context off keeps your open exams, assignments, calendar items and saved notes out of that request; a lecture you explicitly attach stays included.",
      },
    ],
    faqs: [
      {
        question: "Do free accounts get AI summaries?",
        answer:
          "No. Free accounts include on-device English transcription and the local editors. AI summaries, study guides, flashcards and AI chat need a paid plan.",
      },
      {
        question: "Are my lectures used to train a model?",
        answer:
          "Notle sends the transcript you ask it to summarise to OpenAI and uses AssemblyAI for paid cloud transcription. Provider terms and retention practices apply to that processing. Read Notle's Privacy Policy for the current details.",
      },
    ],
  },
  {
    slug: "notle-plans-and-billing",
    title: "Notle plans and billing",
    description:
      "The free plan, the three paid plans, yearly options, cancellation and refunds.",
    category: "plans-and-billing",
    product: "notle",
    updated: "2026-10-17",
    readingTime: 5,
    sections: [
      {
        heading: "Free",
        paragraphs: [
          "Notle Free includes Dox, Point, Exceed and Draft locally, manual knowledge maps, focus sessions and English transcription on your device. Knowledge maps, study plans and calendar items save to your account for free. Document cloud saves and AI are paid features.",
        ],
      },
      {
        heading: "Paid plans",
        bullets: [
          "Notle Student — $12.99 USD every 30 days. 200 AI credits, 2 hours of cloud transcription and 1 GB cloud storage per usage month.",
          "Notle+ — $24.99 USD every 30 days after a 3-day trial. 600 AI credits, 5 hours of cloud transcription and 5 GB cloud storage.",
          "Notle Max — $39.99 USD every 30 days. 1,000 AI credits, 10 hours of cloud transcription and 15 GB cloud storage.",
        ],
        note: "Yearly billing is also offered, with savings of 17%, 20% and 25% respectively. Base prices are in USD. Taxes and any local currency conversion are shown at checkout.",
      },
      {
        heading: "Trials and renewals",
        paragraphs: [
          "The Notle+ trial is available once per eligible customer. It renews automatically at the stated price unless you cancel before it ends. Cancelling stops the next renewal and keeps access until the confirmed period ends.",
          "Payment method, trial eligibility and renewal terms are shown by Whop, which handles checkout and billing.",
        ],
      },
      {
        heading: "Refunds",
        paragraphs: [
          "You can request a full refund within seven days of your first paid Notle purchase. This discretionary window applies to the first paid purchase, not renewals or repeat purchases. Cancellation alone does not issue a refund.",
          "Nothing in the refund policy limits mandatory consumer rights, including remedies for service failures or incorrect charges.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I change plans later?",
        answer:
          "Tier changes currently require support. Contact Notle through the support page on the Notle website.",
      },
      {
        question: "Does Notle store my card details?",
        answer:
          "No. Card details stay with Whop, the payment provider. Notle stores order and membership details needed to keep your plan working.",
      },
    ],
  },
  {
    slug: "your-data-in-notle",
    title: "Your data in Notle",
    description:
      "What stays in your browser, what goes to Supabase, AssemblyAI or OpenAI, and how to delete it.",
    category: "privacy-and-data",
    product: "notle",
    updated: "2026-10-17",
    readingTime: 5,
    sections: [
      {
        heading: "What stays on your device",
        bullets: [
          "Free Dox drafts, Point decks and Exceed workbooks use browser storage.",
          "Draft holds an opened PDF in memory while the editor is open and does not persist it.",
          "Local transcripts, calendar recovery copies and older planning backups use browser storage.",
          "Clearing your browser storage removes these copies, so do not use a shared device for material you need to keep private.",
        ],
      },
      {
        heading: "What goes to a provider",
        paragraphs: [
          "Supabase provides account authentication, the database and private storage. AssemblyAI provides paid cloud transcription. OpenAI provides the summaries, study guides, flashcards and assistant responses you request.",
          "These services may process information outside Australia. Notle's Privacy Policy lists the providers and the current retention details.",
        ],
      },
      {
        heading: "No advertising or analytics",
        paragraphs: [
          "The Notle application currently includes no analytics, advertising pixels, session-replay scripts or third-party advertising embeds. Content is not used for advertising.",
        ],
      },
      {
        heading: "Deleting your data",
        paragraphs: [
          "Use Settings to change your account details, download or remove saved audio, or delete your account. Deleting a Notle account does not erase records Whop must retain for billing reconciliation or legal obligations.",
          "If you are resolving a pending checkout, do that first and let a cancelled subscription expire before deleting the account so a charge is not orphaned.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Notle keep my audio forever?",
        answer:
          "It follows your retention setting. With retention off, uploaded audio is removed after transcription. With retention on, the recording stays with the lecture until you remove it.",
      },
      {
        question: "Can I export my work?",
        answer:
          "Yes. Dox imports and exports .docx, Point imports and exports .pptx, Exceed imports and exports .xlsx and .csv, and Draft saves an edited PDF copy on your device.",
      },
    ],
  },
];

/* ---------- helpers ---------- */

export const popularArticles = helpArticles.filter((article) => article.popular);

export function getArticle(slug: string): HelpArticle | undefined {
  return helpArticles.find((article) => article.slug === slug);
}

export function getArticlesInCategory(slug: HelpCategorySlug): HelpArticle[] {
  return helpArticles.filter((article) => article.category === slug);
}

export function getArticlesForProduct(slug: string): HelpArticle[] {
  return helpArticles.filter((article) => article.product === slug);
}

/**
 * The flat search index used by the help search and the command palette.
 * Titles and descriptions are indexed; body text is not, to keep results
 * fast and predictable.
 */
export const helpSearchIndex = helpArticles.map((article) => ({
  slug: article.slug,
  title: article.title,
  description: article.description,
  category: article.category,
  product: article.product,
  headings: article.sections.map((section) => section.heading),
}));

/** Frequently asked questions shown on /help and in the FAQPage JSON-LD. */
export const helpFaqs = [
  {
    question: "Is there a free plan?",
    answer:
      "Yes. Notle Free includes the local editors, manual knowledge maps, focus sessions and English transcription on your device. Document cloud saves and AI features need a paid plan.",
  },
  {
    question: "What audio can I upload?",
    answer:
      "MP3, WAV and M4A files up to 25 MB, or a recording made from your microphone.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Yes. Notle accounts are intended for people aged 13 or older.",
  },
  {
    question: "Where is my work stored?",
    answer:
      "Free drafts stay in your browser. Paid plans add private cloud saves, cloud transcription and AI study tools. Audio retention is controlled in Settings.",
  },
  {
    question: "How much do paid plans cost?",
    answer:
      "Notle Student is $12.99 USD every 30 days, Notle+ is $24.99 USD every 30 days after a 3-day trial, and Notle Max is $39.99 USD every 30 days. Yearly options are available.",
  },
  {
    question: "When does Notle launch?",
    answer: "Notle launches on 10 November 2026.",
  },
];
