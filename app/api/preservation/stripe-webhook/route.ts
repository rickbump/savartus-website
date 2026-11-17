import { after } from "next/server";
import type Stripe from "stripe";
import { markPaid, setStatusBySubscription } from "@/lib/preservation/accounts";
import { stripeConfig } from "@/lib/preservation/config";
import { provisionAccount } from "@/lib/preservation/provision";
import { stripe } from "@/lib/preservation/stripe";

export const runtime = "nodejs";
export const maxDuration = 120;

function idOf(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = await stripe().webhooks.constructEventAsync(
      await request.text(),
      signature,
      stripeConfig().webhookSecret,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      const accountId = session.metadata?.preservationAccountId;
      const customerId = idOf(session.customer);
      const subscriptionId = idOf(session.subscription);
      if (session.payment_status !== "paid" || !accountId || !customerId || !subscriptionId) break;

      if (await markPaid(accountId, session.id, customerId, subscriptionId)) {
        // Acknowledge Stripe now; provision after the response. Failures are
        // retried by /api/preservation/provision-retry.
        after(() => provisionAccount(accountId));
      }
      break;
    }
    case "invoice.payment_failed": {
      const subscriptionId = idOf(event.data.object.parent?.subscription_details?.subscription);
      if (subscriptionId) await setStatusBySubscription(subscriptionId, "past_due");
      break;
    }
    case "invoice.paid": {
      const subscriptionId = idOf(event.data.object.parent?.subscription_details?.subscription);
      if (subscriptionId) await setStatusBySubscription(subscriptionId, "active");
      break;
    }
    case "customer.subscription.deleted": {
      // Preserved data is never removed automatically. Staff handle retention
      // and deletion through Cloutility's deletion-request approval process.
      await setStatusBySubscription(event.data.object.id, "canceled");
      console.warn("Preservation subscription canceled; review retention", {
        subscriptionId: event.data.object.id,
      });
      break;
    }
  }

  return Response.json({ received: true });
}
