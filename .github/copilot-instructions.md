# Copilot instructions for savartus-website

This is the Savartus corporate website (https://www.savartus.com). It is a Next.js 16 App Router site deployed by Vercel on every merge to `main`.

## Before writing code

- Read `AGENTS.md`. This Next.js version has breaking changes, so check `node_modules/next/dist/docs/` (or nextjs.org docs for v16) before using any Next.js API.
- Product data lives in `data/els-products.ts`. Insight articles live in `content/insights/articles.ts`. The sitemap is `app/sitemap.ts`.
- JSON-LD pattern: render `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />` (see `app/insights/[slug]/page.tsx`).

## Content rules (important)

- Use only facts that already appear on the site or in the repo. Never invent product specifications, capacities, prices, customers, certifications, statistics, awards, addresses, or legal/regulatory claims.
- Keep the existing brand voice and visual design. Reuse existing components and Tailwind classes.
- Do not change external source links in Insights unless the task says to.

## SEO tasks

- SEO issues are created by `.github/workflows/seo-daily.yml` from `seo/backlog.json`. Each issue names the audit check that must pass.
- Audit the live site with `node scripts/seo-audit.mjs --no-psi`. It writes `seo-report/audit.json`, which lists every failing page.
- Titles must be ≤ 65 characters including ` | Savartus` (the root layout adds that suffix via the title template). Meta descriptions must be 70–165 characters and unique.

## Pull requests

- Keep each PR focused on one issue and reference it with `Fixes #<issue>`.
- Before finishing, run all of these and make sure they pass: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- In the PR description, list the pages affected and show before/after values for any titles, descriptions, or structured data you changed.
