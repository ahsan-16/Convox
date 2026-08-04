"use client";

import type { FileoraToolContent } from "@/lib/fileora-tool-content";

type ToolSeoContentProps = {
  content: FileoraToolContent;
};

/**
 * Unique editorial sections for Wave-1+ tools. Renders nothing useful
 * without content — callers should gate on getFileoraToolContent(slug).
 */
export function ToolSeoContent({ content }: ToolSeoContentProps) {
  return (
    <section
      style={{
        maxWidth: 760,
        margin: "0 auto",
        paddingTop: 8,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 36,
          borderTop: "1px solid var(--color-border)",
          paddingTop: 48,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.5px",
              color: "#fff",
              marginBottom: 14,
            }}
          >
            Common use cases
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              display: "grid",
              gap: 10,
            }}
          >
            {content.useCases.map((item) => (
              <li
                key={item}
                style={{
                  fontSize: 15,
                  color: "var(--color-text-2)",
                  lineHeight: 1.7,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.5px",
              color: "#fff",
              marginBottom: 14,
            }}
          >
            Why use this tool
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              display: "grid",
              gap: 10,
            }}
          >
            {content.benefits.map((item) => (
              <li
                key={item}
                style={{
                  fontSize: 15,
                  color: "var(--color-text-2)",
                  lineHeight: 1.7,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.5px",
              color: "#fff",
              marginBottom: 18,
            }}
          >
            Frequently asked questions
          </h2>
          <dl style={{ margin: 0, display: "grid", gap: 16 }}>
            {content.faqs.map((faq) => (
              <div
                key={faq.question}
                style={{
                  padding: "16px 18px",
                  background: "var(--color-bg-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                }}
              >
                <dt
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--color-text-1)",
                    marginBottom: 8,
                  }}
                >
                  {faq.question}
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "var(--color-text-2)",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
