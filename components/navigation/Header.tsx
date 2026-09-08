import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";

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
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="button button-primary">
          Talk to Savartus
        </Link>
      </div>
    </header>
  );
}