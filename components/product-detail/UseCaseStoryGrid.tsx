"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type UseCaseStory = {
  title: string;
  story: string;
  idea: string;
  contexts?: {
    title: string;
    description: string;
  }[];
  caseStudy?: {
    title: string;
    description: string;
    href: string;
  };
  requirements?: {
    name: string;
    applicability: string;
    href: string;
  }[];
  scopeNote?: string;
  insightHref?: string;
  insightTitle?: string;
};

type Props = {
  useCases: string[];
  systemName?: string;
  scalable?: boolean;
  offline?: boolean;
};

const storyPatterns: { matches: string[]; story: UseCaseStory }[] = [
  {
    matches: ["government", "national archive", "public record"],
    story: {
      title: "Public records that stay findable, readable, and accountable",
      story:
        "A county clerk, recorder, and planning department hold deeds, permits, plats, council minutes, ordinances, court-adjacent filings, GIS layers, and decades of scanned historical books. Some series must be kept permanently; others for years under the state's approved retention schedule. Public-records requests arrive with statutory response deadlines, and staff must locate the right record years after the system that created it has been replaced. Keeping every permanent and long-retained record on primary disk means repeated migrations and refresh projects for information that is rarely opened but cannot be lost. The agency's records-management or document-management system remains authoritative for series, schedules, holds, redaction, and disclosure. ELS provides the preservation layer underneath: active files stay on performance storage, while retained and permanent records are kept on write-once optical media that remain indexed and retrievable for requests, audits, and eventual transfer to a state archive or, for federal agencies, to NARA.",
      idea:
        "Pick one record series, such as recorded deeds or council minutes. Map its approved retention schedule and whether it is temporary or permanent, the system of record, the metadata needed to find it during a public-records request, redaction and access restrictions, preservation format, fixity checks, retrieval targets, legal holds, and the transfer or disposition path. Then run a mock records request against preserved material and time it.",
      contexts: [
        {
          title: "Local government: answer the request on deadline",
          description:
            "A county or city must respond to public-records requests within periods set by state law. Requests often reach older or inactive records. The preservation tier helps only if records keep their identifiers and descriptive metadata, remain searchable through the records system, and can be retrieved and reviewed for exemptions within the response window.",
        },
        {
          title: "Permanent records outlive every system",
          description:
            "Deeds, minutes, ordinances, and vital historical records may be designated permanent. Permanent electronic records need open or well-documented formats, preserved metadata, periodic integrity checks, and a planned migration path for both media and readers. Write-once optical copies reduce the risk of alteration and avoid repeated disk refreshes, but they do not remove the need for format and media planning.",
        },
        {
          title: "State and federal transfer",
          description:
            "Many state archives accept permanent local and state agency records under their own transfer rules. Federal agencies transfer permanent records to NARA on the date in the approved schedule or after 30 years, and keep their copy until NARA confirms it has assumed preservation responsibility. Transfer media and formats are agreed with the receiving archive; a preservation copy is not a substitute for the transfer itself.",
        },
      ],
      requirements: [
        {
          name: "State public-records and records-retention laws",
          applicability:
            "For state and local agencies, the state's public-records act sets disclosure duties, exemptions, and response periods, and the state archives or records commission typically issues the approved retention schedules for local government. These vary by state and record series; confirm them with the agency's records officer and counsel. They do not prescribe a storage technology.",
          href: "https://www.statearchivists.org/",
        },
        {
          name: "Freedom of Information Act (5 U.S.C. 552)",
          applicability:
            "Applies to federal executive-branch agencies, not to state or local governments. Agencies generally have 20 working days to determine whether to comply with a request, subject to extensions, and must search for responsive records wherever they are stored. Preserved records must remain searchable and retrievable for FOIA processing.",
          href: "https://www.foia.gov/faq.html",
        },
        {
          name: "NARA records schedules",
          applicability:
            "Federal agencies must manage records under NARA-approved schedules, which designate records as temporary or permanent and set when temporary records may be destroyed and permanent records transferred.",
          href: "https://www.archives.gov/records-mgmt/scheduling/sch-records",
        },
        {
          name: "36 CFR Part 1235, transfer of records to NARA",
          applicability:
            "Federal agencies transfer permanent records when eligible under the approved schedule or after 30 years, and must retain a copy of transferred permanent electronic records until NARA confirms it has assumed preservation. Transfer media, formats, and documentation are specified or agreed with NARA.",
          href: "https://www.ecfr.gov/current/title-36/chapter-XII/subchapter-B/part-1235",
        },
        {
          name: "36 CFR Part 1236, federal electronic records management",
          applicability:
            "Sets federal recordkeeping controls for electronic records, including retrieval and migration over the retention period. Section 1236.28 adds storage-environment and media-maintenance requirements for media holding permanent or unscheduled records. Applies to federal agencies; state rules may adopt similar expectations.",
          href: "https://www.ecfr.gov/current/title-36/chapter-XII/subchapter-B/part-1236",
        },
      ],
      scopeNote:
        "Initial U.S.-focused applicability map, not legal advice. Retention periods and disclosure duties come from the governing statute, approved schedule, and agency policy, not from the storage product. Records that include criminal-justice, health, tax, or other protected information may carry additional requirements such as CJIS, HIPAA, or IRS Publication 1075. ELS is a preservation and storage tier, not a records-management application, redaction tool, or public-access portal, and it does not by itself make an agency compliant.",
      insightHref: "/insights/government-records-public-access-permanent-preservation",
      insightTitle: "Public Records That Outlive the System That Created Them",
    },
  },
  {
    matches: ["medical", "healthcare", "imaging", "dicom", "pacs"],
    story: {
      title: "Keep prior imaging available beyond the PACS refresh cycle",
      story:
        "A growing hospital imaging network is running out of primary PACS capacity. Older studies still matter for clinical comparison, referrals, audits, and applicable retention duties, but keeping every study on the same high-performance tier drives repeated capacity expansions and refresh projects. The hospital keeps its PACS or vendor-neutral archive as the clinical system of record, while placing eligible, less-frequently accessed studies on a managed preservation tier. A single facility can use ELS150 or ELS300, which combine an integrated disk cache with an automatically created write-once optical copy; a larger imaging network can pair its performance storage with scale-out ELS libraries under oRain. Either way, the PACS team must first confirm a supported archive/retrieval interface, metadata handling, and acceptable retrieval times.",
      idea:
        "Choose one modality and study class. Map DICOM ingest, PACS indexing, archive and recall, retention holds, authorized access, retrieval-time targets, integrity checks, and restore tests. Keep frequently accessed studies on the PACS performance tier, and validate every proposed ELS integration against the PACS vendor's supported interfaces and conformance documentation.",
      contexts: [
        {
          title: "A PACS capacity and refresh decision",
          description:
            "A radiology department is approaching its storage limit and must decide whether to expand primary PACS capacity or move some lower-access studies to a separate preservation tier. Classify by modality, age, access patterns, clinical need, and retention policy rather than treating age alone as permission to move or delete records.",
        },
        {
          title: "Prior studies across a regional network",
          description:
            "Clinicians at multiple sites need to locate earlier studies when a patient returns or is referred. Preserve study identifiers and required metadata, keep the PACS/VNA index authoritative, and test the actual retrieval workflow and service levels across sites before moving production data.",
        },
        {
          title: "A preservation copy with an operational recovery plan",
          description:
            "The optical copy can provide another recovery source for selected imaging data, but it does not replace PACS availability, backup, geographic disaster recovery, cybersecurity controls, or a tested restore procedure. Define who can request a recall and how returned images are verified and re-associated with the correct study.",
        },
      ],
      requirements: [
        {
          name: "42 CFR 482.24, Medicare hospital medical-record services",
          applicability:
            "For hospitals subject to the Medicare hospital Conditions of Participation, medical records must be retained in original or legally reproduced form for at least five years. The rule also requires records to be accessible and a coding/indexing system that supports timely retrieval. Confirm whether the imaging studies are part of the covered medical record and whether state law, payer terms, litigation holds, or other rules require longer retention. The regulation does not require optical storage.",
          href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24",
        },
        {
          name: "HIPAA Security Rule, 45 CFR Part 164 Subpart C",
          applicability:
            "Covered entities and business associates handling electronic protected health information must apply the Security Rule safeguards to the system and workflow, including risk analysis, access controls, audit controls, and integrity protections as applicable. 45 CFR 164.316's six-year period is for required Security Rule documentation, not a general six-year retention period for medical images or all PHI. Assess vendor and business-associate responsibilities for the actual deployment.",
          href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C",
        },
        {
          name: "DICOM Standard",
          applicability:
            "DICOM defines medical-imaging information objects and exchange services; it is a technical interoperability standard, not a retention regulation or a certification of this storage product. Review the PACS and archive vendors' current DICOM conformance statements and validate the specific store, query, retrieve, metadata, and lifecycle workflow end to end.",
          href: "https://www.dicomstandard.org/current",
        },
      ],
      scopeNote:
        "This is an initial U.S.-focused applicability map, not legal advice. State medical-record retention laws and special rules can require longer or different periods; the applicable schedule depends on organization, record class, modality, and jurisdiction. ELS is a storage and preservation tier, not a PACS/VNA, clinical viewer, or compliance certification. Confirm supported interfaces, indexing, security, legal-hold and disposition behavior, restore performance, and geographic recovery requirements with the hospital and its vendors before deployment.",
      insightHref: "/insights/medical-imaging-beyond-the-pacs-refresh-cycle",
      insightTitle: "Keep Imaging Records Beyond the PACS Refresh Cycle",
    },
  },
  {
    matches: ["evidence", "forensic", "legal", "court", "surveillance"],
    story: {
      title: "Keep closed-case evidence accessible without trusting one aging disk estate",
      story:
        "A county evidence unit needs to retain body-camera video, surveillance exports, interviews, and forensic images long after cases close. A third-party VMS or the Savartus Evidence Management System remains authoritative for case IDs, custody events, legal holds, and disclosure; ELS adds a preservation tier underneath those workflows through supported interfaces. The deployment can start with a compact system for one unit, expand across online enterprise libraries as agencies and evidence volumes grow, or add drive-less offline libraries when physical isolation is required. The architecture should match access frequency and threat model without losing the link between evidence identity, its authoritative source, and its preserved media.",
      idea:
        "Design the integration and ingest workflow across a third-party VMS or the Savartus Evidence Management System, other file-management platforms, and ELS using interfaces each system supports. Preserve case and item identifiers, acquisition provenance, hash checks at receipt and retrieval, access history, legal holds, media location, periodic fixity checks, and tested restores. Then choose the topology: built-in cache for ELS150/ELS300; external performance storage with networked ELS libraries under oRain for scale-out; or verified optical media transferred to an offline library with its location tracked in oRain. Keep a geographically separate copy when the agency's risk model requires it.",
      requirements: [
        {
          name: "FBI CJIS Security Policy v6.1",
          applicability:
            "Assess when the archive stores Criminal Justice Information or is within a CJI system boundary. Confirm controls, vendor access, and validation expectations with the agency’s CJIS Systems Agency; this is not a product certification.",
          href: "https://le.fbi.gov/cjis-division-resources/cjis-security-policy-resource-center",
        },
        {
          name: "28 CFR Part 23",
          applicability:
            "Conditional: applies to covered criminal-intelligence systems supported under the specified federal crime-control funding. Its scope is not every police evidence archive; where it applies, review safeguards, audit trails, access, and retention/revalidation rules.",
          href: "https://www.ecfr.gov/current/title-28/chapter-I/subchapter-D/part-23",
        },
        {
          name: "Federal Rules of Evidence 901 and 902(13)/(14)",
          applicability:
            "For federal proceedings, plan how a witness or qualified certification will establish authenticity of records and electronic copies. Optical media alone does not establish chain of custody or admissibility; state evidence rules may differ.",
          href: "https://www.uscourts.gov/rules-policies/current-rules-practice-procedure/federal-rules-evidence",
        },
        {
          name: "Federal Rule of Civil Procedure 37(e)",
          applicability:
            "Relevant when electronically stored information must be preserved for anticipated or pending civil litigation. The organization still needs legal-hold procedures that suspend conflicting routine deletion or disposition.",
          href: "https://www.uscourts.gov/rules-policies/current-rules-practice-procedure/federal-rules-civil-procedure",
        },
        {
          name: "Federal Rules of Criminal Procedure Rule 16",
          applicability:
            "For federal criminal cases, assess discovery duties for documents and objects in government possession, custody, or control. Prosecutorial disclosure duties and preservation decisions require agency counsel; state criminal rules differ.",
          href: "https://www.uscourts.gov/rules-policies/current-rules-practice-procedure/federal-rules-criminal-procedure",
        },
        {
          name: "SWGDE 19-F-003: Archiving Digital and Multimedia Evidence",
          applicability:
            "Non-regulatory guidance for digital-forensics evidence archives. It covers provenance, audit history, fixity, redundancy, and migration; it notes optical-media life expectancy is unknown and recommends annual fixity checks plus planned migration for data retained over five years.",
          href: "https://www.swgde.org/documents/published-complete-listing/19-f-003-swgde-best-practices-for-archiving-digital-and-multimedia-evidence/",
        },
        {
          name: "ISO/IEC 17025:2017",
          applicability:
            "Consider only where a forensic laboratory’s accreditation scope is relevant. It addresses testing and calibration laboratory competence; it does not certify an evidence-storage product or make an archive admissible.",
          href: "https://www.iso.org/standard/66912.html",
        },
      ],
      scopeNote:
        "This is an initial US-focused applicability map, not an exhaustive legal determination. Also map the agency’s state and local evidence-retention schedule, prosecutor/court orders, discovery rules, and records policies. No single evidence-storage certification covers every agency. The cache and optical copy are in the same appliance and location, so they do not by themselves provide geographic disaster recovery.",
      insightHref: "/insights/the-evidence-must-outlive-the-storage-system",
      insightTitle: "The Evidence Must Outlive the Storage System",
    },
  },
  {
    matches: ["long-term digital retention"],
    story: {
      title: "Preserve important digital information for years or decades",
      story:
        "A small organization, department, or laboratory has a manageable archive of completed projects, financial and business records, intellectual property, research data, images, and historical reference material. Routine access has declined, but the organization still has reasons to retain the information. Keeping every file on always-on SSD or spinning HDD means paying for power, cooling, hardware refreshes, and repeated migrations even when access is occasional. The ELS100 provides a compact online optical preservation tier: selected information can move from the performance tier to managed write-once optical storage while remaining indexed and retrievable through the organization's storage workflow.",
      idea:
        "Select one record series or completed project. Define its authoritative source, owner, applicable retention schedule or agreement, access restrictions, metadata and relationships, disposition trigger, fixity-check plan, and restore procedure. Keep operationally active information on performance storage; use ELS100 for the durable optical preservation tier. Add off-site copies where the risk plan requires geographic recovery.",
      contexts: [
        {
          title: "A department or professional office",
          description:
            "Move completed project files, contracts, financial records, reference images, or intellectual property out of scarce primary storage once routine access declines. Keep records discoverable through the existing file-management or repository workflow, and retain the approved schedule, legal holds, and access rules with the record series.",
        },
        {
          title: "A laboratory or research group",
          description:
            "Preserve source datasets, engineering files, analysis outputs, and associated documentation after a project ends. Retain enough metadata and processing context to understand or reproduce a result later; funder sharing plans and repository commitments still govern which datasets must be shared and where.",
        },
        {
          title: "A distributed or branch environment",
          description:
            "Give a branch, department, or small organization a compact optical preservation tier without deploying a rack-scale library. Pair ELS100 with a separate SSD/HDD performance tier if current workloads need cache-backed access; ELS100 does not include the integrated cache server found in ELS150 and ELS300.",
        },
      ],
      requirements: [
        {
          name: "36 CFR Part 1236, Federal Electronic Records Management",
          applicability:
            "Applies to U.S. Federal agencies managing Federal electronic records, not generally to private organizations or every state/local agency. It calls for records controls including reliability, authenticity, integrity, usability, content, context, and structure; agencies must plan for retrieval and migration over the NARA-approved retention period. Storage media alone does not supply all required recordkeeping functions.",
          href: "https://www.ecfr.gov/current/title-36/chapter-XII/subchapter-B/part-1236",
        },
        {
          name: "17 CFR 240.17a-4, broker-dealer records",
          applicability:
            "Applies to specified SEC-regulated brokers, dealers, and exchange members for defined business records and retention periods. The electronic-recordkeeping provisions allow either a non-rewriteable, non-erasable format or a compliant time-stamped audit-trail system, along with availability, access, and other controls. Do not assume an optical appliance by itself meets the rule; validate the complete recordkeeping system and current obligations with compliance counsel.",
          href: "https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.17a-4",
        },
        {
          name: "45 CFR 164.316(b)(2)(i), HIPAA Security Rule documentation",
          applicability:
            "For covered entities and business associates subject to the Security Rule, required policies, procedures, and documented actions/assessments must generally be retained for six years from creation or when last in effect, whichever is later. This is a documentation-retention rule, not a universal six-year retention period for medical records or all PHI.",
          href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.316",
        },
        {
          name: "ISO 14721: OAIS Reference Model",
          applicability:
            "A reference model for digital archives, not a regulation or product certification. Its concepts can help teams plan for designated producers and consumers, preservation metadata, managed archival packages, access, and preservation planning over time.",
          href: "https://www.iso.org/standard/57284.html",
        },
      ],
      scopeNote:
        "Retention periods come from the organization's approved records schedule, contract, grant, applicable law, or legal hold—not from the storage product. ELS100 is an optical preservation tier; it does not replace a records-management application, designated research repository, privacy/access controls, retention and disposition governance, fixity procedures, restore testing, or a migration plan. Optical media and drives can also become obsolete, so long-term preservation remains an active lifecycle responsibility.",
      insightHref: "/insights/long-term-digital-retention-with-els100",
      insightTitle: "Long-Term Digital Retention with ELS100",
    },
  },
  {
    matches: ["scientific", "research", "satellite", "remote-sensing", "survey", "experiment"],
    story: {
      title: "Keep the research record ready for the next question",
      story:
        "A research consortium combines decades of Earth-observation imagery with field measurements and clinical-study datasets. The original projects may be complete, but researchers still need to reproduce published findings, compare new observations against the historical record, and evaluate new AI methods. An Active Archive keeps selected datasets accessible while creating a durable optical preservation copy; as collections grow, enterprise ELS libraries can scale the archive. Preserve source data, derived products, metadata, processing versions, and the relationships between them so future teams can interpret and validate what they reuse.",
      idea:
        "Choose a completed project and map its source files, derived products, metadata, processing code/version, sharing restrictions, persistent identifier, and preservation owner. Define how a future researcher or AI team will locate the data, reproduce a result, and distinguish original observations from generated outputs.",
      contexts: [
        {
          title: "Institutional and funded research",
          description:
            "A university consortium closes a grant but retains data needed to validate results, answer follow-up questions, and meet sharing commitments. Keep the approved data-management plan, repository deposit, access limits, metadata, and retention owner connected to the preserved files. NIH's policy applies to NIH-funded or conducted work that generates scientific data; NSF sharing expectations and award terms apply to NSF-supported work. Neither policy means every dataset must be openly released: legal, ethical, privacy, technical, program, and award-specific limits matter.",
        },
        {
          title: "Earth observation and AI reuse",
          description:
            "A climate or land-use team compares new satellite scenes with older imagery, then trains or evaluates a model against the longer time series. Preserve the received scenes alongside calibrated or analysis-ready products, quality masks, geospatial metadata, processing lineage, and version identifiers. The historical series can support work its original collection team did not anticipate, but only if future researchers can identify which product version and processing steps they are using.",
        },
        {
          title: "Clinical and human-participant research",
          description:
            "A medical research center retains study datasets, images, and supporting records for regulated studies and future approved analyses. Access and sharing must follow consent, IRB protocol, award conditions, and applicable privacy rules. HIPAA applies when identifiable PHI is held by a covered entity or business associate; the Common Rule and FDA record rules cover particular human-subject or regulated investigations and specific record classes. These rules do not create one universal retention period for all research datasets.",
        },
      ],
      caseStudy: {
        title: "A real long-horizon data record: Landsat",
        description:
          "USGS Landsat Collection 2 includes Level-1 observations from 1972 onward. Its continuing archive and reprocessing make a long, consistently documented Earth-observation record available for new comparisons and methods. It illustrates the value of preserving source observations, metadata, and processing context across generations; it is an archive example, not a claim that ELS stores Landsat data today.",
        href: "https://www.usgs.gov/landsat-missions/landsat-collection-2",
      },
      requirements: [
        {
          name: "NIH Data Management and Sharing Policy",
          applicability:
            "Applies to NIH-funded or conducted research that generates scientific data. It requires a Data Management and Sharing Plan and compliance with the approved plan; shared data should be available no later than the associated publication or end of the award/support period, whichever comes first. Sharing is contextual, and privacy, consent, legal, technical, and other justified limits remain relevant.",
          href: "https://grants.nih.gov/grants/guide/notice-files/NOT-OD-21-013.html",
        },
        {
          name: "NSF PAPPG 24-1, Chapter XI.D.4",
          applicability:
            "NSF award policy expects primary data and supporting materials to be shared with researchers at no more than incremental cost and within a reasonable time, subject to privacy, confidentiality, field-specific exceptions, and award terms. Check the current PAPPG supplements and the specific award conditions.",
          href: "https://www.nsf.gov/policies/pappg/24-1/ch-11-other-post-award-requirements#ch11D4",
        },
        {
          name: "USGS Landsat Collection 2",
          applicability:
            "A public archive example, not a regulation: Collection 2 provides Landsat Level-1 data from 1972 onward and Level-2 products for later periods, with documented collection versions, metadata, and reprocessing events.",
          href: "https://www.usgs.gov/landsat-missions/landsat-collection-2",
        },
        {
          name: "45 CFR 46.115, Common Rule IRB records",
          applicability:
            "Where the Common Rule applies, this section requires institutions/IRBs to retain specified IRB records for at least three years, and research-related IRB records for at least three years after completion. It is an IRB-record rule, not a blanket three-year retention period for all scientific datasets.",
          href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-46/subpart-A/section-46.115",
        },
        {
          name: "21 CFR 312.62(c), FDA drug investigations",
          applicability:
            "For investigators in covered investigational drug studies, the regulation specifies retention of required investigator records for two years after approval for the investigated indication, or, if no application is filed or approved, two years after the investigation is discontinued and FDA is notified. Other sponsor, award, contract, or institutional terms can differ or extend retention.",
          href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-312/subpart-D/section-312.62",
        },
        {
          name: "21 CFR 812.140(d), FDA device investigations",
          applicability:
            "For covered investigational device studies, investigators/sponsors retain specified records during the investigation and generally for two years after the later of investigation completion/termination or when records are no longer needed to support the relevant FDA submission. Confirm the study type and applicable exceptions.",
          href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-H/part-812/subpart-G/section-812.140",
        },
        {
          name: "HIPAA Privacy Rule",
          applicability:
            "Applies to PHI handled by covered entities and their business associates, not to every research institution or every de-identified research dataset. Research use/disclosure, authorization or waiver, access controls, and business-associate terms require case-specific review.",
          href: "https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html",
        },
        {
          name: "NIST AI Risk Management Framework 1.0",
          applicability:
            "Voluntary guidance, not a research-data regulation or certification. It can inform governance and documentation for dataset provenance, quality, traceability, and reuse in AI development and evaluation.",
          href: "https://www.nist.gov/itl/ai-risk-management-framework",
        },
      ],
      scopeNote:
        "Initial U.S.-focused map, not legal advice or an exhaustive applicability determination. Requirements depend on funder and award terms, institution, research design, data type, consent, jurisdiction, repository commitments, and any clinical-trial status. ELS is a preservation and access tier, not a substitute for a designated repository, research data-management system, privacy controls, or validated scientific workflow. Define fixity checks, restore tests, off-site redundancy, format/reader migration, and which version of each derived or AI-generated artifact is authoritative.",
      insightHref: "/insights/scientific-data-must-outlive-the-project",
      insightTitle: "Scientific Data Must Outlive the Project",
    },
  },
  {
    // Must precede the compliance matcher so labels like "Defense retention" land here.
    matches: ["defense", "critical infrastructure"],
    story: {
      title: "A recoverable copy outside the network that matters most",
      story:
        "A defense contractor holds controlled unclassified technical data for a long-running program: engineering drawings, test results, specifications, and program records that must stay protected and available for the life of the contract and beyond. A regional electric utility must be able to restore the systems that operate its grid after a cyber incident or equipment loss. Both face the same problem: their most important recovery copies sit on networks an attacker may reach, and their records outlast several generations of storage hardware. An online ELS library, paired with performance storage under oRain, holds the working preservation copy. Verified optical media can then move to a drive-less offline library such as ELS8000-OL or ELS10K-OL, physically separated from production networks, with its location tracked so authorized staff can retrieve the right set through a controlled restore. The storage design supports the organization's security program; it does not replace it.",
      idea:
        "Pick one protected data set, such as a program's technical data package or a control-system recovery set. Define its classification and handling rules, who may access it, how copies are written and verified, how often they move offline, custody and media-location records, restore priorities, and how recovery is tested. Confirm with your security and compliance leads where the archive sits within your assessment boundary before relying on it.",
      contexts: [
        {
          title: "Defense contractors: protect CUI for the life of the program",
          description:
            "Contractors that store controlled unclassified information must protect it wherever it resides, including archive and backup media. An optical preservation tier and offline library hold that information, so they belong inside the security boundary: access control, media protection, encryption where required, physical security, and audit records all apply. Physical isolation reduces exposure to network attack, but it does not take CUI out of scope.",
        },
        {
          title: "Critical infrastructure: recover operations, not just files",
          description:
            "A utility or pipeline operator needs more than data: it needs configurations, system images, and the information required to rebuild control systems in a known-good state. An offline optical copy, prepared and verified before an incident, gives recovery teams a source that ordinary network access cannot reach. It is useful only if the recovery plan identifies what to restore, in what order, and has been tested.",
        },
        {
          title: "Long retention across hardware generations",
          description:
            "Program records and engineering baselines can be needed decades later for sustainment, investigations, or audits. Write-once optical media avoids rewriting the archive on every disk refresh. Integrity checks, format planning, and documented migration still apply over that horizon.",
        },
      ],
      requirements: [
        {
          name: "DFARS 252.204-7012, safeguarding covered defense information",
          applicability:
            "Applies to DoD contractors whose contracts include the clause. Covered contractor information systems that process, store, or transmit covered defense information must implement NIST SP 800-171, and cyber incidents must be rapidly reported to DoD, meaning within 72 hours of discovery. Media containing that information falls under these protections.",
          href: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting.",
        },
        {
          name: "NIST SP 800-171, protecting CUI in nonfederal systems",
          applicability:
            "Security requirements for nonfederal systems handling CUI, including media protection, access control, and system and information integrity. Revision 3 is current at NIST, while CMMC Level 2 assessments are conducted against Revision 2; confirm which revision your contract specifies.",
          href: "https://csrc.nist.gov/pubs/sp/800/171/r3/final",
        },
        {
          name: "CMMC Program, 32 CFR Part 170",
          applicability:
            "Assesses whether a defense contractor's own information systems meet the required security level when handling FCI or CUI. CMMC certifies the contractor's environment, not a storage product. Assets that store CUI, including archive and offline media, are in the assessment scope; physical separation from CUI assets does not apply to media that itself holds CUI.",
          href: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-G/part-170",
        },
        {
          name: "NERC CIP-009, recovery plans for BES Cyber Systems",
          applicability:
            "Mandatory for registered entities operating applicable bulk electric system cyber systems. Requires documented recovery plans that include backing up and storing the information needed to recover system functionality, and periodic testing of those plans. Confirm the current enforceable version and your applicable systems.",
          href: "https://www.nerc.com/standards/reliability-standards/cip/cip-009-6",
        },
        {
          name: "CISA #StopRansomware Guide",
          applicability:
            "Voluntary guidance recommending offline, encrypted backups of critical data and regular testing of their availability and integrity. Not a regulation or product certification.",
          href: "https://www.cisa.gov/stopransomware/ransomware-guide",
        },
      ],
      scopeNote:
        "Initial U.S.-focused applicability map, not legal advice. This scenario covers unclassified information only; classified information is governed by separate requirements and is out of scope here. Applicability depends on contract clauses, registration status, system categorization, and jurisdiction. ELS does not hold a CMMC certification, and no storage product makes an organization compliant. Physical isolation reduces exposure to network-based attack but does not guarantee a copy is clean or recoverable: verify restore points, custody, encryption needs, geographic separation, and recovery tests. Offline libraries have no drives, so media is written and verified on a compatible online ELS before controlled transfer.",
      insightHref: "/insights/defense-critical-infrastructure-isolated-recovery",
      insightTitle: "When the Recovery Copy Has to Be Out of Reach",
    },
  },
  {
    matches: ["compliance", "regulated", "regulatory", "retention", "audit", "governance"],
    story: {
      title: "Keep regulated information for the right reason, for the right amount of time",
      story:
        "A regulated organization retains contracts, financial records, transaction data, communications, audit records, reports, and other business information under different regulatory, legal, contractual, and internal retention requirements. Some records remain active. Others may not be accessed for years but still must remain protected, retrievable, and verifiable. Keeping all retained information indefinitely on high-performance SSD or continuously spinning HDD ties the cost of retention to infrastructure designed for active workloads. Savartus separates the two. The organization's records-management, governance, or application systems remain authoritative for record classification, retention schedules, legal holds, access controls, and disposition authority; Savartus provides the storage and preservation layer beneath them. Information can move between storage states as its access requirements change without changing its retention obligations: Active → high-performance storage; Retained → online preservation; Long-term → lower-activity preservation; Isolated → offline preservation; Retention complete → disposition eligible. For information requiring protection against modification, a write-once optical preservation copy creates an independent immutable version of the retained object, while the operational copy can remain accessible and writable where appropriate. The copy being used does not have to be the copy being preserved.",
      idea:
        "Choose one record class and map: Classify → Assign Policy → Preserve → Verify → Retain → Hold if Required → Reevaluate → Authorize → Dispose or Preserve Permanently. For each retained object or record class, determine its owner, governing policy, retention trigger, retention period, required accessibility, immutability requirements, legal-hold status, integrity-verification process, preservation location, and disposition authority. The goal is not to keep everything forever. It is to keep the right information, for the right reason, for the right amount of time. Retention is a policy decision. Storage should execute the policy.",
      contexts: [
        {
          title: "Stand-alone systems",
          description:
            "For departmental, branch, professional-office, laboratory, and smaller retention environments, optical storage provides a dedicated preservation tier for important long-lived information.",
        },
        {
          title: "Integrated Active Archive systems",
          description:
            "For environments requiring routine access alongside preservation, SSD/HDD cache provides the operational tier while write-once optical storage maintains an independent preservation copy.",
        },
        {
          title: "Enterprise and offline systems",
          description:
            "Larger environments can scale preservation across networked optical libraries. Information requiring deeper protection can transition to offline storage for greater physical isolation while remaining governed by its retention policy.",
        },
      ],
      requirements: [
        {
          name: "SEC Rule 17a-4, broker-dealer recordkeeping",
          applicability:
            "Includes electronic-recordkeeping requirements for covered broker-dealers. Current rules permit qualifying electronic recordkeeping through either a WORM approach or an audit-trail alternative, so write-once storage is an available architectural control, not automatic SEC compliance.",
          href: "https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.17a-4",
        },
        {
          name: "NARA records schedules, federal records management",
          applicability:
            "Federal agencies must manage records under NARA-approved records schedules. Those schedules determine whether records are temporary or permanent and when temporary records may be destroyed or permanent records transferred for preservation.",
          href: "https://www.archives.gov/records-mgmt/scheduling/sch-records",
        },
        {
          name: "21 CFR Part 11, FDA electronic records",
          applicability:
            "For covered FDA-regulated activities, the applicable predicate rules determine which records must be maintained and for how long. Evaluate electronic-record controls alongside the specific underlying regulatory requirement.",
          href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11",
        },
        {
          name: "45 CFR 164.316, HIPAA-required documentation",
          applicability:
            "The HIPAA Security Rule requires certain required documentation to be retained for six years from creation or when it was last in effect, whichever is later. That requirement should not be generalized into a six-year retention period for all healthcare or medical records.",
          href: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.316",
        },
      ],
      scopeNote:
        "The applicable requirements depend on the organization and record class. Also assess state records laws, industry-specific requirements, contracts, litigation holds, privacy obligations, organizational retention schedules, and other applicable requirements. Immutability is one control within the larger retention architecture; compliance can also depend on classification, identity, metadata, access controls, audit history, legal holds, integrity verification, retrieval, and authorized disposition. No storage appliance by itself makes an organization compliant.",
      insightHref: "/insights/compliance-retention-right-information-right-time",
      insightTitle: "Compliance Retention: The Right Information, for the Right Time",
    },
  },
  {
    matches: ["ransomware protection", "cyber-resilient preservation", "cyber resilience", "credit union ransomware recovery"],
    story: {
      title: "Recover member services from a copy ransomware cannot reach",
      story:
        "A federally insured credit union is restoring member services after ransomware disrupts production systems and network-connected backups. The incident team isolates affected environments and needs a known-good recovery copy outside the compromised network. The credit union can prepare and verify selected data on a compatible online ELS, then transfer the optical media into a drive-less offline library such as ELS8000-OL or ELS10K-OL. oRain can track media location so authorized staff can retrieve the right set through a controlled restore process. This is one recovery layer, not a substitute for incident response, clean rebuilds, or a tested disaster-recovery plan.",
      idea:
        "Select the member-service datasets and systems that matter most. Define copy frequency and recovery-point objectives, independent verification, offline transfer controls, media-location records, restore priorities, clean-room procedures, decision authority, and recurring recovery exercises. Confirm what data and dependencies each restore set must include before deciding how much protection the optical copy provides.",
      contexts: [
        {
          title: "Backups are reachable during the incident",
          description:
            "If production credentials or management systems are compromised, connected backup systems may also be exposed. A physically isolated copy creates another recovery option outside ordinary network access, provided the media was prepared, verified, and moved offline before the incident.",
        },
        {
          title: "Restore in priority order",
          description:
            "Recovery teams need a clean environment, trusted system images and software, credentials and keys, documented dependencies, and a sequence for restoring services. Offline data is useful only when the organization can identify the correct media, validate it, and restore it into a clean and compatible environment.",
        },
        {
          title: "Preserve evidence and meet reporting duties",
          description:
            "The incident response process should preserve logs and investigation evidence, assess member and sensitive-data impacts, and coordinate regulatory and member notifications. Storage design supports recovery planning but does not decide whether an incident is reportable or satisfy notification duties by itself.",
        },
      ],
      requirements: [
        {
          name: "12 CFR 748.1(c), NCUA cyber incident reporting",
          applicability:
            "Applies to federally insured credit unions. For a reportable cyber incident, NCUA must be notified as soon as possible and no later than 72 hours after the credit union reasonably believes it experienced the incident, subject to the rule's specific third-party timing provision. The rule defines reportable incidents and does not require offline optical backups or prescribe a recovery-time objective. Confirm reportability and notification actions with the credit union's incident-response and compliance teams.",
          href: "https://www.ecfr.gov/current/title-12/chapter-VII/subchapter-A/part-748/section-748.1",
        },
        {
          name: "NCUA Part 748, Appendix A, Safeguarding Member Information",
          applicability:
            "Guidelines for federally insured credit unions' member-information security programs include risk assessment, safeguards, service-provider oversight, and an incident-response program. Apply the current requirements to the credit union's full environment and governance process; an offline archive is not itself a compliant security program or certification.",
          href: "https://www.ecfr.gov/current/title-12/chapter-VII/subchapter-A/part-748/appendix-Appendix%20A%20to%20Part%20748",
        },
        {
          name: "CISA #StopRansomware Guide",
          applicability:
            "Voluntary operational guidance recommends offline, encrypted backups of critical data and regular testing of their availability and integrity in a disaster-recovery scenario. It also emphasizes incident response and restoration planning. The guide is not a regulation or product certification.",
          href: "https://www.cisa.gov/stopransomware/ransomware-guide",
        },
        {
          name: "NIST Cybersecurity Framework 2.0",
          applicability:
            "Voluntary cybersecurity risk-management guidance that can help structure governance, protection, response, and recovery outcomes. It is not a regulation, audit attestation, or certification of an ELS system.",
          href: "https://www.nist.gov/cyberframework",
        },
      ],
      scopeNote:
        "Initial U.S.-focused applicability map, not legal advice. The NCUA reporting duty applies to federally insured credit unions and only to reportable cyber incidents under the rule. State breach-notification laws, other regulator or contract terms, cyber-insurance conditions, and member-notification duties may also apply. Offline optical media does not prevent compromise, prove a copy is clean, or guarantee recovery; verify malware-free restore points, access controls, media custody, encryption needs, geographic separation, recovery-point and recovery-time objectives, and restore tests. The offline library has no drives: prepare and verify media on a compatible online ELS before controlled transfer.",
      insightHref: "/insights/credit-union-ransomware-recovery-offline-copies",
      insightTitle: "Ransomware Recovery for Credit Unions: The Offline Copy",
    },
  },
  {
    matches: ["backup", "disaster recovery", "recovery", "cyber", "ransomware", "resilience"],
    story: {
      title: "A second copy outside the usual failure path",
      story:
        "An organization continues using its familiar storage workflow while a performance tier serves routine reads and writes. A write-once optical copy creates a separate recovery path when a disk failure, ransomware event, or accidental deletion affects the online copy.",
      idea:
        "Trace one critical dataset through write, optical verification, incident declaration, and restore; note who owns each handoff and how quickly service must return.",
    },
  },
  {
    matches: ["ai data", "ai dataset", "ai training", "ai infrastructure", "machine learning", "training dataset"],
    story: {
      title: "Keep the data behind every model you ship",
      story:
        "An AI team trains and evaluates models on large, growing collections: raw source data, labeled sets, cleaned and augmented derivatives, evaluation benchmarks, and the checkpoints produced along the way. Months later a customer, auditor, or regulator asks which data a released model was trained on, a bias finding needs to be reproduced, or a new model has to be compared against the old one on the same benchmark. If the original data was overwritten, cleaned in place, or deleted to free expensive GPU-adjacent storage, those questions cannot be answered. An online ELS library, scaled across networked systems under oRain, keeps each dataset release as an immutable, versioned snapshot alongside its labels, preprocessing code, data cards, and lineage records, while hot training data stays on high-performance storage. The team can free primary capacity without losing the ability to trace, reproduce, or retrain.",
      idea:
        "Define a dataset release as a bundle: source objects, labels, preprocessing and filtering code version, data card or datasheet, licensing and consent records, evaluation results, and the identifiers that connect them to each model version. Decide which releases must be preserved, for how long, and who may access them. Then test reproducing one past training run or evaluation from preserved material.",
      contexts: [
        {
          title: "Trace a model back to its data",
          description:
            "When a model is released, record exactly which dataset versions trained, validated, and tested it. Preserving those versions as write-once snapshots lets the team answer provenance questions later, rerun an evaluation on the original benchmark, and show what changed between model versions.",
        },
        {
          title: "Separate hot training data from the preserved record",
          description:
            "Active training needs high-throughput storage close to compute. Completed dataset releases, checkpoints, and evaluation sets are rarely read but expensive to recreate. Moving them to an online optical tier frees primary capacity while keeping them indexed and retrievable when a retrain or audit needs them.",
        },
        {
          title: "Respect data rights before you preserve",
          description:
            "Not all training data should be kept indefinitely. Personal data, licensed content, and data collected for a limited purpose may carry retention limits or deletion obligations. Write-once media cannot be selectively erased, so classify data before it goes to the immutable tier, and keep restricted or deletable data on storage that supports deletion or use encryption with key destruction where appropriate.",
        },
      ],
      requirements: [
        {
          name: "EU AI Act, Article 10 (data governance)",
          applicability:
            "For providers of high-risk AI systems, training, validation, and testing data must be subject to data governance practices covering data origin, collection processes, preparation steps such as labeling and cleaning, assumptions, and bias examination. Applies from 2 December 2027 for Annex III high-risk systems and 2 August 2028 for Annex I systems, as amended. Most AI systems are not high-risk; confirm classification first.",
          href: "https://artificialintelligenceact.eu/article/10/",
        },
        {
          name: "EU AI Act, Article 18 (documentation keeping)",
          applicability:
            "Providers of high-risk AI systems must keep technical documentation, quality-management documentation, and related records available to authorities for 10 years after the system is placed on the market. This requires keeping documentation that describes the data, not necessarily the datasets themselves; whether to preserve the data is a separate decision.",
          href: "https://artificialintelligenceact.eu/article/18/",
        },
        {
          name: "GDPR storage limitation and right to erasure",
          applicability:
            "Where training data includes personal data of people in the EU, Article 5(1)(e) limits retention to what is necessary for the purpose, and Article 17 can require erasure. Write-once storage is a poor fit for personal data that may need to be deleted; classify data before preserving it immutably and consult privacy counsel.",
          href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
        },
        {
          name: "NIST AI Risk Management Framework 1.0",
          applicability:
            "Voluntary U.S. guidance for managing AI risk, including documentation, traceability, and data provenance practices. Not a regulation or certification.",
          href: "https://www.nist.gov/itl/ai-risk-management-framework",
        },
        {
          name: "ISO/IEC 42001:2023, AI management systems",
          applicability:
            "An international standard for an organization's AI management system. Organizations can be certified against it; storage products are not. A preserved, traceable dataset record can support the organization's evidence, but does not confer certification.",
          href: "https://www.iso.org/standard/42001",
        },
      ],
      scopeNote:
        "Initial applicability map, not legal advice. AI regulation is changing quickly and varies by jurisdiction, sector, and use; confirm current requirements and whether your system is in scope. Copyright, licensing, and contractual terms for training data may also limit what can be kept and for how long. ELS is a storage and preservation tier, not a data catalog, MLOps platform, or compliance certification. Keep version identifiers, lineage, and access controls in the systems your team already uses, and verify integrity and restore paths periodically.",
      insightHref: "/insights/ai-datasets-preserve-the-data-behind-the-model",
      insightTitle: "Preserve the Data Behind the Model",
    },
  },
  {
    matches: ["media", "video", "cultural", "film", "heritage", "digital preservation"],
    story: {
      title: "Find and reuse the footage your archive already owns",
      story:
        "A broadcaster or production studio has decades of finished programs, camera originals, audio, graphics, and project files spread across aging tape, disk, and cloud accounts. A producer needs a cleared clip for a new documentary, but nobody can quickly confirm which master is authoritative, where its high-resolution version lives, or whether the license still covers the intended territory and term. Meanwhile, tape libraries need specialist drives and recurring migration projects, and the media-management platform is not designed to be the only preservation copy. Keep the MAM as the catalog and workflow authority, retain active editing media on performance storage, and use an online ELS library under oRain as a durable tier for selected cleared masters and production assets. Preserve identifiers and rights metadata with each package so staff can find, retrieve, and verify the source without confusing storage with asset management or rights clearance.",
      idea:
        "Choose one completed series or production. Inventory its source masters, derivatives, project files, descriptive metadata, checksum manifests, license windows, territory, talent and music releases, privacy restrictions, and legal holds. Test a complete retrieval through the existing MAM, including verifying the returned file and confirming that rights staff can determine whether the proposed reuse is allowed.",
      contexts: [
        {
          title: "A reuse request becomes a search problem",
          description:
            "Editors and producers often need a specific scene, interview, or clean master years after first release. A durable copy helps only when the MAM still points to stable identifiers, descriptive metadata, proxies, and the correct preservation object. Test discovery and recall from the user's workflow, not only a storage-level file read.",
        },
        {
          title: "Preserve the package, not just the video file",
          description:
            "A useful preservation package may include the highest-quality available master, audio and caption tracks, project or exchange files where needed, technical metadata, checksums, provenance, and relationships to access derivatives. Select formats and validate them against the organization's preservation plan; storage does not normalize, transcode, or validate a media format.",
        },
        {
          title: "Rights decide what can be kept and reused",
          description:
            "A license may limit a work by platform, territory, audience, or term. Footage can also contain identifiable people, confidential material, or third-party music. Record the applicable rights and restrictions in the authoritative catalog, and keep material that may need selective deletion out of an immutable tier until its obligations are resolved.",
        },
      ],
      requirements: [
        {
          name: "ISO 14721, OAIS Reference Model",
          applicability:
            "A reference model for archival information packages, preservation planning, designated communities, and access. It can guide archive design, but it is not a regulation, an implementation specification, or a certification of ELS or oRain.",
          href: "https://public.ccsds.org/Pubs/650x0m2.pdf",
        },
        {
          name: "PREMIS Data Dictionary for Preservation Metadata",
          applicability:
            "A preservation-metadata standard describing objects, events, agents, and rights. It can inform how an archive records fixity checks, migrations, provenance, and preservation actions; it does not prescribe a storage medium or certify a storage product.",
          href: "https://www.loc.gov/standards/premis/",
        },
        {
          name: "FADGI Technical Guidelines for Digitizing Cultural Heritage Materials",
          applicability:
            "Technical recommendations for digitizing cultural-heritage materials, especially relevant to participating U.S. federal agencies and projects adopting the guidelines. They address capture quality and metadata, not long-term storage certification, and are not a universal legal requirement for commercial media libraries.",
          href: "https://www.digitizationguidelines.gov/guidelines/digitize-technical.html",
        },
        {
          name: "Copyright licenses and privacy requirements",
          applicability:
            "Copyright, talent and music licenses, contracts, and privacy laws can restrict retention, access, or reuse. For personal data in scope of the GDPR, storage limitation and erasure rights may apply; preservation is not an automatic exemption. The U.S. Copyright Act's section 108 exception is conditional and limited to eligible libraries and archives, not a blanket right for studios or broadcasters to preserve or reuse all content.",
          href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
        },
      ],
      scopeNote:
        "This is an initial workflow map, not legal advice. Rights depend on the work, contract, territory, intended reuse, and applicable law; a preservation copy does not grant reuse rights. Resolve retention, privacy, legal holds, and deletion obligations before writing material to immutable media. ELS and oRain provide a storage tier and namespace, not a media-asset-management system, transcoder, rights-management tool, format validator, or preservation certification. Validate supported integrations and retrieval performance with the organization's MAM and production workflow.",
      insightHref: "/insights/media-archives-find-and-reuse-preserved-content",
      insightTitle: "Media Archives: Find and Reuse What You Already Own",
    },
  },
  {
    matches: ["remote office", "department", "distributed", "edge"],
    story: {
      title: "Local access, centrally managed preservation",
      story:
        "A distributed team captures records close to where work happens, then manages them through a consistent archive interface. Durable optical copies reduce dependence on fragile local disks or manual backup routines.",
      idea:
        "Sketch one remote-site workflow from file creation through central discovery, optical copy confirmation, and a test restore.",
    },
  },
  {
    matches: ["offline", "physically isolated", "deep preservation"],
    story: {
      title: "An offline copy with a known way back",
      story:
        "A security team separates a preserved copy from production systems but keeps a catalog of what is stored, where it resides, and how it can be restored. The result is a recovery plan that pairs physical isolation with deliberate discovery and retrieval steps.",
      idea:
        "Define the isolation boundary, the catalog fields needed to locate a file, and the people authorized to approve a restore.",
    },
  },
  {
    matches: ["archive", "repository", "object stor", "video", "data center", "preservation"],
    story: {
      title: "Turn a growing archive into a managed collection",
      story:
        "A team groups completed projects, large objects, and video assets into collections with clear owners and retention needs. Frequently requested information remains in an online access tier; durable optical copies give the organization a long-lived source without making every byte depend on primary storage.",
      idea:
        "Choose one collection and define its owner, discovery metadata, retrieval service level, retention event, and preservation copy.",
    },
  },
];

function getStory(useCase: string): UseCaseStory {
  const normalized = useCase.toLowerCase();
  const match = storyPatterns.find(({ matches }) =>
    matches.some((term) => normalized.includes(term)),
  );

  return (
    match?.story ?? {
      title: `A preservation workflow for ${useCase.toLowerCase()}`,
      story:
        `An organization keeps ${useCase.toLowerCase()} available through its online access tier and plans a durable, write-once optical copy for long-term preservation and recovery.`,
      idea:
        "Name the information, the people who need it, the event that sets its retention period, and the proof they would expect to see when retrieving it years later.",
    }
  );
}

export function UseCaseStoryGrid({
  useCases,
  systemName,
  scalable,
  offline,
}: Props) {
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeStory = activeUseCase ? getStory(activeUseCase) : null;
  const hasIntegratedCache = systemName === "ELS150" || systemName === "ELS300";
  const visibleUseCases = useCases.includes("Regulated evidence")
    ? useCases
    : [...useCases, "Regulated evidence"];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeUseCase && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [activeUseCase]);

  return (
    <>
      <div className="product-use-case-grid">
        {visibleUseCases.map((useCase, index) => (
          <button
            className="product-use-case-trigger"
            key={useCase}
            type="button"
            onClick={() => setActiveUseCase(useCase)}
            aria-haspopup="dialog"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{useCase}</strong>
            <span className="product-use-case-open">Explore story +</span>
          </button>
        ))}
      </div>

      {activeStory && (
        <dialog
          aria-labelledby="use-case-story-title"
          className="use-case-story-dialog"
          onClose={() => setActiveUseCase(null)}
          ref={dialogRef}
        >
          <div className="use-case-story-content">
            <p className="product-detail-eyebrow">
              {systemName ? `${systemName} / USE CASE` : "USE CASE STORY"}
            </p>
            <button
              aria-label="Close use case story"
              autoFocus
              className="use-case-story-close"
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              ×
            </button>
            <p className="use-case-story-area">{activeUseCase}</p>
            <h2 id="use-case-story-title">{activeStory.title}</h2>
            <p className="use-case-story-copy">{activeStory.story}</p>
            {activeStory.contexts && (
              <section
                aria-label="Research contexts"
                className="use-case-story-contexts"
              >
                {activeStory.contexts.map((context) => (
                  <article key={context.title}>
                    <h3>{context.title}</h3>
                    <p>{context.description}</p>
                  </article>
                ))}
              </section>
            )}
            {activeStory.caseStudy && (
              <a
                className="use-case-story-case-study"
                href={activeStory.caseStudy.href}
                rel="noreferrer"
                target="_blank"
              >
                <span>REAL-WORLD ARCHIVE</span>
                <strong>{activeStory.caseStudy.title}</strong>
                <p>{activeStory.caseStudy.description}</p>
                <small>View USGS archive ↗</small>
              </a>
            )}
            {hasIntegratedCache && (
              <p className="use-case-story-product-note">
                {systemName} includes its disk cache server in the same
                appliance. Everyday access runs through that built-in cache,
                and each write automatically creates a second copy on
                write-once optical media.
              </p>
            )}
            {offline && (
              <p className="use-case-story-product-note">
                {systemName} is a drive-less, physically isolated optical
                library. Write and verify preservation media on a compatible
                online ELS system, then transfer approved media into the
                offline library. oRain can track the object&apos;s media location;
                retrieval requires an authorized, controlled mount-and-restore
                workflow.
              </p>
            )}
            {!offline && !hasIntegratedCache && scalable && (
              <p className="use-case-story-product-note">
                {systemName} is an online optical library for enterprise scale.
                Pair it with the required performance/cache tier and add
                networked ELS libraries under oRain&apos;s unified namespace as the
                archive grows. The library does not imply an integrated
                cache server.
              </p>
            )}
            {!offline && !hasIntegratedCache && !scalable && (
              <p className="use-case-story-product-note">
                {systemName} is an online optical library. Pair it with a
                separate SSD/HDD performance tier where active workloads need
                cache-backed access; the optical library provides the managed
                preservation copy.
              </p>
            )}
            {activeStory.requirements && (
              <section
                aria-labelledby="use-case-story-requirements-title"
                className="use-case-story-requirements"
              >
                <p className="use-case-story-section-label">
                  POTENTIAL APPLICABILITY
                </p>
                <h3 id="use-case-story-requirements-title">
                  Requirements and guidance to assess
                </h3>
                <ul>
                  {activeStory.requirements.map((requirement) => (
                    <li key={requirement.name}>
                      <a
                        href={requirement.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {requirement.name}
                        <span aria-hidden="true"> ↗</span>
                      </a>
                      <p>{requirement.applicability}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {activeStory.scopeNote && (
              <p className="use-case-story-scope-note">{activeStory.scopeNote}</p>
            )}
            {activeStory.insightHref && activeStory.insightTitle && (
              <Link
                className="use-case-story-insight-link"
                href={activeStory.insightHref}
              >
                <span>MORE INSIGHTS</span>
                <strong>{activeStory.insightTitle}</strong>
                <small>Read the article →</small>
              </Link>
            )}
            <div className="use-case-story-idea">
              <span>
                {activeStory.requirements
                  ? "WORKFLOW DESIGN"
                  : "IDEA TO EXPLORE"}
              </span>
              <p>{activeStory.idea}</p>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}