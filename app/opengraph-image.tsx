import { ImageResponse } from "next/og";

export const alt = "Savartus | Manage. Store. Preserve.";
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
          padding: 64,
          background: "#0b2744",
          color: "#ffffff",
          borderTop: "12px solid #a9b2bc",
        }}
      >
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>
          Savartus
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 60, fontWeight: 700 }}>
            Manage. Store. Preserve.
          </div>
          <div style={{ fontSize: 28, color: "#eaf1f7" }}>
            Active Archive | Preservation | Data Lifecycle Management
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#a9b2bc" }}>
          www.savartus.com
        </div>
      </div>
    ),
    size
  );
}
