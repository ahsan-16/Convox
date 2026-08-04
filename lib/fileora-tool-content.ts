/**
 * Editorial content for Fileora converter tool pages (Phase 2).
 *
 * Single source of truth for unique on-page copy (H1, intro, use cases,
 * benefits, FAQs). Consumed by ToolPage UI and by `lib/seo/routes.ts`
 * (`SeoRoute.faq` / intent title) for FAQPage JSON-LD.
 *
 * Indexing policy is unchanged: tools stay noindex until the quality gate
 * passes and routes.ts is explicitly updated (not in this module).
 *
 * ## Import note
 *
 * Use relative imports only. This module is transitively loaded by
 * `next.config.ts` via `lib/seo/routes.ts` / `redirects.ts`, where the
 * `@/*` path alias does not resolve.
 */

import type { ToolSlug } from "./utils";

export type FileoraToolFaq = {
  question: string;
  answer: string;
};

export type FileoraToolContent = {
  /** Visible intent H1 (also suitable as SeoRoute.title intent). */
  h1: string;
  /** Unique opening paragraph for the tool page. */
  intro: string;
  useCases: readonly string[];
  benefits: readonly string[];
  faqs: readonly FileoraToolFaq[];
};

/** Wave 1 converters prioritized for content quality before any index opt-in. */
export const WAVE_1_TOOL_SLUGS = [
  "image-to-webp",
  "heic-to-jpg",
  "image-to-jpg",
  "image-to-png",
  "image-to-pdf",
  "pdf-merge",
  "pdf-compress",
  "pdf-to-jpg",
] as const satisfies readonly ToolSlug[];

export type Wave1ToolSlug = (typeof WAVE_1_TOOL_SLUGS)[number];

export const FILEORA_TOOL_CONTENT: Partial<
  Record<ToolSlug, FileoraToolContent>
> = {
  "image-to-webp": {
    h1: "Image to WebP Converter",
    intro:
      "Convert JPG, PNG, and other common images to WebP in your browser with Fileora. Shrink file size for faster pages while keeping visual quality — free, unlimited, and private.",
    useCases: [
      "Optimize blog and storefront product photos before publishing.",
      "Reduce LCP weight on marketing sites without a design rewrite.",
      "Batch-convert screenshot libraries for docs and help centers.",
    ],
    benefits: [
      "WebP often cuts image weight 25–80% versus JPG or PNG at similar quality.",
      "Runs in the browser with no account, watermark, or daily cap.",
      "Download one file or a ZIP of many conversions in a single pass.",
    ],
    faqs: [
      {
        question: "What image formats can I convert to WebP?",
        answer:
          "Upload JPG, JPEG, PNG, GIF, BMP, TIFF, AVIF, and other formats Fileora accepts for this tool, then download WebP output.",
      },
      {
        question: "Will converting to WebP reduce quality?",
        answer:
          "WebP is designed for efficient compression. You typically keep comparable quality at a smaller file size; use original sources when you need archival masters.",
      },
      {
        question: "Do browsers support WebP?",
        answer:
          "Yes. Current Chrome, Firefox, Safari, Edge, and Opera versions support WebP for the vast majority of users.",
      },
      {
        question: "Is the Image to WebP converter free?",
        answer:
          "Yes. Fileora’s Image to WebP tool is free and unlimited — no signup or credit card.",
      },
    ],
  },

  "heic-to-jpg": {
    h1: "HEIC to JPG Converter",
    intro:
      "Turn iPhone and iPad HEIC/HEIF photos into universal JPG files with Fileora. Share and edit on Windows, the web, and apps that still expect JPEG — privately in your browser.",
    useCases: [
      "Export Camera Roll shots for email, Slack, or clients who can’t open HEIC.",
      "Prepare photos for Word, PowerPoint, and older CMS uploaders.",
      "Convert travel albums before importing into Lightroom or Windows Photos.",
    ],
    benefits: [
      "JPG opens everywhere — no Apple-only format friction.",
      "No desktop install or iCloud middleman required.",
      "Convert multiple HEIC files and download them together as a ZIP.",
    ],
    faqs: [
      {
        question: "What is HEIC and why convert it to JPG?",
        answer:
          "HEIC is Apple’s efficient photo format. Many Windows apps, email clients, and websites still prefer JPG, so converting improves compatibility.",
      },
      {
        question: "Does HEIC to JPG work with iPhone photos?",
        answer:
          "Yes. Upload HEIC or HEIF files from your iPhone or iPad and download standard JPG images ready to share.",
      },
      {
        question: "Will I lose Live Photo data?",
        answer:
          "This tool converts the still image to JPG. Live Photo motion and depth data are not included in the JPG output.",
      },
      {
        question: "Is HEIC to JPG free on Fileora?",
        answer:
          "Yes. Convert HEIC to JPG with no signup, watermark, or conversion limit.",
      },
    ],
  },

  "image-to-jpg": {
    h1: "Image to JPG Converter",
    intro:
      "Convert PNG, WebP, BMP, TIFF, and other images to JPG with Fileora. Produce shareable JPEG files for email, print workflows, and sites that expect the classic format.",
    useCases: [
      "Flatten transparent PNGs into JPG for email newsletters.",
      "Standardize mixed-format folders before uploading to a CMS.",
      "Create smaller JPEGs from large TIFF or BMP scans.",
    ],
    benefits: [
      "JPG remains the most widely accepted photo format online.",
      "Browser-based conversion with no software install.",
      "Batch upload support with ZIP download for multiple files.",
    ],
    faqs: [
      {
        question: "Which formats can I convert to JPG?",
        answer:
          "Common inputs include PNG, WebP, BMP, TIFF, GIF, and other image types accepted by this Fileora tool — check the uploader for the full list.",
      },
      {
        question: "What happens to PNG transparency?",
        answer:
          "JPG does not support alpha transparency. Transparent areas are typically flattened onto a solid background in the output.",
      },
      {
        question: "Is Image to JPG better than keeping PNG?",
        answer:
          "Use JPG for photos and complex images where smaller size matters. Keep PNG when you need sharp UI graphics or transparency.",
      },
      {
        question: "Can I convert several images to JPG at once?",
        answer:
          "Yes. Upload multiple files (within Fileora’s batch limits), convert, and download a ZIP of JPG outputs.",
      },
    ],
  },

  "image-to-png": {
    h1: "Image to PNG Converter",
    intro:
      "Convert JPG, WebP, and other rasters to PNG with Fileora. Ideal when you need lossless detail, crisp UI assets, or a format that handles transparency well.",
    useCases: [
      "Export logos and icons from mixed sources into PNG for design systems.",
      "Convert WebP assets to PNG for tools that lack WebP import.",
      "Prepare screenshots for documentation that requires PNG.",
    ],
    benefits: [
      "PNG preserves sharp edges and text better than heavily compressed JPG.",
      "Widely supported in design tools, browsers, and print pipelines.",
      "Free unlimited conversions in the browser with private processing.",
    ],
    faqs: [
      {
        question: "When should I convert an image to PNG?",
        answer:
          "Choose PNG for graphics, screenshots, and images where sharpness matters more than smallest file size.",
      },
      {
        question: "Will PNG files be larger than JPG?",
        answer:
          "Often yes for photographs. PNG shines on UI, line art, and images that need lossless quality or transparency.",
      },
      {
        question: "Can I convert JPG to PNG on Fileora?",
        answer:
          "Yes. Upload a JPG (or other supported input) and download a PNG — no signup required.",
      },
      {
        question: "Does Image to PNG support batch conversion?",
        answer:
          "Yes. Convert multiple images in one session and download them as a ZIP when you upload more than one file.",
      },
    ],
  },

  "image-to-pdf": {
    h1: "Image to PDF Converter",
    intro:
      "Combine photos and scans into a single PDF with Fileora. Turn JPG, PNG, and similar images into a portable document for sharing, printing, or archiving — free in your browser.",
    useCases: [
      "Build a multi-page PDF from phone photos of receipts or notes.",
      "Package portfolio images into one file for client review.",
      "Create printable PDFs from screenshots or scanned pages.",
    ],
    benefits: [
      "One PDF is easier to email and archive than a folder of images.",
      "No desktop PDF printer or Office install required.",
      "Private, browser-based conversion with no watermark.",
    ],
    faqs: [
      {
        question: "Can I put multiple images into one PDF?",
        answer:
          "Yes. Upload several images and Fileora builds a PDF document from them according to the tool’s multi-file flow.",
      },
      {
        question: "Which image types work with Image to PDF?",
        answer:
          "JPG, PNG, and other formats accepted by the uploader are supported — see the tool page for the current accept list.",
      },
      {
        question: "Is the PDF searchable?",
        answer:
          "Image to PDF embeds the pictures as pages. It does not run OCR, so text inside photos is not automatically selectable.",
      },
      {
        question: "Is Image to PDF free?",
        answer:
          "Yes. Convert images to PDF on Fileora without an account or payment.",
      },
    ],
  },

  "pdf-merge": {
    h1: "PDF Merge",
    intro:
      "Merge multiple PDF files into one document with Fileora. Combine contracts, statements, and scanned pages in order — quickly, privately, and without installing software.",
    useCases: [
      "Join signed pages and exhibits into a single filing packet.",
      "Assemble a report from chapter PDFs before sending to stakeholders.",
      "Concatenate scanned homework or expense pages into one attachment.",
    ],
    benefits: [
      "One merged PDF is simpler to upload to portals with file-count limits.",
      "Browser-based merge with no Adobe subscription required.",
      "Free unlimited use with files processed privately.",
    ],
    faqs: [
      {
        question: "How do I merge PDFs with Fileora?",
        answer:
          "Open PDF Merge, upload two or more PDFs in the order you want, convert, and download the combined file.",
      },
      {
        question: "Is there a limit to how many PDFs I can merge?",
        answer:
          "You can merge within Fileora’s upload limits (file count and size per file). Stay under those caps for best results.",
      },
      {
        question: "Will merge change PDF quality?",
        answer:
          "Merging concatenates existing pages. It does not recompress images inside each PDF beyond what the tool’s pipeline requires.",
      },
      {
        question: "Is PDF Merge free and private?",
        answer:
          "Yes. Merging is free, requires no signup, and files are not kept on our servers after processing.",
      },
    ],
  },

  "pdf-compress": {
    h1: "PDF Compress",
    intro:
      "Compress oversized PDFs for email and uploads with Fileora. Shrink attachments that bounce from size limits while keeping documents readable — free and private in your browser.",
    useCases: [
      "Fit a proposal under a 10MB or 25MB email gateway limit.",
      "Reduce scanned PDF size before uploading to HR or government portals.",
      "Lighten slide decks exported as PDF for faster sharing.",
    ],
    benefits: [
      "Smaller PDFs send faster and clear attachment caps more often.",
      "No desktop optimizer or paid Acrobat feature required.",
      "Unlimited free compressions with private processing.",
    ],
    faqs: [
      {
        question: "Will compressing a PDF ruin text quality?",
        answer:
          "Fileora targets smaller file size while keeping text and vector content readable. Extreme scans may show more compression artifacts than born-digital PDFs.",
      },
      {
        question: "How much smaller will my PDF become?",
        answer:
          "Savings depend on the source. Image-heavy scans usually shrink more than already-optimized digital PDFs.",
      },
      {
        question: "Can I compress password-protected PDFs?",
        answer:
          "Protected or encrypted PDFs may fail until unlocked. Remove the password in your PDF reader, then compress the unlocked file.",
      },
      {
        question: "Is PDF Compress free on Fileora?",
        answer:
          "Yes. Compress PDFs online with no account, watermark, or daily quota.",
      },
    ],
  },

  "pdf-to-jpg": {
    h1: "PDF to JPG Converter",
    intro:
      "Export PDF pages as JPG images with Fileora. Turn document pages into photos for slides, social posts, or galleries — without installing a PDF editor.",
    useCases: [
      "Pull a chart page from a PDF into a Keynote or Google Slides deck.",
      "Share a single PDF page as a JPG in chat apps that prefer images.",
      "Create image previews of brochure pages for a website gallery.",
    ],
    benefits: [
      "JPG pages are easy to embed where PDFs are blocked.",
      "Works in the browser — no desktop rasterizer required.",
      "Free conversion with private, no-signup processing.",
    ],
    faqs: [
      {
        question: "Does PDF to JPG convert every page?",
        answer:
          "Yes. Each PDF page is rendered to a JPG according to the tool’s output flow so you can use pages individually.",
      },
      {
        question: "Will text stay selectable in the JPG?",
        answer:
          "No. JPG is a picture of the page. Text is not selectable or searchable inside the image.",
      },
      {
        question: "What resolution do I get?",
        answer:
          "Output follows Fileora’s PDF-to-image pipeline defaults — sharp enough for screen sharing and common web use.",
      },
      {
        question: "Is PDF to JPG free?",
        answer:
          "Yes. Convert PDF pages to JPG on Fileora with no signup or payment.",
      },
    ],
  },
};

export function getFileoraToolContent(
  slug: ToolSlug,
): FileoraToolContent | undefined {
  return FILEORA_TOOL_CONTENT[slug];
}

export function isWave1ToolSlug(slug: string): slug is Wave1ToolSlug {
  return (WAVE_1_TOOL_SLUGS as readonly string[]).includes(slug);
}
