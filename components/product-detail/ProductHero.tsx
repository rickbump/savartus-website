import Image from "next/image";
import Link from "next/link";

type ProductHeroProps = {
  model: string;
  category: string;
  headline: string;
  description: string;
  capacity?: string;
  media?: string;
  drives?: string;
  formFactor?: string;
  image?: string;
  imageAlt?: string;
};

export function ProductHero({
  model,
  category,
  headline,
  description,
  capacity,
  media,
  drives,
  formFactor,
  image,
  imageAlt,
}: ProductHeroProps) {
  const metrics = [
    { label: "CAPACITY", value: capacity },
    { label: "MEDIA", value: media },
    { label: "OPTICAL DRIVES", value: drives },
    { label: "FORM FACTOR", value: formFactor },
  ].filter((metric) => metric.value);

  return (
    <section className="product-detail-hero">
      <div className="site-container">
        <div className="product-detail-hero-grid">
          <div>
            <p className="product-detail-eyebrow">{category}</p>

            <h1>{model}</h1>

            <h2>{headline}</h2>

            <p className="product-detail-hero-copy">{description}</p>

            <div className="product-detail-actions">
              <Link href="/contact" className="button button-primary">
                Talk to Savartus
              </Link>

              <Link
                href="/products/els"
                className="button button-secondary"
              >
                Compare ELS Systems
              </Link>
            </div>
          </div>

          <div>
            {image && (
              <div className="product-detail-image-wrap">
                <Image
                  src={image}
                  alt={imageAlt ?? model}
                  width={900}
                  height={700}
                  className="product-detail-image"
                  priority
                />
              </div>
            )}

            <div className="product-detail-metrics">
              {metrics.map((metric) => (
                <div className="product-detail-metric" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}