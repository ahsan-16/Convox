# Fileora Brand SEO Ranking Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/fileora` the clear Fileora brand entity page, strengthen ZolvStack↔Fileora association, and index only a priority tool set with crawlable SEO content — without redesigning ToolPage.

**Architecture:** Extend the existing `lib/seo/*` SSOT (routes, metadata, schema, sitemap). Add `lib/seo/tool-content.ts` + `components/seo/ToolSeoContent.tsx` for per-tool prose below the converter UI. Enrich Organization / WebSite / Fileora WebApplication fields. Opt in four tools via per-route overrides in `routes.ts`.

**Tech Stack:** Next.js App Router metadata API, existing `lib/seo` module, Vitest, server components for SEO content.

## Global Constraints

- Do **not** redesign `ToolPage` / `Converter` layout.
- Do **not** create `/fileora/png-to-webp` or `/fileora/jpg-to-webp` routes.
- Do **not** flip global `TOOL_ROUTE_DEFAULTS` to indexable; only explicit per-tool overrides.
- Do **not** invent ratings, reviews, download counts, or social `sameAs` URLs.
- Do **not** commit unless the user explicitly asks (skip all Commit steps).
- Follow SEO Architecture v1.0 patterns in `lib/seo/*`.
- Spec: `docs/superpowers/specs/2026-08-04-fileora-brand-seo-ranking-design.md`.

## File map

| File | Responsibility |
|---|---|
| `lib/seo/routes.ts` | Metadata, keywords, index/sitemap opt-in for priority tools + hub/home/products copy |
| `lib/seo/schema/organization.ts` | `alternateName`, `knowsAbout`; description sync |
| `lib/seo/schema/website.ts` | `alternateName` |
| `lib/seo/schema/webapplication.ts` | Fileora brand fields (`alternateName`, `featureList`, etc.) |
| `lib/fileora-faq.ts` | Brand FAQs shared by hub UI + JSON-LD |
| `lib/seo/tool-content.ts` | SSOT tool SEO copy (create) |
| `components/seo/ToolSeoContent.tsx` | Server-rendered tool SEO block (create) |
| `components/marketing/FileoraHubClient.tsx` | “What is Fileora?” + featured converters |
| Priority tool `page.tsx` files | Mount `<ToolSeoContent />` |
| Home/products marketing components | Descriptive Fileora CTA anchors if needed |
| Tests under `lib/seo/**` and new component tests | Lock metadata, schema, index flags, content |

---

### Task 1: Route registry — brand metadata + priority tool opt-in

**Files:**
- Modify: `lib/seo/routes.ts`
- Modify: `lib/seo/routes.test.ts` (and any test asserting tool defaults / FAQ count)
- Modify: `lib/seo/schema/graph.test.ts` (hub FAQ length currently expects `8`)
- Modify: `lib/seo/metadata.test.ts` if title/description fixtures break
- Modify: `lib/seo/canonical-consistency.test.ts` / `fileora-migration.integration.test.tsx` only if assertions fail

**Interfaces:**
- Consumes: existing `SeoRoute`, `TOOL_ROUTE_DEFAULTS`, `buildToolRoute`
- Produces: opted-in priority tools with authored `title`, `description`, `keywords`, `index`, `sitemap`, priorities; updated hub/home/products copy

- [ ] **Step 1: Write failing tests for index opt-in and hub metadata**

Add to `lib/seo/routes.test.ts` (or extend existing describe):

```ts
import { getRoute, ROUTE_IDS } from "./routes";

const PRIORITY_TOOLS = [
  "image-to-webp",
  "image-to-jpg",
  "image-to-png",
  "pdf-compress",
] as const;

describe("phase-1 Fileora brand SEO routes", () => {
  it("opts priority tools into index + sitemap", () => {
    for (const id of PRIORITY_TOOLS) {
      const route = getRoute(id);
      expect(route.index).toBe(true);
      expect(route.sitemap).toBe(true);
      expect(route.follow).toBe(true);
      expect(route.title).toBeTruthy();
      expect(route.description).toBeTruthy();
      expect(route.keywords?.length).toBeGreaterThan(0);
    }
  });

  it("keeps a non-priority tool noindex and out of sitemap", () => {
    const route = getRoute("image-to-avif");
    expect(route.index).toBe(false);
    expect(route.sitemap).toBe(false);
  });

  it("authors Fileora hub brand metadata", () => {
    const hub = getRoute(ROUTE_IDS.FILEORA_HUB);
    expect(hub.title).toBe("Fileora — Free File Converter by ZolvStack");
    expect(hub.description).toMatch(/Fileora is ZolvStack/i);
    expect(hub.keywords).toEqual(
      expect.arrayContaining(["fileora", "free file converter"]),
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/seo/routes.test.ts`

Expected: FAIL — priority tools still use `TOOL_ROUTE_DEFAULTS` (`index: false`); hub title still from `productHubTitle()`.

- [ ] **Step 3: Implement route overrides**

In `lib/seo/routes.ts`:

1. Update `HOME`, `PRODUCTS`, and `FILEORA_HUB_ROUTE` description/keywords/title per spec §1.
2. Replace bare `buildToolRoute` mapping with merge of optional overrides:

```ts
type ToolRouteOverride = Partial<
  Pick<
    SeoRoute,
    | "title"
    | "description"
    | "keywords"
    | "index"
    | "sitemap"
    | "follow"
    | "sitemapPriority"
    | "changeFrequency"
    | "faq"
  >
>;

const PRIORITY_TOOL_OVERRIDES: Readonly<
  Partial<Record<ToolSlug, ToolRouteOverride>>
> = Object.freeze({
  "image-to-webp": {
    title: "Image to WebP Converter — JPG & PNG to WebP",
    description:
      "Convert images to WebP with Fileora. Free JPG to WebP and PNG to WebP converter in your browser — smaller files, no signup.",
    keywords: [
      "image to webp converter",
      "jpg to webp",
      "png to webp",
      "convert to webp",
      "fileora webp",
    ],
    index: true,
    sitemap: true,
    follow: true,
    sitemapPriority: 0.8,
    changeFrequency: "weekly",
  },
  "image-to-jpg": {
    title: "Image to JPG Converter",
    description:
      "Convert PNG, WebP, and other images to JPG with Fileora by ZolvStack. Free online image converter — no signup.",
    keywords: [
      "image to jpg",
      "png to jpg",
      "webp to jpg",
      "image converter",
      "fileora",
    ],
    index: true,
    sitemap: true,
    follow: true,
    sitemapPriority: 0.7,
    changeFrequency: "weekly",
  },
  "image-to-png": {
    title: "Image to PNG Converter",
    description:
      "Convert JPG, WebP, and other images to PNG with Fileora by ZolvStack. Free online image converter with transparency support.",
    keywords: [
      "image to png",
      "jpg to png",
      "webp to png",
      "image converter",
      "fileora",
    ],
    index: true,
    sitemap: true,
    follow: true,
    sitemapPriority: 0.7,
    changeFrequency: "weekly",
  },
  "pdf-compress": {
    title: "PDF Compress — Free PDF Converter",
    description:
      "Compress PDF files online with Fileora by ZolvStack. Free PDF converter tool — smaller files, private browser processing, no signup.",
    keywords: [
      "pdf compress",
      "pdf converter",
      "compress pdf online",
      "fileora pdf",
      "file converter",
    ],
    index: true,
    sitemap: true,
    follow: true,
    sitemapPriority: 0.7,
    changeFrequency: "weekly",
  },
});

function buildToolRoute(slug: ToolSlug): SeoRoute {
  return {
    id: slug,
    path: toolHref(slug),
    product: "fileora",
    pageType: "product-tool",
    ...TOOL_ROUTE_DEFAULTS,
    ...PRIORITY_TOOL_OVERRIDES[slug],
  };
}
```

3. Set hub route:

```ts
title: "Fileora — Free File Converter by ZolvStack",
description:
  "Fileora is ZolvStack’s free online file converter for images, PDFs, and documents. Convert files in your browser — no signup, no watermarks, private processing.",
keywords: [
  "fileora",
  "fileora converter",
  "fileora by zolvstack",
  "free file converter",
  "image converter",
  "pdf converter",
  "online file converter",
],
```

4. Update home/products descriptions + keywords per spec §1 (keep home title via `brandHomeTitle()`).

- [ ] **Step 4: Run tests and fix FAQ-count fallout**

Run:

```bash
npx vitest run lib/seo/routes.test.ts lib/seo/metadata.test.ts lib/seo/schema/graph.test.ts lib/seo/sitemap.test.ts
```

Update any assertions that hard-code old hub titles/descriptions. Leave FAQ length changes for Task 2 if FAQs are not yet updated.

Expected: new route tests PASS; unrelated failures only if they assert old hub copy.

- [ ] **Step 5: Commit**

Skip unless the user asks.

---

### Task 2: Hub FAQs + schema entity enrichment

**Files:**
- Modify: `lib/fileora-faq.ts`
- Modify: `lib/seo/schema/organization.ts`
- Modify: `lib/seo/schema/website.ts`
- Modify: `lib/seo/schema/webapplication.ts`
- Modify: `lib/seo/schema/graph.test.ts`

**Interfaces:**
- Consumes: `FILEORA_FAQS`, existing builders
- Produces: richer Organization / WebSite / WebApplication nodes; hub FAQ including brand Q&As

- [ ] **Step 1: Write failing schema tests**

Extend `lib/seo/schema/graph.test.ts`:

```ts
it("enriches Organization with alternateName and knowsAbout", () => {
  stubOrigin();
  const graph = buildJsonLdForRoute(ROUTE_IDS.HOME);
  const org = findNode(graph, "Organization");
  expect(org?.alternateName).toEqual(
    expect.arrayContaining(["zolvstack", "zolv-stack"]),
  );
  expect(org?.knowsAbout).toEqual(
    expect.arrayContaining(["Fileora", "file conversion"]),
  );
});

it("enriches Fileora WebApplication as the product brand entity", () => {
  stubOrigin();
  const graph = buildJsonLdForRoute(ROUTE_IDS.FILEORA_HUB);
  const webApp = findNode(graph, "WebApplication");
  expect(webApp?.name).toBe("Fileora");
  expect(webApp?.alternateName).toEqual(
    expect.arrayContaining(["Fileora by ZolvStack", "Fileora Converter"]),
  );
  expect(webApp?.applicationSubCategory).toBe("File converter");
  expect(webApp?.featureList).toEqual(
    expect.arrayContaining(["Image conversion", "PDF tools"]),
  );
  expect(webApp?.brand).toMatchObject({
    "@type": "Brand",
    name: "Fileora",
  });
  expect(webApp).not.toHaveProperty("aggregateRating");
});
```

Update the hub FAQ length assertion from `8` to the new length after Step 3 (expected `11` if three brand FAQs are prepended).

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/seo/schema/graph.test.ts`

Expected: FAIL — new fields missing.

- [ ] **Step 3: Implement FAQ + schema fields**

Prepend (or insert near top of) `lib/fileora-faq.ts`:

```ts
{
  question: "What is Fileora?",
  answer:
    "Fileora is ZolvStack’s free online file converter for images, PDFs, and documents. Convert files in your browser with no signup and private processing.",
},
{
  question: "Is Fileora part of ZolvStack?",
  answer:
    "Yes. Fileora is a product built and operated by ZolvStack — ZolvStack’s free file conversion toolkit for everyday work.",
},
{
  question: "What can I convert with Fileora?",
  answer:
    "Fileora supports image conversion (including WebP, JPG, and PNG), PDF tools such as compress and split, and document conversions depending on the tool.",
},
```

Keep existing FAQs; lightly mention “Fileora” in answers only where natural.

In `organization.ts`:

```ts
alternateName: ["Zolv Stack", "zolv-stack", "zolvstack"],
knowsAbout: [
  "file conversion",
  "image conversion",
  "document conversion",
  "PDF tools",
  "Fileora",
],
```

Sync `ORGANIZATION_DESCRIPTION` with the home route description from Task 1.

In `website.ts`:

```ts
alternateName: ["zolvstack", "zolv-stack"],
```

In `webapplication.ts` `buildFileoraWebApplicationNode()`:

```ts
alternateName: [
  "Fileora by ZolvStack",
  "Fileora Converter",
  "Fileora File Converter",
],
applicationSubCategory: "File converter",
brand: { "@type": "Brand", name: FILEORA_BRAND.name },
featureList: [
  "Image conversion",
  "PDF tools",
  "Document conversion",
  "Browser-based processing",
  "No signup required",
],
```

- [ ] **Step 4: Run schema/FAQ tests**

Run:

```bash
npx vitest run lib/seo/schema/graph.test.ts lib/seo/fileora-migration.integration.test.tsx
```

Expected: PASS. Update FAQ length expectation to match `FILEORA_FAQS.length`.

- [ ] **Step 5: Commit**

Skip unless the user asks.

---

### Task 3: `tool-content.ts` SSOT + `ToolSeoContent` component

**Files:**
- Create: `lib/seo/tool-content.ts`
- Create: `lib/seo/tool-content.test.ts`
- Create: `components/seo/ToolSeoContent.tsx`
- Create: `components/seo/ToolSeoContent.test.tsx` (optional if project prefers lib-only tests; prefer at least lib tests + a shallow render test)

**Interfaces:**
- Consumes: `ToolSlug`, `toolHref`, `PATHS` / `FILEORA_BASE`
- Produces:

```ts
export type ToolSeoSection = {
  heading: string; // H3
  paragraphs: string[];
};

export type ToolSeoFaq = { question: string; answer: string };

export type ToolSeoContentEntry = {
  h2: string;
  intro: string[]; // 2–3 paragraphs
  howTo: { heading: string; steps: string[] };
  tips: ToolSeoSection;
  moreTools: { heading: string; links: { href: string; label: string }[] };
  faqs?: ToolSeoFaq[];
};

export function getToolSeoContent(
  slug: ToolSlug,
): ToolSeoContentEntry | undefined;

export function listToolSeoContentSlugs(): ToolSlug[];
```

- [ ] **Step 1: Write failing tests for content lookup**

```ts
// lib/seo/tool-content.test.ts
import { getToolSeoContent, listToolSeoContentSlugs } from "./tool-content";

describe("tool-content", () => {
  it("provides unique content for each phase-1 priority tool", () => {
    const slugs = listToolSeoContentSlugs();
    expect(slugs.sort()).toEqual(
      ["image-to-jpg", "image-to-png", "image-to-webp", "pdf-compress"].sort(),
    );
    for (const slug of slugs) {
      const entry = getToolSeoContent(slug);
      expect(entry?.h2).toMatch(/Fileora/i);
      expect(entry?.intro.length).toBeGreaterThanOrEqual(2);
      expect(entry?.moreTools.links.some((l) => l.href === "/fileora")).toBe(
        true,
      );
    }
  });

  it("covers JPG and PNG to WebP intent on image-to-webp", () => {
    const entry = getToolSeoContent("image-to-webp");
    const blob = [entry?.h2, ...(entry?.intro ?? []), ...(entry?.tips.paragraphs ?? [])]
      .join(" ")
      .toLowerCase();
    expect(blob).toMatch(/jpg to webp/);
    expect(blob).toMatch(/png to webp/);
  });

  it("returns undefined for tools without phase-1 content", () => {
    expect(getToolSeoContent("image-to-avif")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/seo/tool-content.test.ts`

Expected: FAIL — module missing.

- [ ] **Step 3: Implement `lib/seo/tool-content.ts` with full unique copy**

Author complete unique copy for all four tools per spec §3 (300–450 words worth of sections). Required link set for every entry:

- `{ href: "/fileora", label: "All Fileora tools" }` (or equivalent)
- Sibling priority tools with natural labels
- WebP entry must discuss JPG→WebP and PNG→WebP in `tips`

Include 2–4 FAQs on `image-to-webp` at minimum; optional on others.

- [ ] **Step 4: Implement `ToolSeoContent` server component**

```tsx
// components/seo/ToolSeoContent.tsx
import { getToolSeoContent } from "@/lib/seo/tool-content";
import type { ToolSlug } from "@/lib/utils";
import Link from "next/link";

export function ToolSeoContent({ slug }: { slug: ToolSlug }) {
  const content = getToolSeoContent(slug);
  if (!content) return null;

  return (
    <section
      aria-labelledby={`tool-seo-${slug}`}
      style={{ padding: "0 24px 80px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 id={`tool-seo-${slug}`}>{content.h2}</h2>
        {content.intro.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
        <h3>{content.howTo.heading}</h3>
        <ol>
          {content.howTo.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h3>{content.tips.heading}</h3>
        {content.tips.paragraphs.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
        <h3>{content.moreTools.heading}</h3>
        <ul>
          {content.moreTools.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        {content.faqs && content.faqs.length > 0 ? (
          <>
            <h3>Frequently asked questions</h3>
            {content.faqs.map((faq) => (
              <div key={faq.question}>
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </section>
  );
}
```

Use existing Fileora CSS variables / display font for headings so it matches hub/tool pages without introducing a new card UI.

- [ ] **Step 5: Run tests**

Run: `npx vitest run lib/seo/tool-content.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

Skip unless the user asks.

---

### Task 4: Wire tool pages + attach tool FAQs to SEO routes

**Files:**
- Modify: `app/(marketing)/fileora/(tools)/image-to-webp/page.tsx`
- Modify: `app/(marketing)/fileora/(tools)/image-to-jpg/page.tsx`
- Modify: `app/(marketing)/fileora/(tools)/image-to-png/page.tsx`
- Modify: `app/(marketing)/fileora/(tools)/pdf-compress/page.tsx`
- Modify: `lib/seo/routes.ts` (set `faq` from tool-content FAQs for tools that have them)
- Modify: `lib/seo/fileora-migration.integration.test.tsx` if it asserts exact page children

**Interfaces:**
- Consumes: `ToolSeoContent`, `getToolSeoContent`
- Produces: crawlable SEO HTML on priority tool URLs; JSON-LD FAQ when `route.faq` set

- [ ] **Step 1: Write / extend integration assertion**

In `fileora-migration.integration.test.tsx` (or a focused new test), assert priority tool page source/module includes `ToolSeoContent`:

```ts
it("renders ToolSeoContent on phase-1 indexed tool pages", async () => {
  for (const slug of [
    "image-to-webp",
    "image-to-jpg",
    "image-to-png",
    "pdf-compress",
  ] as const) {
    const mod = await toolPageLoaders[slug]();
    const page = mod.default();
    // assert a child with type ToolSeoContent OR stringify/render check used by this suite
  }
});
```

Match the suite’s existing child-inspection style.

- [ ] **Step 2: Run to verify fail**

Expected: FAIL — pages only render `ToolPage` + `JsonLd`.

- [ ] **Step 3: Update each priority page**

```tsx
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { ToolPage } from "@/components/tools/ToolPage";
import { buildJsonLdForRoute, buildMetadataForRoute } from "@/lib/seo";

const routeId = "image-to-webp";

export const metadata = buildMetadataForRoute(routeId);

export default function Page() {
  return (
    <>
      <JsonLd data={buildJsonLdForRoute(routeId)} />
      <ToolPage slug="image-to-webp" />
      <ToolSeoContent slug="image-to-webp" />
    </>
  );
}
```

Repeat for the other three slugs.

- [ ] **Step 4: Sync tool FAQs into route registry**

Where `getToolSeoContent(slug)?.faqs` exists, set `faq: [...]` on that tool’s `PRIORITY_TOOL_OVERRIDES` entry (import FAQs from tool-content or define once and reuse) so `FAQPage` JSON-LD emits.

Avoid circular imports: keep FAQ arrays in `tool-content.ts` and import them into `routes.ts`, **or** keep FAQ arrays in a tiny `lib/seo/tool-faqs.ts` imported by both. Prefer `tool-content.ts` exporting faqs and `routes.ts` importing only the faq slices if the next.config redirect import graph allows it.

**Important:** `routes.ts` is loaded from `next.config.ts` via `redirects.ts`. Do **not** import client components into `routes.ts`. Importing a pure data module (`tool-content.ts` with no React) is OK; if anything client-tagged leaks, extract data to `lib/seo/tool-content-data.ts`.

- [ ] **Step 5: Run integration + schema tests**

```bash
npx vitest run lib/seo/fileora-migration.integration.test.tsx lib/seo/schema/graph.test.ts lib/seo/canonical-consistency.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

Skip unless the user asks.

---

### Task 5: Hub brand sections + internal linking CTAs

**Files:**
- Modify: `components/marketing/FileoraHubClient.tsx`
- Modify: `components/marketing/zolvstack/ProductsPageContent.tsx` and/or `ProductCard.tsx` if CTA text is generic
- Modify: `components/marketing/zolvstack/ZolvStackHomeClient.tsx` (or equivalent) for Fileora CTA anchors
- Test: prefer a small source/contains test or manual checklist if components are client-heavy

**Interfaces:**
- Consumes: `toolHref`, priority paths
- Produces: crawlable hub brand copy + featured links; descriptive Fileora anchors from home/products

- [ ] **Step 1: Add hub sections (text-only, existing visual language)**

In `FileoraHubClient.tsx`, add after the main tools area (or before “Why Fileora”):

1. **What is Fileora?** H2 + ~120–160 word paragraph per spec §3.
2. **Popular Fileora converters** H2 + list of four links with descriptive anchors:
   - Image to WebP Converter → `toolHref("image-to-webp")`
   - Image to JPG Converter → `toolHref("image-to-jpg")`
   - Image to PNG Converter → `toolHref("image-to-png")`
   - PDF Compress → `toolHref("pdf-compress")`

Do not change the converter upload interaction or overall hub layout system beyond these additive sections.

- [ ] **Step 2: Audit home + products CTAs**

Ensure visible links to `/fileora` use descriptive anchors such as `Fileora` or `Fileora free file converter`, not only `Learn more` / `Get started` if those are the sole anchors. Prefer copy tweaks only.

- [ ] **Step 3: Smoke-check in browser / dev server**

With `npm run dev` already running:

- Open `/fileora` — confirm brand section + featured links
- Open `/fileora/image-to-webp` — confirm SEO block below tool UI; links back to hub
- Open `/` and `/products` — confirm Fileora CTAs

- [ ] **Step 4: Commit**

Skip unless the user asks.

---

### Task 6: Validation matrix + deploy/GSC checklist doc touch

**Files:**
- Optionally modify: `docs/seo/search-console.md` with a short “Fileora brand phase-1 URL priority” subsection (no secrets)
- No production env changes in repo (document only)

- [ ] **Step 1: Run full validation**

```bash
npm run lint
npm run typecheck
npx vitest run lib/seo components/seo
NEXT_PUBLIC_APP_URL=https://example.com SEO_INDEXING_ENABLED=true npm run seo:check
```

Expected: lint/typecheck clean; seo:check `0` errors; audit lists `/fileora`, `/`, `/products`, and four priority tools as indexable when indexing enabled.

- [ ] **Step 2: Confirm sitemap membership in audit report**

Inspect `reports/seo-audit.md` (or seo:check stdout) for sitemap inclusion of:

- `/fileora`
- `/fileora/image-to-webp`
- `/fileora/image-to-jpg`
- `/fileora/image-to-png`
- `/fileora/pdf-compress`

And absence of a non-priority tool such as `/fileora/image-to-avif`.

- [ ] **Step 3: Add GSC checklist note to `docs/seo/search-console.md`**

Document post-deploy URL Inspection order:

1. `/fileora`
2. `/`
3. `/fileora/image-to-webp`
4. `/products`
5. remaining priority tools

Remind: production requires `SEO_INDEXING_ENABLED=true` + correct `NEXT_PUBLIC_APP_URL` in GitHub Environment `production`, then redeploy.

- [ ] **Step 4: Commit**

Skip unless the user asks.

---

## Spec coverage checklist

| Spec section | Tasks |
|---|---|
| §1 Metadata + index opt-in | Task 1 |
| §2 Schema enrichment | Task 2 |
| §3 Hub + tool content blocks | Tasks 3–5 |
| §4 Internal linking | Task 5 |
| §4 Sitemap / seo:check | Tasks 1, 6 |
| §4 GSC actions | Task 6 (docs + operator checklist) |
| No ToolPage redesign | Global constraint |
| No format-pair routes | Global constraint |
| No commits by default | Global constraint |

## Placeholder scan

No TBD/TODO steps. Exact metadata strings and schema fields are specified. Tool prose must be fully authored in Task 3 Step 3 (not deferred).
