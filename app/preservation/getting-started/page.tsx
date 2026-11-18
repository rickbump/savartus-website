import type { Metadata } from "next";
import Link from "next/link";
import { s3Settings } from "@/lib/preservation/config";
import { socialImages } from "@/lib/social-images";

export const metadata: Metadata = {
  title: "Getting Started with Optical Preservation",
  description:
    "Sign in to your Savartus account, upload files in the browser, and connect S3 software to your write-once optical preservation space.",
  alternates: { canonical: "/preservation/getting-started" },
  openGraph: {
    images: socialImages.openGraph,
    title: "Getting Started with Optical Preservation | Savartus",
    description: "Sign in, upload in the browser, and connect S3 software.",
    url: "/preservation/getting-started",
    type: "article",
  },
};

export default function GettingStartedPage() {
  const { endpoint: endpointText, region } = s3Settings();
  const { hostname, port } = new URL(endpointText);

  return (
    <main>
      <section className="contact-hero">
        <div className="site-container contact-hero-inner">
          <p className="contact-eyebrow">OPTICAL PRESERVATION</p>
          <h1>Getting started</h1>
          <p className="contact-hero-copy">
            Sign in to your Savartus account and upload in the browser. For bulk uploads, files over
            5 GB or backup software, connect any S3-compatible tool with your space&apos;s keys.
          </p>
        </div>
      </section>

      <section className="preservation-doc">
        <div className="site-container preservation-doc-inner">
          <h2>1. Sign in</h2>
          <p>
            Go to <Link href="/account">www.savartus.com/account</Link> and enter the email address you
            signed up or were invited with. We email you a sign-in link; there&apos;s no password.
            Nothing arrived? Check your spam folder, then contact{" "}
            <a href="mailto:info@savartus.com">info@savartus.com</a>.
          </p>

          <h2>2. Upload in the browser</h2>
          <p>
            On the <strong>Files</strong> page, drag files or whole folders onto the drop zone, or
            click <strong>Upload files</strong>. Make folders, search file names, and download. Each
            file shows whether it&apos;s still waiting in the library&apos;s cache or already on
            optical disc; files on disc are restored with one click before downloading.
            Administrators can invite colleagues under <strong>Members</strong>.
          </p>

          <h3>Which file path is saved, and why it matters</h3>
          <div className="preservation-callout">
            <p>
              <strong>Once a file is uploaded, it can&apos;t be moved, renamed or re-filed.</strong>{" "}
              Preserved files are written once to optical disc, and the path a file is saved under
              (its folders and name) is written with it. That path is permanent, and it&apos;s what
              matters later:
            </p>
            <ul>
              <li>it&apos;s how you and your colleagues find the file, sometimes years from now;</li>
              <li>
                it tells files with the same name apart, such as several <code>report.pdf</code> files
                from different projects;
              </li>
              <li>
                it shows where a file came from, which can matter for records, audits and evidence.
              </li>
            </ul>
            <p>
              A file uploaded to the wrong place stays there. Uploading it again to the right folder
              stores a second copy, and both copies count toward your storage and are billed.
            </p>
            <p>
              <strong>
                Your drive letter and the folders above the one you upload are not saved
                automatically.
              </strong>{" "}
              Web browsers never tell a website where a file sits on your computer. This is a security
              rule built into every browser, not a Savartus setting.
            </p>
            <p>What is saved:</p>
            <ul>
              <li>the folder you&apos;re in on the Files page, and</li>
              <li>the path from the folder you drop or choose, downward, with every subfolder kept.</li>
            </ul>
            <p>
              <strong>Example.</strong> On your computer the file is{" "}
              <code>{"C:\\Users\\Rick\\Projects\\2024\\report.pdf"}</code>.
            </p>
            <ul>
              <li>
                Drop the <code>Projects</code> folder on <strong>All files</strong>: saved as{" "}
                <code>Projects/2024/report.pdf</code>.
              </li>
              <li>
                Drop only <code>report.pdf</code>: saved as <code>report.pdf</code>.
              </li>
            </ul>
            <p>
              <strong>To keep the full path:</strong>
            </p>
            <ol>
              <li>
                Click <strong>New folder</strong> and type the path above the folder you&apos;ll drop,
                for example <code>C/Users/Rick</code>. Use forward slashes; a drive such as{" "}
                <code>C:</code> becomes <code>C</code>.
              </li>
              <li>
                Drop <code>Projects</code> into it. It&apos;s saved as{" "}
                <code>C/Users/Rick/Projects/2024/report.pdf</code>.
              </li>
            </ol>
            <p>
              Agree on a naming scheme with your team before uploading, such as{" "}
              <code>computer-or-drive/path</code> or <code>department/year/project</code>. Names
              can&apos;t be changed after upload, because preserved files are written once.
            </p>
          </div>

          <h2>3. Connect S3 software (optional)</h2>
          <p>
            An administrator finds the space&apos;s endpoint, bucket and access key under{" "}
            <strong>S3 keys</strong> in the account, and creates the secret key there. The secret is
            shown once; creating a new one replaces it.
          </p>
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
              Under <strong>S3 keys</strong> in your account
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
              <strong>Server:</strong> <code>{hostname}</code>, <strong>Port:</strong>{" "}
              <code>{port || "443"}</code>
            </li>
            <li>
              <strong>Access Key ID</strong> and <strong>Secret Access Key</strong>: from{" "}
              <strong>S3 keys</strong> in your account.
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
          <p>
            <strong>Paths with S3 software:</strong> S3 software also saves paths only from the folder
            you point it at, downward. Put the rest of the path in the destination yourself. For
            example,{" "}
            <code>{"rclone copy C:\\Users\\Rick\\Projects savartus:<your-bucket>/C/Users/Rick/Projects"}</code>{" "}
            saves <code>C/Users/Rick/Projects/2024/report.pdf</code>.
          </p>

          <h2>Finding your files</h2>
          <ul>
            <li>
              <strong>In your account:</strong> the <strong>Files</strong> page browses folders and
              searches file names across the whole space; <strong>Usage</strong> shows the space used.
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
              Written media can&apos;t be altered, and a file name can be used only once, so preserve
              finished material rather than working files.
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
              <strong>Usage</strong> in your account shows your current storage. Usage is measured
              daily and settled monthly.
            </li>
          </ul>
          <p>
            Administrators see invoices and update the card and billing details under{" "}
            <strong>Billing</strong> in the account.
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
