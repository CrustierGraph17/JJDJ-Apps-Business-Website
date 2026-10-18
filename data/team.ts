import type { IconName } from "@/lib/icons";

/* ------------------------------------------------------------------ *
 *  The two people behind JJDJ.
 *
 *  Ages are never stored. They are derived from the birthday every time
 *  they are rendered, so the site stays correct each year.
 * ------------------------------------------------------------------ */

export const story =
  "JJDJ started because we wanted to help others with the problems we face every day.";

export type TeamMember = {
  name: string;
  role: string;
  /** Age is computed from this — never hard-code a number. */
  birthday: { year: number; month: number; day: number };
  /** Optional: only shown when we actually have one. */
  funFact?: string;
  location: string;
  /** Rendered as a tile-styled initials avatar — no stock photography. */
  initials: string;
  focus: IconName;
};

export const team: TeamMember[] = [
  {
    name: "Joash Jackson",
    role: "CTO",
    birthday: { year: 2011, month: 11, day: 5 },
    funFact:
      "Learnt HTML, JavaScript, C++, C#, Python and SQL before turning 13.",
    location: "Perth, WA",
    initials: "JJ",
    focus: "cpu",
  },
  {
    name: "Darryl Lopez",
    role: "CEO",
    birthday: { year: 2011, month: 10, day: 25 },
    location: "Perth, WA",
    initials: "DL",
    funFact:
    "Has been an A average student since Year 1.",
  focus: "users",
  },
];

/** Whole years between a birthday and today. */
export function ageFrom(
  birthday: { year: number; month: number; day: number },
  today: Date = new Date(),
): number {
  let age = today.getFullYear() - birthday.year;
  const month = today.getMonth() + 1;
  if (month < birthday.month || (month === birthday.month && today.getDate() < birthday.day)) {
    age -= 1;
  }
  return age;
}

/** "5 November" — for the founder cards. */
export function formatBirthday(birthday: {
  month: number;
  day: number;
}): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2025, birthday.month - 1, birthday.day)));
}
