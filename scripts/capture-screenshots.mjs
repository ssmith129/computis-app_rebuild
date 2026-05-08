#!/usr/bin/env node
/**
 * Capture 1920x1080 (logical) screenshots of every screen in the Computis
 * platform at 3x device-scale (5760x3240 actual pixels) and tag each PNG
 * with 300 DPI metadata via a pHYs chunk.
 *
 * For each route we save:
 *   Screenshots/<screen-name>/<screen-name>-viewport.png    (1920x1080 logical)
 *   Screenshots/<screen-name>/<screen-name>-fullpage.png    (1920 wide, full scroll)
 *
 * Usage:
 *   node scripts/capture-screenshots.mjs
 *   BASE_URL=http://localhost:8080 node scripts/capture-screenshots.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

// CLI args: --width=1920 --height=1080 --out=Screenshots --scale=3 --base=http://localhost:8080
function parseArg(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

const BASE_URL = parseArg("base", process.env.BASE_URL || "http://localhost:8080");
const OUT_DIR = path.resolve(parseArg("out", process.env.OUT_DIR || "Screenshots"));
const VIEWPORT_WIDTH = Number(parseArg("width", process.env.VIEWPORT_WIDTH || 1920));
const VIEWPORT_HEIGHT = Number(parseArg("height", process.env.VIEWPORT_HEIGHT || 1080));
const DEVICE_SCALE_FACTOR = Number(parseArg("scale", process.env.DEVICE_SCALE_FACTOR || 3));
const TARGET_DPI = 300;
// 1 inch = 0.0254 m, so pixels-per-meter = dpi / 0.0254
const PIXELS_PER_METER = Math.round(TARGET_DPI / 0.0254); // 11811

const SCREENS = [
  { name: "01-dashboard", label: "Dashboard", path: "/" },
  { name: "02-transactions", label: "Transactions", path: "/transactions" },
  { name: "03-wallets", label: "Wallets and Exchanges", path: "/wallets" },
  { name: "04-clients", label: "Clients", path: "/clients" },
  { name: "05-wallet-ingestion", label: "Wallet Ingestion", path: "/wallet-ingestion" },
  { name: "06-data-anomaly-detection", label: "Data Anomaly Detection", path: "/data-anomaly-detection" },
  { name: "07-irs-8949", label: "IRS Form 8949", path: "/irs-8949" },
  { name: "08-gain-loss", label: "Gain Loss Report", path: "/gain-loss" },
  { name: "09-exports", label: "Exports", path: "/exports" },
  { name: "10-settings", label: "General Settings", path: "/settings" },
  { name: "11-preferences", label: "Preferences", path: "/preferences" },
  { name: "12-rule-engine", label: "Rule Engine", path: "/rule-engine" },
  { name: "13-my-account", label: "My Account", path: "/my-account" },
  { name: "14-help", label: "Help Center", path: "/help" },
  { name: "15-keyboard-shortcuts", label: "Keyboard Shortcuts", path: "/keyboard-shortcuts" },
  { name: "16-design-system", label: "Design System Showcase", path: "/design-system" },
];

/**
 * Inject a pHYs chunk into a PNG buffer to set the physical pixel dimensions
 * (DPI metadata). Returns a new Buffer.
 *
 * PNG layout: 8-byte signature, then chunks: [length(4) | type(4) | data | crc(4)]
 * pHYs chunk data: 9 bytes -> ppuX (4) | ppuY (4) | unit (1; 1 = meter)
 */
function injectPhysChunk(pngBuffer, ppm = PIXELS_PER_METER) {
  const SIGNATURE_LENGTH = 8;
  // Build pHYs chunk
  const data = Buffer.alloc(9);
  data.writeUInt32BE(ppm, 0);
  data.writeUInt32BE(ppm, 4);
  data.writeUInt8(1, 8); // unit = meter

  const type = Buffer.from("pHYs", "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const crcInput = Buffer.concat([type, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(crcInput) >>> 0, 0);

  const physChunk = Buffer.concat([length, type, data, crc]);

  // Find the IHDR chunk end so we can insert pHYs right after it.
  // IHDR is always the first chunk after the signature.
  const ihdrLength = pngBuffer.readUInt32BE(SIGNATURE_LENGTH);
  const ihdrEnd = SIGNATURE_LENGTH + 4 /*len*/ + 4 /*type*/ + ihdrLength + 4 /*crc*/;

  // Remove any pre-existing pHYs chunk to avoid duplicates.
  let cursor = ihdrEnd;
  const chunks = [];
  while (cursor < pngBuffer.length) {
    const len = pngBuffer.readUInt32BE(cursor);
    const chunkType = pngBuffer.toString("ascii", cursor + 4, cursor + 8);
    const totalLen = 4 + 4 + len + 4;
    if (chunkType !== "pHYs") {
      chunks.push(pngBuffer.subarray(cursor, cursor + totalLen));
    }
    cursor += totalLen;
  }

  return Buffer.concat([
    pngBuffer.subarray(0, ihdrEnd),
    physChunk,
    ...chunks,
  ]);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function waitForPageReady(page) {
  // Wait for fonts and any in-flight network to settle.
  try {
    await page.evaluate(() => document.fonts && document.fonts.ready);
  } catch {}
  // Disable animations to get a clean shot.
  await page.addStyleTag({
    content: `*, *::before, *::after {
      transition-duration: 0s !important;
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      caret-color: transparent !important;
    }`,
  });
  // Small settle delay for charts / lazy content.
  await new Promise((r) => setTimeout(r, 800));
}

async function capture(browser, screen) {
  const screenDir = path.join(OUT_DIR, screen.name);
  await ensureDir(screenDir);

  const viewportFile = path.join(screenDir, `${screen.name}-viewport.png`);
  const fullpageFile = path.join(screenDir, `${screen.name}-fullpage.png`);
  const hasViewport = await fs.stat(viewportFile).then(() => true).catch(() => false);
  const hasFullpage = await fs.stat(fullpageFile).then(() => true).catch(() => false);
  if (hasViewport && hasFullpage) {
    console.log(`-- ${screen.name}  (skipped, already exists)`);
    return;
  }

  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
  });
  const page = await context.newPage();

  const url = `${BASE_URL}${screen.path}`;
  console.log(`-> ${screen.name}  ${url}`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await waitForPageReady(page);

  if (!hasViewport) {
    const viewportPng = await page.screenshot({
      type: "png",
      fullPage: false,
      omitBackground: false,
    });
    await fs.writeFile(viewportFile, injectPhysChunk(viewportPng));
  }

  if (!hasFullpage) {
    const fullPng = await page.screenshot({
      type: "png",
      fullPage: true,
      omitBackground: false,
    });
    await fs.writeFile(fullpageFile, injectPhysChunk(fullPng));
  }

  await page.close();
  await context.close();
}

async function main() {
  await ensureDir(OUT_DIR);
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
    for (const screen of SCREENS) {
      try {
        await capture(browser, screen);
      } catch (err) {
        console.error(`!! Failed to capture ${screen.name}:`, err.message);
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`\nDone. Output -> ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
