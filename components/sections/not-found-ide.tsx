"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Blocks,
  BookOpen,
  ChevronRight,
  FileCode2,
  FileText,
  Files,
  Folder,
  FolderOpen,
  GitBranch,
  LifeBuoy,
  Search,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  404 — "find_missing_page.py"
 *
 *  An IDE that cannot find the page either. The explorer is decor, the
 *  code pane is real (and highlights itself), and the terminal at the
 *  bottom runs a script that scans ports, checks under the server
 *  floorboards, and never gives up — every cycle ends in the same
 *  [System] line before it tries again.
 * ------------------------------------------------------------------ */

type Tone = "cmd" | "dim" | "info" | "warn" | "error" | "system";

type TerminalLine = { text: string; tone: Tone };

/** The runaway script, printed one character at a time. */
const SCRIPT: TerminalLine[] = [
  { tone: "dim", text: "loading lookup service ................ ok" },
  { tone: "info", text: "[scan] GET /missing-page → 404" },
  { tone: "info", text: "[scan] Scanning ports 3000…51754 → not there either" },
  { tone: "info", text: "[scan] Checking under the server floorboards… dust" },
  { tone: "warn", text: "[warn] route cache empty — retrying with optimism" },
  { tone: "info", text: '[scan] grep -r "missing-page" /var/www → 0 matches' },
  { tone: "info", text: "[scan] asking the CDN politely… the CDN says no" },
  { tone: "info", text: "[scan] searching node_modules, give it a minute" },
  { tone: "warn", text: "[warn] attempt 4,096 exceeded — continuing anyway" },
  { tone: "info", text: "[scan] checking the browser history… that is private" },
  { tone: "info", text: "[scan] the page is not in this timeline" },
  { tone: "error", text: "Traceback (most recent call last):" },
  { tone: "error", text: '  File "find_missing_page.py", line 21, in <module>' },
  { tone: "error", text: "PageNotFoundError: the page took a coffee break" },
  { tone: "system", text: "[System]: Giving up. Human intervention required." },
];

/** The file rendered in the main pane — the same script, at rest. */
const FILE_SOURCE = `#!/usr/bin/env python3
"""find_missing_page.py — recover a URL that definitely existed."""

import itertools
from hope import spring

ROUTES = ["/", "/products/notle", "/help", "/contact"]
TARGET = "/missing-page"

def find(target: str) -> str:
    for attempt in itertools.count(start=1):
        print(f"attempt {attempt}: not in {len(ROUTES)} routes")
    raise PageNotFoundError("the page took a coffee break")

if __name__ == "__main__":
    try:
        find(TARGET)
    except PageNotFoundError:
        print("[System]: Giving up. Human intervention required.")`;

const FILE_LINES = FILE_SOURCE.split("\n");

const CODE_TOKENS =
  /(#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(and|as|assert|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/g;

/** Just enough Python highlighting to read as a real editor. */
function highlight(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const tokens = new RegExp(CODE_TOKENS.source, "g");
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = tokens.exec(line)) !== null) {
    const [token, comment, string, keyword, number, call] = match;
    if (match.index > last) nodes.push(line.slice(last, match.index));

    const color = comment
      ? "#75715e"
      : string
        ? "#e6db74"
        : keyword
          ? "#f92672"
          : number
            ? "#ae81ff"
            : call
              ? "#a6e22e"
              : undefined;

    nodes.push(
      <span key={`${match.index}-${token}`} style={color ? { color } : undefined}>
        {token}
      </span>,
    );
    last = match.index + token.length;
  }

  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
}

const TREE = [
  { depth: 0, label: "jjdj-web", icon: "folder-open" },
  { depth: 1, label: "app", icon: "folder-open" },
  { depth: 2, label: "page.tsx", icon: "tsx" },
  { depth: 2, label: "layout.tsx", icon: "tsx" },
  { depth: 2, label: "not-found.tsx", icon: "tsx" },
  { depth: 2, label: "find_missing_page.py", icon: "py", active: true },
  { depth: 1, label: "components", icon: "folder" },
  { depth: 1, label: "public", icon: "folder" },
  { depth: 1, label: "package.json", icon: "tsx" },
  { depth: 1, label: "README.md", icon: "tsx" },
] as const;

const TONE_CLASS: Record<Tone, string> = {
  cmd: "text-[#f8f8f2]",
  dim: "text-[#75715e]",
  info: "text-[#b9b9b2]",
  warn: "text-[#e6db74]",
  error: "text-[#f92672]",
  system: "text-[#2dd4bf] font-semibold",
};

/*
 * The way out.
 *
 * Labels name the page they land on, and the second line is the literal path
 * as you would open it — no guessing which of these is home and which is
 * support. Everything except the terminal copy is written plainly.
 */
const ACTIONS = [
  {
    label: "Back to Home",
    href: "/",
    prompt: "open /",
    icon: ArrowLeft,
    primary: true,
  },
  {
    label: "Read the Docs",
    href: "/docs",
    prompt: "open /docs",
    icon: BookOpen,
    primary: false,
  },
  {
    label: "Contact the Team",
    href: "/contact",
    prompt: "open /contact",
    icon: LifeBuoy,
    primary: false,
  },
] as const;

/** Watches the reduced-motion preference without a setState-in-effect. */
function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Reduced motion: no typing and no loop — the whole transcript, at rest. */
const CALM_LOG: TerminalLine[] = [
  { tone: "cmd", text: "python find_missing_page.py --attempt ∞" },
  ...SCRIPT,
];

export function NotFoundIde() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { tone: "dim", text: "starting python runtime…" },
  ]);
  const [typing, setTyping] = useState<TerminalLine | null>(null);
  const [paused, setPaused] = useState(false);
  const calm = useSyncExternalStore(subscribeToReducedMotion, reduceMotion, () => false);
  const logRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const output = calm ? CALM_LOG : lines;

  useEffect(() => {
    if (calm) return;

    let cancelled = false;
    let timer: number | undefined;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });

    /** Hold the script while the tab is hidden or a reader is hovering. */
    async function hold() {
      while (!cancelled && (pausedRef.current || document.hidden)) {
        await sleep(140);
      }
    }

    async function typeLine(line: TerminalLine) {
      if (line.tone === "cmd") {
        setLines((prev) => [...prev, line]);
        await sleep(420);
        return;
      }

      setTyping({ tone: line.tone, text: "" });
      for (let index = 1; index <= line.text.length; index += 1) {
        if (cancelled) return;
        await hold();
        setTyping({ tone: line.tone, text: line.text.slice(0, index) });
        await sleep(line.tone === "error" ? 8 : 11);
      }
      setTyping(null);
      setLines((prev) => [...prev, line]);
    }

    async function run() {
      let attempt = 1;
      while (!cancelled) {
        setLines([]);
        setTyping(null);
        await sleep(420);

        await typeLine({
          tone: "cmd",
          text: `python find_missing_page.py --attempt ${attempt}`,
        });

        for (const line of SCRIPT) {
          if (cancelled) return;
          await hold();
          await typeLine(line);
          await sleep(line.tone === "system" ? 120 : 60);
        }

        if (cancelled) return;
        await sleep(5600);
        attempt += 1;
      }
    }

    void run();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [calm]);

  /* Keep the newest output in view, like a real terminal. */
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [output, typing]);

  return (
    <div className="relative">
      {/* The window itself: always dark, in either theme. */}
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-panel border border-white/10 bg-[#1e1e1e]",
          "shadow-raised ring-1 ring-black/45",
        )}
      >
        {/* ---------- title bar ---------- */}
        <div className="flex items-center gap-3 border-b border-white/8 bg-[#181818] px-3.5 py-2.5 sm:px-4">
          <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f56]" />
            <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="size-2.5 rounded-full bg-[#27c93f]" />
          </div>

          <p className="min-w-0 truncate font-mono text-[0.6875rem] text-[#9d9d97] sm:text-[0.75rem]">
            find_missing_page.py
            <span className="text-[#5c5c58]"> — jjdj-web</span>
          </p>

          <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-pill border border-[#ff5f56]/30 bg-[#ff5f56]/10 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.1em] text-[#ff8a80] uppercase sm:inline-flex">
            <AlertCircle className="size-3" aria-hidden="true" />
            404
          </span>
        </div>

        {/* ---------- body: activity bar · explorer · editor ---------- */}
        <div className="grid lg:grid-cols-[2.75rem_13.5rem_minmax(0,1fr)] md:grid-cols-[13.5rem_minmax(0,1fr)]">
          {/* Activity bar */}
          <div
            aria-hidden="true"
            className="hidden flex-col items-center gap-1 border-r border-white/6 bg-[#202020] py-3 lg:flex"
          >
            <span className="grid size-8 place-items-center border-l-2 border-[#14b8a6] text-[#f8f8f2]">
              <Files className="size-[1.05rem]" />
            </span>
            <span className="grid size-8 place-items-center text-[#6b6b68]">
              <Search className="size-[1.05rem]" />
            </span>
            <span className="grid size-8 place-items-center text-[#6b6b68]">
              <GitBranch className="size-[1.05rem]" />
            </span>
            <span className="grid size-8 place-items-center text-[#6b6b68]">
              <Blocks className="size-[1.05rem]" />
            </span>
            <span className="mt-auto grid size-8 place-items-center text-[#6b6b68]">
              <Settings className="size-[1.05rem]" />
            </span>
          </div>

          {/* Explorer */}
          <div
            aria-hidden="true"
            className="hidden flex-col border-r border-white/6 bg-[#1f1f1f] py-2.5 md:flex"
          >
            <p className="px-3.5 pb-2 font-mono text-[0.625rem] tracking-[0.18em] text-[#8b8b86] uppercase">
              Explorer
            </p>
            <ul className="space-y-px px-1.5">
              {TREE.map((row) => (
                <li
                  key={`${row.depth}-${row.label}`}
                  className={cn(
                    "flex items-center gap-1.5 rounded-[4px] py-1 pr-2 font-mono text-[0.6875rem]",
                    "active" in row && row.active
                      ? "bg-[#37373d] text-[#f8f8f2]"
                      : "text-[#b9b9b2]",
                  )}
                  style={{ paddingLeft: `${0.5 + row.depth * 0.85}rem` }}
                >
                  {row.icon === "py" ? (
                    <FileCode2 className="size-3.5 shrink-0 text-[#14b8a6]" />
                  ) : row.icon === "folder-open" ? (
                    <FolderOpen className="size-3.5 shrink-0 text-[#8b8b86]" />
                  ) : row.icon === "folder" ? (
                    <Folder className="size-3.5 shrink-0 text-[#8b8b86]" />
                  ) : (
                    <FileText className="size-3.5 shrink-0 text-[#8b8b86]" />
                  )}
                  <span className="truncate">{row.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Editor */}
          <div className="min-w-0 bg-[#1e1e1e]">
            {/* Tabs */}
            <div className="flex items-stretch border-b border-white/6 bg-[#181818]">
              <span className="flex items-center gap-2 border-r border-white/6 border-t-2 border-t-[#14b8a6] bg-[#1e1e1e] px-3 py-2 font-mono text-[0.6875rem] text-[#f8f8f2]">
                <FileCode2 className="size-3.5 text-[#14b8a6]" aria-hidden="true" />
                find_missing_page.py
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#14b8a6]" />
              </span>
              <span className="hidden items-center gap-2 border-r border-white/6 px-3 py-2 font-mono text-[0.6875rem] text-[#6b6b68] sm:flex">
                not-found.tsx
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#e6db74]" />
              </span>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 border-b border-white/6 px-3.5 py-1.5 font-mono text-[0.625rem] text-[#8b8b86]">
              <Folder className="hidden size-3 shrink-0 md:block" aria-hidden="true" />
              <span className="hidden md:inline">jjdj-web</span>
              <ChevronRight className="hidden size-3 md:block" aria-hidden="true" />
              <span>app</span>
              <ChevronRight className="size-3" aria-hidden="true" />
              <span className="truncate text-[#c8c8c2]">find_missing_page.py</span>
            </div>

            {/* File, with gutter */}
            <div className="flex overflow-x-auto font-mono text-[0.6875rem] leading-[1.65] sm:text-[0.75rem]">
              <div
                aria-hidden="true"
                className="shrink-0 border-r border-white/6 bg-[#1b1b1b] py-3 text-right text-[#5c5c58] select-none"
              >
                {FILE_LINES.map((_, index) => (
                  <div key={index} className="px-3">
                    {index + 1}
                  </div>
                ))}
              </div>
              <pre className="min-w-0 flex-1 py-3 pl-4 pr-6 text-[#f8f8f2]">
                <code>
                  {FILE_LINES.map((line, index) => (
                    <div key={index} className="whitespace-pre">
                      {highlight(line)}
                      {line.length === 0 ? "\u00a0" : null}
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Terminal */}
            <div className="border-t border-white/8">
              <div className="flex items-center gap-3 border-b border-white/6 bg-[#181818] px-3.5 py-1.5">
                <span className="flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-[#6b6b68] uppercase">
                  Problems
                  <span className="rounded-[3px] bg-[#ff5f56]/15 px-1 text-[#ff8a80]">1</span>
                </span>
                <span className="font-mono text-[0.625rem] tracking-[0.14em] text-[#6b6b68] uppercase">
                  Output
                </span>
                <span className="flex items-center gap-1.5 border-b-2 border-b-[#14b8a6] pb-0.5 font-mono text-[0.625rem] tracking-[0.14em] text-[#f8f8f2] uppercase">
                  Terminal
                </span>
                <span className="ml-auto hidden font-mono text-[0.625rem] text-[#6b6b68] sm:inline">
                  zsh · python 3.13
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.1em] text-[#14b8a6] uppercase">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 rounded-full bg-[#14b8a6]",
                      paused ? "opacity-40" : "animate-pulse",
                    )}
                  />
                  {paused ? "paused" : "live"}
                </span>
              </div>

              <div
                ref={logRef}
                aria-hidden="true"
                onPointerEnter={() => {
                  pausedRef.current = true;
                  setPaused(true);
                }}
                onPointerLeave={() => {
                  pausedRef.current = false;
                  setPaused(false);
                }}
                className="h-[11.5rem] overflow-y-auto bg-[#161616] px-3.5 py-3 font-mono text-[0.6875rem] leading-[1.75] sm:h-[12.5rem] sm:text-[0.75rem]"
              >
                {output.map((line, index) => (
                  <div key={index} className={TONE_CLASS[line.tone]}>
                    {line.tone === "cmd" ? (
                      <>
                        <span className="text-[#14b8a6]">➜</span>{" "}
                        <span className="text-[#8b8b86]">jjdj-web</span> {line.text}
                      </>
                    ) : (
                      line.text
                    )}
                  </div>
                ))}

                {typing && !calm ? (
                  <div className={TONE_CLASS[typing.tone]}>
                    {typing.text}
                    <span className="ml-px inline-block h-[0.85em] w-[0.5em] translate-y-[0.1em] animate-pulse bg-[#f8f8f2]" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- status bar ---------- */}
        <div className="flex items-center gap-3 bg-[#14b8a6] px-3.5 py-1 font-mono text-[0.625rem] font-medium text-[#08100f]">
          <span className="flex items-center gap-1.5">
            <GitBranch className="size-3" aria-hidden="true" />
            main
          </span>
          <span className="flex items-center gap-1.5">
            <AlertCircle className="size-3" aria-hidden="true" />
            1 problem
          </span>
          <span className="ml-auto hidden sm:inline">Ln 21, Col 12</span>
          <span className="hidden sm:inline">Spaces: 4</span>
          <span>UTF-8</span>
          <span className="hidden md:inline">LF</span>
          <span>Python 3.13</span>
        </div>
      </div>

      {/*
       * The transcript above is decorative and mutates constantly, so the
       * spoken version is one static sentence instead.
       */}
      <p className="sr-only">
        Automated terminal log: a script keeps searching for the missing page, checking
        ports, the server floorboards and the browser history, and never finds it. Every
        run ends with: [System]: Giving up. Human intervention required.
      </p>
    </div>
  );
}

/**
 * The way out, written as terminal actions. Rendered from the start, always
 * real links, and never behind the animation.
 */
export function NotFoundActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      {ACTIONS.map(({ label, href, prompt, icon: Icon, primary }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "group inline-flex items-center gap-3 rounded-card border px-4 py-3.5",
            "font-mono text-[0.8125rem] transition-[transform,border-color,background-color,color] duration-200",
            "hover:-translate-y-0.5",
            primary
              ? "border-[#14b8a6]/60 bg-[#102a27] text-[#f8f8f2] hover:border-[#14b8a6] hover:bg-[#163b36]"
              : "border-white/12 bg-[#1b1b1b] text-[#e6e6e1] hover:border-[#14b8a6]/60 hover:bg-[#222222] hover:text-[#f8f8f2]",
          )}
        >
          <Icon
            className={cn(
              "size-4 shrink-0 transition-colors",
              primary ? "text-[#2dd4bf]" : "text-[#8b8b86] group-hover:text-[#2dd4bf]",
            )}
            aria-hidden="true"
          />
          <span className="flex min-w-0 flex-col gap-0.5 text-left">
            <span className="truncate">
              <span aria-hidden="true" className="text-[#5c5c58]">
                [
              </span>
              {label}
              <span aria-hidden="true" className="text-[#5c5c58]">
                ]
              </span>
            </span>
            <span className="truncate text-[0.625rem] text-[#8b8b86]">
              <span aria-hidden="true">$ </span>
              {prompt}
            </span>
          </span>
          <ChevronRight
            className="ml-auto size-4 shrink-0 text-[#5c5c58] transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-[#2dd4bf]"
            aria-hidden="true"
          />
        </Link>
      ))}
    </div>
  );
}
