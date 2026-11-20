// Renders blog/SNS summary cards (1080x1080 PNG) from docs/blog/cards/cards.json using headless Chromium.
//   node scripts/render-cards.mjs [cards.json] [outDir]
// Requires Playwright (`npm i -D playwright` or a global install). Cards contain only source-verified figures;
// every card shows its source and check date so the image never travels without them (SNS reuse).
// Kinds: summary | checklist (SNS cards) | thumb (blog thumbnail: question + one big verified number + a strip of the
// official-page capture that shows that number, so the click hook and its evidence travel together).
// `chip` is per card (e.g. "광고·제휴 없음"); omit it when the post's disclosure may change (affiliate links).
// thumb options: evidenceY = pixels (at 1080 width) to skip from the top of the capture so the strip starts on a
// clean line and shows only the highlighted figure; evidenceHeight = strip height (default 270).
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

const dataUri = (file) => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;

function thumbHtml(card, specDir) {
  const ev = card.evidence ? dataUri(path.resolve(specDir, card.evidence)) : '';
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700;900&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0}
  body{width:1080px;height:1080px;font-family:'Noto Sans KR',sans-serif;background:#fff;color:#111827;display:flex;flex-direction:column}
  .head{padding:64px 72px 0}
  .brand{font-weight:900;font-size:28px;color:#2563eb;margin-bottom:26px}
  h1{font-size:76px;font-weight:900;letter-spacing:-2px;line-height:1.12;white-space:pre-line}
  .num{padding:34px 72px 0}
  .label{font-size:36px;font-weight:700;color:#374151;margin-bottom:4px}
  .big{font-size:164px;font-weight:900;letter-spacing:-5px;line-height:1;color:#dc2626}
  .sub{font-size:36px;font-weight:700;color:#111827;margin-top:14px}
  .evlabel{margin-top:auto;background:#111827;color:#fff;font-size:28px;font-weight:700;padding:12px 72px}
  .ev{position:relative;height:${card.evidenceHeight ?? 270}px;overflow:hidden}
  .ev img{width:100%;position:absolute;left:0;${card.evidenceY != null ? `top:${-card.evidenceY}px` : 'top:50%;transform:translateY(-50%)'}}
</style></head><body>
  <div class="head"><div class="brand">수리기록</div><h1>${esc(card.title)}</h1></div>
  <div class="num"><div class="label">${esc(card.label)}</div><div class="big">${esc(card.big)}</div>${card.sub ? `<div class="sub">${esc(card.sub)}</div>` : ''}</div>
  ${ev ? `<div class="evlabel">${esc(card.evidenceLabel)}</div><div class="ev"><img src="${ev}"></div>` : ''}
</body></html>`;
}

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
  <div class="top"><span class="brand">수리기록</span>${card.chip ? `<span class="chip">${esc(card.chip)}</span>` : ''}</div>
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
  await page.setContent(card.kind === 'thumb' ? thumbHtml(card, path.dirname(specPath)) : html(card), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() => document.body.scrollHeight > 1080);
  const file = path.join(outDir, `${card.id}.png`);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  console.log(`${overflow ? 'WARN overflow' : 'ok'}  ${path.relative(root, file)}`);
}
await browser.close();
