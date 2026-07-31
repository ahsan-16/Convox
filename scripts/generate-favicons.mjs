#!/usr/bin/env node
/**
 * Regenerates Google/browser favicon assets from the master PWA icon.
 *
 * Source: public/icons/icon-512.png
 * Outputs:
 *   - public/favicon.ico   (real ICO with 16 / 32 / 48 PNG entries)
 *   - public/favicon-48.png
 *   - public/favicon-32.png
 *
 * Google Search requires a crawlable square favicon (min 8×8, recommend >48×48)
 * at a stable URL — see https://developers.google.com/search/docs/appearance/favicon-in-search
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");
const SOURCE = path.join(PUBLIC, "icons", "icon-512.png");

/** Pack PNG buffers into a Windows ICO (PNG-compressed image entries). */
function createIco(images) {
  const count = images.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const dir = Buffer.alloc(headerSize);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(count, 4);

  const parts = [dir];
  images.forEach((img, i) => {
    const entry = 6 + i * 16;
    const size = img.size >= 256 ? 0 : img.size;
    dir.writeUInt8(size, entry);
    dir.writeUInt8(size, entry + 1);
    dir.writeUInt8(0, entry + 2);
    dir.writeUInt8(0, entry + 3);
    dir.writeUInt16LE(1, entry + 4);
    dir.writeUInt16LE(32, entry + 6);
    dir.writeUInt32LE(img.data.length, entry + 8);
    dir.writeUInt32LE(offset, entry + 12);
    parts.push(img.data);
    offset += img.data.length;
  });

  return Buffer.concat(parts);
}

async function main() {
  const meta = await sharp(SOURCE).metadata();
  if (meta.width !== meta.height) {
    throw new Error(
      `Source icon must be square, got ${meta.width}x${meta.height}`,
    );
  }

  async function pngAt(size) {
    const data = await sharp(SOURCE)
      .resize(size, size, { fit: "fill" })
      .png()
      .toBuffer();
    return { size, data };
  }

  const images = [];
  for (const size of [16, 32, 48]) {
    images.push(await pngAt(size));
  }

  fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), createIco(images));
  fs.writeFileSync(
    path.join(PUBLIC, "favicon-48.png"),
    images.find((i) => i.size === 48).data,
  );
  fs.writeFileSync(
    path.join(PUBLIC, "favicon-32.png"),
    images.find((i) => i.size === 32).data,
  );

  console.log("Generated favicon.ico, favicon-48.png, favicon-32.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
