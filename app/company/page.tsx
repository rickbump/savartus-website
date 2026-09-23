import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FullDocumentRequest } from "@/components/resources/FullDocumentRequest";

export const metadata: Metadata = {
  title: "About Savartus",

  description:
    "Learn about Savartus, our leadership, history, and expertise in Data Lifecycle Management, Active Archive, enterprise storage, security, and long-term information preservation.",

  alternates: {
    canonical: "/company",
  },

  openGraph: {
    title: "About Savartus | Savartus",
    description:
      "Meet the people and experience behind Savartus and our approach to data lifecycle management, storage, security, Active Archive, and information preservation.",
    url: "/company",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Savartus | Savartus",
    description:
      "Meet the people and experience behind Savartus and our approach to data lifecycle management, storage, security, Active Archive, and information preservation.",
  },
};

const leadership = [
  {
    name: "Rick Bump",
    role: "Co-Founder & CEO",
    descriptor: "The Data Wonk",
    image: "/images/company/rick-bump.jpg",
    bio: [
        "Rick is a technologist and business executive who has spent his career at the intersection of data, software, technology, and business operations.",
        "At Savartus, he leads the company's Data Lifecycle Management strategy, architected the core DLM software platform, and authored the Enterprise Data Lifecycle™ Specification—a comprehensive architecture for governing information according to what it is, what it means, and what it requires.",
        "His focus is a deceptively simple question: What should happen to information as its requirements change?",
        "Rick's background spans enterprise software, data management, AI and analytics, SaaS, hardware, product development, sales, operations, and large-scale business transformation. That combination shapes Savartus's approach to treating information lifecycle as a business and governance problem—not simply a storage problem.",
    ],
    link: {
        label: "Download the Enterprise Data Lifecycle™ overview",
        href: "/downloads/specification/Specification Overview.pdf",
        external: false,
        download: true,
    },
    },
  {
    name: "Christopher Rence",
    role: "Co-Founder",
    descriptor: "The Security Wonk",
    image: "/images/company/christopher-rence.jpg",
    bio: [
        "Chris has spent decades thinking about what can go wrong with enterprise technology—and how organizations can design systems so that it doesn't.",
        "His background spans cybersecurity, data protection, compliance, cloud infrastructure, enterprise IT, and executive technology leadership.",
        "His work has addressed ransomware, cyber risk, security governance, compliance, and protection of information across complex enterprise environments.",
        "Chris is also the author of World War D: The Intersection of Cyber and Biological Pandemics, which explores the convergence of cybersecurity, systemic risk, and large-scale disruption.",
        "At Savartus, Chris brings the security and resilience perspective to the information lifecycle: protecting information not only from loss, but from unauthorized access, alteration, compromise, and operational disruption.",
    ],
    link: {
        label: "Explore World War D",
        href: "https://www.amazon.com/dp/B0B14JLJDR?lv=shuf&channelId=500&plpRedirect=mhFallback",
        external: true,
    },
  },
  {
    name: "Horst Schellong",
    role: "Technical Director",
    descriptor: "The Storage Technologist",
    image: "/images/company/horst-schellong.jpg",
    bio: [
      "Horst brings decades of experience in enterprise storage, with particularly deep expertise in optical systems, removable media, robotics, storage libraries, object storage, and long-term information preservation.",
      "His career has included development and commercialization of large-scale storage and archive technologies across multiple generations of media and infrastructure.",
      "At Savartus, Horst helps translate preservation requirements into practical storage architecture—connecting media, libraries, object storage, management software, and enterprise workflows.",
    ],
  },
  {
    name: "Simon Goettl",
    role: "Director of Marketing",
    descriptor: "The Market Translator",
    image: "/images/company/simon-goettl.jpg",
    bio: [
      "Simon specializes in turning complex technology into stories customers can understand and use.",
      "His background spans product marketing, positioning, messaging, data and technology products, sales enablement, and go-to-market strategy across both agency and enterprise environments.",
      "At Savartus, Simon connects the technology to the problem it solves—translating data lifecycle, storage, security, and preservation architecture into clear customer and business value.",
    ],
  },
];

const disciplines = [
  {
    label: "DATA",
    title: "Understand the information.",
    copy:
      "Understand identity, context, relationships, value, risk, requirements, and lifecycle—not simply age or storage location.",
  },
  {
    label: "SECURITY",
    title: "Protect what matters.",
    copy:
      "Protect information against loss, alteration, unauthorized access, compromise, and disruption across its lifecycle.",
  },
  {
    label: "STORAGE",
    title: "Use the right storage state.",
    copy:
      "Match information to infrastructure appropriate to its performance, availability, protection, isolation, and preservation requirements.",
  },
  {
    label: "SOFTWARE",
    title: "Connect policy to execution.",
    copy:
      "Use software, metadata, APIs, automation, and storage management to connect governed intent with enterprise technology.",
  },
  {
    label: "PRESERVATION",
    title: "Keep trustworthy information trustworthy.",
    copy:
      "Preserve important information beyond the lifespan of individual applications, systems, and storage technologies.",
  },
];

export default function CompanyPage() {
  return (
    <main>
      {/* HERO */}
      <section className="about-hero">
        <div className="site-container about-hero-inner">
          <p className="about-eyebrow">ABOUT SAVARTUS</p>

          <h1>
            Technology changes.
            <br />
            Information persists.
          </h1>

          <p className="about-hero-copy">
            Savartus was created around a simple idea: information often
            outlives the technologies used to create, manage, protect, and
            store it.
          </p>

          <p className="about-hero-copy about-hero-copy-secondary">
            We bring together expertise in data, security, storage, software,
            optical technology, and enterprise operations to help organizations
            manage, store, and preserve information for as long as it matters.
          </p>

          <div className="about-hero-actions">
            <Link href="/contact" className="button button-primary">
              Talk to Savartus
            </Link>

            <Link href="/products" className="button button-secondary">
              Explore Our Technology
            </Link>
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section id="history" className="about-section about-history">
        <div className="site-container">
          <div className="about-section-header">
            <p className="about-eyebrow">OUR STORY</p>

            <h2>
              A new company built on
              <br />
              decades of experience.
            </h2>
          </div>

          <div className="about-history-layout">
            <div className="about-history-lead">
              <p>
                Savartus was founded in 2024, but the experience behind it
                reaches back decades.
              </p>

              <p>
                Our team has worked across enterprise software, data
                management, cybersecurity, optical storage, robotics, cloud
                infrastructure, business transformation, and long-term
                information preservation.
              </p>
            </div>

            <div className="about-history-copy">
              <p>
                Part of that heritage comes from Rimage, a pioneer in automated
                digital media systems whose engineering combined robotics,
                software, and optical technology.
              </p>

              <p>
                Savartus carries that experience forward while addressing a
                broader enterprise problem: how organizations understand,
                govern, store, protect, and preserve information throughout its
                lifecycle.
              </p>

              <p>
                Today, Savartus brings together Data Lifecycle Management,
                Active Archive, optical object storage, enterprise storage
                management, and services into an architecture designed around
                the information itself.
              </p>
            </div>
          </div>

          <div className="about-history-statement">
            <span>THEN</span>
            <strong>Digital media. Robotics. Software. Optical.</strong>

            <div className="about-history-arrow">→</div>

            <span>NOW</span>
            <strong>
              Information lifecycle. Active Archive. Object storage.
              Preservation.
            </strong>
          </div>
        </div>
      </section>

      {/* DISCIPLINES */}
      <section className="about-section about-disciplines">
        <div className="site-container">
          <div className="about-section-header">
            <p className="about-eyebrow">WHAT WE BRING TOGETHER</p>

            <h2>
              Different disciplines.
              <br />
              One information problem.
            </h2>

            <p className="about-lead">
              Managing information over decades requires more than storage.
              Savartus brings together disciplines that are too often treated
              separately.
            </p>
          </div>

          <div className="about-discipline-grid">
            {disciplines.map((discipline, index) => (
              <article className="about-discipline-card" key={discipline.label}>
                <div className="about-discipline-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <span>{discipline.label}</span>

                <h3>{discipline.title}</h3>

                <p>{discipline.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section id="leadership" className="about-section about-leadership">
        <div className="site-container">
          <div className="about-section-header">
            <p className="about-eyebrow">LEADERSHIP</p>

            <h2>
              A team that sees information
              <br />
              from different angles.
            </h2>

            <p className="about-lead">
              Data, security, storage, software, operations, and market
              understanding come together in the Savartus leadership team.
            </p>
          </div>

          <div className="about-leadership-list">
            {leadership.map((person, index) => (
              <article
                className="about-leader"
                key={person.name}
              >
                <div className="about-leader-image-wrap">
                  <Image
                    src={person.image}
                    alt={`${person.name}, ${person.role} at Savartus`}
                    fill
                    sizes="(max-width: 900px) 100vw, 380px"
                    className="about-leader-image"
                    priority={index < 2}
                  />
                </div>

                <div className="about-leader-content">
                  <p className="about-leader-number">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <p className="about-leader-role">{person.role}</p>

                  <h3>{person.name}</h3>

                  <p className="about-leader-descriptor">
                    {person.descriptor}
                  </p>

                  <div className="about-leader-bio">
                    {person.bio.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}

                    {"link" in person && person.link && (
                        <div className="about-leader-link">
                        {person.link.external ? (
                            <a
                            href={person.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            {person.link.label} →
                            </a>
                        ) : (
                            <Link
                            href={person.link.href}
                            download={"download" in person.link && person.link.download}
                            >
                            {person.link.label} →
                            </Link>
                        )}
                        </div>
                    )}

                    {person.name === "Rick Bump" && (
                      <FullDocumentRequest
                        source="Rick Bump company bio"
                        compact
                      />
                    )}
                    </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="locations" className="about-section about-locations">
        <div className="site-container">
          <div className="about-section-header">
            <p className="about-eyebrow">WHERE WE WORK</p>

            <h2>
              People, technology,
              <br />
              and infrastructure.
            </h2>

            <p className="about-lead">
              Savartus operates across business, technology, and infrastructure
              locations in Minnesota, Florida, and Wisconsin.
            </p>
          </div>

          <div className="about-location-image-wrap">
            <Image
              src="/images/company/savartus-locations-map.png"
              alt="Savartus locations in Minnesota, Wisconsin, and Florida"
              width={1792}
              height={896}
              className="about-location-image"
            />
          </div>

          <div className="about-location-grid">
            <article>
              <span>MINNESOTA</span>
              <h3>Business & Operations</h3>
              <p>
                Company leadership, customer engagement, partnerships, and
                business operations.
              </p>
            </article>

            <article>
              <span>FLORIDA</span>
              <h3>Technology & Operations</h3>
              <p>
                Software development, product development, customer solutions,
                systems integration, and company operations.
              </p>
            </article>

            <article>
              <span>WISCONSIN</span>
              <h3>Data Center</h3>
              <p>
                Savartus infrastructure supporting hosted services,
                development, testing, and customer environments.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* POINT OF VIEW */}
      <section className="about-section about-why">
        <div className="site-container">
          <div className="about-why-grid">
            <div>
              <p className="about-eyebrow">WHY SAVARTUS</p>

              <h2>
                We&apos;re building for information that needs to outlive the
                technology around it.
              </h2>
            </div>

            <div className="about-why-copy">
              <p>Technology platforms change.</p>
              <p>Applications change.</p>
              <p>Storage technologies change.</p>
              <p>Organizations change.</p>

              <strong>Important information has to survive all of them.</strong>

              <p>
                That is why Savartus approaches data management from the
                information outward—understand it, govern it, store it
                appropriately, protect it, and preserve what matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="about-closing">
        <div className="site-container about-closing-inner">
          <p className="about-eyebrow about-eyebrow-light">
            MANAGE. STORE. PRESERVE.
          </p>

          <h2>
            Information deserves
            <br />
            a longer view.
          </h2>

          <p>
            Whether the challenge is governance, performance, resilience,
            preservation, or long-term access, Savartus starts with the
            information and works outward.
          </p>

          <div className="about-closing-actions">
            <Link href="/contact" className="button button-light">
              Talk to Savartus
            </Link>

            <Link
              href="/data-lifecycle-management"
              className="button button-outline-light"
            >
              Explore Data Lifecycle Management
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
