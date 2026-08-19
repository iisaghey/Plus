import { ImageResponse } from "next/og";

export const alt = "AqoonsiPlus — Your Leadership. Your Identity. Your Legacy.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B1F3A",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(0,124,131,0.35) 0%, rgba(11,31,58,0) 45%), radial-gradient(circle at 85% 75%, rgba(201,162,39,0.25) 0%, rgba(11,31,58,0) 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "2px solid rgba(255,255,255,0.15)",
              fontSize: 44,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            A+
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, color: "#ffffff" }}>
            Aqoonsi<span style={{ color: "#0DB4B0" }}>Plus</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 32,
            fontWeight: 500,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: 1,
          }}
        >
          Your Leadership. Your Identity. Your Legacy.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            width: 120,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#C9A227",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
