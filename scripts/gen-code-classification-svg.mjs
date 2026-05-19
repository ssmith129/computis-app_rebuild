import fs from "node:fs";

const lines = [
  [["k","const"],["w"," "],["i","classificationData"],["w"," "],["p","="],["w"," "],["p","["]],
  [["w","  "],["p","{"]],
  [["w","    "],["pr","level"],["p",":"],["w"," "],["s","\"High Confidence\""],["p",","]],
  [["w","    "],["pr","count"],["p",":"],["w"," "],["n","61"],["p",","]],
  [["w","    "],["pr","percentage"],["p",":"],["w"," "],["n","55"],["p",","]],
  [["w","    "],["pr","description"],["p",":"],["w"," "],["s","\"Match known patterns with high confidence\""],["p",","]],
  [["w","    "],["pr","color"],["p",":"],["w"," "],["s","\"text-success\""],["p",","]],
  [["w","    "],["pr","bgColor"],["p",":"],["w"," "],["s","\"bg-success-bg\""],["p",","]],
  [["w","    "],["pr","icon"],["p",":"],["w"," "],["t","CheckCircle"],["p",","]],
  [["w","    "],["pr","progressColor"],["p",":"],["w"," "],["s","\"bg-success\""],["p",","]],
  [["w","    "],["pr","actionColor"],["p",":"],["w"," "],["s","\"text-success\""],["p",","]],
  [["w","  "],["p","},"]],
  [["w","  "],["p","{"]],
  [["w","    "],["pr","level"],["p",":"],["w"," "],["s","\"Medium Confidence\""],["p",","]],
  [["w","    "],["pr","count"],["p",":"],["w"," "],["n","42"],["p",","]],
  [["w","    "],["pr","percentage"],["p",":"],["w"," "],["n","34"],["p",","]],
  [["w","    "],["pr","description"],["p",":"],["w"," "],["s","\"Somewhat reliable AI classifications\""],["p",","]],
  [["w","    "],["pr","color"],["p",":"],["w"," "],["s","\"text-warning\""],["p",","]],
  [["w","    "],["pr","bgColor"],["p",":"],["w"," "],["s","\"bg-warning-bg\""],["p",","]],
  [["w","    "],["pr","icon"],["p",":"],["w"," "],["t","AlertCircle"],["p",","]],
  [["w","    "],["pr","progressColor"],["p",":"],["w"," "],["s","\"bg-warning\""],["p",","]],
  [["w","    "],["pr","actionColor"],["p",":"],["w"," "],["s","\"text-warning\""],["p",","]],
  [["w","  "],["p","},"]],
  [["w","  "],["p","{"]],
  [["w","    "],["pr","level"],["p",":"],["w"," "],["s","\"Low Confidence\""],["p",","]],
  [["w","    "],["pr","count"],["p",":"],["w"," "],["n","14"],["p",","]],
  [["w","    "],["pr","percentage"],["p",":"],["w"," "],["n","11"],["p",","]],
  [["w","    "],["pr","description"],["p",":"],["w"," "],["s","\"Need manual review due to uncertain patterns\""],["p",","]],
  [["w","    "],["pr","color"],["p",":"],["w"," "],["s","\"text-error\""],["p",","]],
  [["w","    "],["pr","bgColor"],["p",":"],["w"," "],["s","\"bg-error-bg\""],["p",","]],
  [["w","    "],["pr","icon"],["p",":"],["w"," "],["t","XCircle"],["p",","]],
  [["w","    "],["pr","progressColor"],["p",":"],["w"," "],["s","\"bg-error\""],["p",","]],
  [["w","    "],["pr","actionColor"],["p",":"],["w"," "],["s","\"text-error\""],["p",","]],
  [["w","  "],["p","},"]],
];

const classMap = {
  k: "token-keyword",
  i: "token-ident",
  p: "token-punct",
  pr: "token-prop",
  s: "token-string",
  n: "token-number",
  t: "token-type",
  w: "token-default",
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const padTop = 32;
const padLeft = 32;
const lineH = 26.1;
const fontSize = 18;
const lnW = 22;
const gap = 16;
const codeX = padLeft + lnW + gap;
const W = 720;
const H = 960;

const out = [];
out.push(`<?xml version="1.0" encoding="UTF-8"?>`);
out.push(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1920" viewBox="0 0 ${W} ${H}" overflow="hidden" xml:space="preserve" font-family="'Fira Code','JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace">`,
);
out.push(`  <title>code-classification-insights</title>`);
out.push(
  `  <desc>Code excerpt: classificationData from client/components/transactions/classification-insights.tsx (lines 5-38)</desc>`,
);
out.push(`  <style><![CDATA[
    .bg { fill: #011627; }
    .token-default  { fill: #d6deeb; }
    .token-keyword  { fill: #c792ea; }
    .token-string   { fill: #ecc48d; }
    .token-number   { fill: #f78c6c; }
    .token-ident    { fill: #82aaff; }
    .token-prop     { fill: #addb67; }
    .token-punct    { fill: #7fdbca; }
    .token-type     { fill: #ffcb8b; }
    .ln             { fill: #4b6479; }
    .watermark      { fill: #d6deeb; opacity: 0.6; }
    .code           { font-size: ${fontSize}px; }
    .meta           { font-size: 11px; }
  ]]></style>`);
out.push(`  <rect class="bg" x="0" y="0" width="${W}" height="${H}"/>`);
out.push(`  <g class="code" font-size="${fontSize}">`);

for (let i = 0; i < lines.length; i++) {
  const lineNo = 5 + i;
  const y = padTop + fontSize + i * lineH;
  out.push(
    `    <text class="ln" x="${padLeft + lnW}" y="${y}" text-anchor="end">${lineNo}</text>`,
  );
  const tspans = lines[i]
    .map(
      ([t, txt]) => `<tspan class="${classMap[t]}">${esc(txt)}</tspan>`,
    )
    .join("");
  out.push(
    `    <text class="src" x="${codeX}" y="${y}" data-line="${lineNo}">${tspans}</text>`,
  );
}

out.push(`  </g>`);
out.push(
  `  <text class="watermark meta" x="${padLeft}" y="${H - 16}">client/components/transactions/classification-insights.tsx</text>`,
);
out.push(`</svg>`);

fs.writeFileSync("code-classification-insights.svg", out.join("\n"));
console.log(
  "wrote code-classification-insights.svg",
  fs.statSync("code-classification-insights.svg").size,
  "bytes",
);
