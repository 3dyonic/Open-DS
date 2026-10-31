// The preview image for shared links, built once at build time from brand.json.
import { ImageResponse } from "next/og";
import { brandName, brandTagline } from "@/lib/brand";

export const dynamic = "force-static";
export const alt = `${brandName}: ${brandTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const cell = (fill: string, opacity = 1) => (
    <div style={{ width: 72, height: 72, borderRadius: 12, background: fill, opacity }} />
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#f6f2e9",
        color: "#16140f",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {cell("#ff5a1f")}
        {cell("#16140f")}
        {cell("#16140f", 0.35)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>{brandName}</div>
        <div style={{ fontSize: 44, color: "#4a453b" }}>{brandTagline}</div>
      </div>
    </div>,
    size,
  );
}
