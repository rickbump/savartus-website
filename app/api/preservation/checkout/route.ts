import { randomUUID } from "node:crypto";
import { accountById, emailHasAccount, insertPendingAccount } from "@/lib/preservation/accounts";
import { startCheckout } from "@/lib/preservation/checkout";
import { emailHasLogin } from "@/lib/preservation/cloutility";
import { signupEnabled, tierStripePrice } from "@/lib/preservation/config";
import { createExemptCustomer } from "@/lib/preservation/exemption-review";
import {
  CERTIFICATE_MAX_BYTES,
  certificateKind,
  checkExemption,
  type ExemptionRequest,
} from "@/lib/preservation/tax-exemption";
import { findTier, findUseCase } from "@/lib/preservation/tiers";

export const runtime = "nodejs";

class FormError extends Error {}

function readText(data: Record<string, unknown>, key: string, label: string, limit: number, optional = false) {
  const value = data[key];
  if ((value === undefined || value === "") && optional) return null;
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > limit ||
    Array.from(value).some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })
  ) {
    throw new FormError(`Please enter a valid ${label}.`);
  }
  return value.trim();
}

export async function POST(request: Request) {
  if (!signupEnabled()) return Response.json({ error: "Signup is not open yet." }, { status: 404 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "This request must come from this website." }, { status: 403 });
  }
  // Multipart: a JSON "data" field plus an optional "certificate" file.
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "multipart/form-data") {
    return Response.json({ error: "Please submit the form from the signup page." }, { status: 415 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > CERTIFICATE_MAX_BYTES + 64 * 1024) {
    return Response.json({ error: "The certificate file is too large. Please upload a file under 4 MB." }, { status: 413 });
  }

  let data: Record<string, unknown>;
  let certificate: { name: string; bytes: Uint8Array } | null = null;
  try {
    const form = await request.formData();
    const body = form.get("data");
    if (typeof body !== "string" || body.length > 4096) throw new Error();
    const file = form.get("certificate");
    if (file instanceof File && file.size > 0) {
      if (file.size > CERTIFICATE_MAX_BYTES) {
        return Response.json({ error: "The certificate file is too large. Please upload a file under 4 MB." }, { status: 413 });
      }
      certificate = { name: file.name || "certificate", bytes: new Uint8Array(await file.arrayBuffer()) };
    }
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    data = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "The form could not be read. Please try again." }, { status: 400 });
  }
  if (data.website) {
    return Response.json({ error: "The request could not be accepted." }, { status: 400 });
  }

  let account: Parameters<typeof insertPendingAccount>[0];
  try {
    const tier = findTier(data.tier);
    if (!tier) throw new FormError("Please choose a starting capacity.");
    const useCase = findUseCase(data.useCase);
    if (!useCase) throw new FormError("Please tell us what you'll mainly store.");
    if (data.acceptTerms !== true) {
      throw new FormError("Please accept the preservation service terms to continue.");
    }
    const email = readText(data, "email", "email address", 254)!.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new FormError("Please enter a valid email address.");

    let exemption: ExemptionRequest | null = null;
    if (data.taxExempt === true) {
      const check = checkExemption({ type: data.exemptionType, state: data.exemptionState, number: data.exemptionNumber });
      if (!check.ok) throw new FormError(check.error);
      exemption = check.request;
      if (!certificate) throw new FormError("Please upload a copy of your exemption certificate.");
      if (!certificateKind(certificate.bytes)) {
        throw new FormError("The certificate must be a PDF, JPEG or PNG file.");
      }
    }

    tierStripePrice(tier); // fail early if the tier's price isn't configured
    account = {
      id: randomUUID(),
      tier: tier.id,
      includedTb: tier.includedTb,
      name: readText(data, "name", "name", 150)!,
      organization: readText(data, "organization", "organization", 200)!,
      email,
      phone: readText(data, "phone", "phone number", 40, true),
      useCase,
      exemption,
    };
  } catch (error) {
    if (error instanceof FormError) return Response.json({ error: error.message }, { status: 400 });
    console.error("Preservation checkout misconfigured", { type: error instanceof Error ? error.name : "Unknown" });
    return Response.json({ error: "Online signup is unavailable right now. Please contact info@savartus.com." }, { status: 503 });
  }

  // One email per account: Cloutility allows an email on only one portal
  // login. Checked before payment so nobody pays for an account that can't be
  // set up. If Cloutility can't be reached, signup continues; provisioning
  // still catches a clash and alerts staff.
  let cloutilityLogin = false;
  try {
    cloutilityLogin = await emailHasLogin(account.email);
  } catch (error) {
    console.error("Preservation email check failed", { type: error instanceof Error ? error.message : "UnknownError" });
  }
  if (cloutilityLogin || (await emailHasAccount(account.email))) {
    return Response.json(
      {
        error:
          "An account already exists for this email address. Log in to manage it, or use a different email address to create a new account.",
        code: "email_exists",
        loginUrl: process.env.CLOUTILITY_PORTAL_URL?.trim() || "https://portal.savartus.com",
      },
      { status: 409 },
    );
  }

  try {
    await insertPendingAccount(account);
    let saved = (await accountById(account.id))!;

    if (account.exemption && certificate) {
      // Created as tax exempt, so checkout charges no tax. Staff are emailed
      // the claim and certificate once payment succeeds (stripe-webhook).
      await createExemptCustomer(saved, certificate);
      saved = (await accountById(account.id))!;
    }

    const session = await startCheckout(saved, { idempotent: true });
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Preservation checkout failed", {
      type: error instanceof Error ? error.name : "UnknownError",
    });
    return Response.json(
      { error: "We couldn't start checkout right now. Please try again shortly, or contact info@savartus.com." },
      { status: 503 },
    );
  }
}
