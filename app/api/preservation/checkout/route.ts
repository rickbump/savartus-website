import { randomUUID } from "node:crypto";
import { attachCheckoutSession, insertPendingAccount } from "@/lib/preservation/accounts";
import { signupEnabled, siteUrl, tierStripePrice } from "@/lib/preservation/config";
import { stripe } from "@/lib/preservation/stripe";
import { findTier } from "@/lib/preservation/tiers";

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
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return Response.json({ error: "Please submit the form as JSON." }, { status: 415 });
  }

  const body = await request.text();
  if (body.length > 4096) {
    return Response.json({ error: "The request is too large." }, { status: 413 });
  }

  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    data = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "The form could not be read. Please try again." }, { status: 400 });
  }
  if (data.website) {
    return Response.json({ error: "The request could not be accepted." }, { status: 400 });
  }

  let account: Parameters<typeof insertPendingAccount>[0] & { priceId: string };
  try {
    const tier = findTier(data.tier);
    if (!tier) throw new FormError("Please choose a starting capacity.");
    if (data.acceptTerms !== true) {
      throw new FormError("Please accept the preservation service terms to continue.");
    }
    const email = readText(data, "email", "email address", 254)!.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new FormError("Please enter a valid email address.");
    account = {
      id: randomUUID(),
      tier: tier.id,
      includedTb: tier.includedTb,
      name: readText(data, "name", "name", 150)!,
      organization: readText(data, "organization", "organization", 200)!,
      email,
      phone: readText(data, "phone", "phone number", 40, true),
      priceId: tierStripePrice(tier),
    };
  } catch (error) {
    if (error instanceof FormError) return Response.json({ error: error.message }, { status: 400 });
    console.error("Preservation checkout misconfigured", { type: error instanceof Error ? error.name : "Unknown" });
    return Response.json({ error: "Online signup is unavailable right now. Please contact info@savartus.com." }, { status: 503 });
  }

  try {
    const base = siteUrl();
    await insertPendingAccount(account);

    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      client_reference_id: account.id,
      customer_email: account.email,
      // Committed plan only; usage above it is added to later invoices
      // from Cloutility's monthly billing data.
      line_items: [{ price: account.priceId, quantity: 1 }],
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      metadata: { preservationAccountId: account.id },
      subscription_data: { metadata: { preservationAccountId: account.id } },
      success_url: `${base}/preservation/signup/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/preservation/signup?canceled=1`,
    }, { idempotencyKey: `preservation-checkout-${account.id}` });

    await attachCheckoutSession(account.id, session.id);
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
