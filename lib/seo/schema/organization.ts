/**
 * `Organization` + canonical logo `ImageObject` builders (SEO
 * Architecture v1.0, Task 5).
 *
 * The logo keeps one stable `@id` (`logoImageId`) and is always a full
 * `ImageObject` node in any page graph that includes Organization —
 * Organization.logo references it by `@id` rather than inlining a
 * duplicate logo object (spec: "shared logo entity referenced
 * consistently"). Because Google does not merge graphs across URLs,
 * every page that emits Organization also emits the logo node via
 * `buildSharedSiteEntityNodes` (see `shared-entities.ts`).
 */

import { ZOLVSTACK_BRAND } from "../brands";
import { PATHS } from "../routes";
import { absoluteUrl } from "../url";

import { logoImageId, organizationId, ref } from "./entities";
import type { JsonLdNode, JsonLdRef } from "./types";

/** Site-relative path to the canonical square logo asset used for the
 * `Organization.logo` `ImageObject`. Reuses the existing PWA icon —
 * no new asset invented for this task. */
const LOGO_PATH = "/icons/icon-512.png";
const LOGO_WIDTH = 512;
const LOGO_HEIGHT = 512;

/** Organization description — mirrors the home route SEO description for
 * brand-entity clarity (helps disambiguate near-names like Zolve/Zolv). */
const ORGANIZATION_DESCRIPTION =
  "ZolvStack builds fast, private, browser-based tools for everyday work — starting with Fileora, a free file converter.";

/**
 * Official profile / social URLs for `Organization.sameAs`.
 *
 * Keep empty until real, public profiles exist. An empty array is pruned
 * from the emitted graph (see `prune.ts`), so nothing is published until
 * URLs are added here.
 */
export const ORGANIZATION_SAME_AS: readonly string[] = Object.freeze([]);

/**
 * Builds the single, site-wide `Organization` node (ZolvStack). Its
 * `logo` is always an `{ "@id" }` reference to the canonical logo
 * `ImageObject` (see {@link buildLogoImageNode}), never a re-embedded
 * copy.
 */
export function buildOrganizationNode(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": organizationId(),
    name: ZOLVSTACK_BRAND.name,
    url: absoluteUrl(PATHS.HOME),
    logo: ref(logoImageId()),
    description: ORGANIZATION_DESCRIPTION,
    sameAs: [...ORGANIZATION_SAME_AS],
  };
}

/** In-graph `{ "@id" }` pointer to the shared `Organization` node.
 * Callers must also emit the full node via `buildShared*EntityNodes`. */
export function buildOrganizationRef(): JsonLdRef {
  return ref(organizationId());
}

/**
 * Builds the canonical logo `ImageObject` node (stable {@link logoImageId}).
 * Included alongside {@link buildOrganizationNode} on every self-contained
 * page graph so `Organization.logo` never dangling-references a node
 * defined only on another URL.
 */
export function buildLogoImageNode(): JsonLdNode {
  return {
    "@type": "ImageObject",
    "@id": logoImageId(),
    url: absoluteUrl(LOGO_PATH),
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    caption: `${ZOLVSTACK_BRAND.name} logo`,
  };
}

