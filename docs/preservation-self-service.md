# Self-service optical preservation: setup runbook

Customers sign up at `/preservation/signup`, choose a starting capacity, and pay through Stripe Checkout. Once payment succeeds, this site provisions their space in Cloutility:

1. A business unit for the customer, under the self-service parent, created with a contract (tier subscription, payment terms, and an ERP reference `savartus-<account id>` that billing data is matched on).
2. A portal user with the customer role. Cloutility emails the activation (password-creation) link.
3. An S3 Optical (oRain) user, `pres-<first 8 of account id>`. The customer creates its access key and secret in the portal with **Renew secret**.
4. A consumption unit (external reference = account id) and an oRain bucket built from the preservation preset, on the magazines enabled in the parent's magazine filter.

The confirmation page polls `/api/preservation/status` and shows each step. When provisioning finishes, the customer gets a welcome email with the bucket name and connection details, and a link to `/preservation/getting-started`.

Usage is billed from Cloutility's monthly billing data (`lib/preservation/usage-pricing.ts`):

- The plan's monthly price is charged in advance.
- Each additional TB, with partial TB rounded up, is billed at the plan's per-TB rate. A 5 TB plan using 9 TB pays $35 + 4 × $7 = $63.
- Reaching the next tier's size moves the whole account to that tier's pricing, and the plan is upgraded from the next period. A 5 TB plan at 10 TB pays $65 that month: 10 × $6.50, less the $35 already billed. From then on it is on the $65 plan, and the customer is emailed.
- Plans never move down.
- Charges are added to the customer's next Stripe invoice as itemized lines, and recorded in `preservation_usage_charges` so a repeated notification never bills twice.

The signup page's cost calculator uses the same pricing function, so its estimates match invoices.

| Piece | Path |
|---|---|
| Signup page, form, calculator, FAQ | `app/preservation/signup/`, `components/preservation/` |
| Checkout | `app/api/preservation/checkout/route.ts` |
| Confirmation page and progress | `app/preservation/signup/complete/`, `app/api/preservation/status/route.ts` |
| Stripe events | `app/api/preservation/stripe-webhook/route.ts` |
| Provisioning (resumable) | `lib/preservation/provision.ts`, `lib/preservation/cloutility.ts` |
| Emails (welcome, upgrade, staff alerts) | `lib/preservation/notify.ts` |
| Retry job | `app/api/preservation/provision-retry/route.ts` |
| Monthly usage billing | `app/api/preservation/billing-data/route.ts`, `lib/preservation/usage-pricing.ts` |
| Customer guide, terms, privacy | `app/preservation/getting-started/`, `app/preservation/terms/`, `app/privacy/` |
| Database | `scripts/preservation-accounts.sql` |

## 1. Database

Run `scripts/preservation-accounts.sql` against the Neon database (`DATABASE_URL`).

## 2. Cloutility (system owner)

Current production setup: parent **Savartus_API** (bunit 39), oRain server **HDL 001** (id 1), preset **Preservation** (id 2), customer role **Online preservation customer** (id 6), subscription **Online optical preservation** (id 6), payment terms **Paid by card (Stripe)** (id 1), product code **SAV-OPT-PRES**.

1. **Self-service parent business unit.** Every customer unit is created under it. Record its ID as `CLOUTILITY_SELF_SERVICE_BUNIT_ID`.
2. **Payment terms** (User's manual §5.11), on the system owner unit. Every contract must name payment terms or Cloutility rejects it ("Contract must have PaymentTerms"). Record the ID as `CLOUTILITY_PAYMENT_TERMS_ID`.
3. **Subscription.** One "Total storage" product settled as a package: 1 TB per package, **0 included packages**, price 0, settlement method "Last". Stripe does all the charging; Cloutility only reports the package count. Assign it to the parent. One subscription serves every tier: set `CLOUTILITY_SUBSCRIPTION_TB1`, `_TB5`, `_TB10` and `_TB25` to its ID, and the product code as `CLOUTILITY_STORAGE_PRODUCT_CODE`.
4. **S3 Optical settings on the parent** (§5.13.3):
   - **Preset** with burn mode, burn type, clean type, disc type and minimum burn capacity set. Record its ID as `CLOUTILITY_ORAIN_BUCKET_PRESET_ID`.
   - **Magazine filter.** Enable the magazines self-service buckets may use. Provisioning puts every new bucket on all enabled magazines and stops with an error if none are enabled. Change the pool here at any time; existing buckets are not moved.
5. **Customer role**, on the parent, **inheritable**. Keep it read-only so customers cannot change what billing depends on:
   - Business unit, Consumption unit, Consumption, S3 Optical/Bucket, Backend admin/Server, Status report: **View**
   - S3 Optical/User account: **View, Renew secret**
   - Settings/User: View, Edit (add Create plus Settings/Role View only if customers may invite colleagues)
   - Nothing on contracts, subscriptions, payment terms, deletion requests, presets or backup nodes. In particular **Consumption unit: Edit** would let customers change the external reference and billing dates.

   Record its ID as `CLOUTILITY_CUSTOMER_ROLE_ID`.
6. **Deletion approvals.** On the system owner unit, require at least one approval with Savartus as final approver, so customers can never delete preserved data on their own.
7. **Service account and provisioning role.**
   - The role must be **inheritable**. A role that isn't is invisible in child units, and provisioning fails to assign the customer role.
   - It must **hold every privilege of the customer role**, because Cloutility only lets an account grant privileges it holds ("User is not allowed to grant privilege …"). That includes Backup node View if the customer role ever has it.
   - Beyond those: Business unit, Consumption unit, Contract, User (View/Create/Edit); S3 Optical/Bucket and User account (View/Create, plus Edit and Renew secret on user accounts); Deletion request (View/Create); and View on Consumption, Backend admin/Data center and Server, S3 Optical/Preset, Settings/Payment terms, Settings/Role, Settings/Subscription and Status report. Add **Settings/Billing data View** so the billing route can read billing data.
   - Create the user on the parent, turn off multi-factor authentication for it, and record the credentials as `CLOUTILITY_USERNAME` and `CLOUTILITY_PASSWORD`.
8. **API access** (Administrator's manual §9.3), registered on the **system owner** unit: an application whose origin is this site, e.g. `https://www.savartus.com`. Record its client ID as `CLOUTILITY_CLIENT_ID` and the origin as `CLOUTILITY_ORIGIN`. Every request's `Origin` header must match it exactly.
9. **Fixed outbound IP** (§9.5). Cloutility binds access tokens to the caller's IP address. Make sure this site's server-side requests leave from a fixed IP, through a static-egress option or a proxy, and add that IP to `api:HostWhiteList` in the API's `Web.config`.
10. **oRain credentials on HDL 001.** Cloutility signs in to oRain with the account under HDL 001 > Profile. If that password expires, every S3 user and bucket creation fails with oRain code 3004 "User credentials have expired". Use a dedicated oRain account whose password does not expire, and check HDL 001 > Logs after any change.
11. **Billing-data subscriber** on the parent (§7.1): Post URL `https://<site>/api/preservation/billing-data?token=<CLOUTILITY_BILLING_WEBHOOK_TOKEN>`. Run a billing simulation first (section 6).

### Cloutility API behaviour the code works around

These are handled in `lib/preservation/cloutility.ts`. Keep them in mind when changing it:

| Behaviour | Handling |
|---|---|
| `POST users` without `userIdentities` fails with 500 "The given key was not present in the dictionary" | Always send `userIdentities: []` |
| Email addresses are unique across all of Cloutility; creating a user with an existing one returns 409 | The account is held for staff (section 5) |
| `GET …/orainbucket` returns **409** "No ORain bucket was related…" (not 404) when there is none | Treated as "no bucket yet" |
| A referenced preset's settings are not applied by the API ("Minimum burn capacity must be greater than 0") | The preset's values are copied into the bucket request |
| A bucket without magazines, or with the S3 user given only as `{ id }`, fails with 500 "Object reference not set…" (`ORainBucketSvc.cs:line 563`) | Magazines and the S3 user are sent as the full objects read from the API |
| Errors carry `developerMessage` and a server stack trace | The message is stored in `last_error`; the top of the stack is logged as `serverStack` |

## 3. Stripe

Everything in Stripe is created by `scripts/stripe-setup.mjs`. It is safe to re-run.

1. Set each tier's monthly price in `scripts/preservation-pricing.json`, in whole currency units. Current pricing: 1 TB at $7.50; 5 TB at $35; 10 TB at $65; 25 TB at $150.
2. Put `STRIPE_SECRET_KEY` (start with an `sk_test_` key) and `SITE_URL` in `.env.local`.
3. Run `npm run stripe:setup` for a dry run, then `npm run stripe:setup -- --apply`. This creates or updates:
   - the product `savartus_optical_preservation`
   - a monthly price for each tier (lookup keys `preservation_tb*_monthly`)
   - a webhook endpoint at `<SITE_URL>/api/preservation/stripe-webhook` for the five events the site handles
   - a customer billing portal (cards, billing details, invoices; cancellation and plan changes are off) with a login page
4. Copy the printed `STRIPE_*` variables into the deployment environment. The webhook signing secret is printed only when the endpoint is first created.
5. In the Dashboard: turn on Smart Retries and choose what happens after the final failed retry (leave the subscription past due rather than cancelling it), turn on customer emails for failed payments and upcoming renewals, and set branding (logo, colours) for Checkout, invoices and the portal.
6. Repeat with an `sk_live_` key and the production `SITE_URL` for live mode.

Changing an amount and re-running creates a new price, moves the lookup key to it and archives the old price. Existing subscribers stay on their old price until you move them in the Dashboard.

Optional: register for Stripe Tax and enable automatic tax on the Checkout session in `app/api/preservation/checkout/route.ts`.

## 4. Environment variables

```
SITE_URL=https://www.savartus.com
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_TB1=
STRIPE_PRICE_TB5=
STRIPE_PRICE_TB10=
STRIPE_PRICE_TB25=
STRIPE_PORTAL_LOGIN_URL=                # optional, printed by stripe:setup
CLOUTILITY_API_URL=https://portal-api.savartus.com
CLOUTILITY_CLIENT_ID=
CLOUTILITY_ORIGIN=https://www.savartus.com
CLOUTILITY_USERNAME=
CLOUTILITY_PASSWORD=
CLOUTILITY_SELF_SERVICE_BUNIT_ID=
CLOUTILITY_CUSTOMER_ROLE_ID=
CLOUTILITY_ORAIN_BUCKET_PRESET_ID=
CLOUTILITY_PAYMENT_TERMS_ID=
CLOUTILITY_PORTAL_URL=https://portal.savartus.com
CLOUTILITY_WELCOME_URL=                 # optional: portal password-creation page (defaults to the portal URL)
CLOUTILITY_ORAIN_SERVER_ID=             # optional: only if the parent business unit doesn't set the oRain server
CLOUTILITY_SUBSCRIPTION_TB1=
CLOUTILITY_SUBSCRIPTION_TB5=
CLOUTILITY_SUBSCRIPTION_TB10=
CLOUTILITY_SUBSCRIPTION_TB25=
CLOUTILITY_STORAGE_PRODUCT_CODE=
CLOUTILITY_BILLING_WEBHOOK_TOKEN=       # long random string
PRESERVATION_JOB_TOKEN=                 # long random string
PRESERVATION_S3_ENDPOINT=               # public S3 endpoint shown to customers, e.g. https://s3.savartus.com
PRESERVATION_S3_REGION=                 # optional, defaults to us-east-1
PRESERVATION_SENDER_EMAIL=              # mailbox emails are sent from (defaults to SPECIFICATION_SENDER_EMAIL)
PRESERVATION_STAFF_EMAIL=               # receives staff alerts and a copy of customer emails
PRESERVATION_SIGNUP_ENABLED=            # "true" shows the signup button and opens /preservation/signup; redeploy after changing
AZURE_TENANT_ID=                        # Microsoft Graph app with Mail.Send (shared with the specification emails)
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
```

If the mail settings are missing, emails are skipped and logged; provisioning and billing still run.

## 5. Retries, held accounts, and alerts

Call `GET /api/preservation/provision-retry` with `Authorization: Bearer $PRESERVATION_JOB_TOKEN` every 10 minutes. It resumes any account whose provisioning failed or was interrupted. Each step is recorded as it succeeds, so a retry continues where the last run stopped.

- After **8 attempts** the retry job stops. The account stays `failed` with the error in `last_error`.
- An error a retry cannot fix (today: the customer's email already has a Cloutility login elsewhere) **holds** the account at once.
- Staff get an email on the first failure, when an account is held, and when retries run out.

To resume an account after fixing the cause:

```sql
UPDATE preservation_accounts SET provisioning_attempts = 0 WHERE id = '<account id>';
```

The next retry run picks it up. To see accounts needing attention:

```sql
SELECT id, organization, email, status, provisioning_attempts, last_error
FROM preservation_accounts WHERE status = 'failed' ORDER BY updated_at;
```

## 6. Usage billing: verify before go-live

The pricing, charging, duplicate-skipping, and upgrade logic was tested end to end in Stripe test mode: an overage charge, a duplicate run skipped, and a tier upgrade that moved the subscription price.

**How billing data arrives (confirmed 2026-11-17).** Cloutility's Post URL carries only a notification: `{"trigger":"new billing data available"}`, or `{"trigger":"test for new billing data available"}` from the subscriber's Verify button (acknowledged with 200, nothing billed). On a real trigger the route reads the newest run from `GET v1/bunits/{parent}/billing`, fetches it with `GET v1/bunits/{parent}/billing/{date}`, and takes each invoice's `PayingBusinessUnit.Contract.ErpReference` and each line's `Product.ProductCode.Name` (or `InheritedProductCode.Name`) and `Quantity`. If billing data has lines but none with `CLOUTILITY_STORAGE_PRODUCT_CODE`, staff get an alert and nothing is charged.

**Dry run.** `GET /api/preservation/billing-data?token=<token>&date=YYYY-MM-DD&forecast=true` shows the billing lines Cloutility would produce for that date (future dates are simulated) and what each account would be charged. It charges nothing.

- [ ] **Usage quantity.** Once a test bucket holds data, run a dry run for the next billing date and confirm the storage line's `Quantity` is the customer's total number of 1 TB packages, not just the packages above an included amount. (On 2026-11-17 the simulation had no lines because the test bucket is empty.)

## 7. Launch checklist

Engineering and operations:

- [ ] **Public S3 endpoint** for HDL 001 (it is on a private address, `10.2.1.10`), with a TLS certificate; set `PRESERVATION_S3_ENDPOINT`. Confirm whether clients need path-style addressing (the getting-started page currently says so).
- [ ] **Dedicated oRain account** for Cloutility with a non-expiring password (section 2, step 10).
- [ ] **Fixed outbound IP** for the site, whitelisted in Cloutility (section 2, step 9).
- [ ] **Usage billing verified** (section 6), then the billing-data subscriber created.
- [ ] **Retry job scheduled** (section 5).
- [ ] **Mail settings** set in production and a welcome email received on a test signup.
- [ ] **Stripe live mode** set up (section 3), webhook secret in production, Dashboard settings done.
- [ ] **One live end-to-end signup** with a real card, then refunded: confirmation page progress, both emails, portal login, Renew secret, and an upload with an S3 client.
- [ ] Tidy test data: the "gelos, llc" test unit, the Portal test user, and the unused API applications on Savartus_API.

Business and legal:

- [ ] **Service terms** (`/preservation/terms`) and **privacy notice** (`/privacy`) reviewed by counsel. Fill every highlighted placeholder, then remove `robots` (noindex) from both pages.
- [ ] **Retention after cancellation** decided and written into the terms. Customers currently cancel by email, and staff handle data through Cloutility's deletion approvals.
- [ ] **Stripe Tax** decision.
- [ ] **Overage cap** decision. Today usage is uncapped; consider a per-account limit with a staff review above it.
