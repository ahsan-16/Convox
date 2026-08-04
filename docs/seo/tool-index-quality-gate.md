# Fileora Tool Index Quality Gate

**Status:** Documentation only — no tool routes are indexable or sitemap-eligible until an explicit, approved flip in `lib/seo/routes.ts`.  
**Related:** [Phase 3 indexing candidates](./phase-3-indexing-candidates.md) · [SEO growth roadmap](./seo-growth-audit-roadmap.md) · [Search Console runbook](./search-console.md) · [Rollback](./rollback.md)

This gate is the objective bar a Fileora converter must clear before humans may set `index: true` / `sitemap: true` on its `SeoRoute`. Task 9 defaults remain `index: false`, `sitemap: false`, `follow: true` for every tool until that flip.

---

## Hard rules (never skip)

1. **Fail-closed indexing** still applies: production + valid HTTPS origin + `SEO_INDEXING_ENABLED=true`. Declared `index: true` alone is not enough.
2. **Per-route opt-in only** in `lib/seo/routes.ts` — never mass-enable via `TOOL_ROUTE_DEFAULTS`.
3. **Human approval required** for each batch (see candidates doc).
4. **No soft 404s / Coming Soon shells** may be indexed.
5. **FAQPage JSON-LD** only when real `route.faq` content exists (already enforced by schema composers).

---

## Final quality-gate checklist

A tool may be **considered** for indexing only when **every** item below is checked and evidenced.

### A. Content readiness

- [ ] Entry exists in `lib/fileora-tool-content.ts` for the slug.
- [ ] Unique intent **H1** (not a generic product nickname alone).
- [ ] Unique **intro** (≥ ~40 words; not duplicated across tools — covered by `lib/fileora-tool-content.test.ts`).
- [ ] **≥2 use cases** and **≥2 benefits**, tool-specific.
- [ ] **≥3 FAQs** with non-empty question + answer; answers match real converter behavior (formats, privacy, limits).
- [ ] Visible on `/fileora/{slug}`: H1, intro, use cases, benefits, FAQs (via `ToolPage` + `ToolSeoContent`).
- [ ] Claims in copy verified against live converter (batch/ZIP, accepted MIME types, client-side privacy wording).

### B. Metadata readiness

- [ ] Document title uses intent pattern via content `h1` / slug derivation + brand suffix (`… | Fileora by ZolvStack`).
- [ ] Meta description from substantive `longDesc` / intro; target **~140–160** characters (`seo:check` advisory).
- [ ] Canonical is the tool path under `/fileora/…` (no bare `/slug` as canonical).
- [ ] `robots` still matches route flags until opt-in; after opt-in, expect `index,follow` when effective indexing is active.
- [ ] OG/Twitter title/description align with the same intent (no divergent social copy).

### C. Schema / SEO validation

- [ ] Product-tool JSON-LD includes Organization, WebSite, WebPage, SoftwareApplication, BreadcrumbList.
- [ ] `FAQPage` present **iff** authored FAQs exist; absent otherwise.
- [ ] No fabricated `aggregateRating` / reviews.
- [ ] `NEXT_PUBLIC_APP_URL=… npm run seo:check` passes (errors = 0).
- [ ] Vitest SEO suites green (`lib/seo/routes.test.ts`, `lib/seo/schema/graph.test.ts`, content uniqueness tests).

### D. Functional testing

- [ ] Primary happy path: upload supported sample → convert → download succeeds.
- [ ] Reject unsupported type / oversize with a clear error (API boundary).
- [ ] No “Coming Soon” or non-functional primary CTA for this slug.
- [ ] Tool is discoverable (`isToolDiscoverable`) and linked from Fileora hub category + related tools (no `#` hrefs).
- [ ] Smoke on production-like build or staging host after deploy of the flip.

### E. Discovery & crawlability

- [ ] Hub category lists the tool.
- [ ] At least one internal path from `/fileora` (and preferably home → Fileora).
- [ ] Related-tools / ToolNav do not hide the tool incorrectly.
- [ ] Redirects: bare `/slug` → `/fileora/slug` still work (`lib/seo/redirects.ts`).

### F. Policy & ops

- [ ] Written approval for this slug (or named batch) recorded in PR / issue.
- [ ] Explicit `index: true` **and** `sitemap: true` on that route only (or documented why one differs — prefer both together).
- [ ] Deploy includes baked metadata (`NEXT_PUBLIC_*` / indexing env from GitHub production environment).
- [ ] GSC: brand + hub coverage healthy **before** requesting tool URLs.
- [ ] Rollback path known: revert route flags and/or set `SEO_INDEXING_ENABLED=false` (see `docs/seo/rollback.md`).

---

## Evidence to attach when requesting a flip

| Evidence | Example |
|---|---|
| Content | Link to registry entry + screenshot of `/fileora/{slug}` |
| Uniqueness | `npm test -- lib/fileora-tool-content.test.ts` |
| SEO | `seo:check` excerpt; View-Source FAQPage snippet if FAQs exist |
| Functional | Short smoke notes (formats tried, pass/fail) |
| Approval | PR checklist or signed-off comment |

---

## Explicit non-goals of this document

- Does **not** enable indexing or sitemap inclusion.
- Does **not** change Task 9 defaults.
- Does **not** approve category landers or blog indexing.
