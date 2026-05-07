// Captures 4K full-page screenshots of every Computis route and stores
// them as PNG files at 300 DPI inside Screenshots/<screen>/<screen>.png
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const OUT_ROOT = path.resolve("Screenshots");

// Mirrors the routes registered in client/App.tsx
const SCREENS = [
  { route: "/", folder: "Dashboard", file: "dashboard" },
  { route: "/transactions", folder: "Transactions", file: "transactions" },
  { route: "/wallets", folder: "Wallets", file: "wallets" },
  { route: "/wallet-ingestion", folder: "Wallet-Ingestion", file: "wallet-ingestion" },
  { route: "/clients", folder: "Clients", file: "clients" },
  { route: "/data-anomaly-detection", folder: "Data-Anomaly-Detection", file: "data-anomaly-detection" },
  { route: "/irs-8949", folder: "IRS-8949", file: "irs-8949" },
  { route: "/gain-loss", folder: "Gain-Loss", file: "gain-loss" },
  { route: "/exports", folder: "Exports", file: "exports" },
  { route: "/settings", folder: "Settings", file: "settings" },
  { route: "/preferences", folder: "Preferences", file: "preferences" },
  { route: "/rule-engine", folder: "Rule-Engine", file: "rule-engine" },
  { route: "/my-account", folder: "My-Account", file: "my-account" },
  { route: "/help", folder: "Help", file: "help" },
  { route: "/keyboard-shortcuts", folder: "Keyboard-Shortcuts", file: "keyboard-shortcuts" },
  { route: "/design-system", folder: "Design-System", file: "design-system" },
];

const VIEWPORT = { width: 3840, height: 2160 };
// 300 DPI -> pixels per metre (PNG pHYs unit 1 = metres). 300 dpi = 11811 ppm.
const DPI = 300;

async function main() {
  await fs.mkdir(OUT_ROOT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const results = [];
  for (const screen of SCREENS) {
    const url = `${BASE_URL}${screen.route}`;
    process.stdout.write(`Capturing ${screen.folder.padEnd(28)} ${url} ... `);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      // Give animations / charts a moment to settle
      await page.waitForTimeout(1200);

      const folder = path.join(OUT_ROOT, screen.folder);
      await fs.mkdir(folder, { recursive: true });
      const outFile = path.join(folder, `${screen.file}.png`);

      const rawBuffer = await page.screenshot({
        type: "png",
        fullPage: true,
      });

      // Re-encode with 300 DPI metadata
      await sharp(rawBuffer)
        .withMetadata({ density: DPI })
        .png({ compressionLevel: 9 })
        .toFile(outFile);

      const meta = await sharp(outFile).metadata();
      results.push({
        screen: screen.folder,
        file: outFile,
        width: meta.width,
        height: meta.height,
        density: meta.density,
      });
      console.log(`ok (${meta.width}x${meta.height} @ ${meta.density}dpi)`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      results.push({ screen: screen.folder, error: err.message });
    }
  }

  await browser.close();

  console.log("\nSummary:");
  for (const r of results) {
    if (r.error) console.log(`  ✗ ${r.screen}: ${r.error}`);
    else
      console.log(
        `  ✓ ${r.screen}: ${r.width}x${r.height} @ ${r.density}dpi -> ${r.file}`,
      );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
