import { describe, expect, it } from "vitest";

import {
  FILEORA_TOOL_CONTENT,
  WAVE_1_TOOL_SLUGS,
  getFileoraToolContent,
  isWave1ToolSlug,
  type FileoraToolContent,
} from "./fileora-tool-content";

function assertContentShape(slug: string, content: FileoraToolContent) {
  expect(content.h1.trim().length, `${slug} h1`).toBeGreaterThan(3);
  expect(content.intro.trim().length, `${slug} intro`).toBeGreaterThan(40);
  expect(content.useCases.length, `${slug} useCases`).toBeGreaterThanOrEqual(2);
  expect(content.benefits.length, `${slug} benefits`).toBeGreaterThanOrEqual(2);
  expect(content.faqs.length, `${slug} faqs`).toBeGreaterThanOrEqual(3);

  for (const line of content.useCases) {
    expect(line.trim().length, `${slug} useCase`).toBeGreaterThan(10);
  }
  for (const line of content.benefits) {
    expect(line.trim().length, `${slug} benefit`).toBeGreaterThan(10);
  }
  for (const faq of content.faqs) {
    expect(faq.question.trim().length, `${slug} FAQ question`).toBeGreaterThan(5);
    expect(faq.answer.trim().length, `${slug} FAQ answer`).toBeGreaterThan(20);
  }
}

describe("FILEORA_TOOL_CONTENT (Wave 1)", () => {
  it("covers every Wave 1 tool slug", () => {
    for (const slug of WAVE_1_TOOL_SLUGS) {
      expect(isWave1ToolSlug(slug)).toBe(true);
      const content = getFileoraToolContent(slug);
      expect(content, `missing content for ${slug}`).toBeDefined();
      assertContentShape(slug, content!);
    }
  });

  it("keeps h1 values unique across the registry", () => {
    const h1s = Object.values(FILEORA_TOOL_CONTENT).map((c) => c!.h1.trim());
    expect(new Set(h1s).size).toBe(h1s.length);
  });

  it("keeps intro paragraphs unique across the registry", () => {
    const intros = Object.values(FILEORA_TOOL_CONTENT).map((c) =>
      c!.intro.trim().toLowerCase(),
    );
    expect(new Set(intros).size).toBe(intros.length);
  });

  it("keeps FAQ question strings unique within each tool", () => {
    for (const [slug, content] of Object.entries(FILEORA_TOOL_CONTENT)) {
      const questions = content!.faqs.map((f) => f.question.trim().toLowerCase());
      expect(new Set(questions).size, slug).toBe(questions.length);
    }
  });

  it("avoids identical FAQ question text reused across different Wave 1 tools", () => {
    const seen = new Map<string, string>();
    for (const slug of WAVE_1_TOOL_SLUGS) {
      const content = getFileoraToolContent(slug)!;
      for (const faq of content.faqs) {
        const key = faq.question.trim().toLowerCase();
        const prior = seen.get(key);
        expect(
          prior,
          `duplicate FAQ question "${faq.question}" on ${slug} and ${prior}`,
        ).toBeUndefined();
        seen.set(key, slug);
      }
    }
  });

  it("returns undefined for tools without authored content", () => {
    expect(getFileoraToolContent("md-to-pdf")).toBeUndefined();
    expect(getFileoraToolContent("remove-bg")).toBeUndefined();
  });

  it("uses intent-style H1s that mention the conversion target or action", () => {
    expect(getFileoraToolContent("image-to-webp")!.h1).toBe(
      "Image to WebP Converter",
    );
    expect(getFileoraToolContent("heic-to-jpg")!.h1).toBe(
      "HEIC to JPG Converter",
    );
    expect(getFileoraToolContent("pdf-compress")!.h1).toBe("PDF Compress");
    expect(getFileoraToolContent("pdf-to-jpg")!.h1).toMatch(/PDF to JPG/i);
  });
});
