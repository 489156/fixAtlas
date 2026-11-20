// Live source check: opens every source URL in a draft's claim ledger and confirms that the recorded numbers and
// quoted phrases are actually on the page today. Optionally saves an annotated capture of each source as evidence
// that can be shown to readers (a dated screenshot of the official page instead of a template card).
//
//   NODE_PATH=$(npm root -g) node scripts/verify-sources.mjs docs/blog/naver/*.md [--evidence=docs/blog/evidence]
//
// Ledger row format (front matter `claims:`), 5th field optional:
//   - 28,000원 | https://www.lge.co.kr/support/rates-warranty-guide | 2026-11-18 | 평일 출장점검료 | 거리에 상관없이 동일하게
// - value  : numbers in it must appear on the page (comma or plain form)
// - quote  : a short verbatim phrase that must appear on the page (for policy statements without numbers)
// - note starting with "계산:" marks a derived number (our own arithmetic) — not expected on the page
// - note starting with "이미지:" marks numbers that exist only inside an image on the page (a chart or table
//   picture). Text matching cannot see them, so only the quote (an anchor text next to the image) is checked and
//   the row is reported as "이미지" — capture the image with "캡처:<name>@다음이미지" and check it by eye
// - site:/ sources are FixAtlas's own pages and are skipped here
// - a note containing "캡처:<name>" saves an outlined capture of that quote to <evidence>/<slug>/<name>.png;
//   add "클릭:<탭 이름>" when the quote sits in a tab or accordion that is closed by default
//
// Automation (so the editor does not repeat these by hand):
//   --write    rows that matched today get today's date; data_checked: and the body's "마지막 대조일은 …" are updated when
//              every web row matched. Image rows (이미지:) are read by the AI from the capture, which then dates the row.
//   --suggest  for numbers in the body that no row covers, search the post's source pages and print ready-to-paste rows
//   captures   are checked automatically (not dark, highlight present, phone-legible width) and retried once
//   stamp      <evidence>/<slug>/verify.json records when and how the post was last verified (read by blog-status)
// Pages are loaded with a normal headless Chromium (Playwright) when available, falling back to curl; PDF sources
// (e.g. law.go.kr annex files) are read with pdftotext.
// No user-agent spoofing and no attempt to get around blocks: a blocked page is reported as "확인 불가".
// robots.txt is read first (generic "*" group); a disallowed URL is never opened and is reported as "확인 불가".
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { numbersIn, parseDraft, unsourcedNumbers } from './check-claims.mjs';

const norm = (s) => s.replace(/\s+/g, ' ').trim();

/** Which of a claim's numbers / quote are present in the page text. Pure; unit-tested. */
export function matchClaim(claim, pageText) {
  // join "28,000 원" / "24.9 %" so a figure and its unit compare as one token
  const text = norm(pageText).replace(/(\d)\s+(?=[%원년건개월회명배])/g, '$1');
  const plain = text.replace(/,/g, '');
  const missing = [];
  if (!/^(계산|이미지):/.test(claim.note || '')) {
    for (const n of numbersIn(claim.value)) {
      const unit = n.key.slice(n.digits.length);
      const withCommas = Number(n.digits).toLocaleString('en-US', { maximumFractionDigits: 6 });
      const candidates = [`${withCommas}${unit}`, `${n.digits}${unit}`];
      // a bare figure is only distinctive when it is long or has decimals; "1" alone would match anything
      if (!unit || n.digits.length >= 4 || n.digits.includes('.')) candidates.push(withCommas, n.digits);
      const ok = candidates.some((c) => text.includes(c) || plain.includes(c.replace(/,/g, '')));
      if (!ok) missing.push(n.raw);
    }
  }
  if (claim.quote && !text.includes(norm(claim.quote))) missing.push(`"${claim.quote}"`);
  return missing;
}

async function loadBrowser() {
  // Local install first, then the global one — so nobody has to remember NODE_PATH=$(npm root -g).
  const roots = [import.meta.url];
  try {
    const { execSync } = await import('node:child_process');
    roots.push(path.join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'noop.js'));
  } catch { /* npm missing: local only */ }
  for (const root of roots) {
    try {
      const { chromium } = createRequire(root)('playwright');
      return await chromium.launch();
    } catch { /* try the next root */ }
  }
  console.log('  (Playwright 없음 — 캡처 없이 원문 텍스트만 대조합니다)');
  return null;
}

/** Plain HTTP fallback via curl (honours the environment's proxy and CA settings; default curl user agent). */
async function fetchHtml(url) {
  const { execFile } = await import('node:child_process');
  const os = await import('node:os');
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'vs-')), 'src.bin');
  await new Promise((resolve, reject) => {
    execFile('curl', ['-sS', '-L', '-m', '60', '--fail', '-o', tmp, url], (err, _o, stderr) => (err ? reject(new Error((stderr || err.message).trim().slice(0, 120))) : resolve()));
  });
  const head = fs.readFileSync(tmp).subarray(0, 5).toString('latin1');
  if (head === '%PDF-') {
    // official annexes (e.g. law.go.kr 별표) are PDFs: extract text with poppler's pdftotext
    return new Promise((resolve, reject) => {
      execFile('pdftotext', [tmp, '-'], { maxBuffer: 50 * 1024 * 1024 }, (err, stdout) => (err ? reject(new Error('PDF text extraction failed (install poppler-utils)')) : resolve({ pdf: stdout })));
    });
  }
  return fs.readFileSync(tmp, 'utf8');
}

const htmlToText = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&rsquo;|&lsquo;/g, "'");

/**
 * robots.txt rules for the generic agent ("User-agent: *"): does this path stay allowed? Longest match wins and Allow
 * beats Disallow on a tie (RFC 9309); "*" and "$" are honoured. Pure; unit-tested.
 * This tool sends no custom user agent, so only the "*" group applies to it.
 */
export function robotsAllows(robotsTxt, pathAndQuery) {
  const groups = [];
  let cur = null, lastWasAgent = false;
  for (const raw of String(robotsTxt || '').split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1].toLowerCase(), val = m[2].trim();
    if (key === 'user-agent') {
      if (!lastWasAgent || !cur) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(val.toLowerCase()); lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (cur && (key === 'allow' || key === 'disallow')) cur.rules.push({ allow: key === 'allow', pat: val });
    }
  }
  const rules = groups.filter((g) => g.agents.includes('*')).flatMap((g) => g.rules).filter((r) => r.pat !== '');
  let best = null;
  for (const r of rules) {
    const re = new RegExp('^' + r.pat.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
    if (!re.test(pathAndQuery)) continue;
    const len = r.pat.replace(/[*$]/g, '').length;
    if (!best || len > best.len || (len === best.len && r.allow)) best = { len, allow: r.allow };
  }
  return best ? best.allow : true;
}

const robotsCache = new Map();
/** Fetches and caches a host's robots.txt. 401/403/5xx or no answer = treat the host as closed; 404 = open. */
async function robotsAllowed(url) {
  const u = new URL(url);
  if (!robotsCache.has(u.origin)) {
    const { execFile } = await import('node:child_process');
    const get = () => new Promise((resolve) => {
      execFile('curl', ['-sS', '-L', '-m', '20', '-w', '\n%{http_code}', `${u.origin}/robots.txt`], { maxBuffer: 5 * 1024 * 1024 }, (err, stdout) => {
        if (err) return resolve(null);
        const i = stdout.lastIndexOf('\n'); const code = Number(stdout.slice(i + 1));
        if (code >= 200 && code < 300) return resolve(stdout.slice(0, i));
        resolve(code >= 400 && code < 500 && code !== 401 && code !== 403 ? '' : null);
      });
    });
    let txt = await get();
    if (txt === null) { await new Promise((r) => setTimeout(r, 3000)); txt = await get(); } // one retry: a flaky fetch is not a "closed" signal
    robotsCache.set(u.origin, txt);
  }
  const txt = robotsCache.get(u.origin);
  return txt !== null && robotsAllows(txt, u.pathname + u.search);
}

/** Returns { text, via, page? } — page is kept open for evidence capture when the browser path worked. */
async function openSource(browser, url) {
  if (!(await robotsAllowed(url))) throw new Error('robots.txt가 이 주소의 자동 조회를 막습니다 — 다른 1차 자료로 바꾸세요');
  if (browser && !/flDownload|\.pdf(\?|$)/i.test(url)) {
    const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 }); // phone-width layout at 2x: captures stay legible on phones
    try {
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      if (res && res.ok()) return { text: await page.evaluate(() => document.body.textContent || ''), via: 'browser', page };
    } catch { /* fall through to curl */ }
    await page.close();
  }
  const html = await fetchHtml(url);
  if (typeof html === 'object' && html.pdf) return { text: html.pdf, via: 'pdf' }; // no page to capture
  if (!browser) return { text: htmlToText(html), via: 'curl' };
  // Render the HTML the server sent to curl so it can still be captured as evidence (styles may be missing).
  const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
  await page.setContent(html.replace(/<head([^>]*)>/i, `<head$1><base href="${url}">`), { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  return { text: htmlToText(html), via: 'curl', page };
}

/** Where a number appears in a page text: a short snippet for a suggested ledger row, or null. Pure; unit-tested. */
export function findNumberSnippet(n, pageText) {
  const text = norm(pageText);
  const unit = n.key.slice(n.digits.length);
  const withCommas = Number(n.digits).toLocaleString('en-US', { maximumFractionDigits: 6 });
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const c of [`${withCommas}${unit}`, `${withCommas} ${unit}`.trim(), withCommas, n.digits]) {
    if (c.length < 3 && !unit) continue;
    // the figure must not be the tail of a longer number ("24시간" is not "4시간")
    const m = new RegExp(`(?<![\\d,.])${esc(c)}`).exec(text);
    if (m) return text.slice(Math.max(0, m.index - 18), m.index + c.length + 12).trim();
  }
  return null;
}

/** Rewrite the ledger: matched rows get `today`; data_checked follows when all web rows matched. Pure; unit-tested. */
export function refreshLedgerDates(text, matchedKeys, today, allMatched) {
  const rowKey = (value, url, quote) => `${value}|${url}|${quote}`;
  let out = text.replace(/^(\s+-\s)(.+)$/gm, (line, lead, rest) => {
    const parts = rest.split('|').map((x) => x.trim());
    if (parts.length < 3 || !matchedKeys.has(rowKey(parts[0], parts[1], parts[4] ?? ''))) return line;
    const cells = rest.split('|');
    cells[2] = cells[2].replace(/\d{4}-\d{2}-\d{2}/, today);
    return lead + cells.join('|');
  });
  // the reader-facing "마지막 대조일은 YYYY-MM-DD" in the method line follows data_checked — a dated computer check, not a person's slot
  if (allMatched) out = out.replace(/^data_checked:.*$/m, `data_checked: ${today}`).replace(/마지막 대조일은 \d{4}-\d{2}-\d{2}/g, `마지막 대조일은 ${today}`);
  return out;
}
export const claimKey = (c) => `${c.value}|${c.url}|${c.quote || ''}`;

/** Capture quality gate from pixel statistics. Pure; unit-tested. */
export function captureQA({ mean, redRatio, width, clipped = false, broken = false }) {
  const reasons = [];
  if (broken) reasons.push('이미지가 로드되지 않았습니다(깨진 이미지 아이콘) — 그래프·표 수치가 보이지 않음');
  if (clipped) reasons.push('대상이 화면 폭을 넘어 일부가 잘렸습니다 — 표·그래프의 오른쪽 숫자가 빠졌을 수 있음');
  if (mean < 90) reasons.push(`화면이 어둡습니다(평균 밝기 ${Math.round(mean)}) — 팝업 덮개가 찍혔을 수 있음`);
  if (redRatio < 0.0015) reasons.push('강조 테두리가 보이지 않습니다 — 엉뚱한 영역이 찍혔을 수 있음');
  if (width < 800) reasons.push(`폭 ${width}px — 휴대폰에서 글자가 너무 작음(800px 이상 필요)`);
  return { ok: reasons.length === 0, reasons };
}

async function imageStats(browser, file) {
  const page = await browser.newPage();
  try {
    await page.setContent(`<img id="i" src="data:image/png;base64,${fs.readFileSync(file).toString('base64')}">`);
    return await page.evaluate(async () => {
      const img = document.getElementById('i');
      await img.decode();
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let sum = 0; let red = 0; const n = d.length / 4;
      for (let i = 0; i < d.length; i += 4) {
        sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        if (d[i] > 190 && d[i + 1] < 90 && d[i + 2] < 120) red++;
      }
      return { mean: sum / n, redRatio: red / n, width: c.width };
    });
  } finally { await page.close(); }
}

const KST = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', dateStyle: 'short', timeStyle: 'short' }).format(new Date());

/** Capture the part of the page that shows `needle`, outlined, with a caption bar naming the source and time. */
async function captureEvidence(browser, page, url, needle, outFile, nextImage = false) {
  // images in pages rendered from curl'd HTML load late; wait (max 8 s) so their size is known
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0
    : new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); setTimeout(r, 8000); }))))).catch(() => {});
  const box = await page.evaluate(([needle, nextImage]) => {
    // sites with CSS scroll-behavior: smooth animate scrollIntoView, so positions read right after it are stale
    document.documentElement.style.scrollBehavior = 'auto';
    if (document.body) document.body.style.scrollBehavior = 'auto';
    const all = [...document.querySelectorAll('body *')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (el.textContent || '').replace(/\s+/g, ' ').includes(needle);
    });
    // several elements can carry the same text (a hidden mobile menu, a cart summary, the real price): try them
    // smallest-first and keep the first one a reader would actually see
    const cands = all.sort((a, b) => (a.textContent || '').length - (b.textContent || '').length).slice(0, 10);
    for (const el of cands) {
    let target = el.closest('tr, li, dd, p, section') || el;
    if (nextImage) {
      // the first sizeable image that comes after the anchor text in document order
      const img = [...document.querySelectorAll('img')].find((im) => (im.getBoundingClientRect().width > 300 || im.naturalWidth > 300)
        && (el.compareDocumentPosition(im) & Node.DOCUMENT_POSITION_FOLLOWING));
      if (!img) continue;
      target = img;
    }
    target.scrollIntoView({ block: 'center', behavior: 'instant' });
    // wide tables/charts overflow a phone viewport and get cut off on the right: shrink the target to the screen width,
    // then scroll it into view horizontally. Anything still outside the viewport is reported as clipped.
    const vw = innerWidth - 16;
    let r0 = target.getBoundingClientRect();
    if (r0.width > vw || r0.right > innerWidth || r0.left < 0) {
      const imgs = target.tagName === 'IMG' ? [target] : [...target.querySelectorAll('img')];
      for (const im of imgs) { im.style.maxWidth = `${vw}px`; im.style.height = 'auto'; }
      // text that does not wrap (nowrap/pre blocks, e.g. law.go.kr ruling summaries): make it wrap first — shrinking
      // it would leave unreadable text. Only tables and images that still overflow are scaled down.
      if (target.tagName !== 'IMG') {
        for (const el of [target, ...target.querySelectorAll('*')]) {
          if (['TABLE', 'IMG', 'SVG', 'CANVAS'].includes(el.tagName) || el.closest('table')) continue;
          el.style.whiteSpace = 'normal'; el.style.overflowWrap = 'anywhere'; el.style.maxWidth = '100%'; el.style.width = 'auto';
        }
        target.style.maxWidth = `${vw}px`;
      }
      r0 = target.getBoundingClientRect();
      if (r0.width > vw) target.style.zoom = String(vw / r0.width);
      target.scrollIntoView({ block: 'center', inline: 'start', behavior: 'instant' });
      r0 = target.getBoundingClientRect();
      if (r0.left < 0 || r0.right > innerWidth) window.scrollBy(r0.left - 8, 0);
    }
    // hide layers that sit on top of the content (pop-up dims, sticky headers, chat buttons) — content is untouched
    for (const x of document.querySelectorAll('body *')) {
      const pos = getComputedStyle(x).position;
      if (pos === 'fixed' || pos === 'sticky') x.style.visibility = 'hidden';
    }
    // only one highlight per capture: clear outlines and phrase boxes left by an earlier capture of the same page
    document.querySelectorAll('[data-fx-overlay]').forEach((x) => x.remove());
    document.querySelectorAll('[data-fx-target]').forEach((x) => x.removeAttribute('data-fx-target'));
    target.setAttribute('data-fx-target', '1');
    document.querySelectorAll('[data-fx-outline]').forEach((x) => { x.style.outline = ''; x.removeAttribute('data-fx-outline'); });
    // a block taller than the screen (a court ruling, a long policy paragraph) would be cropped around its middle and
    // the quoted phrase could fall outside the picture: box the phrase itself and centre the capture on it
    if (!nextImage && target.getBoundingClientRect().height > innerHeight * 0.6) {
      const nodes = []; let text = '';
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) { nodes.push([n, text.length]); text += n.textContent; }
      const at = text.indexOf(needle);
      if (at >= 0) {
        const locate = (pos) => { let i = nodes.length - 1; while (i > 0 && nodes[i][1] > pos) i--; return [nodes[i][0], pos - nodes[i][1]]; };
        const range = document.createRange();
        range.setStart(...locate(at)); range.setEnd(...locate(at + needle.length));
        // wrap the phrase in an inline mark so the outline moves with the text if the page reflows (fonts, lazy images)
        let mark = null;
        try { mark = document.createElement('span'); mark.setAttribute('data-fx-outline', '1'); range.surroundContents(mark); } catch { mark = null; }
        const anchor = mark || range.startContainer.parentElement;
        target.removeAttribute('data-fx-target'); anchor.setAttribute('data-fx-target', '1');
        anchor.scrollIntoView({ block: 'center', behavior: 'instant' });
        if (mark) { mark.style.outline = '3px solid #e11d48'; mark.style.outlineOffset = '3px'; }
        const q = (mark || range).getBoundingClientRect();
        if (q.width && q.height && q.top >= 0 && q.bottom <= innerHeight) {
          if (!mark) { // phrase crosses elements: fall back to a positioned box
            const box = document.createElement('div');
            box.setAttribute('data-fx-overlay', '1');
            Object.assign(box.style, { position: 'absolute', left: `${q.left + scrollX - 6}px`, top: `${q.top + scrollY - 6}px`,
              width: `${q.width + 12}px`, height: `${q.height + 12}px`, border: '3px solid #e11d48', zIndex: '2147483647', pointerEvents: 'none' });
            document.body.appendChild(box);
          }
          return { x: q.left - 6, y: q.top - 6, w: q.width + 12, h: q.height + 12, clipped: false };
        }
      }
    }
    target.setAttribute('data-fx-outline', '1');
    target.style.outline = '3px solid #e11d48';
    target.style.outlineOffset = '4px';
    const r = target.getBoundingClientRect();
    // refuse to capture something the reader would not see (e.g. text inside a closed tab)
    const hit = document.elementFromPoint(Math.min(r.x + r.width / 2, innerWidth - 1), Math.min(Math.max(r.y + 4, 0), innerHeight - 1));
    if (!r.width || !r.height || !hit || !(target.contains(hit) || hit.contains(target))) {
      target.style.outline = ''; target.removeAttribute('data-fx-outline');
      continue; // hidden or covered: try the next candidate
    }
    // an image that failed to load renders as a broken-image icon inside a perfectly bright, outlined box
    const broken = target.tagName === 'IMG' && !(target.complete && target.naturalWidth > 0);
    return { x: r.x, y: r.y, w: r.width, h: r.height, clipped: r.left < -1 || r.right > innerWidth + 1, broken };
    }
    return null;
  }, [needle, nextImage]);
  await page.waitForTimeout(300); // lazy images
  if (!box) return false;
  // the page can reflow while it settles (late images, banners collapsing): read the target's position again now,
  // so the crop follows the highlighted text instead of where it was a moment ago
  const settled = await page.evaluate(() => {
    const t = document.querySelector('[data-fx-target]');
    if (!t) return null;
    t.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = t.getBoundingClientRect();
    return r.width && r.height ? { x: r.x - (t.matches('span[data-fx-outline]') ? 6 : 0), y: r.y - (t.matches('span[data-fx-outline]') ? 6 : 0), w: r.width + (t.matches('span[data-fx-outline]') ? 12 : 0), h: r.height + (t.matches('span[data-fx-outline]') ? 12 : 0) } : null;
  }).catch(() => null);
  if (settled) Object.assign(box, settled);
  // full phone-width crop (reads like a phone screenshot), with a little context above and below the target
  const padY = 70;
  const vp = page.viewportSize();
  const clip = { x: 0, y: Math.max(0, box.y - padY), width: vp.width, height: 0 };
  clip.height = Math.min(vp.height - clip.y, box.h + padY * 2);
  const shot = await page.screenshot({ clip });
  const u = new URL(url);
  const framed = await browser.newPage({ viewport: { width: Math.round(clip.width), height: 200 }, deviceScaleFactor: 2 });
  await framed.setContent(`<!doctype html><meta charset="utf-8"><body style="margin:0;font:15px/1.4 'Noto Sans KR',sans-serif">
    <img src="data:image/png;base64,${shot.toString('base64')}" style="display:block;width:100%">
    <div style="background:#111827;color:#f9fafb;padding:8px 12px;font-size:14px;word-break:break-all">원문 캡처 ${KST()} · ${u.host}${u.pathname}</div></body>`);
  const height = await framed.evaluate(() => document.body.scrollHeight);
  await framed.setViewportSize({ width: Math.round(clip.width), height });
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  await framed.screenshot({ path: outFile, fullPage: true });
  await framed.close();
  return { clipped: box.clipped, broken: box.broken };
}

// ---- CLI ----
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v = 'true'] = a.slice(2).split('='); return [k, v]; }));
  const files = args.filter((a) => !a.startsWith('--'));
  if (!files.length) { console.error('usage: node scripts/verify-sources.mjs <post.md...> [--evidence=dir] [--write] [--suggest] [--report=file]'); process.exit(2); }
  let browser = await loadBrowser();
  let bad = 0;
  const report = [];
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const { claims, front } = parseDraft(original);
    const matched = new Set();
    const pageTexts = new Map();
    let fileBad = 0;
    let webRows = 0;
    const qaFails = [];
    const slug = (/^slug:\s*(.+)$/m.exec(front) || [])[1] || path.basename(file, '.md');
    console.log(`\n${file}`);
    const byUrl = new Map();
    for (const c of claims) if (/^https:\/\//.test(c.url)) byUrl.set(c.url, [...(byUrl.get(c.url) || []), c]);
    for (const [url, rows] of byUrl) {
      let src;
      try { src = await openSource(browser, url); } catch (e0) {
        // a crashed headless browser takes every later page with it: relaunch once and retry this page
        let e = e0;
        if (browser && /has been closed|Target closed|disposeBrowserContext|Browser closed/i.test(e0.message)) {
          await browser.close().catch(() => {});
          browser = await loadBrowser();
          try { src = await openSource(browser, url); e = null; } catch (e1) { e = e1; }
        }
        if (!e) { /* recovered */ } else {
        bad += rows.length; fileBad += rows.length; webRows += rows.length;
        console.log(`  확인 불가  ${url} (${e.message}) → 주소를 고치거나 같은 내용의 다른 원문(PDF·보도자료)을 찾아 바꿀 것`);
        report.push({ file, url, status: 'unreachable', error: e.message });
        continue;
        }
      }
      pageTexts.set(url, src.text);
      for (const c of rows) {
        webRows++;
        const missing = matchClaim(c, src.text);
        const status = missing.length ? 'mismatch' : /^계산:/.test(c.note) ? 'derived' : /^이미지:/.test(c.note) ? 'image' : 'ok';
        if (status === 'mismatch') { bad++; fileBad++; }
        if (status === 'ok' || status === 'derived') matched.add(claimKey(c)); // image rows need eyes: their date is not auto-refreshed
        console.log(`  ${{ ok: '일치', derived: '계산값', image: '이미지(캡처 판독 필요)', mismatch: '불일치' }[status]}  ${c.value}${c.quote ? ` / "${c.quote}"` : ''}${missing.length ? `  → 페이지에 없음: ${missing.join(', ')}` : ''}  [${src.via}]`);
        report.push({ file, url, value: c.value, quote: c.quote || '', status, missing, via: src.via });
      }
      if (opt.evidence && src.page) {
        // rows whose note carries "캡처:<name>" are captured to <evidence>/<slug>/<name>.png, highlighting the quote
        for (const r of rows) {
          const [, name, nextImg] = /캡처:([A-Za-z0-9_-]+)(@다음이미지)?/.exec(r.note) || [];
          if (!name) continue;
          const needle = r.quote || numbersIn(r.value)[0]?.raw.replace(/\s/g, '');
          const out = path.join(opt.evidence, slug, `${name}.png`);
          // "클릭:<탭 이름>" opens a tab/accordion first (content that is in the page but not shown by default)
          const tab = (/클릭:(\S+)/.exec(r.note) || [])[1];
          if (tab) await src.page.getByText(tab, { exact: true }).filter({ visible: true }).first().click({ timeout: 8000 }).then(() => src.page.waitForTimeout(800)).catch(() => {});
          let ok = needle && await captureEvidence(browser, src.page, url, needle, out, Boolean(nextImg));
          let qa = ok ? captureQA({ ...(await imageStats(browser, out)), clipped: ok.clipped, broken: ok.broken }) : null;
          if (ok && !qa.ok) { // flaky pages (late pop-ups, lazy images): one retry before failing
            await src.page.waitForTimeout(1500);
            ok = await captureEvidence(browser, src.page, url, needle, out, Boolean(nextImg));
            qa = ok ? captureQA({ ...(await imageStats(browser, out)), clipped: ok.clipped, broken: ok.broken }) : null;
          }
          if (!ok) { console.log(`  캡처 실패  ${name} ("${needle}"를 화면에서 찾지 못함)`); qaFails.push(name); }
          else if (!qa.ok) { console.log(`  캡처 품질 불합격  ${out}\n     - ${qa.reasons.join('\n     - ')}`); qaFails.push(name); }
          else console.log(`  캡처 저장  ${out}  (자동 검사 통과)`);
        }
      }
      await src.page?.close();
    }
    bad += qaFails.length;
    // --suggest: numbers in the body with no ledger row → look them up in this post's source pages
    if (opt.suggest) {
      const loose = unsourcedNumbers(original);
      for (const n of loose) {
        const hits = [...pageTexts].map(([url, text]) => [url, findNumberSnippet(n, text)]).filter(([, snip]) => snip);
        if (!hits.length) { console.log(`  제안 없음  "${n.raw}" — 출처 페이지에서 찾지 못했습니다(계산값이면 비고를 "계산:"으로)`); continue; }
        for (const [url, snip] of hits.slice(0, 2)) console.log(`  제안  - ${n.raw} | ${url} | ${today} | (설명) | ${snip}`);
      }
    }
    // --write: refresh dates of rows that matched today
    if (opt.write && matched.size) {
      const allMatched = fileBad === 0 && matched.size === claims.filter((c) => /^https:\/\//.test(c.url) && !/^이미지:/.test(c.note)).length;
      fs.writeFileSync(file, refreshLedgerDates(original, matched, today, allMatched));
      console.log(`  확인일 갱신  ${matched.size}행 → ${today}${allMatched ? ' (data_checked 포함)' : ''}`);
    }
    // stamp for blog-status
    const slug2 = (/^slug:\s*(.+)$/m.exec(front) || [])[1] || path.basename(file, '.md');
    const stampDir = path.join(opt.evidence || 'docs/blog/evidence', slug2);
    fs.mkdirSync(stampDir, { recursive: true });
    fs.writeFileSync(path.join(stampDir, 'verify.json'), JSON.stringify({ checked_at: KST(), date: today, web_rows: webRows, matched: matched.size, image_rows: claims.filter((c) => /^https:\/\//.test(c.url) && /^이미지:/.test(c.note || '')).length, problems: fileBad, capture_failures: qaFails }, null, 2) + '\n');
  }
  await browser?.close();
  if (opt.report) fs.writeFileSync(opt.report, JSON.stringify({ checked_at: KST(), report }, null, 2));
  console.log(bad ? `\n불일치·확인 불가 ${bad}건 — 원문을 열어 숫자와 문구를 고친 뒤 다시 실행하세요.` : '\n모든 출처 기록이 원문과 일치합니다.');
  process.exit(bad ? 1 : 0);
}
