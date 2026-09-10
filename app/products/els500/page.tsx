import { notFound } from "next/navigation";
import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export default function ELS500Page() {
  const product = getELSProduct("els500");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}