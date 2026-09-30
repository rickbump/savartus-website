import { UseCaseStoryGrid } from "@/components/product-detail/UseCaseStoryGrid";

type ProductUseCasesProps = {
  headline: string;
  description: string;
  useCases: string[];
};

export function ProductUseCases({
  headline,
  description,
  useCases,
}: ProductUseCasesProps) {
  return (
    <section className="product-detail-section product-use-cases">
      <div className="site-container">
        <div className="product-detail-section-header">
          <p className="product-detail-eyebrow">BUILT FOR LONG-LIVED DATA</p>

          <h2>{headline}</h2>

          <p>{description}</p>
        </div>

        <UseCaseStoryGrid useCases={useCases} />
      </div>
    </section>
  );
}