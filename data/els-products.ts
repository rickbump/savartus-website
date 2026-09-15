export type ELSTechnicalSpecs = {
  cartridges: string;
  mediaPerCartridge: string;
  magazines: string;
  cartridgesPerMagazine: string;
  maxMedia: string;

  capacity200GB: string;
  capacity500GB: string;
  capacity1TB: string;

  maxAddressableDrives: string;

  powerRequirements: string;
  peakEnergyConsumption: string;
  typicalEnergyConsumption: string;

  dimensionsInches: string;
  dimensionsCm: string;
  rackUnits: string;

  weightLbs: string;
  weightKg: string;
};

export type ELSProduct = {
  slug: string;
  name: string;
  href: string;

  category: "Stand Alone" | "Rack Mount" | "Offline";
  categoryLabel: string;

  tagline: string;
  description: string;
  positioning: string;

  capacity: string;
  media: string;
  mediaCapacity: string;
  drives: string;
  formFactor: string;

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

  technicalSpecs: ELSTechnicalSpecs;

  useCases: string[];

  scalable?: boolean;
  offline?: boolean;
};

export const elsProducts: ELSProduct[] = [
  {
    slug: "els100",
    name: "ELS100",
    href: "/products/els100",

    category: "Stand Alone",
    categoryLabel: "Stand Alone",

    tagline: "Compact optical preservation for distributed environments.",

    description:
      "The Savartus ELS100 provides compact optical object storage for organizations that need durable, long-term preservation without a rack-scale deployment.",

    positioning:
      "Compact online optical object storage for distributed, departmental, and edge preservation environments.",

    capacity: "16 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "Up to 4",
    formFactor: "Stand-Alone Tower",

    metrics: [
      { label: "CAPACITY", value: "16 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "Up to 4" },
      { label: "FORM FACTOR", value: "Stand-Alone Tower" },
    ],

    architecture: {
      performance:
        "Pairs with SSD or HDD cache storage when deployed as part of an active archive.",
      optical:
        "Provides durable optical object storage for long-term information preservation.",
      offline:
        "Optical media can participate in physically isolated preservation workflows when deeper isolation is required.",
    },

    specs: [
      { label: "System Type", value: "Standalone Online Optical Library" },
      { label: "Capacity", value: "16 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "2" },
      { label: "Media per Cartridge", value: "50" },
      { label: "Maximum Media", value: "100" },
      { label: "Drives", value: "Up to 4" },
      { label: "Form Factor", value: "Stand-Alone Tower" },
      {
        label: "Storage Interface",
        value: "S3-compatible through oRain",
      },
      {
        label: "Management",
        value: "Savartus oRain Storage Management",
      },
      {
        label: "Active Archive",
        value: "Supported with SSD/HDD cache or performance storage",
      },
    ],

    technicalSpecs: {
      cartridges: "2",
      mediaPerCartridge: "50",
      magazines: "N/A",
      cartridgesPerMagazine: "N/A",
      maxMedia: "100",

      capacity200GB: "16 TB",
      capacity500GB: "32 TB",
      capacity1TB: "65 TB",

      maxAddressableDrives: "4",

      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "450 W",
      typicalEnergyConsumption: "160 W",

      dimensionsInches: '9.4" × 20.3" × 25.4"',
      dimensionsCm: "24.0 × 51.5 × 64.5 cm",
      rackUnits: "N/A",

      weightLbs: "79 lbs",
      weightKg: "36 kg",
    },

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
    href: "/products/els150",

    category: "Stand Alone",
    categoryLabel: "Stand Alone Active Archive",

    tagline: "Integrated active archive in a compact standalone system.",

    description:
      "The Savartus ELS150 combines SSD/HDD performance storage with online optical preservation in a compact standalone active archive platform.",

    positioning:
      "An integrated active archive platform combining performance storage and durable optical preservation in one standalone system.",

    capacity: "24 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "Up to 4",
    formFactor: "Stand-Alone Tower",

    metrics: [
      { label: "CAPACITY", value: "24 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "Up to 4" },
      { label: "FORM FACTOR", value: "Stand-Alone Tower" },
    ],

    architecture: {
      performance:
        "Integrated SSD/HDD performance storage provides fast access to active information.",
      optical:
        "Online optical storage preserves information on durable write-once media.",
      offline:
        "Optical media can participate in physically isolated preservation workflows when deeper isolation is required.",
    },

    specs: [
      { label: "System Type", value: "Standalone Active Archive" },
      { label: "Capacity", value: "24 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "3" },
      { label: "Media per Cartridge", value: "50" },
      { label: "Maximum Media", value: "150" },
      { label: "Drives", value: "Up to 4" },
      { label: "Form Factor", value: "Stand-Alone Tower" },
      {
        label: "Performance Storage",
        value: "Integrated SSD/HDD storage",
      },
      {
        label: "Storage Interface",
        value: "S3-compatible through oRain",
      },
      {
        label: "Management",
        value: "Savartus oRain Storage Management",
      },
      { label: "File System", value: "XFS" },
      { label: "Optical RAID", value: "11+1" },
      { label: "Interfaces", value: "Gigabit LAN / SAS / S3" },
    ],

    technicalSpecs: {
      cartridges: "3",
      mediaPerCartridge: "50",
      magazines: "N/A",
      cartridgesPerMagazine: "N/A",
      maxMedia: "150",

      capacity200GB: "24 TB",
      capacity500GB: "49 TB",
      capacity1TB: "97 TB",

      maxAddressableDrives: "4",

      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "450 W",
      typicalEnergyConsumption: "200 W",

      dimensionsInches: '13" × 23.3" × 25.3"',
      dimensionsCm: "33.1 × 59.2 × 64.2 cm",
      rackUnits: "N/A",

      weightLbs: "121 lbs",
      weightKg: "55 kg",
    },

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
    href: "/products/els300",

    category: "Rack Mount",
    categoryLabel: "Rack Mount",

    tagline: "A dedicated optical tier for Active Archive.",

    description:
      "The Savartus ELS300 provides rack-mounted online optical object storage designed to operate with an SSD/HDD cache or performance tier as part of an active archive.",

    positioning:
      "A compact rack-mounted optical preservation tier for Active Archive deployments.",

    capacity: "24 TB",
    media: "Single-sided optical",
    mediaCapacity: "100 GB usable per disc",
    drives: "Up to 6",
    formFactor: "7U Rack Mount",

    metrics: [
      { label: "CAPACITY", value: "24 TB" },
      { label: "MEDIA", value: "Single-sided optical" },
      { label: "DRIVES", value: "Up to 6" },
      { label: "FORM FACTOR", value: "7U Rack Mount" },
    ],

    architecture: {
      performance:
        "Works with an external SSD/HDD cache or performance tier for high-speed access.",
      optical:
        "Provides online optical preservation through a standards-based S3-compatible storage interface.",
      offline:
        "Information can participate in physically isolated optical preservation workflows when additional isolation is required.",
    },

    specs: [
      { label: "System Type", value: "Rack-Mounted Online Optical Library" },
      { label: "Capacity", value: "24 TB with current media" },
      { label: "Storage Media", value: "Single-sided optical" },
      {
        label: "Media Capacity",
        value: "100 GB usable per current-generation disc",
      },
      { label: "Number of Cartridges", value: "24" },
      { label: "Media per Cartridge", value: "12" },
      { label: "Number of Magazines", value: "1" },
      { label: "Cartridges per Magazine", value: "24" },
      { label: "Maximum Media", value: "288" },
      { label: "Drives", value: "Up to 6" },
      { label: "Form Factor", value: "7U Rack Mount" },
      {
        label: "Storage Interface",
        value: "S3-compatible through oRain",
      },
      {
        label: "Management",
        value: "Savartus oRain Storage Management",
      },
      {
        label: "Active Archive",
        value: "Configured with external SSD/HDD cache or performance storage",
      },
      { label: "Maximum Throughput", value: "80 MB/s" },
      { label: "Optical RAID", value: "11+1" },
      { label: "Interfaces", value: "Gigabit LAN / SAS / S3" },
    ],

    technicalSpecs: {
      cartridges: "24",
      mediaPerCartridge: "12",
      magazines: "1",
      cartridgesPerMagazine: "24",
      maxMedia: "288",

      /*
       * ELS300 accesses one side of the optical medium.
       * Its usable capacity is therefore approximately half
       * that of a comparable dual-sided configuration.
       */
      capacity200GB: "24 TB",
      capacity500GB: "47 TB",
      capacity1TB: "94 TB",

      maxAddressableDrives: "6",

      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "450 W",
      typicalEnergyConsumption: "200 W",

      dimensionsInches: '17.7" × 12.2" × 36"',
      dimensionsCm: "44.8 × 31.0 × 93.0 cm",
      rackUnits: "7U",

      weightLbs: "177 lbs",
      weightKg: "80 kg",
    },

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
    href: "/products/els500",

    category: "Rack Mount",
    categoryLabel: "Rack Mount",

    tagline: "Rack-mounted optical storage for scalable active archive.",

    description:
      "The Savartus ELS500 provides rack-mounted optical object storage designed for active archive and long-term preservation environments.",

    positioning:
      "Scalable rack-mounted online optical object storage for enterprise Active Archive environments.",

    capacity: "93 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "Up to 6",
    formFactor: "7U Rack Mount",

    scalable: true,

    metrics: [
      { label: "CAPACITY", value: "93 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "Up to 6" },
      { label: "FORM FACTOR", value: "7U Rack Mount" },
    ],

    architecture: {
      performance:
        "Works with SSD or HDD cache storage to provide high-performance access to active information.",
      optical:
        "Provides persistent optical object storage managed as part of the oRain namespace.",
      offline:
        "Additional optical copies can be maintained in physically isolated libraries for deeper preservation.",
    },

    specs: [
      { label: "System Type", value: "Rack-Mounted Online Optical Library" },
      { label: "Capacity", value: "93 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "48" },
      { label: "Media per Cartridge", value: "12" },
      { label: "Number of Magazines", value: "2" },
      { label: "Cartridges per Magazine", value: "24" },
      { label: "Maximum Media", value: "576" },
      { label: "Drives", value: "Up to 6" },
      { label: "Form Factor", value: "7U Rack Mount" },
      {
        label: "Storage Interface",
        value: "S3-compatible through oRain",
      },
      {
        label: "Management",
        value: "Savartus oRain Storage Management",
      },
      {
        label: "Scale Model",
        value: "Network-mounted multi-system architecture",
      },
      {
        label: "Active Archive",
        value: "Configured with SSD/HDD cache or performance storage",
      },
    ],

    technicalSpecs: {
      cartridges: "48",
      mediaPerCartridge: "12",
      magazines: "2",
      cartridgesPerMagazine: "24",
      maxMedia: "576",

      capacity200GB: "93 TB",
      capacity500GB: "187 TB",
      capacity1TB: "374 TB",

      maxAddressableDrives: "6",

      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "450 W",
      typicalEnergyConsumption: "200 W",

      dimensionsInches: '17.7" × 12.2" × 36"',
      dimensionsCm: "44.8 × 31.0 × 93.0 cm",
      rackUnits: "7U",

      weightLbs: "177 lbs",
      weightKg: "80 kg",
    },

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
    href: "/products/els1000",

    category: "Rack Mount",
    categoryLabel: "Rack Mount",

    tagline: "Enterprise optical capacity with horizontal scalability.",

    description:
      "The Savartus ELS1000 expands optical object storage capacity while maintaining a unified namespace through oRain.",

    positioning:
      "Higher-capacity rack-mounted optical preservation with horizontal multi-system scalability.",

    capacity: "187 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "Up to 12",
    formFactor: "10U Rack Mount",

    scalable: true,

    metrics: [
      { label: "CAPACITY", value: "187 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "Up to 12" },
      { label: "FORM FACTOR", value: "10U Rack Mount" },
    ],

    architecture: {
      performance:
        "Pairs with high-performance cache tiers for frequently accessed information.",
      optical:
        "Maintains preserved objects on optical media under oRain management.",
      offline:
        "Additional optical copies can be maintained in physically isolated systems when required.",
    },

    specs: [
      { label: "System Type", value: "Rack-Mounted Online Optical Library" },
      { label: "Capacity", value: "187 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "96" },
      { label: "Media per Cartridge", value: "12" },
      { label: "Number of Magazines", value: "4" },
      { label: "Cartridges per Magazine", value: "24" },
      { label: "Maximum Media", value: "1,152" },
      { label: "Drives", value: "Up to 12" },
      { label: "Form Factor", value: "10U Rack Mount" },
      {
        label: "Storage Interface",
        value: "S3-compatible through oRain",
      },
      {
        label: "Management",
        value: "Savartus oRain Storage Management",
      },
      {
        label: "Scale Model",
        value: "Network-mounted multi-system architecture",
      },
      {
        label: "Active Archive",
        value: "Configured with SSD/HDD cache or performance storage",
      },
    ],

    technicalSpecs: {
      cartridges: "96",
      mediaPerCartridge: "12",
      magazines: "4",
      cartridgesPerMagazine: "24",
      maxMedia: "1,152",

      capacity200GB: "187 TB",
      capacity500GB: "374 TB",
      capacity1TB: "747 TB",

      maxAddressableDrives: "12",

      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "450 W",
      typicalEnergyConsumption: "200 W",

      dimensionsInches: '17.7" × 17.5" × 36"',
      dimensionsCm: "44.8 × 44.5 × 93.0 cm",
      rackUnits: "10U",

      weightLbs: "352 lbs",
      weightKg: "160 kg",
    },

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
    href: "/products/els3600",

    category: "Rack Mount",
    categoryLabel: "Rack Mount",

    tagline: "High-capacity optical preservation for large data estates.",

    description:
      "The Savartus ELS3600 extends the ELS architecture into larger enterprise environments requiring significant long-term preserved capacity.",

    positioning:
      "High-capacity enterprise optical preservation for large-scale information environments.",

    capacity: "584 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "Up to 24",
    formFactor: "20U Rack Mount",

    scalable: true,

    metrics: [
      { label: "CAPACITY", value: "584 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "Up to 24" },
      { label: "FORM FACTOR", value: "20U Rack Mount" },
    ],

    architecture: {
      performance:
        "Performance storage remains available independently from preserved optical copies.",
      optical:
        "Large optical libraries provide persistent online preserved capacity.",
      offline:
        "Additional media copies can be maintained in physically isolated systems when required.",
    },

    specs: [
      { label: "System Type", value: "Enterprise Online Optical Library" },
      { label: "Capacity", value: "584 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "300" },
      { label: "Media per Cartridge", value: "12" },
      { label: "Maximum Media", value: "3,600" },
      { label: "Drives", value: "Up to 24" },
      { label: "Form Factor", value: "20U Rack Mount" },
      {
        label: "Storage Interface",
        value: "S3-compatible through oRain",
      },
      {
        label: "Management",
        value: "Savartus oRain Storage Management",
      },
      {
        label: "Scale Model",
        value: "Network-mounted multi-system architecture",
      },
      {
        label: "Active Archive",
        value: "Configured with SSD/HDD cache or performance storage",
      },
    ],

    technicalSpecs: {
      cartridges: "300",
      mediaPerCartridge: "12",
      magazines: "TBD",
      cartridgesPerMagazine: "TBD",
      maxMedia: "3,600",

      capacity200GB: "584 TB",
      capacity500GB: "1,168 TB",
      capacity1TB: "2,336 TB",

      maxAddressableDrives: "24",

      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "670 W",
      typicalEnergyConsumption: "200 W",

      dimensionsInches: '17.7" × 35" × 43"',
      dimensionsCm: "44.8 × 89.0 × 109.2 cm",
      rackUnits: "20U",

      weightLbs: "662 lbs",
      weightKg: "300 kg",
    },

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
    href: "/products/els4000",

    category: "Rack Mount",
    categoryLabel: "Rack Mount",

    tagline: "Large-scale optical object storage for persistent information.",

    description:
      "The ELS4000 provides large-scale optical preservation managed through oRain as part of a unified, scalable active archive environment.",

    positioning:
      "Large-scale optical object storage for enterprise preservation and Active Archive.",

    capacity: "654 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "Up to 12",
    formFactor: "20U Rack Mount",

    scalable: true,

    metrics: [
      { label: "CAPACITY", value: "654 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "Up to 12" },
      { label: "FORM FACTOR", value: "20U Rack Mount" },
    ],

    architecture: {
      performance:
        "Hot and warm tiers provide performance independent of long-term preserved copies.",
      optical:
        "Optical media provides durable retained storage under the oRain namespace.",
      offline:
        "Additional media copies can be maintained in physically isolated preservation systems.",
    },

    specs: [
      { label: "System Type", value: "Enterprise Online Optical Library" },
      { label: "Capacity", value: "654 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "336" },
      { label: "Media per Cartridge", value: "12" },
      { label: "Number of Magazines", value: "14" },
      { label: "Cartridges per Magazine", value: "24" },
      { label: "Maximum Media", value: "4,032" },
      { label: "Drives", value: "Up to 12" },
      { label: "Form Factor", value: "20U Rack Mount" },
      {
        label: "Storage Interface",
        value: "S3-compatible through oRain",
      },
      {
        label: "Management",
        value: "Savartus oRain Storage Management",
      },
      {
        label: "Scale Model",
        value: "Network-mounted multi-system architecture",
      },
      {
        label: "Active Archive",
        value: "Configured with SSD/HDD cache or performance storage",
      },
    ],

    technicalSpecs: {
      cartridges: "336",
      mediaPerCartridge: "12",
      magazines: "14",
      cartridgesPerMagazine: "24",
      maxMedia: "4,032",

      capacity200GB: "654 TB",
      capacity500GB: "1,308 TB",
      capacity1TB: "2,616 TB",

      maxAddressableDrives: "12",

      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "670 W",
      typicalEnergyConsumption: "200 W",

      dimensionsInches: '17.7" × 35" × 43"',
      dimensionsCm: "44.8 × 89.0 × 110.0 cm",
      rackUnits: "20U",

      weightLbs: "662 lbs",
      weightKg: "300 kg",
    },

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
    href: "/products/els8000",

    category: "Rack Mount",
    categoryLabel: "Full Rack Size",

    tagline: "Mass-scale optical preservation managed as one namespace.",

    description:
      "The Savartus ELS8000 provides large-scale online optical preservation for enterprise environments where data must remain durable, discoverable, and accessible.",

    positioning:
      "Mass-capacity online optical preservation managed within a unified oRain namespace.",

    capacity: "1,542 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "Up to 40",
    formFactor: "45U Rack Mount",

    scalable: true,

    metrics: [
      { label: "CAPACITY", value: "1,542 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "Up to 40" },
      { label: "FORM FACTOR", value: "45U Rack Mount" },
    ],

    architecture: {
      performance:
        "High-performance storage serves active workloads while preserved copies remain on optical.",
      optical:
        "High-capacity optical libraries provide online persistent storage.",
      offline:
        "Additional copies can be maintained in ELS8000-OL systems for physically isolated preservation.",
    },

    specs: [
      { label: "System Type", value: "Full-Rack Online Optical Library" },
      { label: "Capacity", value: "1,542 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "792" },
      { label: "Media per Cartridge", value: "12" },
      { label: "Number of Magazines", value: "22" },
      { label: "Cartridges per Magazine", value: "36" },
      { label: "Maximum Media", value: "9,504" },
      { label: "Drives", value: "Up to 40" },
      { label: "Form Factor", value: "45U Rack Mount" },
      {
        label: "Storage Interface",
        value: "S3-compatible through oRain",
      },
      {
        label: "Management",
        value: "Savartus oRain Storage Management",
      },
      {
        label: "Scale Model",
        value: "Network-mounted multi-system architecture",
      },
      { label: "Offline Pairing", value: "ELS8000-OL" },
    ],

    technicalSpecs: {
      cartridges: "792",
      mediaPerCartridge: "12",
      magazines: "22",
      cartridgesPerMagazine: "36",
      maxMedia: "9,504",

      capacity200GB: "1,542 TB",
      capacity500GB: "3,083 TB",
      capacity1TB: "6,166 TB",

      maxAddressableDrives: "40",

      powerRequirements: "90-300 VAC",
      peakEnergyConsumption: "1500 W",
      typicalEnergyConsumption: "340 W",

      dimensionsInches: '23.6" × 78.74" × 42"',
      dimensionsCm: "60.0 × 200.0 × 106.7 cm",
      rackUnits: "45U",

      weightLbs: "1,490 lbs",
      weightKg: "676 kg",
    },

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
    href: "/products/els10k",

    category: "Rack Mount",
    categoryLabel: "Full Rack Size",

    tagline: "Maximum-scale online optical preservation.",

    description:
      "The ELS10K is designed for very large information environments requiring extensive optical capacity while preserving a unified object namespace.",

    positioning:
      "Maximum-scale online optical preservation for very large enterprise data estates.",

    capacity: "1,682 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "Up to 40",
    formFactor: "50U Rack Mount",

    scalable: true,

    metrics: [
      { label: "CAPACITY", value: "1,682 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "Up to 40" },
      { label: "FORM FACTOR", value: "50U Rack Mount" },
    ],

    architecture: {
      performance:
        "Performance storage supports active use while optical storage preserves authoritative retained copies.",
      optical:
        "Very large optical capacity remains searchable and location-aware through oRain.",
      offline:
        "Additional copies can be maintained in ELS10K-OL systems for physically isolated preservation.",
    },

    specs: [
      { label: "System Type", value: "Full-Rack Online Optical Library" },
      { label: "Capacity", value: "1,682 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "864" },
      { label: "Media per Cartridge", value: "12" },
      { label: "Number of Magazines", value: "24" },
      { label: "Cartridges per Magazine", value: "36" },
      { label: "Maximum Media", value: "10,368" },
      { label: "Drives", value: "Up to 40" },
      { label: "Form Factor", value: "50U Rack Mount" },
      {
        label: "Storage Interface",
        value: "S3-compatible through oRain",
      },
      {
        label: "Management",
        value: "Savartus oRain Storage Management",
      },
      {
        label: "Scale Model",
        value: "Network-mounted multi-system architecture",
      },
      { label: "Offline Pairing", value: "ELS10K-OL" },
    ],

    technicalSpecs: {
      cartridges: "864",
      mediaPerCartridge: "12",
      magazines: "24",
      cartridgesPerMagazine: "36",
      maxMedia: "10,368",

      capacity200GB: "1,682 TB",
      capacity500GB: "3,363 TB",
      capacity1TB: "6,727 TB",

      maxAddressableDrives: "40",

      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "1500 W",
      typicalEnergyConsumption: "340 W",

      dimensionsInches: '23.6" × 86.6" × 47.2"',
      dimensionsCm: "60.0 × 220.0 × 120.0 cm",
      rackUnits: "50U",

      weightLbs: "1,546 lbs",
      weightKg: "701 kg",
    },

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
    href: "/products/els8000-ol",

    category: "Offline",
    categoryLabel: "Offline / Full Rack",

    tagline: "Physically isolated optical preservation at enterprise scale.",

    description:
      "The ELS8000-OL provides offline optical preservation for information requiring physical isolation while remaining indexed, tracked, and discoverable through the Savartus management environment.",

    positioning:
      "Physically isolated optical preservation at enterprise scale while media remains tracked and discoverable.",

    capacity: "1,542 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "No drives",
    formFactor: "45U Rack Mount",

    offline: true,

    metrics: [
      { label: "CAPACITY", value: "1,542 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "No drives" },
      { label: "ACCESS", value: "Physically Isolated" },
    ],

    architecture: {
      performance:
        "Objects are restored through the online environment when operational access is required.",
      optical:
        "Optical media remains the durable preserved copy.",
      offline:
        "Media is physically isolated while its location and contents remain tracked and indexed by the Savartus management environment.",
    },

    specs: [
      { label: "System Type", value: "Offline Optical Library" },
      { label: "Capacity", value: "1,542 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "792" },
      { label: "Media per Cartridge", value: "12" },
      { label: "Number of Magazines", value: "22" },
      { label: "Cartridges per Magazine", value: "36" },
      { label: "Maximum Media", value: "9,504" },
      { label: "Drives", value: "No drives" },
      { label: "Form Factor", value: "45U Rack Mount" },
      { label: "Connectivity", value: "Physically isolated" },
      {
        label: "Media Tracking",
        value: "Managed and indexed through oRain",
      },
      {
        label: "Restore Workflow",
        value: "Mount media and restore through the online environment",
      },
      { label: "Online Pairing", value: "ELS8000" },
    ],

    technicalSpecs: {
      cartridges: "792",
      mediaPerCartridge: "12",
      magazines: "22",
      cartridgesPerMagazine: "36",
      maxMedia: "9,504",

      capacity200GB: "1,542 TB",
      capacity500GB: "3,083 TB",
      capacity1TB: "6,166 TB",

      maxAddressableDrives: "N/A",

      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "50 W",
      typicalEnergyConsumption: "50 W",

      dimensionsInches: '23.6" × 78.74" × 42"',
      dimensionsCm: "60.0 × 200.0 × 120.0 cm",
      rackUnits: "45U",

      weightLbs: "1,378 lbs",
      weightKg: "625 kg",
    },

    useCases: [
      "Cyber-resilient preservation",
      "Ransomware protection",
      "Defense retention",
      "Regulatory archives",
      "Deep preservation",
      "Physically isolated data storage",
    ],
  },

  {
    slug: "els10k-ol",
    name: "ELS10K-OL",
    href: "/products/els10k-ol",

    category: "Offline",
    categoryLabel: "Offline / Full Rack",

    tagline: "Mass-scale physically isolated preservation.",

    description:
      "The ELS10K-OL extends the Savartus optical architecture into very large offline preservation environments where physical isolation and long-term durability are required.",

    positioning:
      "Mass-scale physically isolated optical preservation for cyber-resilient and long-term retention.",

    capacity: "1,682 TB",
    media: "Dual-sided optical",
    mediaCapacity: "200 GB",
    drives: "No drives",
    formFactor: "50U Rack Mount",

    offline: true,

    metrics: [
      { label: "CAPACITY", value: "1,682 TB" },
      { label: "MEDIA", value: "Dual-sided optical" },
      { label: "DRIVES", value: "No drives" },
      { label: "ACCESS", value: "Physically Isolated" },
    ],

    architecture: {
      performance:
        "Objects are restored to online cache or performance storage when operational access is required.",
      optical:
        "Optical media retains the durable preserved copy.",
      offline:
        "Media remains physically isolated while oRain maintains location and object awareness.",
    },

    specs: [
      { label: "System Type", value: "Offline Optical Library" },
      { label: "Capacity", value: "1,682 TB with 200 GB media" },
      { label: "Storage Media", value: "Dual-sided optical" },
      { label: "Media Capacity", value: "200 GB" },
      { label: "Number of Cartridges", value: "864" },
      { label: "Media per Cartridge", value: "12" },
      { label: "Number of Magazines", value: "24" },
      { label: "Cartridges per Magazine", value: "36" },
      { label: "Maximum Media", value: "10,368" },
      { label: "Drives", value: "No drives" },
      { label: "Form Factor", value: "50U Rack Mount" },
      { label: "Connectivity", value: "Physically isolated" },
      {
        label: "Media Tracking",
        value: "Managed and indexed through oRain",
      },
      {
        label: "Restore Workflow",
        value: "Mount media and restore through the online environment",
      },
      { label: "Online Pairing", value: "ELS10K" },
    ],

    technicalSpecs: {
      cartridges: "864",
      mediaPerCartridge: "12",
      magazines: "24",
      cartridgesPerMagazine: "36",
      maxMedia: "10,368",

      capacity200GB: "1,682 TB",
      capacity500GB: "3,363 TB",
      capacity1TB: "6,727 TB",

      maxAddressableDrives: "N/A",

      /*
       * Same media/chassis configuration as the ELS10K,
       * with the low-power offline operating profile.
       */
      powerRequirements: "110-230 VAC, 50-60 Hz",
      peakEnergyConsumption: "50 W",
      typicalEnergyConsumption: "50 W",

      dimensionsInches: '23.6" × 86.6" × 47.2"',
      dimensionsCm: "60.0 × 220.0 × 120.0 cm",
      rackUnits: "50U",

      weightLbs: "1,546 lbs",
      weightKg: "701 kg",
    },

    useCases: [
      "Mass-scale cyber resilience",
      "Government preservation",
      "Defense archives",
      "Critical infrastructure",
      "Deep retention",
      "Long-term physically isolated storage",
    ],
  },
];

export function getELSProduct(slug: string) {
  return elsProducts.find((product) => product.slug === slug);
}