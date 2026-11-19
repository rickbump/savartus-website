# Self-service optical preservation: setup runbook

Customers sign up at `/preservation/signup`, choose a starting capacity, and pay through Stripe Checkout. Once payment succeeds, this site provisions their space in Cloutility:

1. A business unit for the customer, under the self-service parent, created with a contract (tier subscription, payment terms, and an ERP reference `savartus-<account id>` that billing data is matched on).
2. An S3 Optical (oRain) user, `pres-<first 8 of account id>`.
3. A consumption unit (external reference = account id) and an oRain bucket built from the preservation preset, on the magazines enabled in the parent's magazine filter.
4. The **account space**: the site records the bucket and S3 user, issues an S3 secret through Cloutility (`renews3secret`) and stores it encrypted, and makes the subscriber the space's administrator.

Customers get **no Cloutility portal login**. Cloutility and the oRain file manager are staff tools. The confirmation page polls `/api/preservation/status` and shows each step. When provisioning finishes, the customer gets a welcome email that sends them to `/account`.

## Account space (`/account`)

- **Sign-in:** email and password at `/account/signin`.
  - Passwords are hashed with scrypt and must be at least 10 characters. Ten wrong passwords lock the account for 15 minutes.
  - The password is set through a one-time emailed link to `/account/set-password`. The link comes from the welcome email or an invitation (valid 7 days), or from "Set or reset your password" at `/account/password` (valid 1 hour, at most 5 links per hour). That page gives the same answer for unknown addresses.
  - Setting a password signs out the person's other browsers.
  - Sessions last 30 days in a `savartus_session` cookie, and the database stores only hashes of tokens and session IDs.
- **Roles:** one `preservation_accounts` row is one space. The subscriber is its first administrator.
  - Administrators invite people by email as members or administrators, change roles, and remove people. A space always keeps at least one administrator. Removal takes effect on the next request.
  - Everyone can use **Files** and **Usage**. Administrators also see **Members**, **S3 keys**, **Billing** (invoices, plus the Stripe portal for card and billing details) and **Activity**.
- **Files:** browse folders, search names across the space, upload, download, and restore from disc.
  - The site uses the space's own S3 user, which can only reach its own bucket, to list files and to sign 15-minute links. Upload and download links go straight from the browser to the public S3 gateway (`PRESERVATION_S3_ENDPOINT`, CORS already allows browser uploads), so file data never passes through Vercel.
  - Uploading: a drop zone, **Choose files** and **choose a folder**. Folders keep their structure from the dropped or chosen folder down, so dropping `Projects` into `C/Users/Rick` stores `C/Users/Rick/Projects/2024/report.pdf`. Browsers never reveal the drive or the path above the dropped item. The Files page, the guide and the welcome email all warn that files can't be moved or renamed after upload (the path is permanent, and a re-upload stores and bills a second copy), and explain how to keep the full path. To keep that too, create the matching folder path first: **New folder** accepts a path such as `C/Users/Rick`, and `C:` becomes `C`. Uploads run three at a time.
  - Browser uploads are limited to 5 GB per file (one signed PUT). Larger files go through S3 software.
  - An upload to an existing name is refused (write-once).
  - Status comes from the storage class: STANDARD = in the cache, waiting to be written to disc; GLACIER = on disc. A file on disc is restored for 7 days before it can be downloaded.
  - Search and usage scan the bucket listing, capped at 100,000 objects.
- **S3 keys:** endpoint, region, bucket and access key. **Create a new secret key** renews the secret in Cloutility, shows it once, and stores it encrypted for the site's own use.
- **Not built yet:** deletion (Trash and hiding), disc reclaim, passkeys and two-factor, multipart uploads over 5 GB, and one email owning several spaces (signup still refuses an email that already has a paid space).

| Piece | Path |
|---|---|
| Pages | `app/account/`, `components/account/` |
| Sign-in, sessions, members | `app/account/actions.ts`, `lib/account/session.ts`, `lib/account/store.ts` |
| File access | `lib/account/s3.ts`, `app/api/account/[spaceId]/files/route.ts` |
| Space setup, secret renewal | `lib/account/setup.ts` |
| Database | `scripts/account-space.sql` |

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
| Billing job | `app/api/preservation/billing-sync/route.ts`, `lib/preservation/usage-billing.ts`, schedule in `vercel.json` |
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
| Email addresses are unique across all of Cloutility; creating a user with an existing one returns 409 | Signup refuses an email that already has a paid account or a Cloutility login the service account can find (`search/users`), before payment, and offers a log-in link. A login elsewhere in Cloutility can still slip through; then the account is held for staff (section 5) |
| `GET …/orainbucket` returns **409** "No ORain bucket was related…" (not 404) when there is none | Treated as "no bucket yet" |
| A referenced preset's settings are not applied by the API ("Minimum burn capacity must be greater than 0") | The preset's values are copied into the bucket request |
| A bucket without magazines, or with the S3 user given only as `{ id }`, fails with 500 "Object reference not set…" (`ORainBucketSvc.cs:line 563`) | Magazines and the S3 user are sent as the full objects read from the API |
| Errors carry `developerMessage` and a server stack trace | The message is stored in `last_error`; the top of the stack is logged as `serverStack` |

## 3. Stripe

Everything in Stripe is created by `scripts/stripe-setup.mjs`. It is safe to re-run.

1. Set each tier's monthly price in `scripts/preservation-pricing.json`, in whole currency units. Current pricing: 1 TB at $7.50; 5 TB at $35; 10 TB at $65; 25 TB at $150.
2. Put `STRIPE_SECRET_KEY` (start with an `sk_test_` key) and `SITE_URL` in `.env.local`.
3. Run `npm run stripe:setup` for a dry run, then `npm run stripe:setup -- --apply`. This creates or updates:
   - the product `savartus_optical_preservation`, with Stripe tax code `txcd_10101000` (IaaS, business use)
   - the product `savartus_evidence_preservation`, with tax code `txcd_10103001` (SaaS, business use), for customers storing evidence
   - a monthly price for each tier (lookup keys `preservation_tb*_monthly`), tax-exclusive
   - a webhook endpoint at `<SITE_URL>/api/preservation/stripe-webhook` for the five events the site handles
   - a customer billing portal (cards, billing details, invoices; cancellation and plan changes are off) with a login page
4. Copy the printed `STRIPE_*` variables into the deployment environment. The webhook signing secret is printed only when the endpoint is first created.
5. In the Dashboard: turn on Smart Retries and choose what happens after the final failed retry (leave the subscription past due rather than cancelling it), turn on customer emails for failed payments and upcoming renewals, and set branding (logo, colours) for Checkout, invoices and the portal.
6. Repeat with an `sk_live_` key and the production `SITE_URL` for live mode.

Changing an amount and re-running creates a new price, moves the lookup key to it and archives the old price. Existing subscribers stay on their old price until you move them in the Dashboard.

### Sales tax and VAT (Stripe Tax)

Checkout runs with automatic tax on, so **signup fails until Stripe Tax is set up** in each mode (sandbox and live). The setup script prints its status at the end.

How tax is calculated:

- Prices are tax-exclusive: tax is added on top.
- Stripe Tax combines the product's tax code with the customer's billing address (required at checkout) and any tax ID they enter.
  - Code `txcd_10101000`, IaaS business use, covers storage over the internet. Signup requires an organization, so every subscriber is a business.
  - A valid EU, UK or similar business tax ID gets reverse charge automatically.
- Automatic tax carries over from Checkout to the subscription, so the following are taxed the same way:
  - renewals
  - plan upgrades
  - usage invoice items (`lib/preservation/usage-billing.ts` gives them the same tax code and behavior)
- Customers can change their address and tax ID in the billing portal; later invoices follow.

Dashboard → Tax, once per mode:

1. **Origin address:** Savartus's head office.
2. **Registrations:** add every jurisdiction where Savartus is registered to collect, which is at least its home state. Stripe collects only where a registration exists. **No registrations means $0 tax everywhere. That is not the same as being exempt.**
3. **Monitoring:** Stripe tracks sales per jurisdiction against economic-nexus thresholds. Register (with the state, then in Stripe) when a threshold is reached.
4. **Exempt customers:** handled at signup (see below). Use "Reverse charge" only on an adviser's instruction.
5. **Filing:** Stripe calculates and collects, but it does not file returns or remit unless you add Stripe's filing partner. Export the Tax reports monthly for the accountant.

**Evidence storage.** Signup asks "What will you mainly store?" A customer who answers evidence is billed on the evidence product, so their lines carry the SaaS code. That covers the plan, upgrades and usage. There is one set of prices: checkout and billing put the same amounts on the evidence product (`planLine` in `lib/preservation/checkout.ts`). The answer is saved in `use_case`. To reclassify an existing customer, change the product on their subscription in the Dashboard and update `use_case`.

**Tax-exempt signups.** A customer who ticks "exempt from US sales tax" gives:
- the exemption type
- the issuing state
- the number (optional for federal agencies)
- a copy of the certificate (PDF, JPEG or PNG, under 4 MB)

The site checks the number's format:
- Illinois E-numbers must match the state's format.
- Florida numbers that don't match the usual format are flagged.
- Nonprofit EINs with prefixes the IRS doesn't assign are flagged.
- Anything else must look like a real number.

Before checkout, the site:
- uploads the certificate to Stripe as a file
- creates the Stripe customer marked **Exempt**, with the exemption details and the certificate's file ID in its metadata (`taxExemptCertificateFile`)
- saves both IDs on the account

Checkout and every later invoice therefore charge no tax. When payment succeeds, `PRESERVATION_STAFF_EMAIL` gets "Tax-exempt signup to review", with the details, any format warnings, the certificate attached and a link to the Stripe customer. Provisioning goes ahead as normal. Then:

1. `npx tsx --env-file=.env.local scripts/preservation-tax-review.mts list` shows signups not yet reviewed.
2. Check the certificate:
   - it names the organization
   - it matches the number and state
   - it's signed and not expired
   - it passes the state's verification tool where one exists, or the IRS Tax Exempt Organization Search for a nonprofit EIN
3. **Valid:** `… approve <accountId> --expires YYYY-MM-DD`. The customer stays exempt, and the approval and expiry are written to its Stripe metadata.
4. **Not valid:** talk to the customer, then run `… revoke <accountId>`. This is a dry run that lists each paid invoice and the sales tax that would have been due, using the invoice's date and the customer's billing address. `… revoke <accountId> --apply` then:
   - marks the customer taxable for future invoices
   - charges the back tax on a separate invoice to the card on file
   - records that tax in Stripe Tax reports for filing
5. Certificates expire. Check `taxExemptExpires` in the customer's metadata and ask for renewals.

The certificate is a Stripe file (purpose `tax_document_user_upload`). To see it, open the file ID from the customer's metadata under Dashboard → Files.

Have the tax adviser confirm the codes, the registrations and the review steps before going live. To change the code, set `taxCode` in `scripts/preservation-pricing.json` and `PRESERVATION_TAX_CODE` in `lib/preservation/tiers.ts`, then re-run the script.

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
CLOUTILITY_WELCOME_URL=                 # optional: portal account-activation page (defaults to <CLOUTILITY_PORTAL_URL>/welcome)
CLOUTILITY_ORAIN_SERVER_ID=             # optional: only if the parent business unit doesn't set the oRain server
CLOUTILITY_SUBSCRIPTION_TB1=
CLOUTILITY_SUBSCRIPTION_TB5=
CLOUTILITY_SUBSCRIPTION_TB10=
CLOUTILITY_SUBSCRIPTION_TB25=
CLOUTILITY_STORAGE_PRODUCT_CODE=
CLOUTILITY_BILLING_WEBHOOK_TOKEN=       # long random string
PRESERVATION_JOB_TOKEN=                 # long random string; for running the jobs by hand
CRON_SECRET=                            # long random string; Vercel Cron sends it to the scheduled jobs
PRESERVATION_S3_ENDPOINT=               # public S3 endpoint (defaults to https://portal.savartus.com:9080)
PRESERVATION_S3_REGION=                 # signing region (defaults to us-east-2)
PRESERVATION_ENCRYPTION_KEY=            # 32 random bytes, base64; encrypts stored S3 secrets. SAME value locally and in Vercel (shared database)
PRESERVATION_SENDER_EMAIL=              # mailbox emails are sent from (defaults to SPECIFICATION_SENDER_EMAIL)
PRESERVATION_STAFF_EMAIL=               # receives staff alerts and a copy of customer emails
PRESERVATION_SIGNUP_ENABLED=            # "true" shows the signup button and opens /preservation/signup; redeploy after changing
PRESERVATION_SIGNUP_PREVIEW_CODE=       # optional, 16+ chars: while signup is closed, /preservation/review?code=<this> opens signup for that browser (30-day cookie) so a reviewer can test it
AZURE_TENANT_ID=                        # Microsoft Graph app with Mail.Send (shared with the specification emails)
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
```

If the mail settings are missing, emails are skipped and logged; provisioning and billing still run.

## 5. Retries, held accounts, and alerts

A Vercel Schedule in `vercel.json` (`preservation-provision-retry`) runs `GET /api/preservation/provision-retry` every 10 minutes. Vercel sends `Authorization: Bearer $CRON_SECRET`; to run it by hand, send `Authorization: Bearer $PRESERVATION_JOB_TOKEN`, or use **Run Schedule** under the project's **Schedules** page. Static schedules start inactive on Preview deployments, so previews (which share the production database) don't run jobs unless enabled. It resumes any account whose provisioning failed or was interrupted. Each step is recorded as it succeeds, so a retry continues where the last run stopped.

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

**Billing job (added 2026-11-17).** Cloutility's verify call to the production Post URL got 403 from Vercel's system mitigations, so the site doesn't rely on the notification: the `preservation-billing-sync` schedule runs `GET /api/preservation/billing-sync` hourly at :15, which bills the newest billing run. Vercel doesn't retry failed scheduled runs, so the hourly cadence is the retry. Each customer and billing date is charged once, so the job and the notification never double-charge. The 403 turned out not to come from Vercel (no request reached its firewall): Cloutility runs on Savartus's own network (portal-api.savartus.com is 66.191.123.122; its outbound requests come from 66.191.123.121), where `www.savartus.com` apparently doesn't resolve to Vercel. The subscriber's Post URL therefore uses Vercel's address for the production site, which verified with 200 on 2026-11-17:

`https://savartus-website.vercel.app/api/preservation/billing-data?token=<CLOUTILITY_BILLING_WEBHOOK_TOKEN>`

To use `www.savartus.com` instead, make the internal DNS record for `www` match public DNS (CNAME to Vercel), then change the Post URL. If the Vercel project is ever renamed, update the Post URL.

**Dry run.** `GET /api/preservation/billing-data?token=<token>&date=YYYY-MM-DD&forecast=true` shows the billing lines Cloutility would produce for that date (future dates are simulated) and what each account would be charged. It charges nothing.

- [ ] **Usage quantity.** Once a test bucket holds data, run a dry run for the next billing date and confirm the storage line's `Quantity` is the customer's total number of 1 TB packages, not just the packages above an included amount. (On 2026-11-17 the simulation had no lines because the test bucket is empty.)

## 7. Launch checklist

Engineering and operations:

- [ ] **Public S3 endpoint** for HDL 001 (it is on a private address, `10.2.1.10`), with a TLS certificate; set `PRESERVATION_S3_ENDPOINT`. Confirm whether clients need path-style addressing (the getting-started page currently says so).
- [ ] **Dedicated oRain account** for Cloutility with a non-expiring password (section 2, step 10).
- [ ] **Fixed outbound IP** for the site, whitelisted in Cloutility (section 2, step 9).
- [ ] **Usage billing verified** (section 6), then the billing-data subscriber created.
- [ ] **`CRON_SECRET` set in Vercel**, so the daily retry and billing jobs (section 5 and 6) can run.
- [ ] **Mail settings** set in production and a welcome email received on a test signup.
- [ ] **Stripe live mode** set up (section 3), webhook secret in production, Dashboard settings done.
- [ ] **`PRESERVATION_ENCRYPTION_KEY` set in Vercel**, the same value as in `.env.local`.
- [ ] **One live end-to-end signup** with a real card, then refunded: confirmation page progress, welcome email, sign-in link, upload and download in the browser, an invitation, a new S3 secret, and an upload with an S3 client.
- [ ] Tidy test data: the "gelos, llc" test unit, the Portal test user, and the unused API applications on Savartus_API.

Business and legal:

- [ ] **Service terms** (`/preservation/terms`) and **privacy notice** (`/privacy`) reviewed by counsel. Fill every highlighted placeholder, then remove `robots` (noindex) from both pages.
- [ ] **Retention after cancellation** decided and written into the terms. Customers currently cancel by email, and staff handle data through Cloutility's deletion approvals.
- [ ] **Stripe Tax** (section 3): tax adviser confirms code `txcd_10101000` and where Savartus must register; origin address and registrations entered in live mode; filing approach decided (accountant or Stripe's filing partner).
- [ ] **Overage cap** decision. Today usage is uncapped; consider a per-account limit with a staff review above it.
