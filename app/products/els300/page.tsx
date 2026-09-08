import { ProductHero } from "@/components/product-detail/ProductHero";
import { ProductArchitecture } from "@/components/product-detail/ProductArchitecture";
import { ProductSpecs } from "@/components/product-detail/ProductSpecs";
import { ProductUseCases } from "@/components/product-detail/ProductUseCases";
import { ProductClosingCTA } from "@/components/product-detail/ProductClosingCTA";

const specs = [
  {
    label: "Form factor",
    value: "7U rack-mountable, standard 19-inch rack",
  },
  {
    label: "Optical media",
    value: "Up to 288 discs",
  },
  {
    label: "Disc capacity",
    value: "Up to 100 GB per disc",
  },
  {
    label: "Maximum optical capacity",
    value: "28.8 TB",
  },
  {
    label: "Optical drives",
    value: "Up to 4 Blu-ray drives",
  },
  {
    label: "Concurrent optical throughput",
    value: "80 MB/s",
  },
  {
    label: "Performance storage",
    value: "Not included — separate cache/performance tier",
  },
  {
    label: "Optical redundancy",
    value: "Optical RAID 11+1",
  },
  {
    label: "External interfaces",
    value: "Gigabit LAN, SAS expansion support, standard S3",
  },
  {
    label: "Power consumption",
    value: "550 W maximum",
  },
];

const tiers = [
  {
    label: "YOUR ENVIRONMENT",
    title: "SSD / HDD Cache",
    description:
      "Customer-provided or Savartus-configured performance storage provides fast access for active and frequently used information.",
    variant: "performance" as const,
  },
  {
    label: "STANDARD S3",
    title: "Network Integration",
    description:
      "Applications and the performance tier connect to the ELS300 through a standards-based object-storage interface.",
    variant: "performance" as const,
  },
  {
    label: "ONLINE PRESERVATION",
    title: "ELS300 Optical",
    description:
      "Integrated robotics and write-once optical media provide durable online preservation and retrieval.",
    variant: "optical" as const,
  },
];

export default function ELS300Page() {
  return (
    <main>
      <ProductHero
        model="ELS300"
        category="RACK MOUNT OPTICAL STORAGE"
        headline="A dedicated optical tier for Active Archive."
        description="The Savartus ELS300 is a rack-mounted optical storage system designed to work with a separate SSD/HDD performance tier. It connects through standard S3 and provides write-once optical preservation in a compact 7U form factor."
        capacity="28.8 TB"
        media="288"
        drives="Up to 4"
        formFactor="7U Rack"
        image="/images/products/els300/els288.jpg"
        imageAlt="Savartus ELS300 rack mount optical storage system"
      />

      <ProductArchitecture
        headline="Separate performance from preservation."
        description="The ELS300 does not include a cache server. Instead, it integrates with the existing or separately configured performance tier, allowing SSD/HDD capacity and optical preservation capacity to be sized independently."
        tiers={tiers}
      />

      <ProductSpecs model="ELS300" specs={specs} />

      <ProductUseCases
        headline="Preservation for enterprise workloads."
        description="The ELS300 is designed for organizations that need long-term, tamper-resistant preservation while keeping storage architecture modular and standards-based."
        useCases={[
          "Government records",
          "Medical imaging",
          "Regulated evidence",
          "Scientific and research data",
          "Compliance retention",
          "Enterprise backup",
        ]}
      />

      <ProductClosingCTA
        model="ELS300"
        headline="Keep performance flexible. Make preservation permanent."
      />
    </main>
  );
}