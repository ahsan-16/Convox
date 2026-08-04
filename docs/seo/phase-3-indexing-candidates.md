# Phase 3: Fileora Indexing-Candidate Preparation

**Phase type:** Documentation and readiness only.  
**Production SEO behavior:** Unchanged — every tool remains `index: false` / `sitemap: false` until a later, approved registry flip.

**Related:** [Tool index quality gate](./tool-index-quality-gate.md) · [SEO growth roadmap](./seo-growth-audit-roadmap.md) · [Content plan](../superpowers/plans/2026-08-03-fileora-tool-content-quality-gate.md)

---

## 1. Purpose

Prepare a conservative shortlist and rollout plan so Wave 1 Fileora converters can be **considered** for indexing after they fully pass the [quality gate](./tool-index-quality-gate.md). This phase does **not** flip flags, update the sitemap, or alter Task 9 defaults.

---

## 2. Wave 1 candidate ranking order

Recommended **enablement order** (intent demand × content readiness × product story). All eight already have Phase 2 content + FAQ UI/schema wiring; they are still **noindex**.

| Rank | Slug | Path | Why this order |
|---:|---|---|---|
| 1 | `image-to-webp` | `/fileora/image-to-webp` | Highest “WebP converter” / performance-image demand; core Fileora story |
| 2 | `heic-to-jpg` | `/fileora/heic-to-jpg` | Strong mobile / iPhone photo intent |
| 3 | `pdf-merge` | `/fileora/pdf-merge` | Head PDF utility intent |
| 4 | `pdf-compress` | `/fileora/pdf-compress` | Head PDF utility intent |
| 5 | `pdf-to-jpg` | `/fileora/pdf-to-jpg` | Cross-format PDF → image |
| 6 | `image-to-pdf` | `/fileora/image-to-pdf` | Common export / print path |
| 7 | `image-to-jpg` | `/fileora/image-to-jpg` | Broad image demand |
| 8 | `image-to-png` | `/fileora/image-to-png` | Broad image demand |

### Hold (not candidates yet)

| Slug / area | Reason |
|---|---|
| `remove-bg` | Unfinished; hidden from discovery |
| Other AI (`image-enhance`, etc.) | Need stable UX + unique copy + smoke evidence |
| Thin / non–Wave-1 document converters | No unique registry content yet |
| Category landers | Out of scope until a later phase |

---

## 3. Readiness snapshot (as of Phase 2 close)

| Gate area | Wave 1 status | Remaining before flip |
|---|---|---|
| Unique H1 / intro / use cases / benefits / FAQs | Done in registry + UI | Verify claims vs live converters |
| FAQPage JSON-LD when FAQs exist | Done via `buildToolRoute` | Spot-check View-Source on staging |
| Metadata intent titles | Content `h1` wired | Improve meta **descriptions** toward 140–160 chars where advisory |
| Functional smoke | Not gate-signed per tool | Run and record happy-path smokes |
| Hub discovery | Phase 1 restored | Confirm each candidate still listed |
| `index` / `sitemap` | Still false | Explicit flip only after approval |

---

## 4. Content readiness requirements (summary)

See full checklist in the [quality gate](./tool-index-quality-gate.md#a-content-readiness). Minimum:

- Unique H1, intro, ≥2 use cases, ≥2 benefits, ≥3 FAQs
- No duplicate intros/H1s across tools (automated tests)
- On-page rendering via `ToolSeoContent`
- Claims accurate for the real converter

---

## 5. Metadata readiness requirements (summary)

- Intent title → final branded title
- Substantive description (~140–160 ideal)
- Canonical under `/fileora/{slug}`
- Social fields consistent with document metadata
- After flip: robots/sitemap membership only when fail-closed gate is open

---

## 6. Functional testing requirements (summary)

Per candidate before opt-in:

1. Supported sample convert + download
2. Invalid input / size rejection
3. No Coming Soon shell
4. Discoverable internal links
5. Post-deploy smoke on production-like host

---

## 7. SEO validation requirements (summary)

Before and after any future flip:

```bash
npm run lint
npm run typecheck
npm test
NEXT_PUBLIC_APP_URL=https://example.com npm run seo:check
```

Confirm:

- Errors = 0 on `seo:check`
- Wave-1 graphs include `FAQPage` only where FAQs exist
- Until flips land: **0 tools** declared indexable / in sitemap
- After a flip: only approved slugs appear in sitemap when production indexing is active

---

## 8. Rollout sequence and batch size

### Recommended batch size

| Stage | Tools per batch | Rationale |
|---|---|---|
| Pilot | **1** (`image-to-webp` only) | Isolate GSC coverage, CWV, and soft-404 risk |
| Early | **1–2** | Confirm crawl + impressions before expanding |
| Steady | **2–3** | Only after pilot shows clean coverage for ≥1–2 weeks |
| Avoid | Full Wave 1 (8) in one deploy | Harder to attribute regressions; burns crawl budget |

### Sequence

1. **Ops baseline:** Production indexing gate on; GSC Domain property; sitemap submitted; brand + hub URLs healthy.
2. **Pilot flip:** `image-to-webp` only — PR with quality-gate evidence.
3. **Monitor 7–14 days** (section 9).
4. **Batch 2:** `heic-to-jpg` (+ optionally one PDF utility if pilot is clean).
5. **Batch 3+:** Continue down the ranking table in order; skip any tool that fails a gate item.
6. **Pause** if coverage errors, soft 404s, or CWV regressions spike.

### How to flip (future work — not this phase)

In `lib/seo/routes.ts`, for the approved slug only, override defaults after `TOOL_ROUTE_DEFAULTS` spread (or set explicit flags on that route):

- `index: true`
- `sitemap: true`
- keep `follow: true`

Redeploy so baked metadata/sitemap regenerate. Do **not** change `TOOL_ROUTE_DEFAULTS` globally.

---

## 9. Risks and monitoring plan (after indexing is eventually enabled)

### Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Thin/duplicate content penalty perception | Low rankings / ignored URLs | Quality gate + uniqueness tests; unique intros |
| Soft 404 / broken converter | Trust + coverage “Excluded” | Functional smoke; hold unfinished tools |
| Mass-index crawl waste | Slower discovery of best URLs | 1 → 1–2 → 2–3 batching |
| Meta description too short | Weaker snippets | Tighten `longDesc` / intros before flip |
| Inaccurate FAQ claims | Rich-result invalidation / trust | Claim review vs converter |
| Env bake miss (`SEO_*` / origin) | Accidental noindex or wrong canonicals | CI `seo:check` + GitHub production env |
| Need emergency stop | Indexed thin pages | [Rollback](./rollback.md): disable indexing and/or revert route flags |

### Monitoring (first 14 days per newly indexed tool)

| Signal | Where | Action if bad |
|---|---|---|
| Submitted vs indexed / excluded | GSC URL Inspection + Page indexing | Fix content/UX; temporary `noindex` if soft 404 |
| Sitemap discovered URLs | GSC Sitemaps | Confirm only opted-in tools appear |
| Queries / impressions for slug intents | GSC Performance | Expect slow ramp; investigate cannibalization vs hub |
| CWV / Experience | GSC + field data | Respect `docs/seo/performance-budgets.md` |
| 5xx / convert failures | App logs / uptime | Pause further flips |
| Rich results / FAQ | GSC enhancements (if reported) | Fix FAQ copy or omit broken FAQs |

### Success criteria for expanding batches

- Pilot URL indexed (or clearly crawled with no soft-404 exclusion) within a reasonable window for the property
- No spike in “Crawled – currently not indexed” tied to thin duplicates
- Converter error rate unchanged vs pre-flip baseline
- `seo:check` still clean on mainline

---

## 10. Explicit confirmation (this phase)

- [x] Documentation created for candidates + quality gate
- [x] **No** `index` / `sitemap` flag changes
- [x] **No** Task 9 default changes
- [x] **No** sitemap behavior changes
- [x] Tools remain noindex until a future approved engineering change
