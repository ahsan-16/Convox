"use client";

import { Converter } from "@/components/tools/Converter";
import { ToolSeoContent } from "@/components/tools/ToolSeoContent";
import { getFileoraToolContent } from "@/lib/fileora-tool-content";
import { deriveIntentTitleFromSlug } from "@/lib/seo/content-resolver";
import {
  TOOL_CONFIG,
  TOOL_CATEGORIES,
  categoryIdForTool,
  isToolDiscoverable,
  toolHref,
  type ToolSlug,
} from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { PdfSplitter } from "./pdfSplitter";

const categoryMeta: Record<string, { label: string; color: string }> = {
  image: { label: "🖼️ Image Tools", color: "#00D084" },
  pdf: { label: "📄 PDF Tools", color: "#6366F1" },
  document: { label: "📝 Document Tools", color: "#F59E0B" },
  ai: { label: "✨ AI Tools", color: "#8B5CF6" },
};

function resolveVisibleH1(slug: ToolSlug, fallbackTitle: string): string {
  const content = getFileoraToolContent(slug);
  if (content?.h1) return content.h1;
  if (slug.includes("-to-")) return deriveIntentTitleFromSlug(slug);
  return fallbackTitle;
}

export function ToolPage({ slug }: { slug: ToolSlug }) {
  const [activeTool, setActiveTool] = useState<ToolSlug>(slug);
  const [openCategory, setOpenCategory] = useState<string>(() =>
    categoryIdForTool(slug),
  );
  const config = TOOL_CONFIG[activeTool];
  const content = getFileoraToolContent(activeTool);
  const visibleH1 = resolveVisibleH1(activeTool, config.title);
  const heroLead = content?.intro ?? config.longDesc;

  const categories = Object.entries(TOOL_CATEGORIES)
    .map(([id, slugs]) => ({
      id,
      label: categoryMeta[id]?.label ?? id,
      color: categoryMeta[id]?.color ?? "#666",
      tools: slugs
        .filter((s) => isToolDiscoverable(s) && s !== activeTool)
        .map((s) => TOOL_CONFIG[s]),
    }))
    .filter((cat) => cat.tools.length > 0);

  return (
    <>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "64px 24px 80px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            height: 300,
            background: `radial-gradient(ellipse, ${config.color}10 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              marginBottom: 40,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: `${config.color}15`,
                border: `1px solid ${config.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              {config.icon}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 800,
                  letterSpacing: "-1.5px",
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                {visibleH1}
              </h1>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--color-text-2)",
                  maxWidth: 640,
                  lineHeight: 1.7,
                }}
              >
                {heroLead}
              </p>
            </div>
          </div>

          {slug === "pdf-split" ? (
            <PdfSplitter />
          ) : (
            <Converter
              tool={activeTool}
              onToolChange={(t) => {
                setActiveTool(t);
                setOpenCategory(categoryIdForTool(t));
              }}
            />
          )}

          {content ? (
            <div style={{ marginTop: 56 }}>
              <ToolSeoContent content={content} />
            </div>
          ) : null}
        </div>
      </section>

      {/* Other tools */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--color-text-2)",
              marginBottom: 16,
              letterSpacing: "-0.5px",
            }}
          >
            Other tools
          </h3>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setOpenCategory(openCategory === cat.id ? "" : cat.id)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: 10,
                  cursor: "pointer",
                  border:
                    openCategory === cat.id
                      ? `1px solid ${cat.color}`
                      : "1px solid var(--color-border)",
                  background:
                    openCategory === cat.id
                      ? `${cat.color}12`
                      : "var(--color-bg-2)",
                  color:
                    openCategory === cat.id ? cat.color : "var(--color-text-2)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "all 0.2s ease",
                }}
              >
                {cat.label}
                <span style={{ fontSize: 11, opacity: 0.7 }}>
                  {cat.tools.length} tools
                </span>
              </button>
            ))}
          </div>

          {categories.map(
            (cat) =>
              openCategory === cat.id && (
                <div
                  key={cat.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 12,
                  }}
                >
                  {cat.tools.map((t) => (
                    <Link
                      key={t.slug}
                      href={toolHref(t.slug)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        background: "var(--color-bg-2)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        textDecoration: "none",
                        transition: "border-color 0.2s",
                        position: "relative",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{t.icon}</span>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--color-text-1)",
                          }}
                        >
                          {t.title}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--color-text-3)",
                          }}
                        >
                          {t.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ),
          )}
        </div>
      </section>
    </>
  );
}
