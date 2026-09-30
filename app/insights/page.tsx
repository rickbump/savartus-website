import type { Metadata } from "next";
import Link from "next/link";

import { insightArticles } from "@/content/insights/articles";

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

export default function InsightsPage() {
  const articles = [...insightArticles].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    return (
      new Date(b.publishedDate).getTime() -
      new Date(a.publishedDate).getTime()
    );
  });

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
            {articles.map((article, index) => {
              const isPublished = article.status === "published";

              const cardClass =
                index === 0
                  ? "insights-card insights-card-featured"
                  : "insights-card";

              const cardContent = (
                <>
                  <div className="insights-card-top">
                    <span>{article.category}</span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                  </div>

                  <h3>{article.title}</h3>

                  <p>{article.excerpt}</p>

                  <div className="insights-card-footer">
                    <span>
                      {isPublished
                        ? `${article.readingTime} · Read article →`
                        : "Article coming soon"}
                    </span>
                  </div>
                </>
              );

              if (isPublished) {
                return (
                  <Link
                    href={`/insights/${article.slug}`}
                    className={cardClass}
                    key={article.slug}
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <article className={cardClass} key={article.slug}>
                  {cardContent}
                </article>
              );
            })}
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