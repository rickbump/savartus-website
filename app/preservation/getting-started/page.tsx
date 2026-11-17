import type { Metadata } from "next";
import Link from "next/link";
import { socialImages } from "@/lib/social-images";

export const metadata: Metadata = {
  title: "Getting Started with Optical Preservation",
  description:
    "Activate your Savartus portal login, create your S3 access key, and connect an S3 client to your write-once optical preservation bucket.",
  alternates: { canonical: "/preservation/getting-started" },
  openGraph: {
    images: socialImages.openGraph,
    title: "Getting Started with Optical Preservation | Savartus",
    description: "Activate your login, create S3 keys, and connect your S3 client.",
    url: "/preservation/getting-started",
    type: "article",
  },
};

export default function GettingStartedPage() {
  const portalUrl = process.env.CLOUTILITY_PORTAL_URL?.trim().replace(/\/$/, "") || "https://portal.savartus.com";
  const endpoint = process.env.PRESERVATION_S3_ENDPOINT?.trim();
  const region = process.env.PRESERVATION_S3_REGION?.trim() || "us-east-1";
  const endpointText = endpoint ?? "https://<endpoint from your welcome email>";

  return (
    <main>
      <section className="contact-hero">
        <div className="site-container contact-hero-inner">
          <p className="contact-eyebrow">OPTICAL PRESERVATION</p>
          <h1>Getting started</h1>
          <p className="contact-hero-copy">
            Three steps from payment to your first preserved object: activate your portal login,
            create an S3 access key, and point your S3 client at your bucket.
          </p>
        </div>
      </section>

      <section className="preservation-doc">
        <div className="site-container preservation-doc-inner">
          <h2>1. Activate your portal login</h2>
          <p>
            A few minutes after payment, the Savartus portal sends an activation email to the address
            you signed up with. Follow its link to create your password, then sign in at{" "}
            <a href={portalUrl}>{portalUrl.replace(/^https?:\/\//, "")}</a>. Nothing there? Check
            your spam folder, then contact <a href="mailto:info@savartus.com">info@savartus.com</a>.
          </p>
          <p>In the portal you can see your storage, status reports, and your S3 account.</p>

          <h2>2. Create your S3 access key</h2>
          <ol>
            <li>Click the gear icon at the top right of the portal.</li>
            <li>
              Open <strong>S3 Optical &gt; User accounts</strong> and select your account (named{" "}
              <code>pres-…</code>).
            </li>
            <li>
              Click <strong>Renew secret</strong>. Copy the <strong>access key</strong> and{" "}
              <strong>secret key</strong> into a password manager straight away; the secret is not
              shown again.
            </li>
          </ol>
          <p>
            If a key is ever exposed, click Renew secret again. The old secret stops working
            immediately, so update your S3 clients with the new one.
          </p>

          <h2>3. Connect your S3 client</h2>
          <dl>
            <dt>Endpoint</dt>
            <dd>
              <code>{endpointText}</code>
            </dd>
            <dt>Region</dt>
            <dd>
              <code>{region}</code> (most clients require one; it isn&apos;t used for routing)
            </dd>
            <dt>Bucket</dt>
            <dd>
              In your welcome email, and under <strong>Consumption units</strong> in the portal
            </dd>
            <dt>Addressing</dt>
            <dd>Path-style (turn off virtual-hosted-style buckets if your client offers the choice)</dd>
          </dl>

          <h3>Cyberduck (easiest if you&apos;re new to S3)</h3>
          <p>
            <a href="https://cyberduck.io">Cyberduck</a> is a free drag-and-drop app for Windows and
            Mac.
          </p>
          <ol>
            <li>
              Install and open Cyberduck, then click <strong>Open Connection</strong>.
            </li>
            <li>
              In the drop-down at the top, choose <strong>Amazon S3</strong>.
            </li>
            <li>
              <strong>Server:</strong> <code>{endpointText.replace(/^https?:\/\//, "").replace(/\/$/, "")}</code>,{" "}
              <strong>Port:</strong> <code>443</code>
            </li>
            <li>
              <strong>Access Key ID</strong> and <strong>Secret Access Key</strong>: the two values
              from step 2.
            </li>
            <li>
              Click <strong>Connect</strong>. Your bucket appears as a folder; open it and drag files
              or folders in to upload them.
            </li>
          </ol>

          <h3>AWS CLI</h3>
          <pre>
            <code>{`aws configure --profile savartus
# enter your access key, secret key, and region ${region}

aws --profile savartus --endpoint-url ${endpointText} \\
    s3 cp ./collection s3://<your-bucket>/collection --recursive

aws --profile savartus --endpoint-url ${endpointText} \\
    s3 ls s3://<your-bucket>/collection/`}</code>
          </pre>

          <h3>rclone</h3>
          <pre>
            <code>{`[savartus]
type = s3
provider = Other
access_key_id = <access key>
secret_access_key = <secret key>
endpoint = ${endpointText}
region = ${region}
force_path_style = true

# then:
rclone copy ./collection savartus:<your-bucket>/collection --progress`}</code>
          </pre>
          <p>
            Any S3-compatible tool works the same way, including Cyberduck, S3 Browser, and backup or
            archive software with an S3 target.
          </p>

          <h2>Finding your files</h2>
          <ul>
            <li>
              <strong>In the portal:</strong> open <strong>Consumption units</strong>, select your
              optical preservation unit, then <strong>Bucket &gt; Files</strong> to browse what is
              stored. <strong>Basics</strong> shows the object count and total size.
            </li>
            <li>
              <strong>With an S3 client:</strong> graphical clients such as Cyberduck or S3 Browser
              show your bucket as folders you can browse and search. From the command line:
              <pre>
                <code>{`aws --profile savartus --endpoint-url ${endpointText} \\
    s3 ls s3://<your-bucket>/ --recursive | grep -i "report-2024"`}</code>
              </pre>
            </li>
            <li>
              Organize uploads with meaningful prefixes (for example{" "}
              <code>department/year/project/</code>); they become the folders you browse later.
            </li>
          </ul>

          <h2>How your data is preserved</h2>
          <ul>
            <li>
              Uploads land on the optical library&apos;s staging cache first, then are written to
              write-once Blu-ray media in batches. Your objects stay readable throughout.
            </li>
            <li>
              Written media can&apos;t be altered. Overwriting or deleting an object through S3
              doesn&apos;t erase what was written, so preserve finished material rather than
              working files.
            </li>
            <li>
              Removing preserved data requires a deletion request approved by Savartus. Contact us
              and we&apos;ll take you through it.
            </li>
          </ul>

          <h2>Usage and billing</h2>
          <ul>
            <li>Your plan is billed monthly in advance through Stripe.</li>
            <li>
              If you store more than your plan, each additional terabyte (partial terabytes round up)
              is added to your next invoice at your plan&apos;s per-TB rate.
            </li>
            <li>
              When your storage reaches the next plan&apos;s size, your whole account moves to that
              plan&apos;s lower rate, and we email you when it happens.
            </li>
            <li>
              The portal&apos;s <strong>Summary</strong> page shows your current storage. Usage is
              measured daily and settled monthly.
            </li>
          </ul>
          <p>
            Cards, billing details, and invoices are managed in the Stripe billing portal linked
            from your receipts.
          </p>

          <h2>Cancelling</h2>
          <p>
            To cancel, email <a href="mailto:info@savartus.com">info@savartus.com</a> from your
            account email. Because preserved data is never deleted automatically, we&apos;ll confirm
            with you what happens to it, as set out in the{" "}
            <Link href="/preservation/terms">service terms</Link>.
          </p>

          <h2>Need help?</h2>
          <p>
            Email <a href="mailto:info@savartus.com">info@savartus.com</a> with your organization
            name. Never send your secret key.
          </p>
        </div>
      </section>
    </main>
  );
}
