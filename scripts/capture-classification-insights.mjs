#!/usr/bin/env node
/**
 * Capture the ClassificationInsights component rendered in isolation at
 * `/_render/classification-insights` as a presentation-ready PNG.
 *
 * - Renders at 2x device pixel ratio
 * - Frame width: 720px, height: auto (component-determined)
 * - Clip is taken from the `#render-frame` element bounding box so the
 *   exported PNG contains only the framed component (no surrounding viewport).
 * - DPI metadata: 300 (pHYs chunk)
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const ROUTE = "/_render/classification-insights";
const OUT_FILE = path.resolve("figma-classification-insights.png");
const TARGET_DPI = 300;
const PIXELS_PER_METER = Math.round(TARGET_DPI / 0.0254); // 11811

function injectPhysChunk(pngBuffer, ppm = PIXELS_PER_METER) {
  const SIG_LEN = 8;
  const data = Buffer.alloc(9);
  data.writeUInt32BE(ppm, 0);
  data.writeUInt32BE(ppm, 4);
  data.writeUInt8(1, 8);
  const type = Buffer.from("pHYs", "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(Buffer.concat([type, data])) >>> 0, 0);
  const physChunk = Buffer.concat([length, type, data, crc]);
  const ihdrLen = pngBuffer.readUInt32BE(SIG_LEN);
  const ihdrEnd = SIG_LEN + 4 + 4 + ihdrLen + 4;
  // Drop any existing pHYs to avoid duplicates.
  let cursor = ihdrEnd;
  const chunks = [];
  while (cursor < pngBuffer.length) {
    const len = pngBuffer.readUInt32BE(cursor);
    const t = pngBuffer.toString("ascii", cursor + 4, cursor + 8);
    const total = 4 + 4 + len + 4;
    if (t !== "pHYs") chunks.push(pngBuffer.subarray(cursor, cursor + total));
    cursor += total;
  }
  return Buffer.concat([pngBuffer.subarray(0, ihdrEnd), physChunk, ...chunks]);
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
    ],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 900, height: 1200 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    const url = `${BASE_URL}${ROUTE}`;
    console.log(`-> capturing ${url}`);

    // Capture any runtime errors so we don't silently produce a wrong asset.
    const errors = [];
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
    });

    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

    // Wait for the frame to mount and fonts to load.
    await page.waitForSelector("#render-frame", { timeout: 30_000 });
    try {
      await page.evaluate(() => document.fonts && document.fonts.ready);
    } catch {}
    await page.addStyleTag({
      content: `*,*::before,*::after{transition-duration:0s !important;animation-duration:0s !important;animation-delay:0s !important;caret-color:transparent !important;}`,
    });
    await new Promise((r) => setTimeout(r, 400));

    if (errors.length) {
      throw new Error(
        `Render errors encountered, refusing to export:\n - ${errors.join("\n - ")}`,
      );
    }

    const frame = await page.$("#render-frame");
    if (!frame) throw new Error("#render-frame not found in DOM");
    const box = await frame.boundingBox();
    if (!box) throw new Error("could not compute bounding box for #render-frame");

    const png = await page.screenshot({
      type: "png",
      clip: {
        x: Math.floor(box.x),
        y: Math.floor(box.y),
        width: Math.ceil(box.width),
        height: Math.ceil(box.height),
      },
      omitBackground: false,
    });

    await fs.writeFile(OUT_FILE, injectPhysChunk(png));

    const stat = await fs.stat(OUT_FILE);
    console.log(
      `wrote ${OUT_FILE} (${stat.size} bytes), logical frame ${Math.round(box.width)}x${Math.round(box.height)}`,
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
