<!--
PASTE THE FINAL OPTICAL PRESERVATION TERMS BELOW THIS COMMENT, replacing the
placeholder line.

How: in the Claude Doc, use Export > Markdown (or select all and copy), then
paste here. Delete the "Decisions to make" table and any [DECIDE: ...] text
first.

What happens: as soon as this file contains a "## " heading, the page at
/preservation/terms shows this text instead of the built-in draft.
Supported: # / ## / ### headings, paragraphs, - or 1. lists, **bold**,
*italic*, and [links](https://...). The first "# Title" line is skipped (the
page already has a title).

Optional PDF download: export the doc as PDF and save it as
public/downloads/legal/savartus-optical-preservation-terms.pdf
The page then shows a "Download PDF" link automatically.
-->

Optical Preservation Service Terms (Draft)
Nov 17, 2026 · @Rick
Draft terms for the self-service optical preservation service sold at savartus.com/preservation, for review by Savartus and legal counsel before launch.

1. Who we are
The service is provided by SAVARTUS, INC.  ("Savartus", "we"). "You" means the organization named at signup. The person signing up confirms they may bind that organization to these terms.
2. The service
We provide S3-compatible storage backed by write-once optical media in a Savartus optical library, a portal login to view usage and manage your S3 credentials, and the support described in section 9.
Data you upload is staged on the library's cache and written to optical media in batches.
3. Write-once media and deletion
• Data written to optical media cannot be altered. Overwriting or deleting an object through S3 does not erase data already written.
• Removing preserved data requires a deletion request approved by Savartus. We may ask you to confirm a request in writing before approving it.
• We never delete preserved data automatically, including when a payment fails.
4. Plans, usage, and price
• You choose a plan (a committed capacity) at signup. It is billed monthly in advance through Stripe at the price shown at checkout.
• Storage above your plan is measured by our systems and billed monthly in arrears, in whole terabytes (partial terabytes round up), at your plan's per-TB rate.
• When your measured storage reaches the size of a larger plan, your account moves to that plan and its per-TB rate for that month and every month after. Plans do not move down.
• Prices exclude taxes unless stated. [DECIDE: Stripe Tax collects applicable taxes, or the customer is responsible for them]
• We may change prices with 60 days written notice. Changes apply from your first billing period after the notice period ends.
Plan
Monthly price
Per-TB rate above plan
1 TB
$7.50
$7.50
5 TB
$35
$7.00
10 TB
$65
$6.50
25 TB
$150
$6.00
5. Payment
You authorize us, through Stripe, to charge your payment method for your plan and usage. If a payment fails, Stripe retries it.
If an invoice stays unpaid for 30 days, we may suspend uploads and portal access until it is paid. Your preserved data is kept during suspension.
6. Term and cancellation
• The service renews monthly until cancelled.
• You may cancel by emailing info@savartus.com from your account email. Cancellation takes effect at the end of the current billing period, and plan fees already paid are not refunded. [DECIDE: confirm refund policy]
• After cancellation, your preserved data is kept for 90 days unless you request immediate deletion/destruction. During that period you may retrieve it yourself or extend retention.
• After that period, Savartus deletes it under an approved deletion request.
• We may end the service with 30 written notice, or immediately for material breach, including storing unlawful content.
7. Your responsibilities
• Keep your S3 secret key and portal password confidential, and renew the key if it is exposed.
• Upload only data you have the right to store, and comply with applicable law, including export controls and data protection law.
• Keep your own copy of data until you have confirmed it is preserved, and keep your contact details current.
8. Data protection and confidentiality
We access your stored data only to operate and support the service, to comply with law, or with your permission. Our handling of personal data is described in our privacy notice.
Your data is stored in a Savartus facility in Wisconsin, USA. [DECIDE: offer a data processing addendum on request?]
9. Support and availability
Support is provided by email at info@savartus.com during normal business hours on US eastern time zone.
We aim to keep the service available but do not guarantee uninterrupted access. Planned maintenance is announced in advance where practical. [DECIDE: any availability or retrieval-time commitment]
10. Liability
[DECIDE: warranty disclaimer and limitation of liability from legal counsel, for example liability capped at the fees paid in the preceding 12 months and exclusion of indirect damages]
11. Changes to these terms
We may update these terms with 30 days notice by email. Continuing to use the service after the effective date means you accept the updated terms.
12. Governing law
These terms are governed by the laws of Delaware, and disputes are heard in the courts of Delaware.