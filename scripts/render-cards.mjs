// Renders blog/SNS summary cards (1080x1080 PNG) from docs/blog/cards/cards.json using headless Chromium.
//   node scripts/render-cards.mjs [cards.json] [outDir]
// Requires Playwright (`npm i -D playwright` or a global install). Cards contain only source-verified figures;
// every card shows its source and check date so the image never travels without them (SNS reuse).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const specPath = process.argv[2] ?? path.join(root, 'docs/blog/cards/cards.json');
const outDir = process.argv[3] ?? path.dirname(specPath);
let chromium;
try { ({ chromium } = createRequire(import.meta.url)('playwright')); }
catch { console.error('Playwright is required: npm i -D playwright'); process.exit(2); }

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function html(card) {
  const body = card.kind === 'summary'
    ? `<table>${card.rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table>
       ${card.note ? `<p class="note">${esc(card.note)}</p>` : ''}`
    : `<ol>${card.items.map((i) => {
          const [head, ...rest] = String(i).split(' — ');
          return `<li><b>${esc(head)}</b>${rest.length ? `<span>${esc(rest.join(' — '))}</span>` : ''}</li>`;
        }).join('')}</ol>
       ${card.safety ? `<p class="safety">⚠ ${esc(card.safety)}</p>` : ''}`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0}
  body{width:1080px;height:1080px;font-family:'Noto Sans KR',sans-serif;background:#fff;color:#111827;
       display:flex;flex-direction:column;padding:72px 76px 56px;}
  .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:40px}
  .brand{font-weight:900;font-size:30px;color:#2563eb;letter-spacing:-0.5px}
  .chip{font-size:24px;font-weight:500;color:#374151;border:2px solid #d1d5db;border-radius:999px;padding:8px 20px}
  .eyebrow{font-size:34px;font-weight:700;color:#2563eb;margin-bottom:12px}
  h1{font-size:62px;font-weight:900;letter-spacing:-1.5px;line-height:1.15;margin-bottom:44px}
  table{width:100%;border-collapse:collapse;font-size:36px}
  th{text-align:left;font-weight:500;color:#374151;padding:22px 0;border-bottom:2px solid #e5e7eb;width:58%;line-height:1.3}
  td{text-align:right;font-weight:900;padding:22px 0;border-bottom:2px solid #e5e7eb;letter-spacing:-0.5px}
  ol{list-style:none;padding:0;counter-reset:n}
  li{counter-increment:n;display:flex;flex-direction:column;gap:6px;padding:20px 0 20px 76px;position:relative;border-bottom:2px solid #e5e7eb}
  li::before{content:counter(n);position:absolute;left:0;top:20px;width:52px;height:52px;border-radius:50%;background:#2563eb;color:#fff;
             font-weight:900;font-size:30px;display:flex;align-items:center;justify-content:center}
  li b{font-size:38px;font-weight:900;letter-spacing:-0.5px}
  li span{font-size:30px;color:#374151;line-height:1.35}
  .note{margin-top:26px;font-size:28px;color:#4b5563;line-height:1.4}
  .safety{margin-top:28px;font-size:30px;font-weight:700;color:#991b1b;background:#fef2f2;border:2px solid #fca5a5;border-radius:16px;padding:18px 24px}
  .foot{margin-top:auto;padding-top:28px;font-size:24px;color:#6b7280;display:flex;justify-content:space-between;gap:24px;line-height:1.35}
  .foot b{color:#111827;font-weight:700;white-space:nowrap}
  body.dense h1{font-size:54px;margin-bottom:30px}
  body.dense li{padding:14px 0 14px 70px}
  body.dense li::before{top:14px;width:48px;height:48px;font-size:28px}
  body.dense li b{font-size:33px}
  body.dense li span{font-size:27px}
  body.dense .safety{margin-top:20px;font-size:28px;padding:14px 20px}
</style></head><body class="${(card.items?.length ?? 0) > 3 || (card.rows?.length ?? 0) > 5 ? 'dense' : ''}">
  <div class="top"><span class="brand">고장도감 FixAtlas</span><span class="chip">광고·제휴 없음</span></div>
  <div class="eyebrow">${esc(card.eyebrow)}</div>
  <h1>${esc(card.title)}</h1>
  ${body}
  <div class="foot"><span>${esc(card.source)}</span><b>${esc(card.asof)}</b></div>
</body></html>`;
}

const cards = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
for (const card of cards) {
  await page.setContent(html(card), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() => document.body.scrollHeight > 1080);
  const file = path.join(outDir, `${card.id}.png`);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  console.log(`${overflow ? 'WARN overflow' : 'ok'}  ${path.relative(root, file)}`);
}
await browser.close();
