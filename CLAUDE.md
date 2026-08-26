# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Breaking-changes warning

This repo runs **Next.js 16** and **React 19**, which differ from what training data typically assumes. Check `node_modules/next/dist/docs/` for the relevant guide before relying on older Next.js conventions, and watch for deprecation notices.

## Commands

```
npm run dev      # start dev server (next dev)
npm run build    # production build (next build)
npm run start    # run the production build
npm run lint     # eslint
```

There is no test suite in this repo.

## Architecture

This is a single Next.js App Router application — there is no separate backend service. An earlier FastAPI/Python prototype (`main.py`) that mocked audit results with keyword matching has been removed; all compliance auditing goes through `app/api/audit/route.ts`, which calls the Claude API directly.

**Audit pipeline (`app/api/audit/route.ts`):** accepts an uploaded `.txt`/`.pdf`/`.docx` file, extracts raw text (`unpdf` for PDF, `mammoth` for DOCX), builds a system prompt from `lib/icm.ts` (`SYSTEM_DIRECTIVES` + `COMPLIANCE_RULES` — the "ICM Method" rule set defining things like concentration limits, leverage caps, fee disclosure rules), sends it to Claude (`claude-opus-4-5`) requesting strict JSON output, and persists the resulting findings to the `audit_runs` table. Monthly audit counts are enforced per-user against `lib/tiers.ts` limits before the Claude call is made.

**Auth:** NextAuth v5 (beta) with a Credentials provider (`lib/auth.ts`), bcrypt-hashed passwords in the `users` table. Auth config is deliberately split in two:
- `lib/auth.config.ts` — Edge-safe (no DB/Node APIs), defines route protection rules and JWT/session callbacks (attaches `id`, `role`, `tier` to the session). Used by `proxy.ts` (the Next.js middleware, which runs on the Edge runtime).
- `lib/auth.ts` — the full NextAuth instance with the Credentials provider and DB lookups, used by API routes (Node runtime).

Do not add DB calls or Node-only imports to `auth.config.ts` — it will break the Edge middleware.

**Database:** Postgres via the `postgres` package, pointed at Supabase (`lib/db.ts`). `instrumentation.ts` runs `initDB()` once per server start to create the `users` and `audit_runs` tables if missing — there are no separate migration files. Admin queries live in `app/api/admin/users/route.ts`, gated on `role === 'admin'`.

> **Supabase connection gotcha:** `DATABASE_URL` must use Supabase's **Session Pooler** (port `5432` on a `*.pooler.supabase.com` host), not the direct connection (`db.<project-ref>.supabase.co:5432`). The direct host resolves over IPv6 only, which Vercel's serverless functions cannot reach — this causes `getaddrinfo ENOTFOUND` in production while working fine locally.

**Billing/tiers:** `lib/tiers.ts` is the single source of truth for tier names, monthly audit limits, and prices (`foundation` / `accelerator` / `pinnacle`). `app/api/stripe/checkout/route.ts` creates a Stripe Checkout session tagged with `userId`/`tier` metadata; `app/api/stripe/webhook/route.ts` listens for `checkout.session.completed` / `customer.subscription.updated` / `customer.subscription.deleted` and writes the resulting tier back onto the `users` row. The webhook has a `whsec_placeholder` bypass path for local testing without signature verification.

**PDF export:** `lib/exportPDF.ts` renders the audit findings into a branded PDF client-side with `jsPDF` — this is unrelated to the PDF *parsing* done during audit ingestion (`unpdf`).

**Routes:** marketing/public pages (`/`, `/about`, `/how-it-works`, `/pricing`, `/plans`, `/contact`, `/terms`, `/privacy`) plus `/auth/login`, `/auth/register` are public per `authConfig.callbacks.authorized`; everything else requires a session, and `/admin`* requires `role === 'admin'`.

`types/audit.ts` defines a `ProspectusAuditPayload`/`ComplianceRuleMatch` shape left over from the removed FastAPI prototype — it is not used anywhere in the current app; the real audit response shape is the inline `{ status, findings: [{ rule_id, clause_found, variance, severity }] }` JSON defined in `lib/icm.ts`'s prompt instructions.
