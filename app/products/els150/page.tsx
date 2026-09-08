import { ProductHero } from "@/components/product-detail/ProductHero";
import { ProductArchitecture } from "@/components/product-detail/ProductArchitecture";
import { ProductSpecs } from "@/components/product-detail/ProductSpecs";
import { ProductUseCases } from "@/components/product-detail/ProductUseCases";
import { ProductClosingCTA } from "@/components/product-detail/ProductClosingCTA";

const specs = [
  {
    label: "Optical media",
    value: "Up to 150 discs",
  },
  {
    label: "Disc capacity",
    value: "Up to 200 GB per disc",
  },
  {
    label: "Maximum optical capacity",
    value: "30 TB",
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
    value: "4 × 3.5-inch drive bays supporting SSD and/or HDD",
  },
  {
    label: "File system",
    value: "XFS",
  },
  {
    label: "Optical redundancy",
    value: "Optical RAID 11+1",
  },
  {
    label: "External interfaces",
    value: "Gigabit LAN, SAS expansion support, standard S3",
  },
];

const tiers = [
  {
    label: "PERFORMANCE TIER",
    title: "SSD / HDD",
    description:
      "High-performance storage for active and frequently accessed information.",
    variant: "performance" as const,
  },
  {
    label: "PRESERVATION TIER",
    title: "Online Optical",
    description:
      "Write-once optical storage provides durable preservation while information remains accessible through the system.",
    variant: "optical" as const,
  },
  {
    label: "OPTIONAL DEEP PRESERVATION",
    title: "Offline Optical",
    description:
      "Removable optical media can provide physically isolated, air-gapped long-term retention.",
    variant: "offline" as const,
  },
];

export default function ELS150Page() {
  return (
    <main>
      <ProductHero
        model="ELS150"
        category="STAND ALONE ACTIVE ARCHIVE"
        headline="Performance today. Preservation from day one."
        description="The Savartus ELS150 combines SSD/HDD performance storage and write-once optical preservation in one compact Active Archive platform."
        capacity="30 TB"
        media="150"
        drives="Up to 4"
        formFactor="Standalone"
        image="/images/products/els150/els150.jpg"
        imageAlt="Savartus ELS150 optical storage system"
      />

      <ProductArchitecture
        headline="Active Archive in one system."
        description="The ELS150 combines the performance tier and optical preservation tier in a unified platform, with optional offline optical storage for deeper preservation."
        tiers={tiers}
      />

      <ProductSpecs model="ELS150" specs={specs} />

      <ProductUseCases
        headline="Information worth keeping."
        description="The ELS150 is designed for information that must remain accessible, authentic, and defensible across long retention periods."
        useCases={[
          "Government records",
          "Medical imaging",
          "Regulated evidence",
          "Scientific and research data",
          "Compliance retention",
          "Backup and disaster recovery",
        ]}
      />

      <ProductClosingCTA
        model="ELS150"
        headline="Keep it accessible. Preserve it for the long term."
      />
    </main>
  );
}