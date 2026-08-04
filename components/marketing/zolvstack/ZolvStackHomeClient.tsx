"use client";

import Link from "next/link";
import { ProductCard } from "@/components/marketing/zolvstack/ProductCard";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import { ZOLVSTACK_PRODUCTS } from "@/lib/zolvstack-catalog";

export function ZolvStackHomeClient() {
  return (
    <ZolvStackPageShell mainPaddingTop={0}>
      <section
        style={{
          textAlign: "center",
          padding: "clamp(100px, 18vw, 160px) 24px clamp(64px, 12vw, 100px)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(800px, 100%)",
            height: 500,
            background:
              "radial-gradient(ellipse at center top, rgba(0,208,132,0.06) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "inline-block",
            background: "rgba(0,208,132,0.07)",
            border: "1px solid rgba(0,208,132,0.18)",
            color: "#00D084",
            fontSize: 11,
            fontWeight: 700,
            padding: "5px 16px",
            borderRadius: 100,
            letterSpacing: "1.5px",
            marginBottom: 32,
            textTransform: "uppercase" as const,
          }}
        >
          Free · No Signup · No Limits
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 800,
            letterSpacing: "clamp(-3px, -0.04em, -1px)",
            lineHeight: 1.03,
            marginBottom: 24,
            color: "#fff",
          }}
        >
          ZolvStack — tools that actually
          <br />
          <span className="text-gradient">get things done.</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "var(--color-text-2)",
            maxWidth: 520,
            margin: "0 auto 48px",
            lineHeight: 1.75,
            fontWeight: 300,
          }}
        >
          ZolvStack builds free, fast, and private web tools — starting with
          Fileora, an online file, image, and PDF converter. No subscriptions,
          no watermarks, no nonsense.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            href="/fileora"
            className="btn-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Open Fileora
            <span style={{ fontSize: 18 }}>→</span>
          </Link>
          <Link
            href="/products"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-text-2)",
              textDecoration: "none",
            }}
          >
            Explore Products →
          </Link>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 0",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div className="flex flex-col items-center text-center gap-4 mb-12 md:flex-row md:items-end md:justify-between md:text-left md:gap-4">
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: "var(--color-text-3)",
                textTransform: "uppercase" as const,
                marginBottom: 10,
              }}
            >
              What we build
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              ZolvStack products
            </h2>
          </div>
          <Link
            href="/products"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-brand)",
              textDecoration: "none",
            }}
          >
            View all products →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: 20,
          }}
        >
          {ZOLVSTACK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </ZolvStackPageShell>
  );
}
