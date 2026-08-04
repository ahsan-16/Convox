# SEO Growth Audit & Implementation Roadmap

**Branch:** `docs/seo-ranking-growth-audit`  
**Date:** 2026-08-03  
**Scope:** Rank for ZolvStack, Fileora, Fileora Converter, File Converter, Image Converter, PDF Converter, and related long-tails.

---

## 1. Executive findings

Technical SEO in `lib/seo/*` is production-ready (registry, metadata, JSON-LD, sitemap/robots, fail-closed indexing). Ranking for **non-branded converter keywords** is blocked mainly by:

1. **Task 9 policy** — all 23 `/fileora/*` tools are `index:false` / `sitemap:false`.
2. **Discovery gaps** — hub and related-tool UI previously showed Image Tools only.
3. **Thin tool pages** — short H1s, one description, no FAQ/how-to content (quality gate requirement).
4. **No category landers** for “Image Converter” / “PDF Converter” head terms.

Branded queries (**ZolvStack**, **Fileora**) can rank via `/` and `/fileora` once production indexing + GSC are live.

---

## 2. Phase 1 implemented (this branch)

| ID | Change | Files |
|---|---|---|
| **A** | Restored PDF, Document, and production-ready AI (`image-enhance`) discovery on hub + tool related links; hid unfinished `remove-bg` from discovery | `FileoraHubClient.tsx`, `ToolPage.tsx`, `ToolNav.tsx`, `lib/utils.ts` |
| **B** | Home + Fileora hub titles/descriptions tuned for brand + file/image/PDF converter intents (~50–60 / ~140–160) | `lib/seo/brands.ts`, `lib/seo/routes.ts`, `lib/seo/schema/organization.ts`, tests |
| **C** | Internal links: ZolvStack home → Fileora; Fileora footer Tools; ZolvStack footer product links; hub priority converter links | `ZolvStackHomeClient.tsx`, `Footer.tsx`, `zolvstack-catalog.ts`, `FileoraHubClient.tsx` |
| **D** | This roadmap document | `docs/seo/seo-growth-audit-roadmap.md` |

**Phase 2 (content + ToolPage + FAQ schema — implemented on this branch, still noindex):**  
Plan: [`docs/superpowers/plans/2026-08-03-fileora-tool-content-quality-gate.md`](../superpowers/plans/2026-08-03-fileora-tool-content-quality-gate.md)  
Registry: `lib/fileora-tool-content.ts` · UI: `ToolPage` / `ToolSeoContent` · FAQ wiring: `lib/seo/routes.ts`

**Phase 3 (indexing-candidate preparation — documentation only):**  
- [`docs/seo/tool-index-quality-gate.md`](./tool-index-quality-gate.md) — objective gate checklist  
- [`docs/seo/phase-3-indexing-candidates.md`](./phase-3-indexing-candidates.md) — Wave 1 shortlist, batches, risks  

**Explicitly not changed (constraints):**

- Tool `index` / `sitemap` flags (Task 9 gate intact)
- Category landing pages
- Placeholder blog/docs content
- Premature tool indexing

---

## 3. Prioritized roadmap (remaining)

| Priority | Action | Impact | Effort | ETA | Owner |
|---|---|---|---|---|---|
| P0 | Production domain + `SEO_INDEXING_ENABLED=true` in CI + GSC Domain property + sitemap submit | H | M | weeks | Ops |
| P1 | ~~Unique tool content + intent H1s + per-tool FAQs~~ **Wave 1 done (Phase 2)**; extend remaining tools | H | M–H | ongoing | Content + eng |
| P1b | Gate sign-off + smoke evidence for Wave 1 candidates ([quality gate](./tool-index-quality-gate.md)) | H | M | before opt-in | Eng + QA |
| P2 | Selective `index`/`sitemap` opt-in per [candidates rollout](./phase-3-indexing-candidates.md) (pilot = 1 tool) | H | M | after P0 + P1b | Eng |
| P3 | Category landers: Image / PDF / Document / Free File Converter | H | M | 1–2 mo | Eng + content |
| P4 | Visible breadcrumbs; cleaner `SoftwareApplication` names | M | L | weeks | Eng |
| P5 | Blog/docs guides; flip index when substantial | M | H | months | Content |
| P6 | `Organization.sameAs`, contribute/indexable open-source surface, backlinks | M | M | months | Ops |

---

## 4. Indexing strategy

### Current (unchanged)

- Fail-closed: production + HTTPS origin + `SEO_INDEXING_ENABLED=true`.
- Declared indexable: Home, About, Products, Contact, Security, Privacy, Terms, Fileora hub.
- All tools: `index:false`, `sitemap:false`, `follow:true`.

### Future opt-in rule

A tool becomes indexable only when **all** are true:

1. Converter smoke-tested and stable in production.
2. Unique substantial on-page content (intent H1, how-to, use cases).
3. Correct metadata + JSON-LD (optional FAQPage via `route.faq`).
4. Crawlable internal links from hub and related tools.
5. Explicit per-route flip in `lib/seo/routes.ts` (`index`/`sitemap` true).

Do **not** flip tools before the content quality gate.

---

## 5. Tool rollout strategy (index first)

Authoritative ranking, batch size, and monitoring: [`phase-3-indexing-candidates.md`](./phase-3-indexing-candidates.md).

Recommended enablement order (still **noindex** until explicit flip):

| Rank | Tools | Why |
|---|---|---|
| 1–2 | `image-to-webp`, then `heic-to-jpg` | Highest image / mobile intent; pilot first |
| 3–6 | `pdf-merge`, `pdf-compress`, `pdf-to-jpg`, `image-to-pdf` | PDF / file-converter demand |
| 7–8 | `image-to-jpg`, `image-to-png` | Broad image demand |
| Later | Remaining image + core document tools (after content) | Broader coverage |
| Hold | `remove-bg` (unfinished), other AI until stable + unique copy | Quality / trust |

**Batching:** pilot **1** tool → then **1–2** → steady **2–3**. Do not flip all eight at once.

---

## 6. Content roadmap

### Category hubs (Phase 2+)

- `/fileora/image-converter`
- `/fileora/pdf-converter`
- `/fileora/document-converter`
- Optional: `/fileora/free-file-converter` or strengthen hub copy only

### Guides / long-form (Blog or Docs when real)

- JPG vs WebP; when to use AVIF
- HEIC to JPG on iPhone / Mac / Windows
- How to merge / compress PDFs online privately
- Fileora vs signup-walled converters (privacy angle)

### Per-tool templates

- Intent H1 matching metadata title intent
- 2–4 short use-case paragraphs
- Steps (HowTo-friendly)
- 3–5 FAQs → `route.faq` + FAQPage schema

---

## 7. Long-tail keyword opportunities

Map existing slugs (index only after content):

| Cluster | Example queries | Primary URL (future) |
|---|---|---|
| Image | image to webp, heic to jpg, png to jpg | `/fileora/image-to-webp`, etc. |
| PDF | merge pdf, compress pdf, pdf to jpg | `/fileora/pdf-merge`, etc. |
| Document | docx to pdf, markdown to pdf | `/fileora/document-to-pdf`, `/fileora/md-to-pdf` |
| Brand | zolvstack, fileora, fileora converter | `/`, `/fileora` |
| Head non-brand | file converter, image converter, pdf converter | Hub + future category pages |

`TOOL_CONFIG.keywords` exist but are intentionally unused in meta unless set on `SeoRoute.keywords` — prefer on-page content over keyword meta stuffing.

---

## 8. Google Search Console recommendations

1. Verify **Domain** property for the production host.
2. Submit `https://{origin}/sitemap.xml` only when indexing is enabled.
3. Request indexing for the 8 approved URLs first (home + hub + brand/legal).
4. Do **not** request indexing for tool URLs until Task 9 opt-in.
5. Monitor: Coverage, Experience (CWV), Queries for brand + “fileora” + “converter”.
6. Set verification env vars (`SEO_GOOGLE_SITE_VERIFICATION`) in GitHub production environment before build.

See also: `docs/seo/search-console.md`.

---

## 9. Authority & backlinks

- Fill `ORGANIZATION_SAME_AS` when real public profiles exist (GitHub org, Product Hunt, etc.).
- Keep Contribute (`/careers`) content real before flipping index.
- Outreach: open-source README, converter comparison roundups, privacy-focused communities.

---

## 10. Blockers before tool indexing (post Phase 2/3 docs)

Use the full [quality gate](./tool-index-quality-gate.md). Summary:

1. [x] Unique substantial content on Wave 1 candidate tool pages (Phase 2)  
2. [x] Intent-aligned visible H1s + FAQ UI/schema (Phase 2)  
3. [ ] Smoke tests recorded for each opt-in tool  
4. [ ] Meta descriptions tightened where `seo:check` warns (ideal 140–160)  
5. [ ] Production indexing gate confirmed on  
6. [ ] GSC coverage healthy for current brand/hub URLs  
7. [ ] Hub discovery remaining intact (Phase 1 A)  
8. [ ] Explicit human approval + per-route `index`/`sitemap` flip (not done in Phase 3)

---

## 11. Validation checklist (Phase 1)

Run on this branch before review:

```bash
npm run lint
npm run typecheck
npm test
NEXT_PUBLIC_APP_URL=https://example.com npm run seo:check
```
