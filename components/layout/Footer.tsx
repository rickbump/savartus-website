import Link from "next/link";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <div>
          <div className="footer-brand">{siteConfig.name}</div>
          <p className="footer-tagline">{siteConfig.tagline}</p>
        </div>

        <div className="footer-links">
          <Link href="/active-archive">Active Archive</Link>
          <Link href="/data-lifecycle-management">Data Lifecycle Management</Link>
          <Link href="/optical-object-storage">Optical Object Storage</Link>
          <Link href="/products">Products</Link>
          <Link href="/resources">Resources</Link>
        </div>

        <div className="footer-meta">
          <span>© {new Date().getFullYear()} Savartus</span>
        </div>
      </div>
    </footer>
  );
}