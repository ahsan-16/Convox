# Fileora Brand SEO Ranking Growth — Design Spec

**Date:** 2026-08-04  
**Status:** Approved in conversation; written spec pending final user review before implementation  
**Version:** Fileora Brand SEO Phase 1  
**Parent architecture:** SEO Architecture v1.0 (`docs/superpowers/specs/2026-07-17-seo-architecture-design.md`)  
**Approach:** Brand-hub authority + priority tool indexing (Approach 1) + Hybrid WebP strategy (Option C)

## Goal

Strengthen organic visibility so Google associates:

1. **Fileora** as a recognizable file-conversion product brand (primary success metric).
2. **ZolvStack** as the parent company/platform that owns Fileora.
3. Priority converter pages with their target keywords (secondary).

Phase 1 success criteria:

1. Fileora becomes discoverable as a branded search term.
2. ZolvStack and Fileora are clearly associated in Google.
3. Priority converter pages can begin ranking for their target keywords.
4. The SEO structure remains scalable as more tools are added later.

## Product Decisions

| Decision | Choice |
|---|---|
| Primary brand entity page | `/fileora` (Fileora hub) |
| Parent brand page | `/` (ZolvStack home) |
| Tool indexing this phase | Priority set only |
| WebP keyword strategy | Strengthen `/fileora/image-to-webp` only; defer `/png-to-webp` and `/jpg-to-webp` routes |
| Tool UI | No ToolPage / Converter layout redesign |
| Content delivery | Server-rendered SEO blocks below existing tool UI |
| Commits | Do not commit unless explicitly requested |

## Non-Goals (Phase 1)

- Dedicated format-pair landing pages (`/fileora/png-to-webp`, `/fileora/jpg-to-webp`, etc.)
- Indexing the full Fileora tool catalog
- Redesigning `ToolPage`, `Converter`, or hub visual layout systems
- Blog / Article SEO program
- Fake ratings, reviews, download counts, or invented social `sameAs`
- Guaranteeing rankings or traffic
- IndexNow live pings (optional later)

---

## §1 — Indexable routes & metadata

### Index / sitemap opt-in

| Route id | Path | Index | Sitemap | Priority | Role |
|---|---|---|---|---|---|
| `fileora-hub` | `/fileora` | true (already) | true | 0.9 | Fileora brand entity |
| `home` | `/` | true (already) | true | 1.0 | ZolvStack parent |
| `products` | `/products` | true (already) | true | 0.7 | Product association |
| `image-to-webp` | `/fileora/image-to-webp` | **opt in** | **opt in** | 0.8 | WebP keyword cluster |
| `image-to-jpg` | `/fileora/image-to-jpg` | **opt in** | **opt in** | 0.7 | Image converter support |
| `image-to-png` | `/fileora/image-to-png` | **opt in** | **opt in** | 0.7 | Image converter support |
| `pdf-compress` | `/fileora/pdf-compress` | **opt in** | **opt in** | 0.7 | PDF / file converter signal |

All other tool routes remain `index: false`, `sitemap: false`, `follow: true`.

Effective indexing remains fail-closed: production `NODE_ENV` + valid `NEXT_PUBLIC_APP_URL` + `SEO_INDEXING_ENABLED=true`.

### Exact metadata

Tool `title` values are **intent titles only**. Final document titles are composed by `resolveFinalTitle` as `{intent} | Fileora by ZolvStack`.

#### `/fileora`

- **Title:** `Fileora — Free File Converter by ZolvStack`
- **Description:** `Fileora is ZolvStack’s free online file converter for images, PDFs, and documents. Convert files in your browser — no signup, no watermarks, private processing.`
- **Keywords:** `fileora`, `fileora converter`, `fileora by zolvstack`, `free file converter`, `image converter`, `pdf converter`, `online file converter`

#### `/`

- **Title:** Keep brand-home pattern (`ZolvStack — Fast, Private Tools for Everyday Work`)
- **Description:** `ZolvStack builds fast, private, browser-based tools for everyday work — starting with Fileora, a free file converter for images, PDFs, and documents.`
- **Keywords:** `zolvstack`, `zolv-stack`, `zolvstack tools`, `fileora`, `file converter`

#### `/products`

- **Title:** `Products | ZolvStack`
- **Description:** `Explore ZolvStack products, including Fileora — a free online file converter for images, PDFs, and documents.`
- **Keywords:** `zolvstack products`, `fileora`, `file converter`

#### `/fileora/image-to-webp`

- **Intent title:** `Image to WebP Converter — JPG & PNG to WebP`
- **Final title:** `Image to WebP Converter — JPG & PNG to WebP | Fileora by ZolvStack`
- **Description:** `Convert images to WebP with Fileora. Free JPG to WebP and PNG to WebP converter in your browser — smaller files, no signup.`
- **Keywords:** `image to webp converter`, `jpg to webp`, `png to webp`, `convert to webp`, `fileora webp`
- **Sitemap priority:** 0.8
- **Change frequency:** `weekly`

#### `/fileora/image-to-jpg`

- **Intent title:** `Image to JPG Converter`
- **Description:** `Convert PNG, WebP, and other images to JPG with Fileora by ZolvStack. Free online image converter — no signup.`
- **Keywords:** `image to jpg`, `png to jpg`, `webp to jpg`, `image converter`, `fileora`
- **Sitemap priority:** 0.7

#### `/fileora/image-to-png`

- **Intent title:** `Image to PNG Converter`
- **Description:** `Convert JPG, WebP, and other images to PNG with Fileora by ZolvStack. Free online image converter with transparency support.`
- **Keywords:** `image to png`, `jpg to png`, `webp to png`, `image converter`, `fileora`
- **Sitemap priority:** 0.7

#### `/fileora/pdf-compress`

- **Intent title:** `PDF Compress — Free PDF Converter`
- **Description:** `Compress PDF files online with Fileora by ZolvStack. Free PDF converter tool — smaller files, private browser processing, no signup.`
- **Keywords:** `pdf compress`, `pdf converter`, `compress pdf online`, `fileora pdf`, `file converter`
- **Sitemap priority:** 0.7

### Implementation notes for routes

- Prefer explicit per-tool overrides in `lib/seo/routes.ts` (do not flip the global `TOOL_ROUTE_DEFAULTS`).
- Wire `keywords` onto `SeoRoute` so `buildMetadataForRoute` emits them.
- Update brand/home/products route copy in the same registry so metadata and schema descriptions stay aligned via content resolvers.

---

## §2 — Schema.org for Fileora as a product brand

### Entity hierarchy

```text
Organization (ZolvStack)                 @id: {origin}/#organization
  └── WebSite (ZolvStack)                @id: {origin}/#website
        └── CollectionPage /fileora        mainEntity →
              WebApplication (Fileora)     @id: {origin}/fileora#webapplication
                    ↑ isPartOf
              SoftwareApplication (tool)
```

Keep existing page-type → builder registry. Enrich accurate fields only.

### Organization (`lib/seo/schema/organization.ts`)

| Field | Value |
|---|---|
| `@type` | `Organization` |
| `name` | `ZolvStack` |
| `url` | `{origin}/` |
| `description` | Match home SEO description (mentions Fileora) |
| `logo` | Existing ImageObject ref |
| `alternateName` | `["Zolv Stack", "zolv-stack", "zolvstack"]` |
| `knowsAbout` | `["file conversion", "image conversion", "document conversion", "PDF tools", "Fileora"]` |
| `sameAs` | Empty until real public profiles exist |

### WebSite (`lib/seo/schema/website.ts`)

| Field | Value |
|---|---|
| `name` | `ZolvStack` |
| `url` | `{origin}/` |
| `publisher` | Organization ref |
| `alternateName` | `["zolvstack", "zolv-stack"]` |
| `inLanguage` | `en` |

No `SearchAction`.

### WebApplication Fileora (`lib/seo/schema/webapplication.ts`)

| Field | Value |
|---|---|
| `@type` | `WebApplication` |
| `@id` | `{origin}/fileora#webapplication` (stable, unchanged) |
| `name` | `Fileora` |
| `alternateName` | `["Fileora by ZolvStack", "Fileora Converter", "Fileora File Converter"]` |
| `url` | `{origin}/fileora` |
| `description` | Same as hub meta description via content resolver |
| `applicationCategory` | `UtilitiesApplication` |
| `applicationSubCategory` | `File converter` |
| `operatingSystem` | `Web` |
| `offers` | Free Offer (`price: "0"`, `priceCurrency: "USD"`) |
| `provider` | Organization ref |
| `brand` | `{ "@type": "Brand", "name": "Fileora" }` |
| `featureList` | `["Image conversion", "PDF tools", "Document conversion", "Browser-based processing", "No signup required"]` |
| `inLanguage` | `en` |

**Forbidden:** `aggregateRating`, reviews, download counts, fabricated `sameAs`.

### Hub page graph

- `CollectionPage` with hub metadata; `mainEntity` → Fileora `WebApplication`
- `BreadcrumbList`: Home → Fileora
- `FAQPage` when real FAQ data exists on the route
- Shared Organization + logo + WebSite + WebApplication

### Tool page graph (priority tools)

- `SoftwareApplication.name` = final document title (includes Fileora by ZolvStack)
- `SoftwareApplication.isPartOf` → Fileora WebApplication
- `WebPage.mainEntity` → SoftwareApplication
- Breadcrumbs: Home → Fileora → Tool
- Optional tool FAQ nodes only when real FAQ content is authored

### Schema non-goals

- Separate Brand node with its own `@id`
- `Product` type for Fileora
- Format-pair landing schemas

---

## §3 — SEO content blocks

### Architecture

| Piece | Path / component | Responsibility |
|---|---|---|
| Hub FAQ + brand Q&As | `lib/fileora-faq.ts` | Shared FAQ for UI + JSON-LD |
| Hub brand sections | `components/marketing/FileoraHubClient.tsx` (text sections only) | “What is Fileora?”, featured converters |
| Tool SEO copy SSOT | `lib/seo/tool-content.ts` | Per-`ToolSlug` content for indexed tools |
| Renderer | `components/seo/ToolSeoContent.tsx` | Server component; prose below `<ToolPage />` |
| Page wiring | Priority tool `app/(marketing)/fileora/(tools)/<slug>/page.tsx` | Append `<ToolSeoContent />` |

Tool page pattern:

```tsx
<>
  <JsonLd data={buildJsonLdForRoute(routeId)} />
  <ToolPage slug={routeId} />
  <ToolSeoContent slug={routeId} />
</>
```

Only tools with content entries render a block. Future tools opt in by adding content + route index flags + page wiring.

### Hub content

1. **H2: What is Fileora?** (~120–160 words)  
   Define Fileora as ZolvStack’s free online file converter for images, PDFs, and documents; no signup; private browser processing; product within ZolvStack.

2. **H2: Popular Fileora converters**  
   Featured links (indexable set only):
   - Image to WebP Converter → `/fileora/image-to-webp`
   - Image to JPG Converter → `/fileora/image-to-jpg`
   - Image to PNG Converter → `/fileora/image-to-png`
   - PDF Compress → `/fileora/pdf-compress`

3. **FAQ additions** (factual):
   - What is Fileora?
   - Is Fileora part of ZolvStack?
   - What can I convert with Fileora?

### Shared tool block outline

1. H2 — primary keyword + Fileora  
2. 2–3 short paragraphs  
3. H3 — How to use (3 steps)  
4. H3 — Related tips / keyword cluster notes  
5. H3 — More Fileora tools (hub + siblings)  
6. Optional 2–4 real FAQs → also set on `SeoRoute.faq` for JSON-LD  

Target length: ~300–450 words. Unique copy per tool. Match existing Fileora typography; no card-heavy redesign.

### Tool content briefs

#### `image-to-webp`

- H2: Free Image to WebP Converter with Fileora  
- Cover image→WebP, JPG→WebP, PNG→WebP  
- H3: How to convert images to WebP  
- H3: JPG to WebP and PNG to WebP (same tool; no separate URLs)  
- H3: More Fileora converters  
- FAQs on WebP benefits, free PNG→WebP, privacy  

#### `image-to-jpg` / `image-to-png` / `pdf-compress`

- Matching H2/body for each tool’s keywords  
- Explicit Fileora by ZolvStack ownership sentence  
- Links back to hub and related priority tools  

### Content non-goals

- ToolPage hero/uploader redesign  
- Keyword stuffing / near-duplicate blocks  
- Hidden SEO-only text  
- Blog posts this phase  

---

## §4 — Internal linking, sitemap, indexing & GSC

### Internal linking graph

```text
/  (ZolvStack)
├── /products  →  Fileora
└── /fileora   ←── all priority tools link back
      ├── /fileora/image-to-webp
      ├── /fileora/image-to-jpg
      ├── /fileora/image-to-png
      └── /fileora/pdf-compress
```

#### Link rules

| From | To | Anchor examples |
|---|---|---|
| `/` | `/fileora` | Fileora; Fileora free file converter |
| `/products` | `/fileora` | Fileora; Open Fileora |
| `/fileora` featured | priority tools | Image to WebP Converter; etc. |
| Tool SEO blocks | `/fileora` | Fileora; All Fileora tools |
| Tool SEO blocks | sibling tools | natural keyword anchors |
| Tools | `/` | ZolvStack sparingly |

Avoid: footer keyword spam; featuring noindex tools in the SEO featured list; exact-match over-optimization.

### Sitemap & robots

- Opted-in routes appear in `/sitemap.xml` via existing builders.
- Other tools stay out of sitemap.
- Keep robots allow + sitemap URL; no Host directive.
- Pre-deploy: `NEXT_PUBLIC_APP_URL=https://<prod> SEO_INDEXING_ENABLED=true npm run seo:check`

### Production indexing prerequisites

1. GitHub Environment `production`: `SEO_INDEXING_ENABLED=true`
2. Correct `NEXT_PUBLIC_APP_URL`
3. Redeploy via Lightsail artifact flow (build-time indexing)

Live verification after deploy:

- `/robots.txt`
- `/sitemap.xml` contains priority URLs
- View-source `/fileora` and `/fileora/image-to-webp` show `index,follow`

### GSC post-deploy actions

Priority order for URL Inspection / Request indexing:

1. `/fileora`
2. `/`
3. `/fileora/image-to-webp`
4. `/products`
5. `/fileora/image-to-jpg`
6. `/fileora/image-to-png`
7. `/fileora/pdf-compress`

Also:

- Submit / confirm sitemap `{origin}/sitemap.xml`
- Monitor indexing status and Performance queries: `fileora`, `zolvstack`, `fileora converter`, `image to webp converter`
- If hub is indexed but brand query is weak: improve hub content/links before mass-indexing more tools

---

## File impact map

### Create

- `lib/seo/tool-content.ts` — SSOT tool SEO copy
- `components/seo/ToolSeoContent.tsx` — server renderer
- Tests for tool-content resolution and ToolSeoContent rendering
- Updates to existing schema/metadata/route tests as needed

### Modify

- `lib/seo/routes.ts` — metadata, keywords, index flags, optional tool FAQs
- `lib/seo/schema/organization.ts`
- `lib/seo/schema/website.ts`
- `lib/seo/schema/webapplication.ts`
- `lib/fileora-faq.ts`
- `components/marketing/FileoraHubClient.tsx` — brand + featured sections only
- Priority tool pages under `app/(marketing)/fileora/(tools)/{image-to-webp,image-to-jpg,image-to-png,pdf-compress}/page.tsx`
- Home/products copy only if CTA anchors need descriptive Fileora text
- Schema/metadata tests expecting new fields

### Do not modify (layout)

- `components/tools/ToolPage.tsx` converter layout/structure (unless a tiny non-layout fix is required for crawlable links already present)
- Converter uploader UX

---

## Validation

- Unit/integration tests for routes index flags, metadata keywords/titles, schema fields, tool-content presence
- `npm run lint`
- `npm run typecheck`
- Relevant Vitest suites (`lib/seo/**`, new component tests)
- `NEXT_PUBLIC_APP_URL=... SEO_INDEXING_ENABLED=true npm run seo:check`
- Manual: hub + WebP page render SEO blocks; sitemap lists opted-in URLs when indexing enabled

## Rollback

- Revert route `index`/`sitemap` flags to false for tools
- Remove or empty tool-content entries / stop rendering `ToolSeoContent`
- Schema field additions are additive and safe to revert with the same PR rollback
- Follow `docs/seo/rollback.md` for indexing env fail-closed behavior

## Future phases (out of scope)

- Dedicated format-pair landing pages when Search Console data justifies them
- Opt-in remaining production-ready tools with unique content entries
- Blog / docs Article SEO
- Social `sameAs` once real profiles exist
