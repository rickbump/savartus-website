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
  sourceLinks?: InsightLink[];
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
    publishedDate: "2026-09-30",
    readingTime: "5 min read",
    status: "published",

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
      "the-evidence-must-outlive-the-storage-system",
      "why-do-we-manage-data-based-on-its-birthday",
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

  {
    slug: "the-evidence-must-outlive-the-storage-system",
    title: "The Evidence Must Outlive the Storage System",
    description:
      "Why regulated evidence requires a different approach to storage and preservation, separating evidence management, operational access, and long-term preservation.",
    excerpt:
      "Servers, disk arrays, and applications change. Evidence still has to be identified, verified, retrievable, and understandable years later.",
    category: "DIGITAL EVIDENCE",
    author: "Savartus",
    publishedDate: "2026-09-30",
    readingTime: "14 min read",
    status: "published",

    sections: [
      {
        paragraphs: [
          "A county evidence unit may hold body-camera video, surveillance exports, interviews, photographs, forensic images, documents, and other digital evidence long after the investigation that created them has ended.",
          "Some evidence may need to remain available for years. Some for decades. During that time, servers will be replaced, disk arrays refreshed, applications upgraded or retired, storage vendors changed, and file formats may become obsolete.",
          "Yet the evidence must remain. What happens when evidence needs to outlive the storage system? The answer begins by separating three functions too often treated as one: evidence management, operational access, and long-term preservation.",
        ],
      },
      {
        heading: "The evidence-management system remains authoritative",
        paragraphs: [
          "An evidence-management system may maintain case numbers, evidence-item identifiers, custody events, legal holds, disclosure status, retention requirements, investigator activity, and other information associated with an investigation. A preservation architecture should complement, not replace, those functions.",
          "It should help answer where the bytes are, how they are protected, whether integrity can be verified, whether another recoverable copy exists if operational disk fails, whether the authoritative original can still be retrieved, and what happened to the object throughout its lifecycle.",
          "It can also help avoid keeping every closed-case object indefinitely on expensive high-performance storage simply because the evidence must continue to exist. This is where Active Archive and optical preservation become relevant.",
        ],
      },
      {
        heading: "Access and preservation are different requirements",
        paragraphs: [
          "During an active investigation, evidence may need fast access. Investigators search it, play video repeatedly, analyze forensic data, export files, or process evidence with analytical and AI systems. SSD and HDD storage make sense for this phase.",
          "After a case closes, access may decline dramatically while the retention requirement does not. An organization can find itself maintaining rarely accessed evidence on high-performance disk because it still has to exist.",
          "That conflates two questions: how quickly must information be accessed, and how long must it be preserved? They do not necessarily need the same storage answer.",
        ],
      },
      {
        heading: "Active Archive separates access from preservation",
        paragraphs: [
          "Consider an ELS-based Active Archive. Routine access to evidence can be served from SSD/HDD cache while each write automatically creates a second copy on write-once optical media. The operational copy is optimized for access; the optical copy is intended for preservation.",
          "For the ELS300, the disk cache server and optical library are integrated within the same appliance. Everyday access runs through the cache while evidence is automatically written to optical media. The evidence-management application remains authoritative, and the preservation architecture operates underneath it.",
          "If a cache drive fails or the disk estate is refreshed, the optical copy can provide another recovery source. As evidence becomes less frequently accessed, continued preservation need not depend exclusively on keeping that object on high-performance disk.",
          "The copy being used does not have to be the copy being preserved.",
        ],
      },
      {
        heading: "Immutability matters, but it is not chain of custody",
        paragraphs: [
          "Write-once optical storage provides an important characteristic for regulated evidence: after the preservation copy is written, it cannot simply be overwritten through normal storage operations. That can strengthen a preservation design.",
          "But a storage medium alone does not establish chain of custody. A defensible evidence process encompasses evidence identity, origin, integrity, custody and access events, applicable policies, and the ability to demonstrate what happened throughout its lifecycle.",
          "Federal Rule of Evidence 901 requires evidence sufficient to support a finding that an item is what its proponent claims. Rules 902(13) and 902(14) address certified records generated by electronic processes and certified data copied from electronic devices, storage media, or files. The Advisory Committee notes for Rule 902(14) discuss hash values as a way to establish that copied electronic data is identical to the original.",
          "Authentication does not automatically establish admissibility; other evidentiary requirements can still apply.",
        ],
      },
      {
        heading: "Build the preservation record",
        paragraphs: [
          "A strong evidence-preservation workflow begins when evidence is received, not years later when someone needs to retrieve it. Associate evidence with case and item identifiers. Record acquisition provenance. Calculate a cryptographic hash. Preserve the authoritative source. Record logical and physical storage locations and relevant preservation and access events.",
          "When an object is retrieved, check its integrity again. When it is migrated, perform another fixity check to demonstrate whether the information survived the migration unchanged.",
          "A stronger preservation model brings together identity, provenance, fixity, immutability, and audit history. SWGDE's Best Practices for Archiving Digital and Multimedia Evidence describes archiving as an active, ongoing combination of policies, procedures, infrastructure, tools, and personnel, not simply storage media.",
          "SWGDE identifies provenance information such as original source, circumstances of collection, physical and logical location, formats, fixity information, actions taken, relationships between original and transcoded objects, access history, and disposition. It also recommends an index that identifies what is stored and where it resides and supports integrity validation.",
        ],
      },
      {
        heading: "Hash it when it arrives. Verify it when it returns.",
        paragraphs: [
          "A cryptographic hash is most useful when verification is built into the evidence lifecycle, not merely calculated once: receipt and hashing, preservation and verification, retrieval and reverification, migration and reverification, and periodic integrity review.",
          "Federal Rule of Evidence 902(14)'s Advisory Committee notes recognize hash comparison as an established method for determining whether copied electronic data is identical to its original. SWGDE likewise includes fixity information among archive records and calls for verification as part of archive management, retrieval, and migration.",
          "Years after a case closes, an organization should not simply retrieve a file and assume nothing happened to it. It should be able to retrieve the preserved object and verify its integrity against previously recorded fixity information.",
        ],
      },
      {
        heading: "Preserve the original. Use the copy.",
        paragraphs: [
          "Surveillance and forensic evidence may arrive in proprietary packages containing video, metadata, indexes, timestamps, events, and application-specific information. Investigators may prefer an MP4 because it is easier to play. Both can have value.",
          "The original package preserves what was received from the source system. The normalized MP4 can provide a convenient representation for investigation, review, analytics, or disclosure. A preservation architecture should maintain the relationship from authoritative original to derived review copy rather than silently replacing the original.",
          "SWGDE recommends retaining information about original formats and maintaining a clear relationship between original and transcoded information, including how a derivative was created. When appropriate, it also discusses preserving the software or technical information necessary to render proprietary formats.",
          "This is about more than storage. It is about reproducibility. Years later, the organization can return to the authoritative source rather than depending exclusively on a derivative created by software that may no longer exist.",
        ],
      },
      {
        heading: "Long-term evidence has an economic problem",
        paragraphs: [
          "Preservation requirements can last much longer than performance requirements. Keeping every retained object indefinitely on SSD or continuously spinning HDD means operating infrastructure for performance that much of the information no longer requires. Drives, controllers, power, cooling, maintenance, failures, and periodic refresh all carry costs, and the information must move again when systems reach end of life.",
          "SWGDE recommends evaluating lifecycle cost for the complete storage environment rather than comparing media acquisition prices alone. Servers and associated hardware require power, cooling, maintenance, and periodic upgrades.",
          "Optical storage offers another economic model: frequently accessed evidence can remain cached on SSD/HDD while a preservation copy resides on write-once optical media. If evidence becomes active again, it can be restored to cache. Retention then need not mean paying indefinitely for performance that is no longer needed.",
        ],
      },
      {
        heading: "What about 100-year optical media?",
        paragraphs: [
          "Media longevity needs precise treatment. Not all optical media are the same. SWGDE's 2020 guidance discusses conventional CD-R, DVD-R, and Blu-ray and notes that life expectancy varies considerably with media formulation, environment, and handling. It cites certain formulations with life expectancy of up to 100 years under appropriate conditions while also warning about reader availability and technology obsolescence.",
          "Panasonic reported that its professional 300 GB Archival Disc used WORM (Write Once Read Many) media and had an estimated lifetime of 100 years or more at 30°C and 70% relative humidity based on accelerated testing. Panasonic separately described an optical archival system designed around an estimated data life exceeding 100 years.",
          "That is meaningful, but it is not a reason to write once and forget. Even if physical media remains intact, drives, interfaces, formats, software, and applications can become obsolete. SWGDE recommends planned media migration and ongoing fixity verification; for optical-media data retained over five years, its guidance recommends annual fixity checks and a planned migration schedule.",
          "The objective is not to find storage that never changes. It is to preserve evidence through the changes. Long-lived media can extend migration intervals and reduce dependence on continuously operating infrastructure, but preservation remains an active lifecycle process.",
        ],
      },
      {
        heading: "One appliance is not a disaster-recovery strategy",
        paragraphs: [
          "An ELS appliance containing disk cache and optical preservation provides copies across different storage technologies. A disk failure does not necessarily mean the preservation copy is lost. But if the cache and optical copy occupy the same appliance or physical location, they remain exposed to common risks such as fire, flood, theft, physical destruction, or a site-wide disaster.",
          "For evidence requiring geographic resilience, another copy should exist elsewhere. SWGDE recommends redundancy and preferably geographic dispersal, noting that a single copy presents high risk and recommending multiple copies, ideally using different media types and different locations.",
          "A suitable architecture might include a local operational cache, local write-once optical preservation, a second-site preservation copy, and offline preservation where risk warrants it. Copy count and location should follow the organization's risk model, retention requirements, and governing policies.",
        ],
      },
      {
        heading: "Offline preservation changes the cybersecurity equation",
        paragraphs: [
          "Continuously writable production storage exists in an active computing environment. Credentials can be compromised, administrative accounts abused, malware introduced, and users can make mistakes. An immutable preservation copy establishes another protection boundary.",
          "Offline optical preservation can create a stronger boundary by physically separating preservation media from online infrastructure. This creates a continuum: hot/cache for immediate operational access, online optical for write-once preservation with Active Archive accessibility, and offline optical for physical separation from online infrastructure.",
          "The information's storage state can change without changing its evidentiary identity. The evidence-management system can continue to know what the object is, which case it belongs to, and where it resides.",
        ],
      },
      {
        heading: "Legal holds must override routine disposition",
        paragraphs: [
          "Storage automation cannot blindly delete evidence because a predefined retention period expired. Litigation, court orders, legal holds, discovery obligations, records schedules, and agency policies may change what must happen to an object.",
          "Federal Rule of Civil Procedure 37(e), for example, addresses electronically stored information that should have been preserved in anticipation or conduct of litigation but was lost because reasonable preservation steps were not taken and cannot be restored or replaced through additional discovery. Its Advisory Committee notes recognize that preservation obligations may require intervention in routine information-system operations.",
          "The evidence-management, records-management, or governance system should determine whether information must be retained, held, released, or made eligible for disposition. The storage system executes those decisions. Governance determines what should happen; storage makes it happen.",
        ],
      },
      {
        heading: "Compliance is an architecture, not a storage feature",
        paragraphs: [
          "No storage appliance by itself makes an evidence environment compliant. Depending on the agency, information, jurisdiction, system boundary, funding source, and proceeding, requirements may include the FBI CJIS Security Policy, federal or state rules of evidence, discovery obligations, retention schedules, court orders, prosecutor requirements, agency policies, and other controls.",
          "For example, 28 CFR Part 23 applies in a specific criminal-intelligence context; it should not be generalized to every police evidence repository. Federal Rules of Evidence 901 and 902 address authentication, not whether a particular storage technology is inherently admissible.",
          "The meaningful question is not whether a storage appliance is evidence-compliant. It is how the architecture helps the organization satisfy the controls that apply to its evidence.",
        ],
      },
      {
        heading: "Design the workflow, not just the storage",
        paragraphs: [
          "The strongest regulated-evidence architecture begins with the workflow: receive, identify, hash, preserve, register, verify, access, retrieve, reverify, then migrate or dispose.",
          "Around that workflow, preserve case and item identifiers, acquisition provenance, original formats and derivatives, cryptographic hashes and algorithms, access and audit history, legal holds, retention requirements, logical and physical media locations, fixity history, migration history, tested restore procedures, and disposition authority.",
          "This reflects SWGDE's view of archive management as an ongoing combination of people, policy, practices, procedures, infrastructure, and tools that keeps evidence preserved, safeguarded, accessible, and usable throughout its lifecycle. An optical library is not simply somewhere to put old files; it is one component of a managed evidence-preservation architecture.",
        ],
      },
      {
        heading: "The evidence must outlive the infrastructure",
        paragraphs: [
          "The server will change. The disk array will change. The application may change. The storage vendor may change. Eventually, even preservation media may change.",
          "But years later, the organization should still be able to retrieve an object and establish: this is the evidence received; this is where it came from; this is the case and item it belongs to; this is how it was preserved; this is what happened to it; its integrity has been verified; and the authoritative evidence remains reproducible.",
          "That is a higher standard than simply saying, ‘We still have the file.’ It is the difference between storing evidence and deliberately preserving it.",
          "Technology changes. Evidence persists.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore Active Archive",
        href: "/active-archive",
        description:
          "See how operational access and durable preservation work together.",
      },
      {
        label: "Explore the ELS family",
        href: "/products/els",
        description:
          "Review nearline and offline optical preservation systems.",
      },
    ],

    sourceLinks: [
      {
        label: "Federal Rules of Evidence 901",
        href: "https://www.law.cornell.edu/rules/fre/rule_901",
        description: "Authentication and identification of evidence.",
      },
      {
        label: "Federal Rules of Evidence 902",
        href: "https://www.law.cornell.edu/rules/fre/rule_902",
        description:
          "Self-authentication, including electronic-process records and copied data.",
      },
      {
        label: "Federal Rule of Civil Procedure 37",
        href: "https://www.law.cornell.edu/rules/frcp/rule_37",
        description: "Electronically stored information and preservation duties.",
      },
      {
        label: "SWGDE 19-F-003, Version 1.0",
        href: "https://www.swgde.org/documents/published-complete-listing/19-f-003-swgde-best-practices-for-archiving-digital-and-multimedia-evidence/",
        description:
          "Best Practices for Archiving Digital and Multimedia Evidence.",
      },
      {
        label: "Panasonic Archival Disc announcement",
        href: "https://news.panasonic.com/global/press/data/2016/03/en160310-2/en160310-2.pdf",
        description:
          "Manufacturer-reported accelerated-test lifetime estimate and conditions.",
      },
      {
        label: "FBI CJIS Security Policy Resource Center",
        href: "https://le.fbi.gov/cjis-division-resources/cjis-security-policy-resource-center",
        description: "Current CJIS Security Policy resources.",
      },
      {
        label: "28 CFR Part 23",
        href: "https://www.ecfr.gov/current/title-28/chapter-I/subchapter-D/part-23",
        description: "Criminal intelligence systems operating policies.",
      },
    ],

    relatedArticleSlugs: [
      "performance-and-preservation-should-work-together",
      "technology-changes-information-persists",
    ],
  },

  {
    slug: "scientific-data-must-outlive-the-project",
    title: "Scientific Data Must Outlive the Project",
    description:
      "Research datasets can support validation, longitudinal comparison, and future AI long after a grant or study ends. Their preservation needs to include the data, metadata, provenance, processing history, access limits, and a workable path to reuse.",
    excerpt:
      "A grant can end while its data becomes more valuable. Preserve the original observations and the context future researchers need to validate, compare, and responsibly reuse them.",
    category: "SCIENTIFIC DATA",
    author: "Savartus",
    publishedDate: "2026-10-01",
    readingTime: "11 min read",
    status: "published",

    sections: [
      {
        paragraphs: [
          "A research consortium combines decades of Earth-observation imagery with field measurements and clinical-study datasets. The original projects may be complete, but researchers still need to reproduce published findings, compare new observations against the historical record, and evaluate new AI methods.",
          "The challenge is not simply to keep files. Future researchers need to know what each object is, where it came from, how it was processed, what restrictions apply, and whether it can still be interpreted and verified.",
          "Scientific data must outlive the project that produced it—but the preservation design must fit the research, the data, and the obligations attached to each collection.",
        ],
      },
      {
        heading: "The grant ends. The research questions keep changing.",
        paragraphs: [
          "A completed grant may leave behind raw observations, processed products, calibration files, quality masks, code, lab measurements, documentation, and data derived from people. Some of that material supports published conclusions. Some may be valuable only when a later team combines it with new observations or a new method.",
          "If the only copy lives on a project server, an aging disk array, or with one investigator, technology turnover and staff changes can break the chain between a dataset and its scientific meaning. A later AI project may be able to use the bits but be unable to establish which instrument, protocol, model version, or preprocessing step produced them.",
          "Preservation has to retain the context needed to interpret and evaluate the data, not just the payload.",
        ],
      },
      {
        heading: "A 50-year Earth-observation record becomes new research material",
        paragraphs: [
          "The USGS Landsat Collection 2 provides Level-1 observations from Landsats 1–9 beginning in 1972, alongside later Level-2 and Level-3 science products. USGS has reprocessed the archive as methods and reference data improved, and publishes collection identifiers, metadata, product documentation, and reprocessing information.",
          "That long record lets researchers compare current conditions with earlier observations, build consistent time series, and develop analyses that were not foreseeable when the first scenes were acquired. The archive is a real example of scientific value accumulating over decades when source observations and processing context remain available.",
          "It is not a claim that ELS stores Landsat data. It illustrates why research teams may want a preservation architecture that can retain source data and versions while allowing future authorized users to locate and retrieve them.",
        ],
      },
      {
        heading: "Institutional and funded research: plan for sharing and retention",
        paragraphs: [
          "For NIH-funded or conducted research that generates scientific data, the NIH Data Management and Sharing Policy requires a Data Management and Sharing Plan and compliance with the plan approved by the relevant NIH Institute, Center, or Office. Shared data should be made accessible as soon as possible and no later than the associated publication or the end of the award/support period, whichever comes first.",
          "That policy does not require every dataset to be openly released. NIH recognizes that legal, ethical, privacy, technical, and other factors can limit sharing, and strongly encourages established repositories where practical. Investigators must account for consent, controlled access, tribal data governance where relevant, genomic-data policy, award terms, repository commitments, and institutional rules.",
          "For NSF-supported work, the applicable Proposal and Award Policies and Procedures Guide and award terms set expectations for sharing primary data and supporting materials within a reasonable time, with exceptions for privacy, confidentiality, field-specific concerns, and legitimate interests. NSF has issued supplements to PAPPG 24-1 that may apply based on award date, so the current award terms and policy version need review.",
          "In either case, storage capacity is only one line of a data-management plan. Teams also need named stewardship, repository or access arrangements, metadata, persistent identifiers, retention/disposition decisions, and funding for preservation and sharing activities.",
        ],
      },
      {
        heading: "Earth observation: preserve source, products, and processing lineage",
        paragraphs: [
          "A climate or land-use team may combine new satellite scenes with decades of prior imagery, field observations, and derived analytical products. To make comparisons meaningful, preserve the received observations alongside calibrated or analysis-ready products, quality masks, geospatial metadata, collection identifiers, processing versions, and documented transformations.",
          "A generated product should remain connected to the source observations and processing recipe that produced it. If a new algorithm reprocesses an archive, retain enough version and provenance information to distinguish the earlier result from the replacement and to reproduce either one when required.",
          "NASA and USGS have agency-specific scientific data policies and archive practices. Those are not interchangeable with one generic federal retention statute; project requirements can arise from a mission, data center, award, repository, or agency policy. The Landsat archive shows why continuity, reprocessing records, and standardized metadata matter for reuse.",
        ],
      },
      {
        heading: "Clinical and human-participant research: protect access as well as longevity",
        paragraphs: [
          "A medical research center may retain study datasets, images, and supporting records for future approved analysis. Requirements depend on the study type and records involved. Consent, IRB protocol, award conditions, sponsor contracts, institutional policy, and state law can all affect what must be retained and who may access it.",
          "The Common Rule at 45 CFR 46.115 sets a minimum retention period for specified IRB records: at least three years, and research-related IRB records for at least three years after completion. It is not a blanket three-year retention period for all scientific datasets.",
          "For covered investigational drug studies, 21 CFR 312.62(c) specifies retention periods for required investigator records tied to approval or discontinuation of the investigation. For covered investigational device studies, 21 CFR 812.140(d) defines retention for specified investigator and sponsor records in relation to investigation completion and regulatory submissions. These rules cover defined record classes and study contexts; other award, sponsor, contract, and institutional terms may extend retention.",
          "HIPAA applies to protected health information held or handled by covered entities and their business associates, not to every research institution or every de-identified dataset. Research use and disclosure may require authorization, an IRB or Privacy Board waiver, a limited-data-set agreement, or another permitted basis. Long-term preservation should maintain those access constraints and agreements rather than turn preservation into open publication.",
        ],
      },
      {
        heading: "AI reuse raises the value of provenance",
        paragraphs: [
          "Historical observations can become training inputs, validation sets, or comparison baselines for new AI systems. That reuse can be valuable, but only if the team can determine whether the data is appropriate for the task, what transformations have been applied, and whether access or consent conditions permit the intended use.",
          "Preserve the original dataset, labels, derived features, model and preprocessing versions, evaluation outputs, and links between each derivative and its source. Keep a record of access restrictions and data-use agreements so a future team does not treat technical availability as permission to reuse.",
          "The NIST AI Risk Management Framework is voluntary guidance, not a research-data regulation or certification. It can help teams think about traceability, data quality, governance, and risk when datasets are reused in AI development and evaluation.",
        ],
      },
      {
        heading: "An archive is not a repository or a research information system",
        paragraphs: [
          "A scientific archive tier can help retain large source collections and make them retrievable over time. It does not automatically provide a domain repository, DOI registration, searchable scientific catalog, participant-consent enforcement, laboratory information management, validated clinical workflow, or publication-quality metadata.",
          "A useful architecture connects those systems: repository or research-management tools govern discovery, description, sharing, and access; policy defines who may use the data and for what; storage services hold and protect the objects; preservation procedures verify integrity and plan for migration.",
          "For ELS environments, oRain can manage object and media-location awareness across networked libraries. Integrations should use interfaces supported by the research, repository, and storage systems involved; system-specific design and validation remain part of implementation.",
        ],
      },
      {
        heading: "Design for revalidation, not just retention",
        paragraphs: [
          "A practical preservation workflow is: receive and identify the data; retain its source and required metadata; record a cryptographic fixity value; create the preservation copy; preserve access restrictions and data-use terms; periodically verify integrity; test retrieval; and document any migration or transformation.",
          "For each dataset, identify a responsible steward, authoritative version, repository or discovery record, allowed uses, retention trigger, review date, restore procedure, and disposition authority. Where long-term reproducibility matters, retain processing code, parameters, calibration references, and software or format information alongside the outputs.",
          "Maintain redundancy appropriate to the risk. An online optical copy can complement performance storage, while an offline copy can add physical separation. Copies in one device or one facility do not provide geographic disaster recovery; the number and placement of copies should reflect project, institution, funder, and risk requirements.",
        ],
      },
      {
        heading: "Preserve the evidence behind the next discovery",
        paragraphs: [
          "Research records often become more useful when joined to later observations, new measurements, or better analytical tools. The Landsat archive demonstrates how continuity across decades can support questions that could not be fully formed when the original data was collected.",
          "A strong preservation design keeps observations findable, interpretable, verifiable, and appropriately governed as media, software, teams, and analytical methods change. For clinical data, it also preserves the restrictions that protect participants. For AI reuse, it retains the provenance and version links needed to explain where training and evaluation material came from.",
          "The goal is not simply to keep research data. It is to keep enough of the research record for future teams to understand what they have, establish what they are allowed to do with it, and determine whether a result can be reproduced.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore Preservation",
        href: "/preservation",
        description:
          "See how nearline and offline optical storage can support long-lived information preservation.",
      },
      {
        label: "Explore Enterprise Library Systems",
        href: "/products/els",
        description:
          "Review online and offline ELS options for research archives at different scales.",
      },
      {
        label: "Explore Active Archive",
        href: "/active-archive",
        description:
          "Separate operational performance needs from long-term preservation needs.",
      },
    ],

    sourceLinks: [
      {
        label: "NIH Data Management and Sharing Policy",
        href: "https://grants.nih.gov/grants/guide/notice-files/NOT-OD-21-013.html",
        description:
          "Policy scope, data-management plans, sharing timing, and justified limitations.",
      },
      {
        label: "NSF PAPPG 24-1, Chapter XI.D.4",
        href: "https://www.nsf.gov/policies/pappg/24-1/ch-11-other-post-award-requirements#ch11D4",
        description:
          "NSF award dissemination and sharing expectations; check current supplements and award terms.",
      },
      {
        label: "USGS Landsat Collection 2",
        href: "https://www.usgs.gov/landsat-missions/landsat-collection-2",
        description:
          "Collection coverage, product levels, metadata, and reprocessing information.",
      },
      {
        label: "The 50-Year Landsat Collection 2 Archive",
        href: "https://doi.org/10.1016/j.srs.2023.100103",
        description:
          "Peer-reviewed description of the long-running Landsat archive.",
      },
      {
        label: "45 CFR 46.115, Common Rule IRB records",
        href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-46/subpart-A/section-46.115",
        description:
          "Retention requirements for specified IRB records, not all research data.",
      },
      {
        label: "21 CFR 312.62(c), investigational drug records",
        href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-312/subpart-D/section-312.62",
        description:
          "FDA investigator record-retention rule for covered drug investigations.",
      },
      {
        label: "21 CFR 812.140(d), investigational device records",
        href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-H/part-812/subpart-G/section-812.140",
        description:
          "FDA investigator and sponsor record-retention rule for covered device studies.",
      },
      {
        label: "HHS HIPAA Privacy Rule overview",
        href: "https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html",
        description:
          "Covered entities, business associates, protected health information, and research uses.",
      },
      {
        label: "45 CFR 164.512(i), HIPAA research uses and disclosures",
        href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.512",
        description:
          "Conditions for certain research uses and disclosures of protected health information.",
      },
      {
        label: "NIST AI Risk Management Framework 1.0",
        href: "https://www.nist.gov/itl/ai-risk-management-framework",
        description:
          "Voluntary guidance for managing AI risks and supporting trustworthy data use.",
      },
    ],

    relatedArticleSlugs: [
      "technology-changes-information-persists",
      "performance-and-preservation-should-work-together",
    ],
  },

  {
    slug: "long-term-digital-retention-with-els100",
    title: "Long-Term Digital Retention with ELS100",
    description:
      "A dedicated optical preservation tier for organizations that need important digital information to remain protected for years or decades, without keeping every retained file on high-performance storage.",
    excerpt:
      "Preserve completed projects, records, research, and intellectual property on a compact optical library after routine access declines—while keeping records governance, access controls, and migration planning in place.",
    category: "DIGITAL PRESERVATION",
    author: "Savartus",
    publishedDate: "2026-10-01",
    readingTime: "7 min read",
    status: "published",

    sections: [
      {
        paragraphs: [
          "Not every long-term retention requirement involves petabytes of data. Organizations of every size have documents, records, images, research data, intellectual property, completed projects, historical information, and other digital assets that must remain protected after routine access declines.",
          "Keeping all of that information indefinitely on SSD or continuously spinning HDD can mean ongoing power and cooling costs, hardware refreshes, and repeated migrations for data that may be rarely accessed.",
          "The Savartus ELS100 provides a compact, dedicated online optical preservation tier for important information that needs to remain retained and retrievable without a rack-scale library.",
        ],
      },
      {
        heading: "Preserve what matters",
        paragraphs: [
          "Selected information can be written to optical media and managed as a long-term preservation copy. Optical media does not require power simply to retain the recorded information, unlike continuously operating disk storage.",
          "The ELS100 is an online optical library, not the integrated-cache appliance offered by ELS150 and ELS300. Where active workloads need cache-backed access, pair ELS100 with a separate SSD/HDD performance tier or existing storage environment. Keep frequently accessed information on storage designed for active use; preserve long-lived information on storage selected for preservation.",
          "Write-once behavior, media type, and supported workflow should be confirmed for the specific media and system configuration. Optical preservation helps create a distinct preservation copy, but it does not remove the need for retention governance, access controls, fixity checks, tested retrieval, or media and reader migration planning.",
        ],
      },
      {
        heading: "Designed for long-lived information",
        paragraphs: [
          "An ELS100 retention tier can support business and financial records, completed project files, intellectual property, research data, engineering documents, images and media, historical records, reference datasets, and other material with a continuing retention requirement.",
          "As routine access declines, preserved information need not occupy scarce high-performance capacity for its entire retention life. It remains managed and retrievable through the surrounding storage and information-management workflow when staff have an authorized reason to access it.",
        ],
      },
      {
        heading: "Retention without enterprise-scale complexity",
        paragraphs: [
          "The ELS100 brings optical preservation to departments, small organizations, branch locations, laboratories, and professional offices whose collections are important but do not require a large automated library.",
          "Its role is intentionally focused: provide a compact online optical library for a dedicated preservation tier. That gives ELS100 a distinct place alongside ELS150 and ELS300, which combine organizational storage, an integrated cache server, and automatic optical second-copy creation in one appliance.",
        ],
      },
      {
        heading: "Real requirements come from the record and the organization",
        paragraphs: [
          "There is no single U.S. retention period that applies to every document, dataset, or organization. The retention authority may be an approved records schedule, contract, grant or repository commitment, regulation, legal hold, or institutional policy. A storage tier should execute and support those decisions, not invent them.",
          "For U.S. Federal agencies, 36 CFR Part 1236 requires electronic-record controls for reliability, authenticity, integrity, usability, content, context, and structure. Agencies must plan to keep records retrievable and usable for their NARA-approved retention periods and plan migration when records outlive the system. These rules apply to Federal agencies managing Federal records; they should not be generalized to every private organization or state/local entity.",
          "For specified SEC-regulated broker-dealers and exchange members, 17 CFR 240.17a-4 defines preservation periods for particular records and permits electronic recordkeeping through either a non-rewriteable, non-erasable format or a compliant time-stamped audit-trail system, subject to access, production, redundancy, and other conditions. An optical library by itself does not establish compliance with the full rule.",
          "For HIPAA-covered entities and business associates subject to the Security Rule, 45 CFR 164.316 requires retention of specified security policies, procedures, and documented actions or assessments for six years from creation or when last in effect, whichever is later. This is not a general six-year medical-record or PHI retention mandate.",
          "ISO 14721, the Open Archival Information System (OAIS) Reference Model, offers a conceptual framework for thinking about archival information packages, preservation description, access, and long-term planning. It is a reference model, not a regulation or an ELS100 product certification.",
        ],
      },
      {
        heading: "A practical preservation workflow",
        paragraphs: [
          "Begin by identifying which record series or project is being preserved, its owner, authoritative source, approved retention schedule, restrictions, and disposition authority. Preserve descriptive and administrative metadata that allows staff to find the object and understand its context.",
          "Define how content is ingested, how integrity is checked at receipt and retrieval, who may access or export it, how legal holds suspend ordinary disposition, and how restore tests and media migration are documented. Preserve relationships among source files, derived copies, and related records.",
          "For federal records, Part 1236 specifically treats storage media as only one part of electronic records management: recordkeeping controls, associated metadata, retrieval, access, disposition, and migration planning remain necessary. For other environments, apply the organization's governing schedule, award, regulation, and policy.",
        ],
      },
      {
        heading: "Preserve information beyond the system that created it",
        paragraphs: [
          "Applications, storage platforms, vendors, and media generations change. An important record may outlast all of them. A compact preservation tier can reduce reliance on keeping every long-retained file on continuously powered performance storage, while a defined stewardship process keeps the information discoverable and usable.",
          "Technology changes. Information persists.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore ELS100",
        href: "/products/els100",
        description:
          "See the compact online optical library for dedicated long-term preservation.",
      },
      {
        label: "Explore the ELS family",
        href: "/products/els",
        description:
          "Compare compact, enterprise-scale, and offline optical library options.",
      },
      {
        label: "Explore Preservation",
        href: "/preservation",
        description:
          "See how Savartus approaches durable nearline and offline preservation.",
      },
    ],

    sourceLinks: [
      {
        label: "36 CFR Part 1236, Electronic Records Management",
        href: "https://www.ecfr.gov/current/title-36/chapter-XII/subchapter-B/part-1236",
        description:
          "Federal-agency controls for electronic records, retrieval, migration, and disposition.",
      },
      {
        label: "NARA Records Management Regulations and Guidance",
        href: "https://www.archives.gov/records-mgmt/policy",
        description:
          "Federal records management laws, regulations, schedules, and guidance.",
      },
      {
        label: "17 CFR 240.17a-4, broker-dealer records",
        href: "https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.17a-4",
        description:
          "Record categories, retention periods, and electronic recordkeeping conditions for covered firms.",
      },
      {
        label: "45 CFR 164.316, HIPAA Security Rule documentation",
        href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.316",
        description:
          "Documentation requirements and the six-year retention provision for covered entities/business associates.",
      },
      {
        label: "ISO 14721, OAIS Reference Model",
        href: "https://public.ccsds.org/Pubs/650x0m2.pdf",
        description:
          "Open archival information system concepts for preservation planning and access.",
      },
    ],

    relatedArticleSlugs: [
      "scientific-data-must-outlive-the-project",
      "technology-changes-information-persists",
    ],
  },

  {
    slug: "medical-imaging-beyond-the-pacs-refresh-cycle",
    title: "Keep Imaging Records Beyond the PACS Refresh Cycle",
    description:
      "How a hospital can consider an optical preservation tier for less-frequently accessed imaging while keeping PACS retrieval, patient privacy, and record-retention duties in view.",
    excerpt:
      "A PACS storage decision is also a clinical retrieval and records-governance decision. Separate the performance tier from preservation without losing the path back to a prior study.",
    category: "HEALTHCARE DATA",
    author: "Savartus",
    publishedDate: "2026-10-01",
    readingTime: "7 min read",
    status: "published",

    sections: [
      {
        paragraphs: [
          "A regional hospital network sees imaging volume grow year after year. CT, MRI, radiography, ultrasound, and other studies accumulate in the Picture Archiving and Communication System (PACS). The primary storage tier approaches capacity, and another expansion or refresh is on the budget calendar.",
          "Yet older studies do not simply stop mattering. A clinician may need a prior image for comparison. A patient may return after years. A referral, audit, or legal request may require the record. The challenge is to manage the long tail of imaging without making the clinical retrieval path harder to use or weakening the recordkeeping process.",
        ],
      },
      {
        heading: "The problem is more than storage capacity",
        paragraphs: [
          "PACS capacity planning is tied to clinical workflow. The system must keep studies discoverable and return the correct images with the right patient, accession, study, and series context. A storage target that is inexpensive but difficult to query or recall can turn a capacity project into a clinical operations problem.",
          "Not every study has the same access pattern. Recent studies and frequently consulted priors may belong on the primary performance tier. Other studies may be accessed less often but still need to remain retained, indexed, protected, and retrievable through an approved workflow. That distinction should be driven by clinical and records requirements, not age alone.",
        ],
      },
      {
        heading: "Separate the preservation tier from the clinical system of record",
        paragraphs: [
          "A hospital could evaluate moving eligible, lower-access imaging into a managed preservation tier while leaving the PACS or vendor-neutral archive (VNA) responsible for clinical viewing, patient and study indexing, and the established user workflow. The design goal is not merely to copy files; it is to keep the route from a clinical search to the correct study understandable and testable.",
          "ELS150 and ELS300 combine an integrated disk cache server with automatic creation of a write-once optical copy, which suits a single facility or department. A larger imaging network can instead pair its existing performance storage with scale-out ELS libraries, such as ELS500 or ELS4000, managed as one namespace through oRain. Either architecture should be evaluated against the hospital's capacity, throughput, access, and retention requirements. The systems are storage products, not PACS or VNA replacements. Do not assume a direct integration: confirm the PACS/VNA vendor's supported archive interface, DICOM conformance, metadata mapping, recall behavior, and service levels for the proposed configuration.",
          "Before migrating production studies, test representative modalities and study sizes, concurrent recalls, time-to-first-image and full-study retrieval, failure recovery, and behavior when records are corrected, held, or approved for disposition. Keep any existing backup and geographically separate disaster-recovery strategy; a cache and optical copy in one appliance and location are not geographic redundancy.",
        ],
      },
      {
        heading: "Preserve the study context, not only image files",
        paragraphs: [
          "Imaging preservation depends on retaining the object together with the identifiers and metadata needed to discover, interpret, and return it correctly. The implementation should account for patient and study identifiers, accession numbers, modality, series relationships, relevant metadata, and the PACS/VNA index. Define which system is authoritative for each element and how a recalled study is reconciled with the clinical workflow.",
          "DICOM is the principal standard family used to define medical-imaging information objects and exchange services. It supports interoperability, but citing DICOM does not prove a particular system integration works, certify the storage appliance, or establish a retention period. Review current conformance statements for the actual products and validate the specific store, query, retrieve, and lifecycle operations end to end.",
          "The preservation plan should also include integrity checks at ingest and retrieval, documented authorization and audit paths, test recalls, migration of media and readers, and a process for legal holds and authorized disposition. Verify these capabilities across the complete solution; do not infer them from the storage medium alone.",
        ],
      },
      {
        heading: "Regulatory requirements depend on the hospital and record",
        paragraphs: [
          "For hospitals subject to the Medicare hospital Conditions of Participation, 42 CFR 482.24 requires medical records to be retained in their original or legally reproduced form for at least five years. It also requires records to be accessible and a coding and indexing system that supports timely retrieval. Whether a particular imaging object is part of the covered medical record, and whether a longer period applies, must be assessed in context. This rule does not require optical storage or prescribe a specific PACS architecture.",
          "HIPAA is also relevant, but its requirements should not be misstated as a universal imaging-retention period. Covered entities and business associates handling electronic protected health information must apply the HIPAA Security Rule safeguards to the applicable systems and workflows. The six-year retention requirement in 45 CFR 164.316 concerns required Security Rule documentation, such as policies, procedures, and documented actions or assessments. It is not a general six-year mandate for medical images or all protected health information.",
          "State medical-record laws, payer and contract terms, organizational schedules, special record categories, and legal holds may change the applicable period or process. The hospital's compliance, privacy, security, clinical informatics, and legal teams should identify which rules apply to each imaging class before setting archive or disposition policy.",
        ],
      },
      {
        heading: "A deployment workflow to validate",
        paragraphs: [
          "Start with a bounded pilot: one facility, modality, and study class. Establish the source of truth, approved retention schedule, clinical owner, security boundary, retrieval service levels, and conditions that suspend routine disposition. Document how the PACS/VNA index points to archived studies and how an authorized user gets them back.",
          "Then validate the actual interface with the relevant vendors. Test ordinary retrieval and unusual cases, verify identifiers and metadata, measure recall performance, confirm access and audit behavior, and run restore and integrity checks. Include failure handling and ensure a study under legal hold cannot be removed by routine lifecycle processing.",
          "Only after clinical and technical owners accept the workflow should the organization estimate how much eligible data can leave the primary tier, what access patterns the archive must support, and how costs compare with continued PACS expansion. The objective is a governed storage choice that preserves clinical usability, not a blanket instruction to move older studies offline.",
        ],
      },
      {
        heading: "Keep the path to the prior study intact",
        paragraphs: [
          "The value of a preserved image depends on more than the media that holds it. The hospital must be able to discover the right study, establish that the returned information is intact, authorize access, and put it back into the clinical workflow when needed.",
          "An optical preservation tier may be one part of that design. PACS interoperability, clinical retrieval, records governance, privacy, security, recovery, and long-term stewardship remain responsibilities of the complete system and its operators.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore ELS150",
        href: "/products/els150",
        description:
          "See the stand-alone active archive with integrated cache and automatic optical copy.",
      },
      {
        label: "Explore ELS300",
        href: "/products/els300",
        description:
          "See the rack-mount active archive with integrated cache and automatic optical copy.",
      },
      {
        label: "Explore Active Archive",
        href: "/active-archive",
        description:
          "See how performance access and preservation can work together.",
      },
    ],

    sourceLinks: [
      {
        label: "42 CFR 482.24, Hospital Medical Record Services",
        href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24",
        description:
          "Medicare hospital Conditions of Participation for medical record retention, accessibility, and retrieval indexing.",
      },
      {
        label: "45 CFR Part 164, HIPAA Security Rule",
        href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C",
        description:
          "Security safeguards for covered entities and business associates handling electronic protected health information.",
      },
      {
        label: "45 CFR 164.316, HIPAA Security Rule Documentation",
        href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.316",
        description:
          "The six-year retention requirement for specified Security Rule documentation, not a general medical-image retention period.",
      },
      {
        label: "DICOM Standard, Current Edition",
        href: "https://www.dicomstandard.org/current",
        description:
          "The current technical standard for medical-imaging information objects and exchange; not a retention regulation or product certification.",
      },
    ],

    relatedArticleSlugs: [
      "long-term-digital-retention-with-els100",
      "scientific-data-must-outlive-the-project",
    ],
  },

  {
    slug: "credit-union-ransomware-recovery-offline-copies",
    title: "Ransomware Recovery for Credit Unions: The Offline Copy",
    description:
      "How a federally insured credit union can include physically isolated optical media in a ransomware recovery plan, alongside clean rebuilds, tested restores, and incident reporting.",
    excerpt:
      "Network-connected backups may be exposed during a ransomware incident. A prepared, verified offline copy can add another recovery path, but only as part of a rehearsed recovery program.",
    category: "CYBER RESILIENCE",
    author: "Savartus",
    publishedDate: "2026-10-01",
    readingTime: "8 min read",
    status: "published",

    sections: [
      {
        paragraphs: [
          "A federally insured credit union is in the middle of a ransomware incident. Member-facing services are disrupted, administrators are isolating systems, and responders are determining which identities, servers, data, and backups can still be trusted. A backup repository that remains connected to production may have been visible to the same compromised accounts or management plane.",
          "Recovery now depends on more than having another copy. The team needs to know what to restore first, where a trustworthy copy is, whether it can be validated, and how to rebuild in a clean environment without reintroducing the compromise.",
        ],
      },
      {
        heading: "The recovery gap is the copy an attacker can reach",
        paragraphs: [
          "Ransomware operators may seek to encrypt or delete backups as well as production data. CISA therefore recommends maintaining offline, encrypted backups of critical data and regularly testing their availability and integrity in a disaster-recovery scenario. Those are resilience practices, not a guarantee against attack or a prescription to use any particular medium.",
          "A physically isolated copy can add separation from ordinary network credentials and services. Its usefulness depends on how it is created, verified, transferred, protected, and restored. A copy made after compromise may already contain corrupted or malicious content; a copy that has never been restored is an assumption, not a proven recovery path.",
        ],
      },
      {
        heading: "Where an offline optical library can fit",
        paragraphs: [
          "An ELS8000-OL or ELS10K-OL is a drive-less offline optical library. In the described workflow, selected data is written and verified on a compatible online ELS system, then approved optical media is physically transferred into the offline library. oRain can track the media location so staff can identify where the required recovery set resides.",
          "During a declared recovery, authorized personnel identify the needed media, follow the organization's custody and access procedure, mount it through a compatible online environment, validate the recovered data, and restore it into a clean and compatible recovery environment. The offline library is one layer in that design; it does not replace the credit union's backup platform, incident response capability, endpoint and identity security, clean system images, or geographically separate disaster recovery.",
          "Recovery-point objective depends on how frequently data is copied, verified, and transferred offline. Recovery-time objective depends on the size and priority of the data set, media retrieval and mount workflow, available online systems, network capacity, staff readiness, and the order in which dependent services are rebuilt. Neither objective follows automatically from using optical media.",
        ],
      },
      {
        heading: "Make recovery a practiced operational workflow",
        paragraphs: [
          "Start with a prioritized inventory of member services, supporting applications, data stores, identity systems, encryption keys, network services, and external dependencies. Identify which records and configurations are needed to rebuild each service, who approves each recovery step, and what can be restored while systems remain isolated.",
          "Set copy frequency and recovery-point objectives for each data class. Record the source and timestamp of each copy, integrity-check results, media identifier and location, encryption and key-handling requirements, custody events, and any known exclusions. Keep malware investigation evidence and security logs according to the incident plan; do not treat backup media as the sole evidence record.",
          "Exercise the whole path on a schedule: select a recovery set, retrieve its media, validate contents and dependencies, restore into a clean test environment, measure elapsed time, and document what failed or was missing. Include scenarios where a media item is unavailable, the online ELS or oRain management environment is unavailable, credentials must be rotated, or a service must be rebuilt from clean images before data is restored.",
        ],
      },
      {
        heading: "Regulatory duties are separate from the storage design",
        paragraphs: [
          "Under 12 CFR 748.1(c), each federally insured credit union must notify the appropriate NCUA-designated point of contact of a reportable cyber incident as soon as possible and no later than 72 hours after the credit union reasonably believes it has experienced the incident, subject to the provision's specific third-party timing rule. The regulation defines which incidents are reportable. The notification clock is not a recovery-time objective, and the rule does not require offline optical storage.",
          "NCUA Part 748, Appendix A provides guidelines for safeguarding member information, including a security program based on risk assessment, safeguards, service-provider oversight, and an incident-response program. Credit unions should assess those requirements against their full environment, service providers, and established response procedures. An ELS appliance does not constitute the security program or certify compliance.",
          "Other duties may also apply, including state breach-notification laws, contractual or insurance terms, and obligations to members or other regulators. Determine incident reportability, evidence-preservation needs, and required notices with the credit union's legal, compliance, and incident-response leads. CISA's #StopRansomware Guide and NIST's Cybersecurity Framework 2.0 are useful voluntary guidance; they are not regulations or product certifications.",
        ],
      },
      {
        heading: "A recovery copy is useful only if the team can get back",
        paragraphs: [
          "Physical isolation can reduce exposure to network-based compromise, but it does not establish that a copy is clean, complete, current, or compatible with the systems that need it. It does not by itself provide geographic redundancy, protect encryption keys, define service priorities, or prove that member services can be restored within required business targets.",
          "The defensible claim is narrower and more useful: a prepared and tested offline copy can provide another recovery source outside normal network access. The organization must supply the governance, security controls, custody, validation, clean rebuild, and practiced restore process that make that source operationally useful.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore ELS8000-OL",
        href: "/products/els8000-ol",
        description:
          "See the physically isolated, drive-less optical library for enterprise-scale preservation.",
      },
      {
        label: "Explore ELS10K-OL",
        href: "/products/els10k-ol",
        description:
          "See the mass-capacity offline optical preservation system.",
      },
      {
        label: "Explore Preservation",
        href: "/preservation",
        description:
          "See how online and physically isolated preservation tiers can work together.",
      },
    ],

    sourceLinks: [
      {
        label: "12 CFR 748.1(c), NCUA Cyber Incident Reporting",
        href: "https://www.ecfr.gov/current/title-12/chapter-VII/subchapter-A/part-748/section-748.1",
        description:
          "Scope and timing for federally insured credit unions' notification of reportable cyber incidents.",
      },
      {
        label: "NCUA Part 748, Appendix A, Safeguarding Member Information",
        href: "https://www.ecfr.gov/current/title-12/chapter-VII/subchapter-A/part-748/appendix-Appendix%20A%20to%20Part%20748",
        description:
          "Guidelines for member-information security programs, safeguards, service-provider oversight, and incident response.",
      },
      {
        label: "CISA #StopRansomware Guide",
        href: "https://www.cisa.gov/stopransomware/ransomware-guide",
        description:
          "Voluntary guidance recommends offline backups and regular availability and integrity testing as part of recovery preparation.",
      },
      {
        label: "NIST Cybersecurity Framework 2.0",
        href: "https://www.nist.gov/cyberframework",
        description:
          "Voluntary framework for understanding and managing cybersecurity risk across governance, protection, response, and recovery.",
      },
    ],

    relatedArticleSlugs: [
      "the-evidence-must-outlive-the-storage-system",
      "long-term-digital-retention-with-els100",
    ],
  },

  {
    slug: "compliance-retention-right-information-right-time",
    title: "Compliance Retention: The Right Information, for the Right Time",
    description:
      "How regulated organizations can separate retention policy from storage infrastructure, using online, lower-activity, and offline optical preservation while records systems remain authoritative for classification, holds, and disposition.",
    excerpt:
      "Retention is a policy decision. Storage should execute the policy—without keeping every retained record on infrastructure built for active workloads.",
    category: "COMPLIANCE RETENTION",
    author: "Savartus",
    publishedDate: "2026-10-02",
    readingTime: "8 min read",
    status: "published",

    sections: [
      {
        paragraphs: [
          "A regulated organization retains contracts, financial records, transaction data, communications, audit records, reports, and other business information under different regulatory, legal, contractual, and internal retention requirements.",
          "Some records remain active. Others may not be accessed for years but still must remain protected, retrievable, and verifiable.",
          "Keeping all retained information indefinitely on high-performance SSD or continuously spinning HDD ties the cost of retention to infrastructure designed for active workloads. Savartus separates the two.",
        ],
      },
      {
        heading: "Retention follows policy",
        paragraphs: [
          "The organization's records-management, governance, or application systems remain authoritative for record classification, retention schedules, legal holds, access controls, and disposition authority. Savartus provides the storage and preservation layer beneath them.",
          "Information can move between storage states as its access requirements change without changing its retention obligations. Active information can remain on high-performance storage. Retained information can move to online preservation. Long-term information can move to lower-activity preservation. Information requiring isolation can move to offline preservation. When retention is complete, it becomes eligible for authorized disposition.",
          "The result is a retention architecture in which information does not have to remain on expensive active storage simply because it must continue to exist. A change in storage state is not a change in retention state: a record held for litigation stays held whether it resides on disk, online optical media, or offline media.",
        ],
      },
      {
        heading: "Immutability where it matters",
        paragraphs: [
          "For information requiring protection against modification, a write-once optical preservation copy creates an independent immutable version of the retained object. The operational copy can remain accessible and writable where appropriate. The preservation copy remains protected.",
          "The copy being used does not have to be the copy being preserved.",
          "Immutability is one control within the larger retention architecture. Compliance can also depend on classification, identity, metadata, access controls, audit history, legal holds, integrity verification, retrieval, and authorized disposition. A write-once copy that cannot be found, verified, or tied back to its record class does not satisfy a retention obligation by itself.",
        ],
      },
      {
        heading: "One retention model, multiple scales",
        paragraphs: [
          "Stand-alone systems: for departmental, branch, professional-office, laboratory, and smaller retention environments, an online optical library such as ELS100 provides a dedicated preservation tier for important long-lived information, paired with separate performance storage where active access is needed.",
          "Integrated Active Archive systems: for environments requiring routine access alongside preservation, ELS150 and ELS300 combine an SSD/HDD cache for the operational tier with write-once optical storage that maintains an independent preservation copy in the same appliance.",
          "Enterprise and offline systems: larger environments can scale preservation across networked optical libraries managed through oRain. Information requiring deeper protection can transition to drive-less offline libraries, such as ELS8000-OL and ELS10K-OL, for greater physical isolation while remaining governed by its retention policy and tracked by media location.",
          "The retention model stays the same across these deployments. What changes is the scale of the archive, how frequently information is accessed, and how much physical isolation the organization's risk assessment requires.",
        ],
      },
      {
        heading: "Potential applicability: requirements depend on the organization and record class",
        paragraphs: [
          "SEC recordkeeping requirements: Rule 17a-4 includes electronic-recordkeeping requirements for covered broker-dealers. Current rules permit qualifying electronic recordkeeping through either a write-once, read-many (WORM) approach or an audit-trail alternative. Write-once storage should therefore be positioned as an available architectural control, not as automatic SEC compliance.",
          "Federal records management: federal agencies must manage records under NARA-approved records schedules. Those schedules determine whether records are temporary or permanent, and when temporary records may be destroyed or permanent records transferred for preservation.",
          "FDA-regulated electronic records: for covered FDA-regulated activities, the applicable predicate rules determine which records must be maintained and for how long. 21 CFR Part 11 electronic-record controls should be evaluated alongside the specific underlying regulatory requirement, not in isolation.",
          "HIPAA-required documentation: the HIPAA Security Rule requires certain required documentation to be retained for six years from creation or when it was last in effect, whichever is later. That requirement should not be generalized into a six-year retention period for all healthcare or medical records.",
          "Also assess state records laws, industry-specific requirements, contracts, litigation holds, privacy obligations, organizational retention schedules, and other applicable requirements. No storage appliance by itself makes an organization compliant.",
        ],
      },
      {
        heading: "Workflow design",
        paragraphs: [
          "Choose one record class and map its lifecycle: classify, assign policy, preserve, verify, retain, hold if required, reevaluate, authorize, and then dispose or preserve permanently.",
          "For each retained object or record class, determine its owner, governing policy, retention trigger, retention period, required accessibility, immutability requirements, legal-hold status, integrity-verification process, preservation location, and disposition authority.",
          "Then test the path end to end: confirm the preservation copy was written and verified, retrieve a record after it has moved to a lower-activity or offline state, confirm a legal hold prevents routine disposition, and document who authorized each disposition decision.",
        ],
      },
      {
        heading: "Keep the right information",
        paragraphs: [
          "The goal is not to keep everything forever. It is to keep the right information, for the right reason, for the right amount of time.",
          "Retention is a policy decision. Storage should execute the policy.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore the ELS family",
        href: "/products/els",
        description:
          "Compare stand-alone, integrated Active Archive, enterprise, and offline optical systems.",
      },
      {
        label: "Explore Data Lifecycle Management",
        href: "/data-lifecycle-management",
        description:
          "See how policy, not age, can drive lifecycle and storage decisions.",
      },
      {
        label: "Explore Preservation",
        href: "/preservation",
        description:
          "See how online and physically isolated preservation tiers work together.",
      },
    ],

    sourceLinks: [
      {
        label: "17 CFR 240.17a-4, broker-dealer records",
        href: "https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.17a-4",
        description:
          "Record categories, retention periods, and electronic-recordkeeping options for covered broker-dealers.",
      },
      {
        label: "NARA: Scheduling Records",
        href: "https://www.archives.gov/records-mgmt/scheduling/sch-records",
        description:
          "How federal records schedules determine temporary and permanent records and their disposition.",
      },
      {
        label: "21 CFR Part 11, FDA electronic records",
        href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11",
        description:
          "Electronic-record and electronic-signature controls for records required by FDA predicate rules.",
      },
      {
        label: "45 CFR 164.316, HIPAA Security Rule documentation",
        href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.316",
        description:
          "Six-year retention of required Security Rule documentation, not all medical records.",
      },
    ],

    relatedArticleSlugs: [
      "long-term-digital-retention-with-els100",
      "the-evidence-must-outlive-the-storage-system",
    ],
  },

  {
    slug: "government-records-public-access-permanent-preservation",
    title: "Public Records That Outlive the System That Created Them",
    description:
      "How state, local, and federal agencies can keep retained and permanent records findable for public-records requests and ready for archival transfer, without keeping them on primary storage for decades.",
    excerpt:
      "A deed recorded today may be requested in fifty years. The record has to survive every system refresh in between, and still be found on deadline.",
    category: "GOVERNMENT RECORDS",
    author: "Savartus",
    publishedDate: "2026-10-02",
    readingTime: "8 min read",
    status: "published",

    sections: [
      {
        paragraphs: [
          "A county clerk and recorder holds deeds, mortgages, plats, and liens going back more than a century. The planning department keeps permits, inspections, and GIS layers. The council keeps minutes, ordinances, and resolutions. Much of it has been scanned from paper books; much more was born digital in systems that have since been replaced.",
          "Some of these series are permanent. Others are kept for years under the state's approved retention schedule. Either way, the public can request them, and the agency must find, review, and produce the right record within the period set by law.",
          "The challenge is not storing today's records. It is keeping records findable, readable, and trustworthy across decades of system replacements, without paying to keep every permanent record on primary disk forever.",
        ],
      },
      {
        heading: "Public records carry two obligations at once",
        paragraphs: [
          "The first is retention. Approved schedules decide whether a record series is temporary or permanent, how long temporary records are kept, and when they may be destroyed or transferred. For state and local governments, schedules are typically issued or approved by the state archives or a state records commission. For federal agencies, they are approved by NARA.",
          "The second is access. State public-records acts, and FOIA for federal executive-branch agencies, give the public a right to request records and set deadlines and exemptions for responding. A record that is retained but cannot be located, retrieved, and reviewed in time does not meet the access obligation.",
          "A preservation architecture has to serve both: keep the record intact for as long as the schedule requires, and keep it discoverable for as long as it can be requested.",
        ],
      },
      {
        heading: "Separate access from preservation",
        paragraphs: [
          "Most requests and daily work touch recent records. Older and permanent series are opened less often but cannot be lost. Keeping all of it on high-performance disk ties the cost of permanence to infrastructure designed for active workloads and forces a migration every time that infrastructure is refreshed.",
          "The agency's records-management or document-management system remains authoritative for record series, schedules, legal holds, redaction, and disclosure decisions. ELS provides the preservation layer underneath. Active files stay on performance storage. Retained and permanent records are written to write-once optical media that remain indexed and retrievable through oRain.",
          "A smaller agency or a single department might use an integrated Active Archive system such as ELS150 or ELS300, which combines cache and an automatic optical copy in one appliance. A state agency or large county can scale across networked ELS libraries in one namespace. Where physical isolation is warranted, verified media can move to an offline library while its location remains tracked.",
        ],
      },
      {
        heading: "Answering the request on deadline",
        paragraphs: [
          "A preservation tier helps with public-records requests only if the request can actually reach it. That depends on what is preserved alongside the content: record series, identifiers, dates, parties, parcel or case numbers, and other descriptive metadata the records system uses to search.",
          "Test this before it matters. Run a mock request against a series that has been moved to preservation, time how long it takes to locate, retrieve, and stage the records for exemption review, and compare that with the statutory response period. If retrieval from optical media is slower than from disk, plan for it in the request workflow rather than discovering it on deadline.",
          "Redaction, exemption decisions, and release remain functions of the records system and the agency's staff. The preservation copy should stay unaltered; redacted release copies are separate derivatives.",
        ],
      },
      {
        heading: "Permanent means planning for change",
        paragraphs: [
          "Write-once optical media protects a preserved copy against alteration and removes the need to rewrite permanent records on every disk refresh. It does not remove the need to plan for change over decades.",
          "Permanent electronic records should be kept in open or well-documented formats, with the metadata needed to interpret them, periodic fixity checks to confirm they remain intact, and a documented path for migrating to new media and readers when the time comes. Federal rules at 36 CFR 1236.28 add storage-environment and media-maintenance requirements for media holding permanent or unscheduled federal records; state archives may set comparable expectations.",
          "The question to ask of any preservation tier is not only how long the media lasts, but how the agency will know the records are still intact, and how it will move them when the technology around them changes.",
        ],
      },
      {
        heading: "Transfer to the archives",
        paragraphs: [
          "Many permanent records eventually leave the creating agency. State archives accept permanent state and local records under their own transfer rules. Federal agencies transfer permanent records to NARA under 36 CFR Part 1235 when they become eligible under the approved schedule, or after 30 years.",
          "Federal agencies must retain a copy of transferred permanent electronic records until NARA confirms it has assumed responsibility for their preservation. Transfer media, formats, and required documentation are specified or agreed with the receiving archive. A well-preserved copy with intact metadata makes transfer easier, but it is not a substitute for the transfer itself.",
        ],
      },
      {
        heading: "Requirements to assess",
        paragraphs: [
          "State public-records and retention laws: the state's public-records act sets disclosure duties, exemptions, and response periods; the state archives or records commission typically issues the approved retention schedules for local government. These vary by state and record series.",
          "FOIA (5 U.S.C. 552): applies to federal executive-branch agencies, not to state or local governments. Agencies generally have 20 working days to determine whether to comply with a request, subject to extensions, and must search for responsive records wherever they are stored.",
          "NARA records schedules and 36 CFR Parts 1235 and 1236: for federal agencies, approved schedules govern retention and disposition, Part 1235 governs transfer of permanent records to NARA, and Part 1236 sets electronic recordkeeping controls including media maintenance for permanent records.",
          "Records that include criminal-justice, health, tax, or other protected information may carry additional requirements, such as the CJIS Security Policy, HIPAA, or IRS Publication 1075. Confirm applicability with the agency's records officer and counsel. No storage product by itself makes an agency compliant.",
        ],
      },
      {
        heading: "Keep the record, and the way back to it",
        paragraphs: [
          "Public records are kept so that people can rely on them: to prove ownership, to understand a decision, to hold government accountable. That only works if the record can be found and trusted when someone asks for it.",
          "Retention keeps the record. Access keeps it useful. A preservation architecture should do both, for as long as the record matters.",
        ],
      },
    ],

    relatedLinks: [
      {
        label: "Explore the ELS family",
        href: "/products/els",
        description:
          "Compare integrated Active Archive, scale-out, and offline optical systems.",
      },
      {
        label: "Explore Preservation",
        href: "/preservation",
        description:
          "See how online and physically isolated preservation tiers work together.",
      },
      {
        label: "Explore oRain",
        href: "/technology/orain",
        description:
          "See how oRain keeps preserved objects indexed and location-aware across libraries.",
      },
    ],

    sourceLinks: [
      {
        label: "Council of State Archivists",
        href: "https://www.statearchivists.org/",
        description:
          "The association of state and territorial archives that preserve and provide access to government records.",
      },
      {
        label: "FOIA.gov frequently asked questions",
        href: "https://www.foia.gov/faq.html",
        description:
          "Scope, process, and response times for federal FOIA requests.",
      },
      {
        label: "NARA: Scheduling Records",
        href: "https://www.archives.gov/records-mgmt/scheduling/sch-records",
        description:
          "How federal records schedules designate temporary and permanent records.",
      },
      {
        label: "36 CFR Part 1235, transfer of records to NARA",
        href: "https://www.ecfr.gov/current/title-36/chapter-XII/subchapter-B/part-1235",
        description:
          "When and how federal agencies transfer permanent records to the National Archives.",
      },
      {
        label: "36 CFR Part 1236, electronic records management",
        href: "https://www.ecfr.gov/current/title-36/chapter-XII/subchapter-B/part-1236",
        description:
          "Federal electronic recordkeeping controls, including media maintenance for permanent records.",
      },
    ],

    relatedArticleSlugs: [
      "compliance-retention-right-information-right-time",
      "long-term-digital-retention-with-els100",
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