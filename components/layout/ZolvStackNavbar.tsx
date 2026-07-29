"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ZolvStackLogo } from "@/components/brand/ZolvStackLogo";
import { ZOLVSTACK_NAV_LINKS } from "@/lib/zolvstack-catalog";

const navLinkStyle: CSSProperties = {
  fontSize: 14,
  color: "var(--color-text-2)",
  textDecoration: "none",
  transition: "color 0.2s",
};

const MD_MIN_WIDTH = 768;

export function ZolvStackNavbar() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia(`(min-width: ${MD_MIN_WIDTH}px)`).matches) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(17,19,24,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <ZolvStackLogo wordSize={20} />

          <nav
            style={{ alignItems: "center", gap: 32 }}
            className="hidden md:flex"
            aria-label="Primary"
          >
            {ZOLVSTACK_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={navLinkStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-2)")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
              color: "var(--color-text-1)",
            }}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={menuId}
          className="md:hidden"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(17,19,24,0.98)",
          }}
        >
          <nav
            aria-label="Mobile"
            style={{
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {ZOLVSTACK_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  ...navLinkStyle,
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
