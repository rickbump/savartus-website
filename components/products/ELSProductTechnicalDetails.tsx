"use client";

import { useId, useState } from "react";
import type { ELSTechnicalSpecs } from "@/data/els-products";

type Props = {
  model: string;
  technicalSpecs: ELSTechnicalSpecs;
};

type DetailGroup = {
  title: string;
  rows: {
    label: string;
    value: string;
  }[];
};

export function ELSProductTechnicalDetails({
  model,
  technicalSpecs,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = useId();

  const detailGroups: DetailGroup[] = [
    {
      title: "Media Configuration",
      rows: [
        { label: "Cartridges", value: technicalSpecs.cartridges },
        { label: "Media per cartridge", value: technicalSpecs.mediaPerCartridge },
        { label: "Magazines", value: technicalSpecs.magazines },
        {
          label: "Cartridges per magazine",
          value: technicalSpecs.cartridgesPerMagazine,
        },
        { label: "Maximum media", value: technicalSpecs.maxMedia },
      ],
    },
    {
      title: "Capacity",
      rows: [
        { label: "With 200 GB media", value: technicalSpecs.capacity200GB },
        { label: "With 500 GB media", value: technicalSpecs.capacity500GB },
        { label: "With 1 TB media", value: technicalSpecs.capacity1TB },
      ],
    },
    {
      title: "Drives and Power",
      rows: [
        {
          label: "Maximum addressable drives",
          value: technicalSpecs.maxAddressableDrives,
        },
        { label: "Power requirements", value: technicalSpecs.powerRequirements },
        {
          label: "Peak energy consumption",
          value: technicalSpecs.peakEnergyConsumption,
        },
        {
          label: "Typical energy consumption",
          value: technicalSpecs.typicalEnergyConsumption,
        },
      ],
    },
    {
      title: "Physical",
      rows: [
        { label: "Dimensions", value: technicalSpecs.dimensionsInches },
        { label: "Dimensions metric", value: technicalSpecs.dimensionsCm },
        { label: "Rack units", value: technicalSpecs.rackUnits },
        { label: "Weight", value: technicalSpecs.weightLbs },
        { label: "Weight metric", value: technicalSpecs.weightKg },
      ],
    },
  ];

  return (
    <div className="product-extended-details">
      <button
        type="button"
        className="button button-secondary product-extended-toggle"
        aria-expanded={isExpanded}
        aria-controls={detailsId}
        onClick={() => setIsExpanded((current) => !current)}
      >
        {isExpanded ? "Show Less" : "Extended Details"}
      </button>

      {isExpanded && (
        <div id={detailsId} className="product-extended-panel">
          <div className="product-extended-header">
            <p className="product-detail-eyebrow">EXTENDED DETAILS</p>
            <h3>{model} technical details.</h3>
          </div>

          <div className="product-extended-grid">
            {detailGroups.map((group) => (
              <article className="product-extended-group" key={group.title}>
                <h4>{group.title}</h4>

                <div className="product-extended-table">
                  {group.rows.map((row) => (
                    <div className="product-extended-row" key={row.label}>
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="button button-secondary product-extended-toggle"
            onClick={() => setIsExpanded(false)}
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
}
