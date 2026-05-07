import fs from "node:fs";
const file = process.argv[2];
const d = fs.readFileSync(file);
let i = 8;
while (i < d.length) {
  const len = d.readUInt32BE(i);
  const t = d.toString("ascii", i + 4, i + 8);
  if (t === "pHYs") {
    const x = d.readUInt32BE(i + 8);
    const y = d.readUInt32BE(i + 12);
    const u = d[i + 16];
    console.log(`pHYs ppuX=${x} ppuY=${y} unit=${u} -> ~${Math.round(x * 0.0254)} DPI`);
    process.exit(0);
  }
  i += 12 + len;
}
console.log("no pHYs chunk");
