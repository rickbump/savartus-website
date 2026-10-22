#!/usr/bin/env node
// Daily SEO manager. Runs the live SEO audit, then:
//   1. closes task issues whose check now passes (and reopens ones that regress),
//   2. keeps exactly one Copilot fix task in flight (assigned to Copilot when possible),
//   3. updates the pinned "SEO Dashboard" issue,
//   4. posts today's action plan as an issue assigned to the site owner (the daily reminder).
//
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY (owner/repo), optional COPILOT_ASSIGN_TOKEN, SEO_OWNER.
// Flags: --dry-run (no writes), --scheduled (skip weekends, before 6 AM ET, or if today's plan exists),
//        --audit=path/to/audit.json (reuse an audit), --no-psi, --out=seo-report

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { runAudit, SITE } from "./seo-audit.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, "").split("=");
    return [key, value ?? true];
  })
);
const DRY = Boolean(args["dry-run"]);
const OUT = args.out ?? "seo-report";
const REPO = process.env.GITHUB_REPOSITORY ?? "rickbump/savartus-website";
const OWNER = process.env.SEO_OWNER ?? REPO.split("/")[0];
const TOKEN = process.env.GITHUB_TOKEN;
const COPILOT_TOKEN = process.env.COPILOT_ASSIGN_TOKEN;
const API = "https://api.github.com";
const LABELS = {
  task: { name: "seo-task", color: "1d76db", description: "Automated SEO fix task" },
  dashboard: { name: "seo-dashboard", color: "0e8a16", description: "Live SEO dashboard" },
  daily: { name: "seo-daily", color: "fbca04", description: "Daily SEO action plan" },
};
const STALL_DAYS = 2;
const HISTORY_LIMIT = 60;

if (!TOKEN) {
  console.error("GITHUB_TOKEN is required (locally: GITHUB_TOKEN=$(gh auth token) node scripts/seo-daily.mjs --dry-run)");
  process.exit(1);
}

async function gh(method, path, body, token = TOKEN) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "content-type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = new Error(`${method} ${path} → ${res.status}: ${(await res.text()).slice(0, 300)}`);
    error.status = res.status;
    throw error;
  }
  return res.status === 204 ? null : res.json();
}

async function ghAll(path) {
  const items = [];
  for (let page = 1; page < 20; page += 1) {
    const batch = await gh("GET", `${path}${path.includes("?") ? "&" : "?"}per_page=100&page=${page}`);
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items;
}

const write = async (description, fn) => {
  if (DRY) {
    console.log(`[dry-run] ${description}`);
    return null;
  }
  console.log(description);
  return fn();
};

function nyNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
      weekday: "short",
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value])
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour), weekday: parts.weekday };
}

const marker = (id) => `<!-- seo-task:${id} -->`;
const taskIdOf = (issue) => issue.body?.match(/<!-- seo-task:(\w+) -->/)?.[1];
const isCopilotAssigned = (issue) => issue.assignees?.some((a) => /copilot/i.test(a.login));
const daysSince = (iso) => (Date.now() - new Date(iso).getTime()) / 86_400_000;
const link = (issue) => `[#${issue.number}](${issue.html_url})`;
const icon = { pass: "✅", fail: "❌", unknown: "⚪" };

function taskBody(task, check) {
  const failing = check?.failing ?? [];
  const lines = [
    marker(task.id),
    `**Why it matters:** ${task.why}`,
    "",
  ];
  if (failing.length) {
    lines.push(`### Currently failing on www.savartus.com (${failing.length})`, "");
    failing.slice(0, 40).forEach((f) => lines.push(`- \`${f.url}\` — ${f.detail}`));
    if (failing.length > 40) lines.push(`- …and ${failing.length - 40} more`);
    lines.push("");
  }
  lines.push("### What to do", "", ...task.steps.map((s, i) => `${i + 1}. ${s}`), "");
  if (task.files.length) lines.push("### Likely files", "", ...task.files.map((f) => `- \`${f}\``), "");
  lines.push("### Done when", "", ...task.acceptance.map((a) => `- [ ] ${a}`), "");
  if (task.owner === "copilot") {
    lines.push(
      "### Rules",
      "",
      "- Follow `.github/copilot-instructions.md` and `AGENTS.md` (Next.js 16 — read the bundled docs before using an API).",
      "- Keep the PR focused on this task only. Do not invent product specs, customers, prices, certifications, or legal claims.",
      "- `npm run lint`, `npx tsc --noEmit`, and `npm run build` must pass.",
      `- Verify locally with \`node scripts/seo-audit.mjs --no-psi\` where possible. Production is re-checked daily against check \`${task.check}\`.`,
      "",
      `_Managed by the daily SEO workflow: this issue closes automatically once check \`${task.check}\` passes on the live site._`
    );
  } else {
    lines.push(
      task.check
        ? `_Managed by the daily SEO workflow. Close this issue when done (it also closes automatically if check \`${task.check}\` detects it)._`
        : "_Managed by the daily SEO workflow. Close this issue when done._"
    );
  }
  return lines.join("\n");
}

async function ensureLabels() {
  for (const label of Object.values(LABELS)) {
    try {
      await gh("GET", `/repos/${REPO}/labels/${label.name}`);
    } catch (error) {
      if (error.status !== 404) throw error;
      await write(`create label ${label.name}`, () => gh("POST", `/repos/${REPO}/labels`, label));
    }
  }
}

async function assignCopilot(issue) {
  if (!COPILOT_TOKEN) return false;
  try {
    const updated = await gh(
      "POST",
      `/repos/${REPO}/issues/${issue.number}/assignees`,
      {
        assignees: ["copilot-swe-agent[bot]"],
        agent_assignment: { target_repo: REPO, base_branch: "main", custom_instructions: "", custom_agent: "", model: "" },
      },
      COPILOT_TOKEN
    );
    return isCopilotAssigned(updated);
  } catch (error) {
    console.warn(`Copilot assignment failed for #${issue.number}: ${error.message}`);
    return false;
  }
}

async function siteHealth() {
  try {
    const data = await gh("GET", `/repos/${REPO}/actions/workflows/site-health.yml/runs?per_page=1&status=completed`);
    const run = data.workflow_runs?.[0];
    return run ? { conclusion: run.conclusion, url: run.html_url, at: run.updated_at } : null;
  } catch {
    return null;
  }
}

async function main() {
  const today = nyNow();
  const briefingTitle = `SEO daily plan — ${today.date}`;
  const existingBriefings = await ghAll(`/repos/${REPO}/issues?labels=${LABELS.daily.name}&state=all&sort=created&direction=desc`).catch(
    (error) => (error.status === 404 ? [] : Promise.reject(error))
  );
  const todaysBriefing = existingBriefings.find((i) => i.title === briefingTitle && !i.pull_request);

  if (args.scheduled) {
    if (["Sat", "Sun"].includes(today.weekday) || today.hour < 6 || todaysBriefing) {
      console.log(`Skipping: ${today.weekday} ${today.date} ${today.hour}:00 ET, briefing exists: ${Boolean(todaysBriefing)}`);
      return;
    }
  }

  const audit = args.audit ? JSON.parse(await readFile(args.audit, "utf8")) : await runAudit({ psi: !args["no-psi"] });
  const checks = new Map(audit.checks.map((c) => [c.id, c]));
  const { tasks } = JSON.parse(await readFile(new URL("../seo/backlog.json", import.meta.url), "utf8"));

  await ensureLabels();

  const taskIssues = new Map();
  for (const issue of await ghAll(`/repos/${REPO}/issues?labels=${LABELS.task.name}&state=all`)) {
    const id = taskIdOf(issue);
    if (id && !issue.pull_request && (!taskIssues.has(id) || issue.state === "open")) taskIssues.set(id, issue);
  }
  const openPrs = await ghAll(`/repos/${REPO}/pulls?state=open`);

  const fixedTasks = [];
  const reopenedTasks = [];
  const statusOf = (task) => (task.check ? checks.get(task.check)?.status ?? "unknown" : "unknown");

  // 1. Reconcile existing task issues with the live audit.
  for (const task of tasks) {
    const issue = taskIssues.get(task.id);
    if (!issue) continue;
    const status = statusOf(task);
    if (issue.state === "open" && status === "pass") {
      await write(`close #${issue.number} (${task.id} passes)`, async () => {
        await gh("POST", `/repos/${REPO}/issues/${issue.number}/comments`, {
          body: `✅ Verified on ${SITE}: check \`${task.check}\` now passes. Closing automatically.`,
        });
        await gh("PATCH", `/repos/${REPO}/issues/${issue.number}`, { state: "closed", state_reason: "completed" });
      });
      issue.state = "closed";
      issue.state_reason = "completed";
      fixedTasks.push({ task, issue });
    } else if (issue.state === "closed" && issue.state_reason === "completed" && status === "fail" && task.owner === "copilot") {
      const failing = checks.get(task.check).failing;
      await write(`reopen #${issue.number} (${task.id} still failing)`, async () => {
        await gh("PATCH", `/repos/${REPO}/issues/${issue.number}`, { state: "open" });
        await gh("POST", `/repos/${REPO}/issues/${issue.number}/comments`, {
          body: [
            `⚠️ This was closed, but check \`${task.check}\` still fails on ${SITE}:`,
            "",
            ...failing.slice(0, 20).map((f) => `- \`${f.url}\` — ${f.detail}`),
            "",
            "Reopened so the fix can be completed.",
          ].join("\n"),
        });
      });
      issue.state = "open";
      reopenedTasks.push({ task, issue });
    }
  }

  // 2. Keep one Copilot task in flight, and open any unblocked human tasks.
  const openCopilot = tasks.filter((t) => t.owner === "copilot" && taskIssues.get(t.id)?.state === "open");
  const isDone = (id) => {
    const t = tasks.find((x) => x.id === id);
    return !t || statusOf(t) === "pass" || taskIssues.get(id)?.state === "closed";
  };
  const candidates = tasks.filter((t) => {
    if (taskIssues.has(t.id)) return false;
    if (t.dependsOn && !isDone(t.dependsOn)) return false;
    return t.owner === "copilot" ? statusOf(t) === "fail" : statusOf(t) !== "pass";
  });
  const toOpen = [
    ...(openCopilot.length ? [] : candidates.filter((t) => t.owner === "copilot").slice(0, 1)),
    ...candidates.filter((t) => t.owner !== "copilot"),
  ];
  const newlyOpened = [];
  for (const task of toOpen) {
    const title = `SEO ${task.id}: ${task.title}`;
    const created = await write(`open issue "${title}"`, () =>
      gh("POST", `/repos/${REPO}/issues`, {
        title,
        body: taskBody(task, task.check ? checks.get(task.check) : null),
        labels: [LABELS.task.name],
        assignees: task.owner === "copilot" ? [] : [OWNER],
      })
    );
    const issue = created ?? { number: 0, html_url: `https://github.com/${REPO}/issues`, state: "open", assignees: [], created_at: new Date().toISOString(), title };
    if (task.owner === "copilot" && created) {
      if (!(await assignCopilot(created))) {
        await gh("POST", `/repos/${REPO}/issues/${created.number}/assignees`, { assignees: [OWNER] });
      } else {
        issue.assignees = [{ login: "Copilot" }];
      }
    }
    taskIssues.set(task.id, issue);
    newlyOpened.push({ task, issue });
  }

  // Retry Copilot assignment on open Copilot tasks that are not yet assigned to it.
  for (const task of tasks.filter((t) => t.owner === "copilot")) {
    const issue = taskIssues.get(task.id);
    if (issue?.state === "open" && issue.number && !isCopilotAssigned(issue) && !DRY && (await assignCopilot(issue))) {
      issue.assignees = [...(issue.assignees ?? []), { login: "Copilot" }];
    }
  }

  // 3. Build today's action list.
  const actions = [];
  const copilotWork = [];
  for (const task of tasks) {
    const issue = taskIssues.get(task.id);
    if (issue?.state !== "open") continue;
    if (task.owner !== "copilot") {
      actions.push(`**${task.title}** — ${link(issue)} (about 10 minutes, steps in the issue)`);
      continue;
    }
    const pr = openPrs.find((p) => new RegExp(`#${issue.number}\\b`).test(`${p.title}\n${p.body ?? ""}`));
    if (pr && !pr.draft) {
      actions.push(
        `**Review and merge PR [#${pr.number}](${pr.html_url})** for ${task.id} (${task.title}). Open the Vercel preview link in the PR checks, spot-check the change, then **Merge**. The live site is re-verified tomorrow morning and the issue closes automatically.`
      );
      copilotWork.push(`${task.id} — PR [#${pr.number}](${pr.html_url}) ready for your review`);
    } else if (pr) {
      copilotWork.push(`${task.id} — Copilot is working in draft PR [#${pr.number}](${pr.html_url})`);
      if (daysSince(pr.updated_at) > STALL_DAYS) {
        actions.push(
          `**Nudge Copilot on PR [#${pr.number}](${pr.html_url})** — no progress in ${Math.floor(daysSince(pr.updated_at))} days. Comment \`@copilot please continue and finish this task\`, or close the PR and reassign the issue.`
        );
      }
    } else if (!isCopilotAssigned(issue)) {
      actions.push(
        `**Assign ${link(issue)} to Copilot** (${task.title}): open the issue → Assignees → choose **Copilot**. It will open a PR for you to review.`
      );
      copilotWork.push(`${task.id} — waiting for you to assign Copilot (${link(issue)})`);
    } else {
      copilotWork.push(`${task.id} — assigned to Copilot, PR not opened yet (${link(issue)})`);
      if (issue.number && daysSince(issue.updated_at ?? issue.created_at) > STALL_DAYS) {
        actions.push(`**Check on ${link(issue)}** — Copilot has not opened a PR in ${STALL_DAYS}+ days. Unassign and reassign Copilot to restart it.`);
      }
    }
  }

  const health = await siteHealth();
  if (health && health.conclusion !== "success") {
    actions.unshift(`**Fix site health failure** — the last [site health check](${health.url}) ended with \`${health.conclusion}\`. Open the linked \`site-health\` issue for details.`);
  }

  // 4. Dashboard with trend history.
  const scored = audit.checks.filter((c) => c.status !== "unknown");
  const passed = scored.filter((c) => c.status === "pass").length;
  const dashboards = await ghAll(`/repos/${REPO}/issues?labels=${LABELS.dashboard.name}&state=open`);
  const dashboard = dashboards.find((i) => !i.pull_request);
  const history = JSON.parse(dashboard?.body?.match(/<!-- seo-history:(.*?) -->/s)?.[1] ?? "[]");
  const previous = history.filter((h) => h.date !== today.date).at(-1);
  const failingIds = scored.filter((c) => c.status === "fail").map((c) => c.id);
  const nowFixed = previous ? previous.failing.filter((id) => !failingIds.includes(id)) : [];
  const nowBroken = previous ? failingIds.filter((id) => !previous.failing.includes(id)) : [];
  const nextHistory = [...history.filter((h) => h.date !== today.date), { date: today.date, passed, total: scored.length, failing: failingIds }].slice(
    -HISTORY_LIMIT
  );

  const queue = tasks
    .filter((t) => t.owner === "copilot")
    .map((t) => {
      const issue = taskIssues.get(t.id);
      const status = statusOf(t);
      const state =
        status === "pass" ? "✅ Done" : issue?.state === "open" ? `🔧 In progress ${link(issue)}` : issue?.state_reason === "not_planned" ? "⏭️ Skipped" : "⏳ Queued";
      return `| ${t.id} | ${t.title} | ${state} |`;
    });
  const categories = [...new Set(audit.checks.map((c) => c.category))].map((cat) => {
    const inCat = audit.checks.filter((c) => c.category === cat);
    return `| ${cat} | ${inCat.map((c) => icon[c.status]).join(" ")} | ${inCat.filter((c) => c.status === "pass").length}/${inCat.length} |`;
  });
  const trend = nextHistory.slice(-14).map((h) => `| ${h.date} | ${h.passed}/${h.total} | ${"█".repeat(h.passed)}${"░".repeat(h.total - h.passed)} |`);

  const dashboardBody = [
    `# SEO score: ${passed}/${scored.length} checks passing`,
    "",
    `_Last updated ${today.date} from a live audit of ${audit.pagesAudited} pages on ${SITE}. This issue is rewritten every weekday morning — don't edit it by hand._`,
    "",
    health
      ? `**Site health:** ${health.conclusion === "success" ? "✅ passing" : `❌ ${health.conclusion}`} ([last run](${health.url}))`
      : "**Site health:** ⚪ unknown",
    "",
    "## By category",
    "",
    "| Category | Checks | Passing |",
    "|---|---|---|",
    ...categories,
    "",
    "## All checks",
    "",
    "| | Check | Result |",
    "|---|---|---|",
    ...audit.checks.map((c) => `| ${icon[c.status]} | ${c.title} | ${c.summary} |`),
    "",
    "## Fix queue (Copilot)",
    "",
    "| Task | Fix | Status |",
    "|---|---|---|",
    ...queue,
    "",
    "## Trend",
    "",
    "| Date | Passing | |",
    "|---|---|---|",
    ...trend,
    "",
    audit.psi?.some((r) => !r.error)
      ? [
          "## Mobile performance (PageSpeed lab data)",
          "",
          "| Page | Score | LCP | CLS | TBT |",
          "|---|---|---|---|---|",
          ...audit.psi.filter((r) => !r.error).map((r) => `| \`${r.path}\` | ${r.score} | ${(r.lcpMs / 1000).toFixed(1)} s | ${r.cls} | ${r.tbtMs} ms |`),
          "",
        ].join("\n")
      : "",
    `<!-- seo-history:${JSON.stringify(nextHistory)} -->`,
  ].join("\n");

  let dashboardIssue = dashboard;
  if (dashboard) {
    await write(`update dashboard #${dashboard.number}`, () => gh("PATCH", `/repos/${REPO}/issues/${dashboard.number}`, { body: dashboardBody }));
  } else {
    dashboardIssue = await write("create dashboard issue", () =>
      gh("POST", `/repos/${REPO}/issues`, { title: "📊 SEO Dashboard", body: dashboardBody, labels: [LABELS.dashboard.name] })
    );
  }
  const dashboardLink = dashboardIssue ? `[📊 SEO Dashboard](${dashboardIssue.html_url})` : "📊 SEO Dashboard";

  // 5. Daily briefing (the reminder).
  const label = (id) => audit.checks.find((c) => c.id === id)?.title ?? id;
  const nextUp = tasks.find((t) => t.owner === "copilot" && statusOf(t) === "fail" && !taskIssues.has(t.id));
  const delta = previous ? passed - previous.passed : 0;
  const briefing = [
    `## Good morning — ${passed}/${scored.length} SEO checks passing${previous ? ` (${delta >= 0 ? "+" : ""}${delta} since ${previous.date})` : ""}`,
    "",
    "### ✅ Your actions today",
    "",
    ...(actions.length ? actions.map((a) => `- [ ] ${a}`) : ["- [ ] Nothing needs you today. Copilot is working; check back tomorrow."]),
    "",
    "### 🤖 Copilot",
    "",
    ...(copilotWork.length ? copilotWork.map((w) => `- ${w}`) : ["- No fix in flight. All queued checks pass. 🎉"]),
    "",
  ];
  if (nowFixed.length || fixedTasks.length) {
    briefing.push("### 🎉 Fixed since last run", "", ...nowFixed.map((id) => `- ${label(id)}`), ...fixedTasks.map(({ task, issue }) => `- Closed ${link(issue)} (${task.id})`), "");
  }
  if (nowBroken.length || reopenedTasks.length) {
    briefing.push(
      "### ⚠️ Regressed",
      "",
      ...nowBroken.map((id) => `- ${label(id)}: ${checks.get(id).summary}`),
      ...reopenedTasks.map(({ task, issue }) => `- Reopened ${link(issue)} (${task.id})`),
      ""
    );
  }
  briefing.push(
    "### Up next",
    "",
    nextUp ? `- ${nextUp.id}: ${nextUp.title} (opens automatically once the current fix is verified)` : "- Backlog is clear. Add tasks in `seo/backlog.json`.",
    "",
    `Full status: ${dashboardLink}. This plan closes automatically tomorrow.`
  );
  const briefingBody = briefing.join("\n");

  if (todaysBriefing) {
    await write(`update briefing #${todaysBriefing.number}`, () =>
      gh("PATCH", `/repos/${REPO}/issues/${todaysBriefing.number}`, { body: briefingBody, state: "open" })
    );
  } else {
    await write(`create briefing "${briefingTitle}"`, () =>
      gh("POST", `/repos/${REPO}/issues`, { title: briefingTitle, body: briefingBody, labels: [LABELS.daily.name], assignees: [OWNER] })
    );
  }
  for (const old of existingBriefings.filter((i) => i.state === "open" && i.title !== briefingTitle && !i.pull_request)) {
    await write(`close old briefing #${old.number}`, () =>
      gh("PATCH", `/repos/${REPO}/issues/${old.number}`, { state: "closed", state_reason: "completed" })
    );
  }

  await mkdir(OUT, { recursive: true });
  await writeFile(join(OUT, "audit.json"), JSON.stringify(audit, null, 2));
  await writeFile(join(OUT, "briefing.md"), `# ${briefingTitle}\n\n${briefingBody}\n`);
  await writeFile(join(OUT, "dashboard.md"), dashboardBody.replace(/<!-- seo-history:.*? -->/s, ""));
  console.log(`\n${briefingBody}`);
}

await main();
