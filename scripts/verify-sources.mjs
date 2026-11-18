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
// - a note containing "캡처:<name>" saves an outlined capture of that quote to <evidence>/<slug>/<name>.png
//
// Pages are loaded with a normal headless Chromium (Playwright) when available, falling back to curl.
// No user-agent spoofing and no attempt to get around blocks: a blocked page is reported as "확인 불가".
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { numbersIn, parseDraft } from './check-claims.mjs';

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
  try {
    const require = createRequire(import.meta.url);
    const { chromium } = require('playwright');
    return await chromium.launch();
  } catch {
    return null; // Playwright not installed: fetch-only mode
  }
}

/** Plain HTTP fallback via curl (honours the environment's proxy and CA settings; default curl user agent). */
async function fetchHtml(url) {
  const { execFile } = await import('node:child_process');
  return new Promise((resolve, reject) => {
    execFile('curl', ['-sS', '-L', '-m', '40', '--fail', url], { maxBuffer: 20 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) reject(new Error((stderr || err.message).trim().slice(0, 120)));
      else resolve(stdout);
    });
  });
}

const htmlToText = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&rsquo;|&lsquo;/g, "'");

/** Returns { text, via, page? } — page is kept open for evidence capture when the browser path worked. */
async function openSource(browser, url) {
  if (browser) {
    const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 }); // phone-width layout at 2x: captures stay legible on phones
    try {
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      if (res && res.ok()) return { text: await page.evaluate(() => document.body.textContent || ''), via: 'browser', page };
    } catch { /* fall through to curl */ }
    await page.close();
  }
  const html = await fetchHtml(url);
  if (!browser) return { text: htmlToText(html), via: 'curl' };
  // Render the HTML the server sent to curl so it can still be captured as evidence (styles may be missing).
  const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
  await page.setContent(html.replace(/<head([^>]*)>/i, `<head$1><base href="${url}">`), { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  return { text: htmlToText(html), via: 'curl', page };
}

const KST = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', dateStyle: 'short', timeStyle: 'short' }).format(new Date());

/** Capture the part of the page that shows `needle`, outlined, with a caption bar naming the source and time. */
async function captureEvidence(browser, page, url, needle, outFile, nextImage = false) {
  // images in pages rendered from curl'd HTML load late; wait (max 8 s) so their size is known
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0
    : new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); setTimeout(r, 8000); }))))).catch(() => {});
  const box = await page.evaluate(([needle, nextImage]) => {
    const all = [...document.querySelectorAll('body *')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (el.textContent || '').replace(/\s+/g, ' ').includes(needle);
    });
    const el = all.sort((a, b) => (a.textContent || '').length - (b.textContent || '').length)[0];
    if (!el) return null;
    let target = el.closest('tr, li, dd, p, section') || el;
    if (nextImage) {
      // the first sizeable image that comes after the anchor text in document order
      const img = [...document.querySelectorAll('img')].find((im) => (im.getBoundingClientRect().width > 300 || im.naturalWidth > 300)
        && (el.compareDocumentPosition(im) & Node.DOCUMENT_POSITION_FOLLOWING));
      if (!img) return null;
      target = img;
    }
    target.scrollIntoView({ block: 'center' });
    // hide layers that sit on top of the content (pop-up dims, sticky headers, chat buttons) — content is untouched
    for (const x of document.querySelectorAll('body *')) {
      const pos = getComputedStyle(x).position;
      if (pos === 'fixed' || pos === 'sticky') x.style.visibility = 'hidden';
    }
    // only one highlight per capture: clear outlines left by an earlier capture of the same page
    document.querySelectorAll('[data-fx-outline]').forEach((x) => { x.style.outline = ''; x.removeAttribute('data-fx-outline'); });
    target.setAttribute('data-fx-outline', '1');
    target.style.outline = '3px solid #e11d48';
    target.style.outlineOffset = '4px';
    const r = target.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, [needle, nextImage]);
  await page.waitForTimeout(300); // lazy images
  if (!box) return false;
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
  return true;
}

// ---- CLI ----
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v = 'true'] = a.slice(2).split('='); return [k, v]; }));
  const files = args.filter((a) => !a.startsWith('--'));
  if (!files.length) { console.error('usage: node scripts/verify-sources.mjs <post.md...> [--evidence=dir]'); process.exit(2); }
  const browser = await loadBrowser();
  let bad = 0;
  const report = [];
  for (const file of files) {
    const { claims, front } = parseDraft(fs.readFileSync(file, 'utf8'));
    const slug = (/^slug:\s*(.+)$/m.exec(front) || [])[1] || path.basename(file, '.md');
    console.log(`\n${file}`);
    const byUrl = new Map();
    for (const c of claims) if (/^https:\/\//.test(c.url)) byUrl.set(c.url, [...(byUrl.get(c.url) || []), c]);
    for (const [url, rows] of byUrl) {
      let src;
      try { src = await openSource(browser, url); } catch (e) {
        bad += rows.length;
        console.log(`  확인 불가  ${url} (${e.message}) → 사람이 직접 열어 확인`);
        report.push({ file, url, status: 'unreachable', error: e.message });
        continue;
      }
      for (const c of rows) {
        const missing = matchClaim(c, src.text);
        const status = missing.length ? 'mismatch' : /^계산:/.test(c.note) ? 'derived' : /^이미지:/.test(c.note) ? 'image' : 'ok';
        if (status === 'mismatch') bad++;
        console.log(`  ${{ ok: '일치', derived: '계산값', image: '이미지(캡처로 눈 확인)', mismatch: '불일치' }[status]}  ${c.value}${c.quote ? ` / "${c.quote}"` : ''}${missing.length ? `  → 페이지에 없음: ${missing.join(', ')}` : ''}  [${src.via}]`);
        report.push({ file, url, value: c.value, quote: c.quote || '', status, missing, via: src.via });
      }
      if (opt.evidence && src.page) {
        // rows whose note carries "캡처:<name>" are captured to <evidence>/<slug>/<name>.png, highlighting the quote
        for (const r of rows) {
          const [, name, nextImg] = /캡처:([A-Za-z0-9_-]+)(@다음이미지)?/.exec(r.note) || [];
          if (!name) continue;
          const needle = r.quote || numbersIn(r.value)[0]?.raw.replace(/\s/g, '');
          const out = path.join(opt.evidence, slug, `${name}.png`);
          const ok = needle && await captureEvidence(browser, src.page, url, needle, out, Boolean(nextImg));
          console.log(ok ? `  캡처 저장  ${out}` : `  캡처 실패  ${name} ("${needle}"를 화면에서 찾지 못함)`);
        }
      }
      await src.page?.close();
    }
  }
  await browser?.close();
  if (opt.report) fs.writeFileSync(opt.report, JSON.stringify({ checked_at: KST(), report }, null, 2));
  console.log(bad ? `\n불일치·확인 불가 ${bad}건 — 원문을 열어 숫자와 문구를 고친 뒤 다시 실행하세요.` : '\n모든 출처 기록이 원문과 일치합니다.');
  process.exit(bad ? 1 : 0);
}
