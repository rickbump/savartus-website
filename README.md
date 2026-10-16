This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Specification download requests (Vercel + Neon + Microsoft 365)

The shared **Full Document** form submits to `POST /api/specification-requests`.
The server validates the fields, saves the request in Neon Postgres, and
asks Microsoft Graph to email the download link from a Microsoft 365 mailbox.
Each download email BCCs `rick.bump@savartus.com`; the requestor remains the To recipient.
No visitor email application is opened, and no credentials are exposed to the browser.

### Required setup before going live

1. Deploy Next.js on Vercel with Node.js 22 or later (required by the Microsoft
   identity SDK). Route handlers run as Vercel Functions; no Azure website or
   storage account is needed.
2. In the Vercel project's Storage/Marketplace section, add **Neon Postgres** and
   connect it to the project. Vercel uses database partners rather than hosting
   its own Postgres service. Choose a region close to the Vercel Function region.
   Ensure the integration adds `DATABASE_URL` to the appropriate deployment
   environment. Use a separate database/branch for previews and local testing;
   do not expose production lead data to preview deployments.
3. Run [scripts/specification-requests.sql](./scripts/specification-requests.sql)
   once in Neon's SQL editor for each database/branch used by the application.
   The application does not create tables during requests or builds.
4. Register a Microsoft Entra application and create a client secret. Authorize
   its service principal to send from the intended Microsoft 365 mailbox (for
   example, `info@savartus.com`). Have your Microsoft 365 administrator use
   [Exchange Online Application RBAC](https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac)
   with the **Application Mail.Send** role scoped to that mailbox. Alternatively,
   grant Microsoft Graph's application **Mail.Send** permission with administrator
   consent and restrict it with an application access policy. Do not combine an
   unrestricted Entra Mail.Send grant with a scoped RBAC grant: permissions are
   additive. A website visitor never signs into Microsoft 365.
5. Set these **server-only** environment variables in the Vercel project. Mark
   credentials as sensitive and scope them to the intended environments. For local
   development, place them in an uncommitted `.env.local` file:

   ```dotenv
   DATABASE_URL=postgresql://USER:PASSWORD@YOUR_NEON_HOST/neondb?sslmode=require
   AZURE_TENANT_ID=YOUR_MICROSOFT_365_TENANT_ID
   AZURE_CLIENT_ID=YOUR_ENTRA_APPLICATION_CLIENT_ID
   AZURE_CLIENT_SECRET=YOUR_ENTRA_APPLICATION_SECRET_VALUE
   SPECIFICATION_SENDER_EMAIL=info@savartus.com
   SPECIFICATION_DOWNLOAD_URL=https://www.savartus.com/downloads/specification/Enterprise%20Data%20Lifecycle%20Specification%20v6.pdf
   ```

   The sender and download URL above are examples: confirm the actual sender and
   final published website URL before use. The download URL must use HTTPS.
   The `AZURE_*` names are Microsoft identity credentials, not an Azure hosting
   requirement. Vercel cannot use an Azure managed identity; the server uses
   `ClientSecretCredential` in both production and local development. Never prefix
   credentials with `NEXT_PUBLIC_` or commit them. Set a secret expiration reminder
   and rotate it before expiry. Redeploy after changing Vercel environment variables.
6. Configure abuse protection with Vercel Firewall rate limiting on
   `/api/specification-requests` before launch. The app
   rejects cross-origin submissions, has a honeypot, and permits at most one
   request per email address every ten minutes, enforced atomically in storage
   across instances. These controls alone do not prevent bots rotating addresses;
   use ingress rate limits and monitor outbound email volume.
7. Submit a real request using a controlled inbox. Confirm the database record,
   Microsoft 365 Sent Items, inbox delivery, and that the emailed link downloads
   the intended PDF. The app only reports success after storage succeeds and Graph
   returns `202 Accepted`; that response is not a guarantee of inbox delivery.

### Stored data and operations

- One row per normalized email address, with name, employer/institution, title,
  email, request source, latest request timestamp, and email status
  (`pending`, `accepted`, or `failed`). Repeat requests update the existing row;
  this is a lead/request list, not a full event history.
- The `email_key` primary key is a SHA-256 hash of the normalized email. A UUID
  version makes repeat-request reservations atomic and prevents stale workers
  overwriting newer request statuses. Queries are parameterized.
  Email and other personal data remain in the row and require restricted access.
- Use the Neon console, accessible through the Vercel integration, to view/export
  requests. There is no public listing API or admin dashboard.
- Failed sends keep the request with status `failed` and allow retry after one
  minute. Storage failure prevents sending. A process interruption or ambiguous
  Graph timeout can leave a `pending` request; there is no background retry queue.
  Requests blocked by a cooldown receive HTTP 429 and a `Retry-After` header.
- If Graph accepted an email but the final storage status update fails, the form
  reports an error even though an email may arrive. Check Sent Items before
  manually resending. Log diagnostics omit form contents and credentials.
- Agree on retention and deletion procedures for this personal data before launch.
  The form explains request storage and does not opt visitors into marketing.
- The existing PDF is publicly served. This flow captures requests and emails a
  link; it does **not** make downloads private or issue expiring download tokens.

Run the focused automated checks with:

```bash
npx playwright test tests/specification-requests.spec.ts tests/specification-request-form.spec.ts
```

These tests use fake storage/email services or intercept the browser API call;
they never send real emails. Live Neon/Microsoft 365 verification is still required.

### CRM contact synchronization

Each new request also creates a durable `specification_crm_sync` job in the same
database transaction as the request reservation. It attempts to import the
contact before sending the email; a CRM failure is logged and retained for retry,
but does not prevent delivery of the download email. The CRM call has an
eight-second timeout and never follows sign-in redirects.

Before deploying this change:

1. Deploy the matching CRM endpoint, Prisma migration, token and exact nginx
   location from the neighboring `crm-savartus` project. Its README documents
   the server setup. Normal CRM APIs must remain behind Microsoft sign-in.
2. Run `scripts/specification-requests.sql` again against the website's Neon
   database to add the sync queue. Existing request data is preserved.
3. Set these server-only Vercel Production settings:

   ```dotenv
   CRM_CONTACT_IMPORT_URL=https://crm.savartus.com/api/integrations/website-contacts
   CRM_CONTACT_IMPORT_TOKEN=THE_SAME_RANDOM_TOKEN_CONFIGURED_ON_THE_CRM
   ```

   The token must contain at least 32 characters; generate a random credential,
   not a memorable password. Mark it sensitive. No browser receives this token.
4. Deploy the website and verify a controlled submission creates a contact and
   updates the queue status to `synced`.

The CRM receives `Website - Specification page` in its API's `source`
field as the lead source. The original website form location remains in the
website request and queue payload. New
contacts store this in the CRM's Lead source field; existing lead sources remain
unchanged and differing values are recorded in notes
under `*** New Values from Specification request ***`. It matches email addresses
case-insensitively, including alternate emails. New contacts use a matching
company account or a new PROSPECT account. Ambiguous matches remain pending for
manual review. Per-request UUID receipts prevent duplicate contacts/notes when
timeouts or retries repeat a call.

To retry pending jobs, set `DATABASE_URL`, `CRM_CONTACT_IMPORT_URL`, and
`CRM_CONTACT_IMPORT_TOKEN` privately in `.env.local` and run:

```bash
npm run crm:retry
```

This requires Node.js 22.18 or later for TypeScript stripping. It processes up to
25 pending jobs, never resends download emails, and exits nonzero if any attempted
job fails. Re-run for further batches. There is no automatic scheduler; pending
jobs require this operational retry command. Synced jobs remain for traceability.
Include queue payloads and CRM import receipts in retention/deletion procedures.
Requests submitted before this integration are not automatically backfilled.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
