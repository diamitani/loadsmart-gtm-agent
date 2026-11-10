import { ImageResponse } from "next/og";

export const alt = "Enably — the AI GTM Architect by Salesgency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "linear-gradient(135deg, #ffffff 0%, #eef4ff 55%, #f4efff 100%)",
          color: "#14171f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#14171f", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 7, paddingBottom: 14 }}>
            <div style={{ width: 9, height: 16, borderRadius: 3, background: "#ffffff", opacity: 0.55 }} />
            <div style={{ width: 9, height: 25, borderRadius: 3, background: "#ffffff", opacity: 0.8 }} />
            <div style={{ width: 9, height: 34, borderRadius: 3, background: "#0d6efd" }} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>Enably</div>
          <div style={{ fontSize: 24, color: "#6c757d", marginLeft: 8 }}>by Salesgency</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Your go-to-market engine,</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#0d6efd" }}>architected by AI.</div>
          <div style={{ fontSize: 30, color: "#343a40", maxWidth: 980 }}>ICP, personas, messaging, sequences, playbooks and KPIs from your notes, docs and links. Verified, and approved by you.</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#6c757d" }}>
          <span style={{ color: "#fd7e14" }}>●</span> enably.salesgency.com
        </div>
      </div>
    ),
    size,
  );
}
