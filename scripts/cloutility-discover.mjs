// Read-only Cloutility explorer used while wiring up self-service provisioning.
// Signs in with the CLOUTILITY_* settings and only ever sends GET requests.
//
//   npm run cloutility:discover                    sign in and list the API's endpoints
//   npm run cloutility:discover -- bunits/12/users  GET one or more API paths (under /v1/)
//   npm run cloutility:discover -- --help POST-v1-bunits-bunitId-users
//                                                   show one endpoint's help page (request schema)

const env = (name) => process.env[name]?.trim();
const apiUrl = env("CLOUTILITY_API_URL")?.replace(/\/$/, "");
const missing = ["CLOUTILITY_API_URL", "CLOUTILITY_CLIENT_ID", "CLOUTILITY_ORIGIN", "CLOUTILITY_USERNAME", "CLOUTILITY_PASSWORD"]
  .filter((name) => !env(name));
if (missing.length) {
  console.error(`Set these in .env.local first: ${missing.join(", ")}`);
  process.exit(1);
}
const origin = env("CLOUTILITY_ORIGIN");

function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(tr|p|div|h\d|li)>/gi, "\n")
    .replace(/<\/t[dh]>/gi, " | ")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&#39;/g, "'")
    .split("\n").map((line) => line.trim()).filter(Boolean).join("\n");
}

async function signIn() {
  const response = await fetch(`${apiUrl}/v1/oauth`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: origin },
    body: new URLSearchParams({
      client_id: env("CLOUTILITY_CLIENT_ID"),
      grant_type: "password",
      username: env("CLOUTILITY_USERNAME"),
      password: env("CLOUTILITY_PASSWORD"),
    }),
  });
  const body = await response.text();
  if (!response.ok) {
    console.error(`Sign-in failed (${response.status}): ${body.slice(0, 500)}`);
    process.exit(1);
  }
  const data = JSON.parse(body);
  console.log(`Signed in. Token expires in ${data.expires_in}s.`);
  return data.access_token;
}

async function get(token, path) {
  const response = await fetch(`${apiUrl}/v1/${path.replace(/^\/?(v1\/)?/, "")}`, {
    headers: { Authorization: `Bearer ${token}`, Origin: origin, Accept: "application/json" },
  });
  const body = await response.text();
  console.log(`\n=== GET ${path} -> ${response.status}`);
  try {
    console.log(JSON.stringify(JSON.parse(body), null, 2).slice(0, 12000));
  } catch {
    console.log(text(body).slice(0, 4000));
  }
}

async function helpPage(path) {
  const url = path ? `${apiUrl}/v1/help/Api/${path}` : `${apiUrl}/v1/help`;
  const response = await fetch(url, { headers: { Origin: origin } });
  console.log(`\n=== ${url} -> ${response.status}`);
  console.log(text(await response.text()).slice(0, path ? 12000 : 30000));
}

const args = process.argv.slice(2);
if (args[0] === "--help") {
  for (const page of args.slice(1)) await helpPage(page);
} else {
  const token = await signIn();
  if (args.length === 0) await helpPage("");
  for (const path of args) await get(token, path);
}
