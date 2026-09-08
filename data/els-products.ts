export type ELSCategory =
  | "standalone"
  | "rack"
  | "offline";

export type ELSProduct = {
  name: string;
  category: ELSCategory;
  categoryLabel: string;
  positioning: string;
  capacity?: string;
  media?: string;
  drives?: string;
  formFactor?: string;
  mediaType?: string;
  architecture?: string;
  href: string;
};

export const elsProducts: ELSProduct[] = [
  {
    name: "ELS100",
    category: "standalone",
    categoryLabel: "Stand Alone System",
    positioning: "Compact standalone optical storage system.",
    architecture: "Standalone",
    href: "/products/els100",
  },

  {
    name: "ELS150",
    category: "standalone",
    categoryLabel: "Stand Alone System",
    positioning:
      "Integrated Active Archive combining performance storage and optical preservation.",
    capacity: "30 TB",
    media: "150 media",
    drives: "Up to 4 drives",
    formFactor: "Standalone",
    mediaType: "200 GB dual-sided",
    architecture: "Integrated SSD/HDD + optical",
    href: "/products/els150",
  },

  {
    name: "ELS300",
    category: "rack",
    categoryLabel: "Rack Mount System",
    positioning:
      "Compact rack-mount optical storage tier for Active Archive environments.",
    capacity: "28.8 TB",
    media: "288 media",
    drives: "Up to 4 drives",
    formFactor: "7U rack",
    mediaType: "100 GB single-sided",
    architecture: "Separate performance tier",
    href: "/products/els300",
  },

  {
    name: "ELS500",
    category: "rack",
    categoryLabel: "Rack Mount System",
    positioning:
      "Scalable optical storage tier for growing preservation environments.",
    capacity: "115.2 TB",
    media: "576 media",
    drives: "Up to 6 drives",
    formFactor: "7U rack",
    mediaType: "200 GB media",
    architecture: "oRain-managed scalable tier",
    href: "/products/els500",
  },

  {
    name: "ELS1000",
    category: "rack",
    categoryLabel: "Rack Mount System",
    positioning:
      "High-density optical storage for enterprise preservation workloads.",
    capacity: "230.4 TB",
    media: "1,152 media",
    drives: "Up to 12 drives",
    formFactor: "10U rack",
    mediaType: "200 GB media",
    architecture: "oRain-managed scalable tier",
    href: "/products/els1000",
  },

  {
    name: "ELS3600",
    category: "rack",
    categoryLabel: "Rack Mount System",
    positioning:
      "Enterprise-scale optical storage for large information environments.",
    capacity: "720 TB",
    media: "3,600 media",
    drives: "Up to 24 drives",
    formFactor: "20U",
    mediaType: "200 GB media",
    architecture: "oRain-managed scalable tier",
    href: "/products/els3600",
  },

  {
    name: "ELS4000",
    category: "rack",
    categoryLabel: "Rack Mount System",
    positioning:
      "High-capacity optical storage for enterprise Active Archive.",
    capacity: "806.4 TB",
    media: "4,032 media",
    drives: "Up to 12 drives",
    formFactor: "20U",
    mediaType: "200 GB media",
    architecture: "oRain-managed scalable tier",
    href: "/products/els4000",
  },

  {
    name: "ELS8000",
    category: "rack",
    categoryLabel: "Rack Mount System",
    positioning:
      "Petabyte-scale online optical library for large preservation estates.",
    capacity: "1.90 PB",
    media: "9,504 media",
    drives: "Up to 40 drives",
    formFactor: "45U library",
    mediaType: "200 GB media",
    architecture: "oRain-managed scalable tier",
    href: "/products/els8000",
  },

  {
    name: "ELS10K",
    category: "rack",
    categoryLabel: "Rack Mount System",
    positioning:
      "Maximum-density online optical library for very large information estates.",
    capacity: "2.07 PB",
    media: "10,368 media",
    drives: "Up to 40 drives",
    formFactor: "50U library",
    mediaType: "200 GB media",
    architecture: "oRain-managed scalable tier",
    href: "/products/els10k",
  },

  {
    name: "ELS8000-OL",
    category: "offline",
    categoryLabel: "Off-Line System",
    positioning:
      "Physically offline optical media library for long-term preservation.",
    capacity: "1.90 PB",
    media: "9,504 media",
    drives: "No drives",
    formFactor: "ELS8000 chassis",
    mediaType: "200 GB media",
    architecture: "Physically offline / oRain managed",
    href: "/products/els8000-ol",
  },

  {
    name: "ELS10K-OL",
    category: "offline",
    categoryLabel: "Off-Line System",
    positioning:
      "Maximum-density physically isolated optical preservation library.",
    capacity: "2.07 PB",
    media: "10,368 media",
    drives: "No drives",
    formFactor: "ELS10K chassis",
    mediaType: "200 GB media",
    architecture: "Physically offline / oRain managed",
    href: "/products/els10k-ol",
  },
];