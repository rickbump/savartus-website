import { DualWrite } from "@/components/active-archive/DualWrite";
import { LifecycleState } from "@/components/active-archive/LifecycleState";
export default function ActiveArchivePage() {
  return (
    <main>
      <section
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "900px" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 700,
              color: "#123a63",
            }}
          >
            Active Archive
          </p>

          <h1
            style={{
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              margin: "20px 0",
            }}
          >
            Active today.
            <br />
            Preserved from day one.
          </h1>

          <p
            style={{
              fontSize: "1.3rem",
              color: "#43505e",
              maxWidth: "760px",
              margin: "0 auto",
            }}
          >
            Savartus combines high-performance SSD or HDD storage with optical
            object storage to provide immediate access and long-term
            preservation from the moment information arrives.
          </p>
        </div>
      </section>
      <DualWrite />
      <LifecycleState />
    </main>
  );
}