import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const HTML_PATH = path.resolve("code-classification-insights.html");
const OUT_FILE = path.resolve("code-classification-insights.png");
const BASE_W = 720;
const BASE_H = 960;

function injectPhysChunk(pngBuf) {
  // 300 DPI -> pixels-per-metre = round(300 / 0.0254) = 11811
  const ppm = 11811;
  const data = Buffer.alloc(9);
  data.writeUInt32BE(ppm, 0);
  data.writeUInt32BE(ppm, 4);
  data.writeUInt8(1, 8); // unit = meters

  const typeAndData = Buffer.concat([Buffer.from("pHYs"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(typeAndData) >>> 0, 0);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const chunk = Buffer.concat([length, typeAndData, crc]);

  // Insert immediately after IHDR (first 8 bytes = signature, then IHDR = 25 bytes)
  const sig = pngBuf.subarray(0, 8);
  const ihdrLen = pngBuf.readUInt32BE(8);
  const ihdrEnd = 8 + 4 + 4 + ihdrLen + 4; // length + type + data + crc
  const before = pngBuf.subarray(0, ihdrEnd);
  const after = pngBuf.subarray(ihdrEnd);
  return Buffer.concat([before, chunk, after]);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: BASE_W, height: BASE_H },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto("file://" + HTML_PATH, { waitUntil: "load" });
const frame = await page.$(".frame");
const box = await frame.boundingBox();
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
await browser.close();
console.log("wrote", OUT_FILE);
