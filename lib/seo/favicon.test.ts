import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const PUBLIC_DIR = join(process.cwd(), "public");

/** PNG IHDR width/height live at bytes 16–23 (big-endian). */
function pngDimensions(buf: Buffer): { width: number; height: number } {
  expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

describe("Google Search favicon assets", () => {
  it("ships a real ICO (not a renamed PNG) at /favicon.ico", () => {
    const path = join(PUBLIC_DIR, "favicon.ico");
    expect(existsSync(path)).toBe(true);
    const buf = readFileSync(path);

    // ICO directory: reserved=0, type=1 (icon), count>=1
    expect(buf.readUInt16LE(0)).toBe(0);
    expect(buf.readUInt16LE(2)).toBe(1);
    const count = buf.readUInt16LE(4);
    expect(count).toBeGreaterThanOrEqual(1);

    // Must not be a raw PNG (common misconfiguration that breaks crawlers)
    expect(buf.subarray(0, 8).toString("hex")).not.toBe("89504e470d0a1a0a");
  });

  it("includes at least one ICO image entry that is 48x48 or larger", () => {
    const buf = readFileSync(join(PUBLIC_DIR, "favicon.ico"));
    const count = buf.readUInt16LE(4);
    const sizes: number[] = [];

    for (let i = 0; i < count; i++) {
      const entry = 6 + i * 16;
      let w = buf.readUInt8(entry);
      let h = buf.readUInt8(entry + 1);
      if (w === 0) w = 256;
      if (h === 0) h = 256;
      sizes.push(Math.min(w, h));
    }

    expect(sizes.some((s) => s >= 48)).toBe(true);
  });

  it("ships a stable square PNG at /favicon-48.png for Google's ≥48px guidance", () => {
    const path = join(PUBLIC_DIR, "favicon-48.png");
    expect(existsSync(path)).toBe(true);
    const { width, height } = pngDimensions(readFileSync(path));
    expect(width).toBe(48);
    expect(height).toBe(48);
  });

  it("keeps favicon.svg square (1:1 viewBox) for SVG eligibility", () => {
    const svg = readFileSync(join(PUBLIC_DIR, "favicon.svg"), "utf8");
    const match = svg.match(/viewBox=["']0\s+0\s+(\d+)\s+(\d+)["']/i);
    expect(match).not.toBeNull();
    expect(match![1]).toBe(match![2]);
  });
});
