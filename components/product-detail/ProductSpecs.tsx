type Spec = {
  label: string;
  value: string;
};

type ProductSpecsProps = {
  model: string;
  specs: Spec[];
};

export function ProductSpecs({
  model,
  specs,
}: ProductSpecsProps) {
  return (
    <section className="product-detail-section product-detail-specs">
      <div className="site-container">
        <div className="product-detail-section-header">
          <p className="product-detail-eyebrow">
            TECHNICAL SPECIFICATIONS
          </p>

          <h2>
            {model}
            <br />
            at a glance.
          </h2>
        </div>

        <div className="product-spec-table">
          {specs.map((spec) => (
            <div className="product-spec-row" key={spec.label}>
              <div>{spec.label}</div>
              <div>{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}