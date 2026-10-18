/* ------------------------------------------------------------------ *
 *  Notle screenshots
 *
 *  Real captures of the app, kept in public/notle. Editor shots are keyed
 *  by editor so a card can never pick up the wrong screenshot, and the
 *  study gallery only lists the screens that are not tied to one editor.
 * ------------------------------------------------------------------ */

export type NotleEditor = "dox" | "point" | "exceed" | "draft";

export type NotleScreenshot = {
  /** Stable id, also used for the little address bar in the frame. */
  slug: string;
  src: string;
  /** What the screen shows, for people who cannot see it. */
  alt: string;
  title: string;
  caption: string;
};

/** One screenshot per editor — the mapping is the point of this file. */
export const editorScreenshots: Record<NotleEditor, NotleScreenshot> = {
  dox: {
    slug: "dox",
    src: "/notle/dox-field-notes.jpeg",
    alt: "Notle Dox with a Field Notes document open on the page.",
    title: "Field notes",
    caption: "A multi-page document in Notle Dox.",
  },
  point: {
    slug: "point",
    src: "/notle/point-water-cycle.jpeg",
    alt: "Notle Point showing a presentation about the water cycle.",
    title: "Water cycle",
    caption: "A themed slide deck in Notle Point.",
  },
  exceed: {
    slug: "exceed",
    src: "/notle/exceed-seedling-growth.jpeg",
    alt: "Notle Exceed showing a spreadsheet tracking seedling growth.",
    title: "Seedling growth",
    caption: "Sheets and formulas in Notle Exceed.",
  },
  draft: {
    slug: "draft",
    src: "/notle/draft-garden-soil.jpeg",
    alt: "Notle Draft with a garden soil PDF open for annotation.",
    title: "Garden soil",
    caption: "Text placed on a PDF page in Notle Draft.",
  },
};

/**
 * The rest of the workspace, in the order a study session moves through it:
 * the home screen, lectures, the study desk, the plan, the map, follow-up
 * questions, the week, then the app shelf.
 */
export const studyScreenshots: NotleScreenshot[] = [
  {
    slug: "home",
    src: "/notle/home.jpeg",
    alt: "The Notle home screen with the workspace, study plan and editors.",
    title: "Home",
    caption: "Everything Notle can do, one screen in.",
  },
  {
    slug: "my-lectures",
    src: "/notle/my-lectures.jpeg",
    alt: "The My lectures list in Notle.",
    title: "My lectures",
    caption: "Every recording and upload, kept in one list.",
  },
  {
    slug: "study-desk",
    src: "/notle/study-desk.jpeg",
    alt: "The Notle study desk with a lecture open for study.",
    title: "Study desk",
    caption: "Where a lecture becomes notes you can use.",
  },
  {
    slug: "study-plan",
    src: "/notle/study-plan.jpeg",
    alt: "A study plan laid out in Notle.",
    title: "Study plan",
    caption: "A plan built from the material you actually have to learn.",
  },
  {
    slug: "knowledge-map",
    src: "/notle/knowledge-map.jpeg",
    alt: "A knowledge map of connected topics in Notle.",
    title: "Knowledge map",
    caption: "See the topics in a lecture and how they connect.",
  },
  {
    slug: "ai-tutor",
    src: "/notle/ai-tutor.jpeg",
    alt: "The Notle AI tutor answering a question about the material.",
    title: "AI tutor",
    caption: "Ask follow-up questions about the lecture you are working through.",
  },
  {
    slug: "calendar",
    src: "/notle/calendar-water-cycle.jpeg",
    alt: "The Notle calendar with a water cycle study item.",
    title: "Calendar",
    caption: "Put study sessions beside the rest of your week.",
  },
  {
    slug: "all-apps",
    src: "/notle/all-apps.jpeg",
    alt: "The All apps screen showing the Notle editors and study tools.",
    title: "All apps",
    caption: "The four editors and the study tools, side by side.",
  },
];
