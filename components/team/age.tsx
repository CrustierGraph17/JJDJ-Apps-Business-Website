"use client";

import { ageFrom } from "@/data/team";

type Birthday = { year: number; month: number; day: number };

/**
 * Age, derived from a birthday at render time.
 *
 * A hard-coded age is wrong within twelve months, so the number is computed
 * from the date instead. The server renders it at build time and the client
 * re-computes on hydration; `suppressHydrationWarning` keeps a birthday that
 * falls between the two quiet.
 */
export function Age({ birthday }: { birthday: Birthday }) {
  return <span suppressHydrationWarning>{ageFrom(birthday, new Date())}</span>;
}
