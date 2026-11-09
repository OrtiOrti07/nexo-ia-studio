import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1633c9",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32">
          <ellipse
            cx="16"
            cy="16"
            rx="12"
            ry="5.2"
            transform="rotate(-24 16 16)"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.6"
          />
          <circle cx="16" cy="16" r="4.6" fill="#ffffff" />
          <circle cx="26.6" cy="11.1" r="2.7" fill="#f6b443" />
        </svg>
      </div>
    ),
    size,
  );
}
