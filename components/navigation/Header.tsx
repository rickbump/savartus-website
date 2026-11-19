import Image from "next/image";
import Link from "next/link";

type NavGroup = {
  label: string;
  href: string;
  align?: "right";
  items: { label: string; href: string; description: string }[];
};

const navGroups: NavGroup[] = [
  {
    label: "On-Premises",
    href: "/products/els",
    items: [
      {
        label: "Enterprise Library Systems",
        href: "/products/els",
        description: "Optical libraries for your own facility, compact to petabyte scale.",
      },
      {
        label: "oRain Storage Management",
        href: "/technology/orain",
        description: "One managed environment across disk and optical.",
      },
      {
        label: "File Management System",
        href: "/products/file-management",
        description: "Metadata, search, and information management.",
      },
      {
        label: "All Products",
        href: "/products",
        description: "The full Savartus product family.",
      },
    ],
  },
  {
    label: "Solutions",
    href: "/#solutions",
    items: [
      {
        label: "Preservation",
        href: "/preservation",
        description: "Durable, immutable retention, online or isolated.",
      },
      {
        label: "Active Archive",
        href: "/active-archive",
        description: "Keep information active and preserved.",
      },
      {
        label: "Data Lifecycle Management",
        href: "/data-lifecycle-management",
        description: "Govern information according to its requirements.",
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    align: "right",
    items: [
      {
        label: "Online Storage Guide",
        href: "/preservation/getting-started",
        description: "Sign in, upload, and connect S3 tools.",
      },
      {
        label: "Insights",
        href: "/insights",
        description: "Perspectives on archive, preservation, and lifecycle.",
      },
      {
        label: "Documents and Specifications",
        href: "/resources",
        description: "Data sheets, technical briefs, and the DLM specification.",
      },
    ],
  },
  {
    label: "Company",
    href: "/company",
    align: "right",
    items: [
      {
        label: "About Savartus",
        href: "/company",
        description: "History, leadership, and locations.",
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
    <>
      <Link href="/online-storage" className="site-announcement">
        <span className="site-announcement-badge">New</span>
        <span>
          Immutable online storage on write-once optical media. Ready in minutes.
        </span>
        <span className="site-announcement-link">Learn more →</span>
      </Link>

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
            <Link href="/online-storage" className="nav-link nav-link-featured">
              Online Storage
            </Link>

            {navGroups.map((group) => (
              <div
                className={`nav-menu ${group.align === "right" ? "nav-menu-right" : ""}`}
                key={group.label}
              >
                <Link href={group.href} className="nav-link nav-menu-trigger">
                  {group.label}
                </Link>

                <div className="nav-dropdown" aria-label={group.label}>
                  {group.items.map((item) => (
                    <Link key={item.label} href={item.href} className="nav-dropdown-link">
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <Link href="/account/signin" className="nav-link header-signin">
            Sign in
          </Link>

          <Link href="/online-storage" className="button button-primary">
            Start Online
          </Link>
        </div>
      </header>
    </>
  );
}
