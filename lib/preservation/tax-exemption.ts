// US sales tax exemptions claimed at signup. The customer is charged without
// tax straight away; staff then review the uploaded certificate and approve or
// revoke it (scripts/preservation-tax-review.mts). These checks only catch
// typing mistakes and obvious junk early.

export const exemptionTypes = [
  { id: "federal_government", label: "US federal government agency", numberRequired: false },
  { id: "state_local_government", label: "State or local government (including police and courts)", numberRequired: true },
  { id: "nonprofit", label: "Nonprofit, such as a 501(c)(3)", numberRequired: true },
  { id: "education", label: "School, college or university", numberRequired: true },
  { id: "resale", label: "Resale", numberRequired: true },
  { id: "other", label: "Other exemption", numberRequired: true },
] as const;

export type ExemptionType = (typeof exemptionTypes)[number]["id"];

export const usStates: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
  KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts",
  MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico",
  NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", PR: "Puerto Rico", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

// EIN prefixes the IRS lists as invalid or no longer assigned (IRM). A few
// old organizations still hold some of them, so a match is flagged for
// staff, not refused.
const unassignedEinPrefixes = new Set(["00", "07", "08", "09", "17", "18", "19", "28", "29", "49", "69", "70", "78", "79", "89", "96", "97"]);

type Rule = {
  pattern: RegExp;
  // Strict rules come from the issuing agency and refuse a mismatch. Others
  // were seen on sample certificates only and just flag it for staff.
  strict: boolean;
  example: string;
};

// Known formats, checked on the number with spaces and dashes removed.
const stateRules: Record<string, Rule> = {
  // Illinois Department of Revenue: "E99" followed by six digits (E99XX-XXXX).
  IL: { pattern: /^E\d{8}$/, strict: true, example: "E9912-3456" },
  // Florida Consumer's Certificate of Exemption (DR-14), e.g. 85-8012345678C-9.
  FL: { pattern: /^85\d{10}C\d$/, strict: false, example: "85-8012345678C-9" },
};

export type ExemptionRequest = {
  type: ExemptionType;
  state: string;
  number: string | null;
};

export type ExemptionCheck =
  | { ok: true; request: ExemptionRequest; warnings: string[] }
  | { ok: false; error: string };

export function checkExemption(input: { type: unknown; state: unknown; number: unknown }): ExemptionCheck {
  const type = exemptionTypes.find((option) => option.id === input.type);
  if (!type) return { ok: false, error: "Please choose the type of tax exemption." };

  const state = typeof input.state === "string" ? input.state.trim().toUpperCase() : "";
  if (!usStates[state]) return { ok: false, error: "Please choose the state that issued your exemption." };

  const raw = typeof input.number === "string" ? input.number.trim().toUpperCase() : "";
  if (!raw) {
    return type.numberRequired
      ? { ok: false, error: "Please enter your exemption or certificate number." }
      : { ok: true, request: { type: type.id, state, number: null }, warnings: [] };
  }
  if (raw.length > 40 || !/^[A-Z0-9][A-Z0-9 ./-]*$/.test(raw) || (raw.match(/\d/g)?.length ?? 0) < 3) {
    return { ok: false, error: "That exemption number doesn't look right. Please check it against your certificate." };
  }

  const compact = raw.replace(/[\s./-]/g, "");
  const warnings: string[] = [];

  if (type.id === "nonprofit" && /^\d{9}$/.test(compact)) {
    // A federal EIN rather than a state number: staff can check it against
    // the IRS Tax Exempt Organization Search.
    if (unassignedEinPrefixes.has(compact.slice(0, 2))) {
      warnings.push(`EIN prefix ${compact.slice(0, 2)} is not currently assigned by the IRS.`);
    }
  } else {
    const rule = stateRules[state];
    if (rule && !rule.pattern.test(compact)) {
      if (rule.strict) {
        return {
          ok: false,
          error: `${usStates[state]} exemption numbers look like ${rule.example}. Please check it against your certificate.`,
        };
      }
      warnings.push(`Number doesn't match the usual ${usStates[state]} format (${rule.example}).`);
    }
  }

  return { ok: true, request: { type: type.id, state, number: raw }, warnings };
}

export function exemptionLabel(type: string | null | undefined) {
  return exemptionTypes.find((option) => option.id === type)?.label ?? type ?? "";
}

// Exemption certificates uploaded at signup. Vercel limits a request body to
// 4.5 MB, so the file must fit well inside that with the form fields.
export const CERTIFICATE_MAX_BYTES = 4 * 1024 * 1024;
export const CERTIFICATE_ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

const certificateKinds = [
  { type: "application/pdf", extension: "pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { type: "image/png", extension: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { type: "image/jpeg", extension: "jpg", magic: [0xff, 0xd8, 0xff] },
];

// Identifies the file by its contents, not its name or claimed type.
export function certificateKind(bytes: Uint8Array) {
  return certificateKinds.find((kind) => kind.magic.every((byte, index) => bytes[index] === byte));
}
