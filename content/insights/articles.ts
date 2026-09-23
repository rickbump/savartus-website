export type InsightStatus = "published" | "draft";

export type InsightSection = {
  heading?: string;
  paragraphs: string[];
};

export type InsightLink = {
  label: string;
  href: string;
  description: string;
};

export type InsightArticle = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  author: string;
  publishedDate: string;
  updatedDate?: string;
  readingTime: string;
  status: InsightStatus;
  featured?: boolean;
  sections: InsightSection[];
  relatedLinks: InsightLink[];
  relatedArticleSlugs: string[];
};

export const insightArticles: InsightArticle[] = [
  {
    slug: "why-do-we-manage-data-based-on-its-birthday",
    title: "Why do we manage data based on its birthday?",
    description:
      "Age is easy to measure, but enterprise information should be governed according to value, risk, retention, protection, obligations, and business requirements—not simply elapsed time.",
    excerpt:
      "Age is easy to measure. Value, risk, retention, security, and future usefulness are what should determine lifecycle decisions.",
    category: "DATA LIFECYCLE",
    author: "Savartus",
    publishedDate: "2026-09-23",
    readingTime: "5 min read",
    status: "published",
    featured: true,

    sections: [
      {
        paragraphs: [
          "Enterprise storage policies frequently begin with a clock. Keep information here for 30 days. Move it there after 90 days. Send it somewhere cheaper after a year.",
          "Age is convenient because it is objective, measurable, and easy to automate. But the age of information rarely tells us what that information means to the organization.",
          "A file turning 90 days old is not a business event.",
        ],
      },
      {
        heading: "Age is a characteristic, not a lifecycle",
        paragraphs: [
          "Information can be old and critically important. It can be new and disposable. It can become valuable again years after its original use declined.",
          "Retention obligations can change. Legal requirements can change. Security requirements can change. Relationships can emerge. New analytics or AI workloads can make historical information operationally important again.",
          "None of those changes are adequately represented by a timestamp.",
        ],
      },
      {
        heading: "Information has a state",
        paragraphs: [
          "A useful lifecycle model begins with the information itself: its identity, relationships, business value, risk, retention requirements, protection requirements, security classification, integrity, availability, provenance, and other governance-relevant context.",
          "Savartus refers to this richer understanding as governed information state. The Enterprise Data Lifecycle™ architecture formalizes that concept through the Enterprise Data State Vector.",
          "The objective is not to collect metadata for its own sake. The objective is to establish enough context to make an explainable governance decision.",
        ],
      },
      {
        heading: "Storage state is different",
        paragraphs: [
          "Information lifecycle and storage lifecycle are not the same thing.",
          "An archived dataset might remain Archived while moving from low-cost storage to high-performance infrastructure because an AI workload suddenly requires it. Its storage changed. Its lifecycle state did not.",
          "Likewise, information can move into a different governed lifecycle state without requiring an immediate storage migration.",
        ],
      },
      {
        heading: "Move information when its requirements change",
        paragraphs: [
          "That leads to a different approach to lifecycle management. Instead of asking how old the information is, ask what the organization currently requires from it.",
          "Policy can then determine whether information should remain active, receive additional protection, move to preservation, become eligible for disposition, or be made more readily available.",
          "Age can still be one signal. It simply should not be the governance model.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore Data Lifecycle Management",
        href: "/data-lifecycle-management",
        description:
          "See how Savartus governs information according to context, policy, and requirements.",
      },
      {
        label: "Enterprise Data Lifecycle™ Specification",
        href: "/resources/dlm-specification",
        description:
          "Explore the architecture behind governed information state and lifecycle decisions.",
      },
    ],

    relatedArticleSlugs: [
      "old-data-isnt-necessarily-cold-data",
      "a-file-turning-90-days-old-isnt-a-business-event",
    ],
  },

  {
    slug: "old-data-isnt-necessarily-cold-data",
    title: "Old data isn't necessarily cold data.",
    description:
      "Historical enterprise information can become operationally important again as business, regulatory, analytical, and AI requirements change.",
    excerpt:
      "Information can become relevant again as business, regulatory, analytical, and AI requirements change.",
    category: "DATA LIFECYCLE",
    author: "Savartus",
    publishedDate: "2026-09-25",
    readingTime: "5 min read",
    status: "draft",

    sections: [
      {
        paragraphs: [
          "Storage architectures often assume that information cools predictably over time.",
          "It starts hot. Usage declines. Eventually it becomes cold. From there, the traditional answer is to move it farther away from the systems that use it.",
          "That model is convenient. It is also increasingly incomplete.",
        ],
      },
      {
        heading: "Age and relevance are not the same thing",
        paragraphs: [
          "A five-year-old engineering dataset may suddenly become valuable when a new product is designed. Historical video may become evidence. Old research data may become training material for a new AI model. A customer record may become important because of litigation, regulation, or a new business relationship.",
          "The information did not become younger. Its requirements changed.",
          "Treating age as a proxy for value assumes that usefulness moves in only one direction. In practice, enterprise information can move between periods of high and low operational importance many times during its life.",
        ],
      },
      {
        heading: "AI makes the distinction more important",
        paragraphs: [
          "AI and analytics increase the potential future value of information that may have appeared dormant.",
          "Historical datasets can contain patterns, relationships, edge cases, and context that did not matter when the information was originally created.",
          "That means a storage decision made years ago can directly affect whether the organization can use that information today.",
        ],
      },
      {
        heading: "Cold storage can create a business constraint",
        paragraphs: [
          "There is nothing inherently wrong with low-cost or lower-performance storage. The problem appears when the storage state becomes mistaken for the information state.",
          "If a dataset is difficult to retrieve, slow to restore, poorly indexed, or stripped of the metadata needed to understand it, its theoretical value may be much greater than its practical value.",
          "Preserving the bits is necessary. Preserving the ability to understand and use them is equally important.",
        ],
      },
      {
        heading: "Lifecycle management should be reversible",
        paragraphs: [
          "A modern information lifecycle should allow data to move back toward higher availability when requirements justify it.",
          "Archived information can become operational again. Preserved information can be restored. A dataset can remain in the same governed lifecycle state while its storage placement changes.",
          "The important question is not whether the information is old. The important question is what the organization needs from it now.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore Data Lifecycle Management",
        href: "/data-lifecycle-management",
        description:
          "Govern information according to its current requirements rather than age alone.",
      },
      {
        label: "Explore Active Archive",
        href: "/active-archive",
        description:
          "See how performance and preservation can coexist in one storage architecture.",
      },
    ],

    relatedArticleSlugs: [
      "why-do-we-manage-data-based-on-its-birthday",
      "a-file-turning-90-days-old-isnt-a-business-event",
    ],
  },

  {
    slug: "a-file-turning-90-days-old-isnt-a-business-event",
    title: "A file turning 90 days old isn't a business event.",
    description:
      "Why infrastructure-driven lifecycle rules often fail to reflect the real business and governance state of enterprise information.",
    excerpt:
      "Infrastructure-driven lifecycle rules often fail to reflect the actual business state of information.",
    category: "DATA STRATEGY",
    author: "Savartus",
    publishedDate: "2026-09-29",
    readingTime: "5 min read",
    status: "draft",

    sections: [
      {
        paragraphs: [
          "Ninety days is a useful number for a storage policy.",
          "It is easy to understand. Easy to configure. Easy to automate.",
          "But when the clock reaches day 90, what exactly happened to the information?",
        ],
      },
      {
        heading: "Usually, nothing happened",
        paragraphs: [
          "The business value may be unchanged. The retention requirement may be unchanged. The security classification may be unchanged. The information may still be part of an active case, project, customer relationship, analytical workload, or regulatory obligation.",
          "Only one thing changed: the timestamp.",
          "That is an infrastructure event, not necessarily an information event.",
        ],
      },
      {
        heading: "Storage policies became lifecycle policies",
        paragraphs: [
          "Many lifecycle practices evolved from the needs of storage infrastructure. Expensive performance capacity had to be protected, so older or less frequently accessed data was moved to less expensive tiers.",
          "That is a legitimate storage optimization technique.",
          "The problem begins when that operational mechanism becomes the organization's definition of the information lifecycle itself.",
        ],
      },
      {
        heading: "A business event looks different",
        paragraphs: [
          "A contract expires. A legal hold is issued. A case closes. A regulatory retention period begins or ends. A dataset becomes training material for AI. A record becomes evidence. An information object is superseded by an authoritative replacement.",
          "Those are meaningful changes in context.",
          "They provide a much stronger basis for lifecycle decisions than the passage of an arbitrary number of days.",
        ],
      },
      {
        heading: "Use policy to connect context to action",
        paragraphs: [
          "The answer is not to abandon time-based rules. Age can be useful evidence and may be directly relevant to retention or operational policy.",
          "But it should be evaluated alongside identity, relationships, business value, risk, security, protection, compliance, availability, provenance, and other relevant context.",
          "Policy can then determine what should happen and why.",
        ],
      },
      {
        heading: "The goal is better decisions",
        paragraphs: [
          "The shift is subtle but important.",
          "Instead of moving information because it became old, move it because its requirements changed.",
          "That turns lifecycle management from a storage schedule into an information-governance capability.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Enterprise Data Lifecycle™ Specification",
        href: "/resources/dlm-specification",
        description:
          "See how governed state and policy-driven lifecycle transitions are defined.",
      },
      {
        label: "Explore Data Lifecycle Management",
        href: "/data-lifecycle-management",
        description:
          "Understand how Savartus evaluates information requirements continuously.",
      },
    ],

    relatedArticleSlugs: [
      "why-do-we-manage-data-based-on-its-birthday",
      "old-data-isnt-necessarily-cold-data",
    ],
  },

  {
    slug: "why-optical-storage-matters-again-in-the-ai-era",
    title: "Why optical storage matters again in the AI era.",
    description:
      "AI increases both the value and vulnerability of retained information, strengthening the case for durable and physically isolated preservation.",
    excerpt:
      "AI increases both the value and vulnerability of retained information, making durable and physically isolated preservation increasingly important.",
    category: "OPTICAL STORAGE",
    author: "Savartus",
    publishedDate: "2026-10-02",
    readingTime: "6 min read",
    status: "draft",

    sections: [
      {
        paragraphs: [
          "AI is changing the economics of retained information.",
          "Data that once appeared historical can become useful again as training material, analytical context, evidence, reference information, or input to new models.",
          "At the same time, the systems capable of extracting more value from information also make the integrity and trustworthiness of that information more important.",
        ],
      },
      {
        heading: "AI increases the value of what organizations keep",
        paragraphs: [
          "Organizations are discovering new uses for information they already possess.",
          "Historical video, documents, telemetry, transactions, images, research data, engineering files, and operational records can all become inputs to AI and advanced analytics.",
          "That creates a strong reason to preserve information that may have limited current activity but significant future value.",
        ],
      },
      {
        heading: "AI also increases the importance of trust",
        paragraphs: [
          "The usefulness of retained information depends on whether it can still be trusted.",
          "Was it altered? Is it complete? Can its provenance be established? Is the original still available? Can the organization distinguish a preserved source from a transformed or AI-generated derivative?",
          "Those questions move preservation from a simple capacity problem to an integrity problem.",
        ],
      },
      {
        heading: "Preservation benefits from physical separation",
        paragraphs: [
          "Modern infrastructure is highly connected by design. That connectivity improves performance and accessibility, but it also expands the pathways through which software errors, compromised credentials, malicious activity, or ransomware can affect information.",
          "Optical storage introduces a materially different preservation state. Information can be written to durable removable media and, when appropriate, placed offline and physically isolated from production systems.",
          "The objective is not to replace performance storage. It is to create a preservation layer with different operational characteristics.",
        ],
      },
      {
        heading: "Nearline and offline serve different purposes",
        paragraphs: [
          "Nearline optical libraries keep preserved information accessible through automated systems. Offline optical storage takes isolation further by removing media from continuously connected infrastructure.",
          "Those states can coexist within the same preservation architecture.",
          "Information that still requires convenient retrieval can remain nearline, while material requiring deeper isolation can move offline without abandoning a consistent management model.",
        ],
      },
      {
        heading: "The future may depend on the past",
        paragraphs: [
          "AI makes historical information more useful, but it also makes trustworthy source information more strategically important.",
          "Organizations therefore need to think beyond how cheaply they can retain data.",
          "The more valuable historical information becomes, the more important it is to preserve that information in a durable, understandable, and trustworthy state.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore Preservation",
        href: "/preservation",
        description:
          "See how Savartus uses nearline and offline optical storage for durable information preservation.",
      },
      {
        label: "Explore Enterprise Library Systems",
        href: "/products/els",
        description:
          "Review Savartus nearline and offline optical storage systems.",
      },
    ],

    relatedArticleSlugs: [
      "technology-changes-information-persists",
      "performance-and-preservation-should-work-together",
    ],
  },

  {
    slug: "performance-and-preservation-should-work-together",
    title: "Performance and preservation should work together.",
    description:
      "Active Archive separates performance requirements from preservation requirements so information can remain active without delaying long-term protection.",
    excerpt:
      "Important information should remain available on the right performance tier while being preserved on durable optical storage.",
    category: "ACTIVE ARCHIVE",
    author: "Savartus",
    publishedDate: "2026-10-06",
    readingTime: "5 min read",
    status: "draft",

    sections: [
      {
        paragraphs: [
          "Organizations are often forced to choose between two goals that should not be mutually exclusive.",
          "Keep information on fast storage so users and applications can access it, or move it to a preservation tier so it can be retained economically and durably.",
          "Active Archive changes that decision by separating performance from preservation.",
        ],
      },
      {
        heading: "Preservation does not need to wait",
        paragraphs: [
          "The traditional model often leaves information only on performance infrastructure during its active period.",
          "Preservation happens later, after usage declines or an age threshold is reached.",
          "That creates a period in which important information may be highly active but does not yet have an independent preservation copy.",
        ],
      },
      {
        heading: "Create the preserved state at ingest",
        paragraphs: [
          "In an Active Archive architecture, information can be written to a performance tier and to durable optical preservation as part of the same ingest process.",
          "The performance copy supports active workloads. The optical copy establishes the preserved state.",
          "The organization no longer has to wait for information to become inactive before preserving it.",
        ],
      },
      {
        heading: "Performance capacity can then follow usage",
        paragraphs: [
          "The active copy does not need to exist forever.",
          "As usage falls, policy can reduce or remove the performance copy while the preserved optical version remains available.",
          "If requirements change later, the preserved object can be restored back to performance storage.",
        ],
      },
      {
        heading: "Information state and storage state remain separate",
        paragraphs: [
          "This architecture reinforces an important lifecycle principle: the information's governed state does not have to be defined by its current storage tier.",
          "A preserved object can be active, archived, protected, or otherwise governed according to business requirements while its physical placement changes independently.",
          "Storage becomes an execution choice rather than the definition of the lifecycle.",
        ],
      },
      {
        heading: "The result is a different storage model",
        paragraphs: [
          "Performance storage is used because performance is required—not simply because the information has nowhere else to live.",
          "Preservation begins immediately rather than eventually.",
          "And when information activity changes, the infrastructure can change with it without sacrificing the preserved copy.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore Active Archive",
        href: "/active-archive",
        description:
          "See the Savartus architecture for combining performance and preservation.",
      },
      {
        label: "Active Archive as a Service",
        href: "/active-archive/service",
        description:
          "Explore Savartus-managed Active Archive infrastructure and economics.",
      },
    ],

    relatedArticleSlugs: [
      "why-optical-storage-matters-again-in-the-ai-era",
      "old-data-isnt-necessarily-cold-data",
    ],
  },

  {
    slug: "technology-changes-information-persists",
    title: "Technology changes. Information persists.",
    description:
      "Applications, platforms, and storage technologies change. Identity, context, provenance, relationships, and governance must persist with the information.",
    excerpt:
      "Applications, infrastructure, and media change. Information context, provenance, relationships, and governance must persist.",
    category: "INFORMATION MANAGEMENT",
    author: "Savartus",
    publishedDate: "2026-10-09",
    readingTime: "6 min read",
    status: "draft",

    sections: [
      {
        paragraphs: [
          "Enterprises routinely preserve files longer than they preserve the systems that created them.",
          "Applications are replaced. Databases are migrated. Storage platforms reach end of life. Employees leave. Vendors disappear. Formats evolve.",
          "The information remains.",
        ],
      },
      {
        heading: "Keeping the file is only the beginning",
        paragraphs: [
          "A file can be perfectly intact and still become difficult to understand.",
          "Who created it? Why was it created? What business process produced it? Which customer, project, case, system, or record does it relate to? What changed after it was created? Which version is authoritative?",
          "If those relationships disappear, preserving the bits may not preserve the meaning.",
        ],
      },
      {
        heading: "Context is part of preservation",
        paragraphs: [
          "Long-term preservation therefore has to include more than media durability.",
          "Identity, metadata, provenance, relationships, classifications, retention requirements, integrity evidence, and lifecycle history all contribute to whether information remains understandable and trustworthy.",
          "That context becomes increasingly important as the original application environment disappears.",
        ],
      },
      {
        heading: "Infrastructure should be replaceable",
        paragraphs: [
          "No storage technology lasts forever. No software platform should be expected to.",
          "A durable information architecture assumes that infrastructure will change and ensures that the information can survive those transitions.",
          "That means separating information identity and governance from any single application, storage system, or physical medium.",
        ],
      },
      {
        heading: "Preservation is a continuity problem",
        paragraphs: [
          "The goal is continuity across generations of technology.",
          "An organization should be able to move information from one storage platform to another, restore it into a new application environment, or make it available to future analytics while retaining the context needed to understand what the information is.",
          "The storage may change. The identity and history should not.",
        ],
      },
      {
        heading: "Design for the information, not the current platform",
        paragraphs: [
          "The longer information matters, the less reasonable it is to define that information by the system currently holding it.",
          "Applications are temporary. Infrastructure is temporary. Media is temporary.",
          "Important information needs an architecture designed to outlive all three.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore the Enterprise Data Lifecycle™",
        href: "/resources/dlm-specification",
        description:
          "See the architecture for identity, context, governance, policy, and lifecycle state.",
      },
      {
        label: "Explore Preservation",
        href: "/preservation",
        description:
          "See how Savartus preserves information independently of performance infrastructure.",
      },
    ],

    relatedArticleSlugs: [
      "why-optical-storage-matters-again-in-the-ai-era",
      "why-do-we-manage-data-based-on-its-birthday",
    ],
  },
];

export function getPublishedInsights() {
  return insightArticles.filter((article) => article.status === "published");
}

export function getInsightBySlug(slug: string) {
  return insightArticles.find(
    (article) =>
      article.slug === slug &&
      article.status === "published"
  );
}

export function getRelatedInsights(article: InsightArticle) {
  return article.relatedArticleSlugs
    .map((slug) => getInsightBySlug(slug))
    .filter((item): item is InsightArticle => Boolean(item));
}