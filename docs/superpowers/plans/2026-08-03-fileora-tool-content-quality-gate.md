# Fileora Tool Content Quality Gate (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give priority Fileora converter pages unique, intent-aligned content and FAQs (with schema wiring) so they can later pass the Task 9 index quality gate — without enabling indexing or sitemap inclusion in this phase.

**Architecture:** Introduce a single content registry keyed by `ToolSlug` for editorial H1, body sections, and FAQs. `ToolPage` renders that content below the converter UI. `lib/seo/routes.ts` attaches the same FAQ arrays to `SeoRoute.faq` so existing `FAQPage` JSON-LD composers pick them up automatically. Keep Task 9 defaults (`index: false`, `sitemap: false`) unchanged.

**Tech Stack:** Next.js App Router, existing `lib/seo/*` registry + schema, React client `ToolPage`, Vitest, `npm run seo:check`.

## Global Constraints

- Do **not** set any tool route `index: true` or `sitemap: true`.
- Do **not** change `TOOL_ROUTE_DEFAULTS` or Task 9 policy text in a way that opts tools in.
- Do **not** invent FAQs or ratings; only real authored FAQ copy.
- Do **not** use `#` / Coming Soon links for discoverable tools.
- Do **not** commit or open a PR unless the user explicitly asks.
- Prefer unique per-tool copy; no copy-paste paragraphs across tools.
- H1 intent must match the **actual** converter (e.g. Image to WebP — not “WebP to PNG” unless that tool exists).

---

## File map (exact touch list)

### Create

| File | Responsibility |
|---|---|
| `lib/fileora-tool-content.ts` | Content registry: `h1`, `intro`, `useCases[]`, `benefits[]`, `faqs[]` per Wave-1 `ToolSlug`; type `FileoraToolContent`; helper `getFileoraToolContent(slug)`. |
| `lib/fileora-tool-content.test.ts` | Uniqueness checks (no duplicate intros/H1s across tools); FAQ shape; Wave-1 coverage. |
| `components/tools/ToolSeoContent.tsx` | Presentational block: H1 already on page → render intro, use cases, benefits, FAQ accordion/list under converter. |
| `docs/seo/tool-index-quality-gate.md` | Objective checklist for a tool to become indexable (content, metadata, functional, intent, linking). |
| `docs/seo/phase-2-indexing-candidates.md` | Shortlist of first tools eligible **after** gate is satisfied (still noindex until Phase 3). |

### Modify

| File | Change |
|---|---|
| `components/tools/ToolPage.tsx` | Visible H1 uses intent title (`resolveToolIntentTitle` / content `h1`); render `<ToolSeoContent />` below converter; keep converter UI unchanged. |
| `lib/seo/routes.ts` | In `buildToolRoute(slug)`, if content FAQs exist, set `faq: [...content.faqs]` (still `...TOOL_ROUTE_DEFAULTS` for index/sitemap). Optional: set `title` intent override only when content supplies a better phrase than slug derivation. |
| `lib/seo/content-resolver.ts` | **Likely no change** — already derives `"Image to WebP Converter"` from `image-to-webp`. Only touch if Wave-1 needs special-case intent for non-`-to-` tools (e.g. richer “Merge PDF Files Online”). |
| `lib/utils.ts` (`TOOL_CONFIG`) | Optionally enrich Wave-1 `longDesc` to match unique intros (metadata description source). Do not weaken uniqueness. |
| `lib/seo/schema/graph.test.ts` | Add assertion: a Wave-1 tool with FAQs emits `FAQPage` when `route.faq` is populated. |
| `lib/seo/routes.test.ts` | Assert Wave-1 tools still `index:false` / `sitemap:false`; assert FAQ arrays present when content wired. |
| `docs/seo/seo-growth-audit-roadmap.md` | Link to Phase 2 plan + quality-gate + candidates docs; mark Phase 2 in progress. |

### Do **not** modify (this phase)

| File / area | Why |
|---|---|
| `TOOL_ROUTE_DEFAULTS` / per-tool `index`/`sitemap` flips | Constraint: no indexing |
| `lib/seo/sitemap.ts`, `lib/seo/indexability.ts` | No sitemap/policy change |
| Category landing page routes | Deferred to later phase |
| `app/(marketing)/fileora/(tools)/remove-bg/page.tsx` | Unfinished; stay out of Wave 1 |
| Hub category discovery (Phase 1) | Already done; avoid regressions |

---

## Wave 1 content scope (priority converters)

Implement unique content + FAQs for these slugs first (matches Phase 1 shortlist):

| Slug | Intended visible H1 / intent |
|---|---|
| `image-to-webp` | Image to WebP Converter |
| `heic-to-jpg` | HEIC to JPG Converter |
| `image-to-jpg` | Image to JPG Converter |
| `image-to-png` | Image to PNG Converter |
| `image-to-pdf` | Image to PDF Converter |
| `pdf-merge` | PDF Merge (or “Merge PDF Files Online” if authored override) |
| `pdf-compress` | PDF Compress |
| `pdf-to-jpg` | PDF to JPG Converter |

**Note on examples:** Prefer real tool direction (`Image to WebP`), not reverse pairs that are not product tools (e.g. “WebP to PNG” only if a matching slug exists).

---

## Task 1: Content model + failing uniqueness tests

**Files:**
- Create: `lib/fileora-tool-content.ts`
- Create: `lib/fileora-tool-content.test.ts`

- [ ] Add types:

```ts
export type FileoraToolContent = {
  h1: string;
  intro: string;
  useCases: readonly string[];
  benefits: readonly string[];
  faqs: readonly { question: string; answer: string }[];
};
```

- [ ] Export `FILEORA_TOOL_CONTENT: Partial<Record<ToolSlug, FileoraToolContent>>` and `getFileoraToolContent(slug)`.
- [ ] Write failing tests: every Wave-1 slug has content; all `h1` and `intro` values are unique across the map; each tool has ≥3 FAQs with non-empty Q/A.
- [ ] Run: `npm test -- lib/fileora-tool-content.test.ts` (expect FAIL until content filled).

---

## Task 2: Author Wave-1 unique copy

**Files:**
- Modify: `lib/fileora-tool-content.ts`
- Optionally modify: `lib/utils.ts` (`longDesc` for Wave-1 only)

- [ ] Fill Wave-1 entries with distinct intros, 2–4 use cases, 2–4 benefits, 3–5 FAQs each.
- [ ] Ensure FAQs are tool-specific (e.g. HEIC iPhone workflow ≠ generic “is it free?” only — may share one free/privacy FAQ but vary others).
- [ ] Re-run uniqueness tests until PASS.
- [ ] If updating `longDesc`, keep ≤ ~160 chars where possible for meta description quality (seo:check advisory).

---

## Task 3: Intent-aligned visible H1 on ToolPage

**Files:**
- Modify: `components/tools/ToolPage.tsx`
- Create: `components/tools/ToolSeoContent.tsx` (stub OK this task)

- [ ] Import `resolveToolIntentTitle` + `getRoute` **or** use `getFileoraToolContent(slug)?.h1` with fallback to `resolveToolIntentTitle(getRoute(slug)!)`.
  - Preferred: **content `h1` wins**, else `resolveToolIntentTitle`, else `TOOL_CONFIG.title`.
- [ ] Replace hero `{config.title}` H1 with that intent string.
- [ ] Keep icon + short supporting line (intro snippet or `longDesc`).
- [ ] Smoke: open `/fileora/image-to-webp` and confirm H1 reads like “Image to WebP Converter”, not “WebP”.

**Server vs client note:** `ToolPage` is a client component. Do not import server-only SEO modules if they pull Node APIs. Prefer passing intent from the server `page.tsx` as a prop **or** keep H1 resolution in client-safe helpers (`fileora-tool-content` + slug derivation duplicated lightly). Safest pattern:

- [ ] Update each Wave-1 `app/(marketing)/fileora/(tools)/<slug>/page.tsx` only if needed to pass `intentTitle` / content — **prefer** keeping logic in shared client-safe `fileora-tool-content.ts` so all tool pages stay one-liners.

---

## Task 4: Render SEO body + FAQ UI

**Files:**
- Modify: `components/tools/ToolSeoContent.tsx`
- Modify: `components/tools/ToolPage.tsx`

- [ ] Implement sections: Intro, Use cases (list), Benefits (list), FAQ (definition list or accessible accordion).
- [ ] If no content for slug, render nothing (non–Wave-1 tools unchanged).
- [ ] Place block below converter / PdfSplitter, above “Other tools”.
- [ ] Match Fileora visual tokens (existing CSS variables; no new purple/card clutter).

---

## Task 5: Wire FAQs into SEO registry (schema only; still noindex)

**Files:**
- Modify: `lib/seo/routes.ts` (`buildToolRoute`)
- Modify: `lib/seo/routes.test.ts`
- Modify: `lib/seo/schema/graph.test.ts`

- [ ] Update `buildToolRoute`:

```ts
function buildToolRoute(slug: ToolSlug): SeoRoute {
  const content = getFileoraToolContent(slug);
  return {
    id: slug,
    path: toolHref(slug),
    product: "fileora",
    pageType: "product-tool",
    ...TOOL_ROUTE_DEFAULTS, // index/sitemap stay false
    ...(content?.faqs?.length
      ? { faq: content.faqs.map(({ question, answer }) => ({ question, answer })) }
      : {}),
    ...(content?.h1 ? { title: content.h1 } : {}),
  };
}
```

- [ ] Confirm `composeProductTool` already appends `buildFaqPageNode` when `route.faq` is set (no registry change expected).
- [ ] Tests: Wave-1 tool graph includes `FAQPage`; Task 9 still zero tools indexable/sitemap-eligible.
- [ ] Run: `npm test -- lib/seo/routes.test.ts lib/seo/schema/graph.test.ts`

---

## Task 6: Document quality gate + indexing candidates

**Files:**
- Create: `docs/seo/tool-index-quality-gate.md`
- Create: `docs/seo/phase-2-indexing-candidates.md`
- Modify: `docs/seo/seo-growth-audit-roadmap.md` (cross-links only)

### Quality gate checklist (must document)

A tool may be considered for Phase 3 indexing **only if**:

1. **Content:** Unique H1, intro, ≥2 use cases, ≥2 benefits, ≥3 FAQs; no duplicate intros across tools.
2. **Metadata:** Final title uses intent pattern; description from substantive `longDesc`/intro (~140–160 ideal).
3. **Schema:** `SoftwareApplication` + breadcrumbs; `FAQPage` only when FAQs authored.
4. **Functional:** Converter (or specialist UI) works for primary happy path; no “Coming Soon” shell.
5. **Discovery:** Linked from hub category + related tools; no `#` hrefs.
6. **Policy:** Explicit human approval + per-route `index`/`sitemap` flip in `routes.ts` (Phase 3 only).

### Indexing candidates shortlist (Phase 3 preview — still noindex in Phase 2)

| Priority | Slug | Rationale |
|---|---|---|
| 1 | `image-to-webp` | High “webp converter” demand; core Fileora story |
| 2 | `heic-to-jpg` | Strong mobile photo intent |
| 3 | `pdf-merge` | Head PDF utility intent |
| 4 | `pdf-compress` | Head PDF utility intent |
| 5 | `pdf-to-jpg` | Cross format PDF→image |
| 6 | `image-to-pdf` | Common export path |
| 7–8 | `image-to-jpg`, `image-to-png` | Broad image demand |

**Hold:** `remove-bg`, unstable AI, thin document variants until content + smoke evidence exist.

---

## Task 7: Validation matrix

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `NEXT_PUBLIC_APP_URL=https://example.com npm run seo:check`
- [ ] Manual: Wave-1 tool pages show intent H1 + content + FAQ; View-Source / rich results path shows FAQ JSON-LD when present.
- [ ] Confirm audit report still: **0 tools** effectively indexable with production indexing stubbed on.

---

## Out of scope (explicit)

- Flipping `index` / `sitemap` for any tool
- Category landing pages (`/fileora/image-converter`, etc.)
- Blog/docs article engine
- Changing fail-closed `SEO_INDEXING_ENABLED` behavior
- Committing or opening a PR without a new user request

---

## Suggested implementation order

1 → 2 → 3 → 4 → 5 → 6 → 7

Tasks 3–4 can be one PR-sized chunk after content exists; Task 5 must land with FAQs present so schema tests are meaningful.

---

## Approval gate

Do **not** start coding Tasks 1–7 until the user approves this plan (or requests edits). After approval, implement on `docs/seo-ranking-growth-audit` (or a dedicated `feature/fileora-tool-content` branch if preferred) and leave changes uncommitted if the user so requires.
