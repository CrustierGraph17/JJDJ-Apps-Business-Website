import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon, generated at build time so it is a real PNG (iOS ignores
 * SVG for home-screen icons).
 *
 * The mark is drawn with plain divs and a CSS border triangle, which is the
 * subset satori renders most predictably. The background is the dark theme's
 * near-black, so the icon looks at home on a dark home screen and still reads
 * on a light one because of the off-white tiles.
 */
export default function AppleIcon() {
  const tile = 56;
  const radius = 16;
  const gap = 10;

  const flat = {
    width: tile,
    height: tile,
    borderRadius: radius,
    backgroundColor: "#F5F5F2",
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap }}>
          <div style={{ display: "flex", gap }}>
            <div
              style={{
                width: tile,
                height: tile,
                borderRadius: radius,
                backgroundColor: "#14B8A6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  marginLeft: 7,
                  borderTop: "14px solid transparent",
                  borderBottom: "14px solid transparent",
                  borderLeft: "22px solid #0A0A0A",
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
                color: "#14B8A6",
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              JJDJ
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
