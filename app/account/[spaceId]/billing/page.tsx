import type { Metadata } from "next";
import { openBillingPortal } from "@/app/account/actions";
import { formatDate } from "@/lib/account/format";
import { requireSpace } from "@/lib/account/session";
import { stripe } from "@/lib/preservation/stripe";
import { findTier } from "@/lib/preservation/tiers";

export const metadata: Metadata = { title: "Billing" };
export const dynamic = "force-dynamic";

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default async function BillingPage({
  params,
  searchParams,
}: {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { spaceId } = await params;
  const { error } = await searchParams;
  const { account } = await requireSpace(spaceId, "admin");

  let invoices: { id: string; number: string | null; date: number; total: number; currency: string; status: string | null; url: string | null }[] = [];
  let upcoming: string | null = null;
  if (account.stripe_customer_id) {
    try {
      const list = await stripe().invoices.list({ customer: account.stripe_customer_id, limit: 12 });
      invoices = list.data.map((invoice) => ({
        id: invoice.id!,
        number: invoice.number,
        date: invoice.created,
        total: invoice.total,
        currency: invoice.currency,
        status: invoice.status,
        url: invoice.hosted_invoice_url ?? null,
      }));
      if (account.stripe_subscription_id) {
        const subscription = await stripe().subscriptions.retrieve(account.stripe_subscription_id);
        const periodEnd = subscription.items.data[0]?.current_period_end;
        upcoming = periodEnd ? formatDate(new Date(periodEnd * 1000)) : null;
      }
    } catch {
      // Billing details are optional here; the portal button still works.
    }
  }

  return (
    <>
      <h2>Billing</h2>
      {error && <p className="preservation-error">Billing isn&apos;t available for this space yet. Contact info@savartus.com.</p>}
      <dl className="account-facts">
        <div>
          <dt>Plan</dt>
          <dd>{findTier(account.tier)?.label ?? account.tier} committed capacity, billed monthly</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{account.status === "past_due" ? <strong className="account-warning">Payment overdue</strong> : "Active"}</dd>
        </div>
        {upcoming && (
          <div>
            <dt>Next invoice</dt>
            <dd>{upcoming}</dd>
          </div>
        )}
      </dl>
      <form action={openBillingPortal}>
        <input type="hidden" name="spaceId" value={spaceId} />
        <button type="submit" className="button button-primary">
          Manage payment method and billing details
        </button>
      </form>
      <p className="account-muted account-small">
        Opens Stripe&apos;s secure billing page. Plans move up automatically as you grow and never move
        down, because preserved data is written once. To change or end a plan, contact info@savartus.com.
      </p>
      <h3>Invoices</h3>
      {invoices.length === 0 ? (
        <p className="account-muted">No invoices yet.</p>
      ) : (
        <div className="account-table-wrap">
          <table className="account-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    {invoice.url ? (
                      <a href={invoice.url} target="_blank" rel="noreferrer">
                        {invoice.number ?? "Draft"}
                      </a>
                    ) : (
                      invoice.number ?? "Draft"
                    )}
                  </td>
                  <td>{formatDate(new Date(invoice.date * 1000))}</td>
                  <td>{money(invoice.total, invoice.currency)}</td>
                  <td>{invoice.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
