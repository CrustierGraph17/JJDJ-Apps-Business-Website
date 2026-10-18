import { ImageResponse } from "next/og";

/* ------------------------------------------------------------------ *
 *  Open Graph cards
 *
 *  One builder used by every route's opengraph-image.tsx so the cards are
 *  consistent: near-black, a teal wash in the corner, the four-tile mark and
 *  a tight headline.
 *
 *  Satori (what ImageResponse uses under the hood) only understands a subset
 *  of CSS and requires explicit flex layout, so everything here is deliberately
 *  plain: absolute positioning, fixed padding, borders. The play triangle is a
 *  CSS border triangle rather than an SVG path, which satori renders reliably.
 *
 *  Fonts are left to the runtime's bundled default — no font file has to be
 *  shipped or fetched to render these.
 * ------------------------------------------------------------------ */

export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  bg: "#0A0A0A",
  tile: "#F5F5F2",
  ink: "#0A0A0A",
  teal: "#14B8A6",
  fg: "#F5F5F2",
  muted: "#A1A1A1",
  faint: "#6F6F6C",
  border: "rgba(255,255,255,0.10)",
};

/** 2×2 tile mark, built from divs. */
function Mark({ size = 34 }: { size?: number }) {
  const tile = size;
  const radius = Math.round(size * 0.29);
  const gap = Math.round(size * 0.17);

  const flat = {
    width: tile,
    height: tile,
    borderRadius: radius,
    backgroundColor: C.tile,
  } as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      <div style={{ display: "flex", gap }}>
        {/* Play tile: teal square with a dark CSS triangle. */}
        <div
          style={{
            width: tile,
            height: tile,
            borderRadius: radius,
            backgroundColor: C.teal,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              marginLeft: Math.round(tile * 0.1),
              borderTop: `${Math.round(tile * 0.21)}px solid transparent`,
              borderBottom: `${Math.round(tile * 0.21)}px solid transparent`,
              borderLeft: `${Math.round(tile * 0.32)}px solid ${C.ink}`,
            }}
          />
        </div>
        <div style={flat} />
      </div>
      <div style={{ display: "flex", gap }}>
        <div style={flat} />
        <div
          style={{
            ...flat,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.teal,
            fontSize: Math.round(size * 0.36),
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          JJDJ
        </div>
      </div>
    </div>
  );
}

export type OgOptions = {
  /** Small mono label above the headline. */
  eyebrow: string;
  title: string;
  description?: string;
  /** Bottom-left path, e.g. "jjdj.app/products". */
  path?: string;
};

export function createOgImage({
  eyebrow,
  title,
  description,
  path = "jjdj.app",
}: OgOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: C.bg,
          padding: 72,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Teal wash, top-left */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -200,
            width: 760,
            height: 760,
            borderRadius: 760,
            background:
              "radial-gradient(circle, rgba(20,184,166,0.20) 0%, rgba(20,184,166,0.05) 45%, rgba(20,184,166,0) 70%)",
          }}
        />

        {/* Header: mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Mark />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div
              style={{
                color: C.teal,
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              JJDJ
            </div>
            <div style={{ color: C.faint, fontSize: 15, letterSpacing: 3 }}>
              APPS
            </div>
          </div>
        </div>

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: C.teal,
              fontSize: 19,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              color: C.fg,
              fontSize: title.length > 42 ? 62 : 76,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              maxWidth: 940,
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                color: C.muted,
                fontSize: 26,
                lineHeight: 1.4,
                maxWidth: 820,
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${C.border}`,
            paddingTop: 26,
          }}
        >
          <div style={{ color: C.faint, fontSize: 20 }}>{path}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: C.muted,
              fontSize: 20,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 9,
                backgroundColor: C.teal,
              }}
            />
            Two high schoolers in Perth, building useful apps.
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
