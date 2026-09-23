import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getInsightBySlug,
  getPublishedInsights,
  getRelatedInsights,
} from "@/content/insights/articles";

type InsightPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getPublishedInsights().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightBySlug(slug);

  if (!article) {
    return {};
  }

  const canonicalPath = `/insights/${article.slug}`;

  return {
    title: article.title,

    description: article.description,

    alternates: {
      canonical: canonicalPath,
    },

    openGraph: {
      title: `${article.title} | Savartus`,
      description: article.description,
      url: canonicalPath,
      type: "article",
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate ?? article.publishedDate,
      authors: [article.author],
    },

    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Savartus`,
      description: article.description,
    },
  };
}

export default async function InsightArticlePage({
  params,
}: InsightPageProps) {
  const { slug } = await params;
  const article = getInsightBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedInsights(article);

  const articleUrl = `https://www.savartus.com/insights/${article.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate ?? article.publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    author: {
      "@type": "Organization",
      name: article.author,
      url: "https://www.savartus.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Savartus",
      url: "https://www.savartus.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.savartus.com/images/brand/savartus-shield.jpeg",
      },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <article className="insight-article">
        <header className="insight-article-hero">
          <div className="site-container insight-article-hero-inner">
            <Link href="/insights" className="insight-article-back">
              ← Insights
            </Link>

            <p className="insights-eyebrow">{article.category}</p>

            <h1>{article.title}</h1>

            <p className="insight-article-deck">{article.description}</p>

            <div className="insight-article-meta">
              <span>{article.author}</span>

              <span>
                {new Date(
                  `${article.publishedDate}T12:00:00`
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <span>{article.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="site-container insight-article-layout">
          <div className="insight-article-body">
            {article.sections.map((section, sectionIndex) => (
              <section
                className="insight-article-section"
                key={`${article.slug}-${sectionIndex}`}
              >
                {section.heading && <h2>{section.heading}</h2>}

                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <div className="insight-article-statement">
              <strong>Manage. Store. Preserve.</strong>
            </div>
          </div>

          <aside className="insight-article-sidebar">
            <p className="insights-eyebrow">EXPLORE THE TECHNOLOGY</p>

            {article.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="insight-related-link"
              >
                <strong>{link.label}</strong>
                <span>{link.description}</span>
                <small>Explore →</small>
              </Link>
            ))}
          </aside>
        </div>

        {relatedArticles.length > 0 && (
          <section className="insight-related-articles">
            <div className="site-container">
              <div className="insights-section-header">
                <p className="insights-eyebrow">RELATED THINKING</p>

                <h2>Continue exploring.</h2>
              </div>

              <div className="insights-grid">
                {relatedArticles.map((related) => (
                  <Link
                    href={`/insights/${related.slug}`}
                    className="insights-card"
                    key={related.slug}
                  >
                    <div className="insights-card-top">
                      <span>{related.category}</span>
                    </div>

                    <h3>{related.title}</h3>

                    <p>{related.excerpt}</p>

                    <div className="insights-card-footer">
                      <span>Read article →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

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

            <div className="products-closing-actions">
              <Link href="/insights" className="button button-light">
                Explore Insights
              </Link>

              <Link
                href="/contact"
                className="button button-outline-light"
              >
                Talk to Savartus
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}