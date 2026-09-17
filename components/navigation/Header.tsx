import Image from "next/image";
import Link from "next/link";

const navGroups = [
  {
    label: "Solutions",
    href: "/#solutions",
    items: [
      {
        label: "Active Archive",
        href: "/active-archive",
        description: "Keep information active and preserved.",
      },
      {
        label: "Preservation",
        href: "/preservation",
        description: "Durable nearline and physically isolated retention.",
      },
      {
        label: "Data Lifecycle Management",
        href: "/data-lifecycle-management",
        description: "Govern information according to its requirements.",
      },
    ],
  },
  {
    label: "Deployment",
    href: "/#deployment",
    items: [
      {
        label: "On-Premises",
        href: "/#deployment",
        description: "Deploy Savartus technology in the customer environment.",
      },
      {
        label: "As a Service",
        href: "/active-archive/service",
        description: "Use Savartus-managed infrastructure and operations.",
      },
      {
        label: "Hybrid",
        href: "/#deployment",
        description: "Combine on-premises systems and managed services.",
      },
    ],
  },
  {
    label: "Products",
    href: "/products",
    items: [
      {
        label: "Products Overview",
        href: "/products",
        description: "Technology for managing, storing, and preserving information.",
      },
      {
        label: "Enterprise Library Systems",
        href: "/products/els",
        description: "Nearline and offline optical storage infrastructure.",
      },
      {
        label: "oRain Storage Management",
        href: "/technology/orain",
        description: "Storage management across performance and optical environments.",
      },
      {
        label: "File Management System",
        href: "/products/file-management",
        description: "Metadata, search, and information management.",
      },
      {
        label: "DLM Platform",
        href: "/data-lifecycle-management",
        description: "Policy-driven governance across enterprise repositories.",
      },
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    items: [
      {
        label: "Insights Overview",
        href: "/insights",
        description: "Perspectives on lifecycle, archive, and preservation.",
      },
      {
        label: "Latest Thinking",
        href: "/insights#latest",
        description: "Current Savartus thinking on enterprise information strategy.",
      },
      {
        label: "DLM Perspective",
        href: "/data-lifecycle-management",
        description: "Why governance should follow information requirements.",
      },
      {
        label: "Active Archive Perspective",
        href: "/active-archive",
        description: "Why performance and preservation should work together.",
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    align: "right",
    items: [
      {
        label: "Resources Overview",
        href: "/resources",
        description: "Technical documents, product information, and specifications.",
      },
      {
        label: "Enterprise Data Lifecycle Specification",
        href: "/resources/dlm-specification",
        description: "The architecture behind Savartus DLM.",
      },
      {
        label: "Active Archive Resources",
        href: "/resources#active-archive",
        description: "Architecture and service resources.",
      },
      {
        label: "ELS Family Resources",
        href: "/resources#els",
        description: "Product information for Enterprise Library Systems.",
      },
      {
        label: "Software Resources",
        href: "/resources#software",
        description: "oRain, FMS, and DLM information management resources.",
      },
    ],
  },
  {
    label: "Company",
    href: "/company",
    align: "right",
    items: [
      {
        label: "Company Overview",
        href: "/company",
        description: "Savartus mission, history, leadership, and locations.",
      },
      {
        label: "History",
        href: "/company#history",
        description: "The experience behind Savartus.",
      },
      {
        label: "Leadership",
        href: "/company#leadership",
        description: "Meet the Savartus leadership team.",
      },
      {
        label: "Locations",
        href: "/company#locations",
        description: "Savartus presence in the United States and Europe.",
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Start a conversation with Savartus.",
      },
    ],
  },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="brand">
          <Image
            src="/images/brand/savartus-shield.jpeg"
            alt="Savartus"
            width={64}
            height={64}
            className="brand-mark"
            priority
          />
          <span className="brand-name">Savartus</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div
              className={`nav-menu ${
                group.align === "right" ? "nav-menu-right" : ""
              }`}
              key={group.label}
            >
              <Link href={group.href} className="nav-link nav-menu-trigger">
                {group.label}
              </Link>

              <div className="nav-dropdown" aria-label={group.label}>
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="nav-dropdown-link"
                  >
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/*
            Keep contact as the primary action button rather than another
            dropdown item in the crowded desktop nav.
          */}
        </nav>

        <Link href="/contact" className="button button-primary">
          Talk to Savartus
        </Link>
      </div>
    </header>
  );
}
