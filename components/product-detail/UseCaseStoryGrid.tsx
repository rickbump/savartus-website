"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type UseCaseStory = {
  title: string;
  story: string;
  idea: string;
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
};

const storyPatterns: { matches: string[]; story: UseCaseStory }[] = [
  {
    matches: ["government", "national archive", "public record"],
    story: {
      title: "A record that is still there when it is needed",
      story:
        "A county moves permits, deeds, signed minutes, and case files into an S3-accessible archive. Staff keep responsive access to current records while preserved optical copies give auditors a durable source without changing the way departments retrieve files.",
      idea:
        "Start with one high-value record series, its retention schedule, and the people who need to retrieve it during an audit or public-records request.",
    },
  },
  {
    matches: ["medical", "healthcare", "imaging", "dicom", "pacs"],
    story: {
      title: "Keep the prior study close, and the original safe",
      story:
        "A regional imaging network retains DICOM studies across facilities. Clinicians can retrieve prior images through the online storage tier, while write-once optical copies provide a durable source for long retention and recovery if the performance tier is damaged.",
      idea:
        "Map the path from PACS ingest to clinical retrieval, then identify which studies need fast access and which must remain verifiable for decades.",
    },
  },
  {
    matches: ["evidence", "forensic", "legal", "court", "surveillance"],
    story: {
      title: "Keep closed-case evidence accessible without trusting one aging disk estate",
      story:
        "A county evidence unit holds body-camera video, surveillance exports, interviews, and forensic images long after cases close. Its evidence-management system, whether a third-party platform or the Savartus Evidence Management System, remains authoritative for case IDs, custody events, legal holds, and disclosure. A third-party video management system (VMS) can continue to manage video operations. ELS150 or ELS300 can be integrated with these and other file-management systems through supported interfaces and workflows. Routine file access is served from the appliance's built-in cache, and each write automatically creates a second copy on write-once optical media. When the disk estate is refreshed or a cache drive fails, the optical copy gives staff another recovery source without changing the investigators’ normal workflow.",
      idea:
        "Design the integration and ingest workflow across a third-party VMS or the Savartus Evidence Management System, other file-management platforms, and ELS150 or ELS300 using interfaces each system supports. Preserve case and item identifiers, acquisition provenance, hash checks at receipt and retrieval, access history, legal holds, media location, periodic fixity checks, and a tested restore. Keep an off-site copy if the agency’s threat model requires geographic recovery.",
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
    matches: ["scientific", "research", "satellite", "remote-sensing", "survey", "experiment"],
    story: {
      title: "Research data that stays usable after the project ends",
      story:
        "A research team preserves satellite scenes, survey captures, and experiment outputs without leaving every completed project on expensive primary storage. Analysts can return to individual files while durable optical copies protect source data for future studies.",
      idea:
        "Pick a project that has completed its active phase and describe how a future researcher would discover, validate, and retrieve one source file.",
    },
  },
  {
    matches: ["compliance", "regulated", "regulatory", "retention", "audit", "governance"],
    story: {
      title: "Retention follows the obligation, not a storage refresh cycle",
      story:
        "A compliance team applies retention rules to contracts, quality records, and operational evidence. Routine access stays available while a write-once optical copy can remain preserved beyond the refresh life of a disk array.",
      idea:
        "Take one retention policy and identify the data event that starts it, the evidence of a successful optical write, and the approved disposition date.",
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
    matches: ["ai", "machine learning", "training dataset", "model"],
    story: {
      title: "Preserve the dataset behind the model",
      story:
        "An AI team retains training inputs, evaluation sets, and the associated release artifacts after a model ships. Researchers can revisit the data while durable optical copies keep a reference set for reproducibility, governance, and later model comparisons.",
      idea:
        "Define a dataset release as a bundle: source objects, labels, preprocessing version, evaluation results, and the record that connects them.",
    },
  },
  {
    matches: ["defense", "critical infrastructure", "security"],
    story: {
      title: "Long-lived records for high-consequence operations",
      story:
        "An operational team preserves mission records, inspections, and incident data while keeping recent material available to authorized users. Write-once optical copies add a durable recovery source alongside normal operational access.",
      idea:
        "Select one operational record set and map its access boundaries, retention obligation, and recovery path after loss of the primary environment.",
    },
  },
  {
    matches: ["media", "cultural", "film", "heritage", "digital preservation"],
    story: {
      title: "A working collection with a preserved source",
      story:
        "A media or cultural institution keeps masters, born-digital works, and production files available to curators without treating preservation as a once-a-decade migration project. Durable write-once optical copies retain source material as collections evolve.",
      idea:
        "Choose a collection and separate preservation masters, access derivatives, descriptive records, and rights information into a retrieval-ready package.",
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

export function UseCaseStoryGrid({ useCases, systemName }: Props) {
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeStory = activeUseCase ? getStory(activeUseCase) : null;
  const hasIntegratedCache = systemName === "ELS150" || systemName === "ELS300";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeUseCase && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [activeUseCase]);

  return (
    <>
      <div className="product-use-case-grid">
        {useCases.map((useCase, index) => (
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
            {hasIntegratedCache && (
              <p className="use-case-story-product-note">
                {systemName} includes its disk cache server in the same
                appliance. Everyday access runs through that built-in cache,
                and each write automatically creates a second copy on
                write-once optical media.
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