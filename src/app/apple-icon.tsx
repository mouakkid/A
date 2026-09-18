import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0b0d10", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 36 }}>
        <svg viewBox="0 0 64 64" width="150" height="150">
          <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
            <path d="M10 44c8-10 16-10 22-4s14 6 22-4" />
            <path d="M10 34c8-10 16-10 22-4s14 6 22-4" opacity="0.6" />
            <path d="M10 24c8-10 16-10 22-4s14 6 22-4" opacity="0.35" />
          </g>
          <circle cx="44" cy="20" r="7" fill="#1d6ef5" />
          <circle cx="44" cy="20" r="2.8" fill="#fff" />
        </svg>
      </div>
    ),
    size,
  );
}
