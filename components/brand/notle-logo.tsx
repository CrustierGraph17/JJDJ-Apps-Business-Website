import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  The Notle mark and wordmark.
 *
 *  Notle's identity is a boxed "N" that a pen is drawn through — an app
 *  about writing, with the letter doing the work of the icon. Both pieces
 *  are reproduced here exactly as supplied, so the site, the product and
 *  any printed material share one drawing.
 *
 *  Colour comes from `currentColor`, and both default to the site's teal
 *  accent, which is the only colour the brand uses. The white strokes
 *  inside the pen are the highlight and nib knockout from the original
 *  artwork and are deliberately not themed.
 *
 *  These are server components: no motion, no client JavaScript, so the
 *  logo is painted with the HTML rather than after hydration.
 * ------------------------------------------------------------------ */

const MARK_VIEW_BOX = "0 0 80 80";
const WORDMARK_WIDTH = 270;
const WORDMARK_HEIGHT = 88;

/** The mark on its own — the boxed N with the pen through it. */
export function NotleMark({
  size = 40,
  className,
  label = "Notle",
}: {
  /** Rendered width and height, in pixels. */
  size?: number;
  className?: string;
  /** Accessible label. Pass `null` when the mark is decorative. */
  label?: string | null;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={MARK_VIEW_BOX}
      fill="none"
      role={label ? "img" : "presentation"}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("shrink-0 text-accent", className)}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6H26L54 35V7H74V74H57L27 43V74H6Z" strokeWidth="1.7" />
        <path d="M11 11H23L59 48V12H69V69H59L22 31V69H11Z" strokeWidth="1.9" />
        <path
          d="M8 17L17 8M8 24L24 8M8 31L29 10M8 38L33 14"
          strokeWidth="2.2"
          opacity=".42"
        />
        <g transform="translate(22 36) rotate(43)">
          <g fill="#fff" strokeWidth="1.6">
            <path d="M0-44H7V-7H0Z" fill="currentColor" />
            <path d="M0-7H7L3.5 0Z" />
            <rect
              x="0"
              y="-50"
              width="7"
              height="7"
              rx="3"
              fill="currentColor"
            />
          </g>
          <path
            d="M0-43H7M2-40V-10"
            stroke="#fff"
            strokeWidth="1.1"
            opacity=".65"
          />
          <path d="M3.5 0 2-3H5Z" fill="currentColor" strokeWidth=".6" />
        </g>
      </g>
    </svg>
  );
}

/** The full lockup: the mark, then "otle" inside the wordmark's frame. */
export function NotleWordmark({
  height = 32,
  className,
  label = "Notle",
}: {
  /** Rendered height in pixels. Width follows the original 270 × 88 ratio. */
  height?: number;
  className?: string;
  label?: string | null;
}) {
  const width = Math.round((height * WORDMARK_WIDTH) / WORDMARK_HEIGHT);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`}
      fill="none"
      role={label ? "img" : "presentation"}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("shrink-0 text-accent", className)}
    >
      <path
        d="M5 5H265V83H5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <g transform="translate(12 9) scale(.82)">
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6H26L54 35V7H74V74H57L27 43V74H6Z" strokeWidth="1.7" />
          <path d="M11 11H23L59 48V12H69V69H59L22 31V69H11Z" strokeWidth="1.9" />
          <path
            d="M8 17L17 8M8 24L24 8M8 31L29 10M8 38L33 14"
            strokeWidth="2.2"
            opacity=".42"
          />
          <g transform="translate(22 36) rotate(43)">
            <g fill="#fff" strokeWidth="1.6">
              <path d="M0-44H7V-7H0Z" fill="currentColor" />
              <path d="M0-7H7L3.5 0Z" />
              <rect
                x="0"
                y="-50"
                width="7"
                height="7"
                rx="3"
                fill="currentColor"
              />
            </g>
            <path
              d="M0-43H7M2-40V-10"
              stroke="#fff"
              strokeWidth="1.1"
              opacity=".65"
            />
            <path d="M3.5 0 2-3H5Z" fill="currentColor" strokeWidth=".6" />
          </g>
        </g>
      </g>

      <g
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M108 34C94 34 84 43 84 54C84 66 94 74 108 74C122 74 131 65 131 54C131 42 122 34 108 34ZM108 44C100 44 95 48 95 54C95 61 100 65 108 65C116 65 121 61 121 54C121 48 116 44 108 44Z" />
        <path d="M149 20H160V35H173V44H160V61Q160 66 166 66H173V74H162Q149 74 149 63V44H139V35H149Z" />
        <path d="M182 20H193V74H182Z" />
        <path d="M249 56H214Q215 65 224 65Q232 65 238 61L245 68Q236 76 224 75C208 75 203 65 203 54C203 42 212 34 225 34C240 34 249 43 249 56ZM214 49H237Q235 43 225 43Q216 43 214 49Z" />
      </g>
    </svg>
  );
}
