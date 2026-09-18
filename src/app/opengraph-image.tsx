import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b0d10 0%, #1f252c 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: 14, textTransform: "uppercase" }}>Garmin</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 10, textTransform: "uppercase", color: "#5a9bff" }}>Communauté Maroc</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>Tout l'univers Garmin. Une communauté au Maroc.</div>
          <div style={{ fontSize: 24, color: "#b3bac4" }}>Communauté indépendante — Non affiliée à Garmin · garmin.ma</div>
        </div>
      </div>
    ),
    size,
  );
}
