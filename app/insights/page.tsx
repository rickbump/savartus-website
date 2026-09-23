import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights",

  description:
    "Savartus insights on Data Lifecycle Management, Active Archive, information preservation, optical storage, AI-era data strategy, and enterprise information governance.",

  alternates: {
    canonical: "/insights",
  },

  openGraph: {
    title: "Insights | Savartus",
    description:
      "Perspectives on Data Lifecycle Management, Active Archive, information preservation, optical storage, AI, and long-term enterprise data strategy.",
    url: "/insights",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Insights | Savartus",
    description:
      "Perspectives on Data Lifecycle Management, Active Archive, information preservation, optical storage, AI, and long-term enterprise data strategy.",
  },
};

const insights = [
  {
    category: "DATA LIFECYCLE",
    title: "Why do we manage data based on its birthday?",
    excerpt:
      "Age is easy to measure. Value, risk, retention, security, and future usefulness are what should determine lifecycle decisions.",
  },
  {
    category: "DATA LIFECYCLE",
    title: "Old data isn't necessarily cold data.",
    excerpt:
      "Information can become relevant again as business, regulatory, analytical, and AI requirements change.",
  },
  {
    category: "DATA STRATEGY",
    title: "A file turning 90 days old isn't a business event.",
    excerpt:
      "Infrastructure-driven lifecycle rules often fail to reflect the actual business state of information.",
  },
  {
    category: "OPTICAL STORAGE",
    title: "Why optical storage matters again in the AI era.",
    excerpt:
      "AI increases both the value and vulnerability of retained information, making durable and physically isolated preservation increasingly important.",
  },
  {
    category: "ACTIVE ARCHIVE",
    title: "Performance and preservation should work together.",
    excerpt:
      "Important information should remain available on the right performance tier while being preserved on durable optical storage.",
  },
  {
    category: "INFORMATION MANAGEMENT",
    title: "Technology changes. Information persists.",
    excerpt:
      "Applications, infrastructure, and media change. Information context, provenance, relationships, and governance must persist.",
  },
];

export default function InsightsPage() {
  return (
    <main>
      <section className="insights-hero">
        <div className="site-container insights-hero-inner">
          <p className="insights-eyebrow">INSIGHTS</p>

          <h1>
            Rethinking how enterprise
            <br />
            information is managed.
          </h1>

          <p className="insights-hero-copy">
            Perspectives on Data Lifecycle Management, Active Archive,
            information preservation, optical storage, AI-era data strategy,
            and long-term enterprise information governance.
          </p>
        </div>
      </section>

      <section id="latest" className="insights-section">
        <div className="site-container">
          <div className="insights-section-header">
            <p className="insights-eyebrow">LATEST THINKING</p>

            <h2>
              Better questions lead
              <br />
              to better data strategy.
            </h2>
          </div>

          <div className="insights-grid">
            {insights.map((insight, index) => (
              <article
                className={
                  index === 0
                    ? "insights-card insights-card-featured"
                    : "insights-card"
                }
                key={insight.title}
              >
                <div className="insights-card-top">
                  <span>{insight.category}</span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </div>

                <h3>{insight.title}</h3>

                <p>{insight.excerpt}</p>

                <div className="insights-card-footer">
                  <span>Article coming soon</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="insights-closing">
        <div className="site-container insights-closing-inner">
          <p className="insights-eyebrow insights-eyebrow-light">
            SAVARTUS PERSPECTIVE
          </p>

          <h2>
            Information should move
            <br />
            when its requirements change.
          </h2>

          <p>
            Not because a clock expired. Not because a file reached a certain
            age. Because the information itself changed.
          </p>
        </div>
      </section>
    </main>
  );
}