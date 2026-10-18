import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * ESLint (flat config).
 *
 * `core-web-vitals` is the Next.js rule set plus the stricter Core Web Vitals
 * checks; the TypeScript config adds type-aware rules. Build output and
 * generated type files are ignored rather than linted.
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      /*
       * React Hooks 7 ships the compiler-era rules. Two of them flag patterns
       * this codebase uses deliberately:
       *
       *  - set-state-in-effect: the preloader's timed phases, the navbar's
       *    scroll state, `useMounted` and the media-query hook all sync state
       *    from something outside React (timers, scroll, matchMedia). That is
       *    what the rule's own guidance recommends an effect *for* when the
       *    value cannot be read during render without breaking hydration.
       *  - refs: a "latest props" ref (canvas settings, escape handlers) is
       *    read only from event handlers and animation frames, never for
       *    rendering.
       *
       * Kept as warnings so new instances are visible in review without
       * failing the build on an intentional pattern.
       */
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      // react-hook-form's `useForm` is not compiler-compatible yet.
      "react-hooks/incompatible-library": "warn",
    },
  },
]);
