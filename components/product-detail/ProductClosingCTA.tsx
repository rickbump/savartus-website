import Link from "next/link";

type ProductClosingCTAProps = {
  model: string;
  headline: string;
};

export function ProductClosingCTA({
  model,
  headline,
}: ProductClosingCTAProps) {
  return (
    <section className="product-detail-closing">
      <div className="site-container">
        <div className="product-detail-closing-inner">
          <p className="product-detail-eyebrow product-detail-eyebrow-light">
            {model}
          </p>

          <h2>{headline}</h2>

          <div className="product-detail-actions">
            <Link href="/contact" className="button button-light">
              Talk to Savartus
            </Link>

            <Link
              href="/products/els"
              className="button button-outline-light"
            >
              Compare ELS Systems
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}