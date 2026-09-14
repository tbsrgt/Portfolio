import { ImageResponse } from "next/og";

export const alt = "Tobias Ringot — Refonte et création de sites internet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    <div style={{ background: "#fafafa", color: "#111", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 78px", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 30, fontWeight: 600 }}>Tobias Ringot</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 600, letterSpacing: -3, lineHeight: 1.05 }}>
          <span>Votre activité évolue.</span>
          <span>Votre site aussi.</span>
        </div>
        <div style={{ fontSize: 28, color: "#555" }}>Refonte · Site vitrine · Landing page</div>
      </div>
    </div>,
    size,
  );
}
