import { notFound } from "next/navigation";
import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export default function ELS150Page() {
  const product = getELSProduct("els150");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}
