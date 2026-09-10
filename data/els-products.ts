export type ELSProduct = {
  slug: string;
  name: string;
  category: "Stand Alone" | "Rack Mount" | "Offline";
  tagline: string;
  description: string;

  image?: string;

  metrics: {
    label: string;
    value: string;
  }[];

  architecture: {
    performance: string;
    optical: string;
    offline: string;
  };

  specs: {
    label: string;
    value: string;
  }[];

  useCases: string[];

  scalable?: boolean;
  offline?: boolean;
};

export const elsProducts: ELSProduct[] = [
  {
    slug: "els100",
    name: "ELS100",
    category: "Stand Alone",
    tagline: "Compact optical preservation for distributed environments.",
    description:
      "The Savartus ELS100 provides compact optical object storage for organizations that need durable, long-term preservation without a rack-scale deployment.",

    metrics: [
      { label: "SYSTEM TYPE", value: "Stand Alone" },
      { label: "STORAGE ROLE", value: "Optical Archive" },
      { label: "ACCESS", value: "Online" },
      { label: "MANAGEMENT", value: "oRain" },
    ],

    architecture: {
      performance:
        "Pairs with SSD or HDD cache storage when deployed as part of an active archive.",
      optical:
        "Provides durable optical object storage for long-term information preservation.",
      offline:
        "Media may be incorporated into offline preservation workflows where required.",
    },

    specs: [
      { label: "Form Factor", value: "Standalone" },
      { label: "Storage Media", value: "Optical" },
      { label: "Storage Interface", value: "S3-compatible through oRain" },
      { label: "Management", value: "Savartus oRain Storage OS" },
      { label: "Active Archive", value: "Supported with cache or hot/warm tier" },
    ],

    useCases: [
      "Remote offices",
      "Departmental preservation",
      "Distributed data protection",
      "Long-term digital retention",
      "Active archive edge deployments",
      "Compliance retention",
    ],
  },

  {
  slug: "els150",
  name: "ELS150",
  category: "Stand Alone",
  tagline: "Integrated active archive in a compact standalone system.",
  description:
    "The Savartus ELS150 combines SSD/HDD performance storage with online optical preservation in a compact standalone active archive platform.",

  metrics: [
    { label: "CAPACITY", value: "30 TB" },
    { label: "MEDIA", value: "150" },
    { label: "DRIVES", value: "Up to 4" },
    { label: "FORM FACTOR", value: "Standalone" },
  ],

  architecture: {
    performance:
      "Integrated SSD/HDD performance storage provides fast access to active information.",
    optical:
      "Online optical storage preserves information on durable write-once media.",
    offline:
      "Optical media can participate in offline preservation workflows when deeper isolation is required.",
  },

  specs: [
    { label: "Capacity", value: "30 TB" },
    { label: "Media", value: "150" },
    { label: "Storage Media", value: "200 GB dual-sided optical" },
    { label: "Drives", value: "Up to 4" },
    { label: "Form Factor", value: "Standalone" },
    { label: "Performance Storage", value: "4 × 3.5-inch SSD/HDD bays" },
    { label: "File System", value: "XFS" },
    { label: "Optical RAID", value: "11+1" },
    { label: "Interfaces", value: "Gigabit LAN / SAS / S3" },
  ],

  useCases: [
    "Government records",
    "Medical imaging",
    "Regulated evidence",
    "Scientific and research data",
    "Compliance retention",
    "Backup and disaster recovery",
  ],
},

{
  slug: "els300",
  name: "ELS300",
  category: "Rack Mount",
  tagline: "A dedicated optical tier for Active Archive.",
  description:
    "The Savartus ELS300 provides rack-mounted online optical object storage designed to operate with an SSD/HDD cache or performance tier as part of an active archive.",

  metrics: [
    { label: "CAPACITY", value: "28.8 TB" },
    { label: "MEDIA", value: "288" },
    { label: "DRIVES", value: "Up to 4" },
    { label: "FORM FACTOR", value: "7U" },
  ],

  architecture: {
    performance:
      "Works with an external SSD/HDD cache or performance tier for high-speed access.",
    optical:
      "Provides online optical preservation through a standards-based S3 storage interface.",
    offline:
      "Information can transition into offline optical preservation workflows when physical isolation is required.",
  },

  specs: [
    { label: "Capacity", value: "28.8 TB" },
    { label: "Media", value: "288" },
    { label: "Storage Media", value: "100 GB single-sided optical" },
    { label: "Drives", value: "Up to 4" },
    { label: "Form Factor", value: "7U rack mount" },
    { label: "Maximum Throughput", value: "80 MB/s" },
    { label: "Optical RAID", value: "11+1" },
    { label: "Interfaces", value: "Gigabit LAN / SAS / S3" },
  ],

  useCases: [
    "Government records",
    "Medical imaging",
    "Regulated evidence",
    "Scientific data",
    "Compliance retention",
    "Enterprise backup",
  ],
},

  {
    slug: "els500",
    name: "ELS500",
    category: "Rack Mount",
    tagline: "Rack-mounted optical storage for scalable active archive.",
    description:
      "The Savartus ELS500 provides rack-mounted optical object storage designed for active archive and long-term preservation environments.",

    scalable: true,

    metrics: [
      { label: "SYSTEM TYPE", value: "Rack Mount" },
      { label: "STORAGE ROLE", value: "Online Optical" },
      { label: "SCALABILITY", value: "Multi-System" },
      { label: "MANAGEMENT", value: "oRain" },
    ],

    architecture: {
      performance:
        "Works with SSD or HDD cache storage to provide high-performance access to active information.",
      optical:
        "Provides persistent optical object storage managed as part of the oRain namespace.",
      offline:
        "Information can transition to offline optical libraries for deeper preservation.",
    },

    specs: [
      { label: "Form Factor", value: "Rack Mount" },
      { label: "Storage Media", value: "Optical" },
      { label: "Management", value: "Savartus oRain Storage OS" },
      { label: "Scale Model", value: "Network-mounted multi-system architecture" },
      { label: "Active Archive", value: "Configured with cache or hot/warm storage" },
    ],

    useCases: [
      "Enterprise active archive",
      "Media preservation",
      "Healthcare imaging",
      "Government records",
      "AI data preservation",
      "Long-term object storage",
    ],
  },

  {
    slug: "els1000",
    name: "ELS1000",
    category: "Rack Mount",
    tagline: "Enterprise optical capacity with horizontal scalability.",
    description:
      "The Savartus ELS1000 expands optical object storage capacity while maintaining a unified namespace through oRain.",

    scalable: true,

    metrics: [
      { label: "SYSTEM TYPE", value: "Rack Mount" },
      { label: "STORAGE ROLE", value: "Online Optical" },
      { label: "SCALABILITY", value: "Horizontal" },
      { label: "MANAGEMENT", value: "oRain" },
    ],

    architecture: {
      performance:
        "Pairs with high-performance cache tiers for frequently accessed information.",
      optical:
        "Maintains preserved objects on optical media under oRain management.",
      offline:
        "Supports transition to offline optical systems for physical isolation.",
    },

    specs: [
      { label: "Form Factor", value: "Rack Mount" },
      { label: "Storage Media", value: "Optical" },
      { label: "Storage Interface", value: "S3-compatible" },
      { label: "Scale Model", value: "Multiple network-mounted ELS systems" },
      { label: "Management", value: "oRain" },
    ],

    useCases: [
      "Enterprise archive",
      "Research data",
      "Video repositories",
      "AI datasets",
      "Government preservation",
      "Large object stores",
    ],
  },

  {
    slug: "els3600",
    name: "ELS3600",
    category: "Rack Mount",
    tagline: "High-capacity optical preservation for large data estates.",
    description:
      "The Savartus ELS3600 extends the ELS architecture into larger enterprise environments requiring significant long-term preserved capacity.",

    scalable: true,

    metrics: [
      { label: "SYSTEM TYPE", value: "Rack Mount" },
      { label: "STORAGE ROLE", value: "Online Optical" },
      { label: "SCALE", value: "Enterprise" },
      { label: "MANAGEMENT", value: "oRain" },
    ],

    architecture: {
      performance:
        "Performance storage remains available independently from preserved optical copies.",
      optical:
        "Large optical libraries provide persistent online preserved capacity.",
      offline:
        "Media may transition to offline systems when air-gapped retention is required.",
    },

    specs: [
      { label: "Form Factor", value: "Enterprise Rack Mount" },
      { label: "Storage Media", value: "Optical" },
      { label: "Management", value: "oRain" },
      { label: "Scale Model", value: "Infinitely scalable multi-library architecture" },
      { label: "Active Archive", value: "Requires cache or hot/warm tier" },
    ],

    useCases: [
      "Enterprise preservation",
      "National archives",
      "Scientific data",
      "Surveillance repositories",
      "AI training datasets",
      "Long-duration retention",
    ],
  },

  {
    slug: "els4000",
    name: "ELS4000",
    category: "Rack Mount",
    tagline: "Large-scale optical object storage for persistent information.",
    description:
      "The ELS4000 provides large-scale optical preservation managed through oRain as part of a unified, scalable active archive environment.",

    scalable: true,

    metrics: [
      { label: "SYSTEM TYPE", value: "Rack Mount" },
      { label: "STORAGE ROLE", value: "Online Optical" },
      { label: "ARCHITECTURE", value: "Scale Out" },
      { label: "MANAGEMENT", value: "oRain" },
    ],

    architecture: {
      performance:
        "Hot and warm tiers provide performance independent of long-term preserved copies.",
      optical:
        "Optical media provides durable retained storage under the oRain namespace.",
      offline:
        "Selected media can transition to offline preservation systems.",
    },

    specs: [
      { label: "Form Factor", value: "Enterprise Rack Mount" },
      { label: "Storage Media", value: "Optical" },
      { label: "Management", value: "oRain" },
      { label: "Scale Model", value: "Network-mounted scale-out" },
      { label: "Active Archive", value: "Hot/warm cache recommended" },
    ],

    useCases: [
      "Data centers",
      "Media archives",
      "Defense data",
      "Healthcare retention",
      "Research repositories",
      "Enterprise active archive",
    ],
  },

  {
    slug: "els8000",
    name: "ELS8000",
    category: "Rack Mount",
    tagline: "Mass-scale optical preservation managed as one namespace.",
    description:
      "The Savartus ELS8000 provides large-scale online optical preservation for enterprise environments where data must remain durable, discoverable, and accessible.",

    scalable: true,

    metrics: [
      { label: "SYSTEM TYPE", value: "Rack Mount" },
      { label: "STORAGE ROLE", value: "Online Optical" },
      { label: "SCALE", value: "Mass Capacity" },
      { label: "MANAGEMENT", value: "oRain" },
    ],

    architecture: {
      performance:
        "High-performance storage serves active workloads while preserved copies remain on optical.",
      optical:
        "High-capacity optical libraries provide online persistent storage.",
      offline:
        "Media can be transferred into ELS8000-OL systems for air-gapped preservation.",
    },

    specs: [
      { label: "Form Factor", value: "Large Enterprise Library" },
      { label: "Storage Media", value: "Optical" },
      { label: "Management", value: "Savartus oRain" },
      { label: "Scale Model", value: "Multi-library scale-out" },
      { label: "Offline Pairing", value: "ELS8000-OL" },
    ],

    useCases: [
      "Mass data preservation",
      "AI datasets",
      "National archives",
      "Defense",
      "Government",
      "Large enterprise repositories",
    ],
  },

  {
    slug: "els10k",
    name: "ELS10K",
    category: "Rack Mount",
    tagline: "Maximum-scale online optical preservation.",
    description:
      "The ELS10K is designed for very large information environments requiring extensive optical capacity while preserving a unified object namespace.",

    scalable: true,

    metrics: [
      { label: "SYSTEM TYPE", value: "Rack Mount" },
      { label: "STORAGE ROLE", value: "Online Optical" },
      { label: "SCALE", value: "Very Large" },
      { label: "MANAGEMENT", value: "oRain" },
    ],

    architecture: {
      performance:
        "Performance storage supports active use while optical storage preserves authoritative retained copies.",
      optical:
        "Very large optical capacity remains searchable and location-aware through oRain.",
      offline:
        "Pairs naturally with ELS10K-OL for deep, air-gapped preservation.",
    },

    specs: [
      { label: "Form Factor", value: "Large Enterprise Library" },
      { label: "Storage Media", value: "Optical" },
      { label: "Management", value: "oRain" },
      { label: "Scale Model", value: "Multi-system architecture" },
      { label: "Offline Pairing", value: "ELS10K-OL" },
    ],

    useCases: [
      "Hyperscale preservation",
      "Defense",
      "Scientific research",
      "Government repositories",
      "AI infrastructure",
      "Very large archives",
    ],
  },

  {
    slug: "els8000-ol",
    name: "ELS8000-OL",
    category: "Offline",
    tagline: "Air-gapped optical preservation at enterprise scale.",
    description:
      "The ELS8000-OL provides offline optical preservation for data requiring physical isolation while remaining indexed and discoverable through Savartus management software.",

    offline: true,

    metrics: [
      { label: "SYSTEM TYPE", value: "Offline" },
      { label: "STORAGE ROLE", value: "Deep Preservation" },
      { label: "ACCESS", value: "Air Gapped" },
      { label: "TRACKING", value: "Indexed" },
    ],

    architecture: {
      performance:
        "Objects are restored through the online environment when operational access is required.",
      optical:
        "Optical media remains the preserved authoritative copy.",
      offline:
        "Magazines are physically isolated while their contents remain tracked and indexed.",
    },

    specs: [
      { label: "System Type", value: "Offline Optical Library" },
      { label: "Connectivity", value: "Air Gapped" },
      { label: "Media Tracking", value: "Indexed by Savartus" },
      { label: "Restore Workflow", value: "Mount media, restore to cache" },
      { label: "Online Pairing", value: "ELS8000" },
    ],

    useCases: [
      "Cyber-resilient preservation",
      "Ransomware protection",
      "Defense retention",
      "Regulatory archives",
      "Deep preservation",
      "Air-gapped data storage",
    ],
  },

  {
    slug: "els10k-ol",
    name: "ELS10K-OL",
    category: "Offline",
    tagline: "Mass-scale air-gapped preservation.",
    description:
      "The ELS10K-OL extends the Savartus optical architecture into very large offline preservation environments where physical isolation and long-term durability are required.",

    offline: true,

    metrics: [
      { label: "SYSTEM TYPE", value: "Offline" },
      { label: "STORAGE ROLE", value: "Deep Preservation" },
      { label: "ACCESS", value: "Air Gapped" },
      { label: "TRACKING", value: "Indexed" },
    ],

    architecture: {
      performance:
        "Objects are restored to online cache or performance storage when needed.",
      optical:
        "Optical media retains the durable authoritative copy.",
      offline:
        "Media remains physically isolated while oRain maintains location awareness.",
    },

    specs: [
      { label: "System Type", value: "Offline Optical Library" },
      { label: "Connectivity", value: "Air Gapped" },
      { label: "Media Tracking", value: "Indexed" },
      { label: "Restore Workflow", value: "Mount and restore through oRain" },
      { label: "Online Pairing", value: "ELS10K" },
    ],

    useCases: [
      "Mass-scale cyber resilience",
      "Government preservation",
      "Defense archives",
      "Critical infrastructure",
      "Deep retention",
      "Long-term isolated storage",
    ],
  },
];

export function getELSProduct(slug: string) {
  return elsProducts.find((product) => product.slug === slug);
}