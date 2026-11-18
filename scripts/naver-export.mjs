// Turns a Naver-ready post (docs/blog/naver/*.md) into a copy-paste HTML page for the Naver SmartEditor.
//   SITE_URL=https://your.domain node scripts/naver-export.mjs docs/blog/naver/01-battery-price.md [--out=naver-out]
//   node scripts/naver-export.mjs docs/blog/naver/*.md --preview      (placeholder domain, watermark, for review only)
//
// Why a script and not an API call: Naver has no blog write API and its terms forbid posting through automated
// means without permission (이용약관 2026-10-01, 게시물 운영정책 2026-07-07). A person pastes this output into the
// editor and publishes or schedules it there. The script only prepares the text.
//
// What it does:
//   1. Refuses to export a post that fails scripts/check-claims.mjs (unsourced number, stale date, banned phrase).
//   2. Resolves `site:/path?query#placement` links to SITE_URL + path with UTM tags
//      (utm_source=naver_blog, utm_medium=blog, utm_campaign=<slug>, utm_content=<placement>), and
//      `site:/` ledger sources likewise (without UTM), so the domain lives in one place.
//   3. Converts the small Markdown subset used in these posts to HTML and copies card images next to it.
//   4. Checks that every number printed on a card image (docs/blog/cards/cards.json) is in the post's ledger,
//      so the image and the text cannot drift apart.
//   5. Prints a layout report (title length, images, CTA count, tags) against the editorial limits.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDraft, numbersIn, parseDraft } from './check-claims.mjs';

const PLACEHOLDER = 'https://fixatlas.example';
export const LIMITS = { maxCta: 2, minImages: 3, maxImages: 6, maxTags: 10, maxTitle: 45 };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Resolve an internal `site:/...#placement` target to an absolute tracked URL. */
export function resolveSite(target, { origin, slug, utm = true }) {
  const m = /^site:(\/[^#]*)(?:#(.+))?$/.exec(target);
  if (!m) return target;
  const url = new URL(origin.replace(/\/$/, '') + m[1]);
  if (utm) {
    url.searchParams.set('utm_source', 'naver_blog');
    url.searchParams.set('utm_medium', 'blog');
    url.searchParams.set('utm_campaign', slug.slice(0, 80));
    url.searchParams.set('utm_content', (m[2] || 'body').slice(0, 80));
  }
  return url.toString();
}

/** Front-matter scalars other than the claims ledger (title, slug, tags ...). */
export function frontFields(front) {
  const out = {};
  for (const line of front.split('\n')) {
    const m = /^([a-z_]+):\s*(.+)$/.exec(line);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

function inline(text, ctx) {
  let s = esc(text);
  s = s.replace(/\[\[직접 확인:([^\]]*)\]\]/g, '<span class="human-slot">직접 확인 필요:$1</span>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, target) => {
    const raw = target.replace(/&amp;/g, '&');
    const aff = /^aff:[a-z-]+:(https:\/\/.+)$/.exec(raw);
    // affiliate URLs are used exactly as the program issued them (no UTM, no redirect: programs ban link tampering)
    const href = aff ? aff[1] : resolveSite(raw, ctx);
    if (/^https?:/.test(href)) ctx.links.push({ label, href, cta: /\/submit-repair/.test(href), affiliate: Boolean(aff) });
    if (aff) return `<a href="${esc(href)}" rel="sponsored nofollow">${label}</a>`;
    return `<a href="${esc(href)}">${label}</a>`;
  });
  return s;
}

/** Markdown subset → HTML: h2/h3, paragraphs, bold, links, lists, tables, blockquotes, hr, images, comments. */
export function mdToHtml(md, ctx) {
  const lines = md.replace(/<!--[\s\S]*?-->/g, '').split('\n');
  const html = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = /^(#{2,3})\s+(.*)$/.exec(line))) {
      const lvl = m[1].length;
      html.push(`<h${lvl}>${inline(m[2], ctx)}</h${lvl}>`); i++; continue;
    }
    if (/^#\s/.test(line)) { i++; continue; } // the title goes into the editor's title field, not the body
    if (/^---\s*$/.test(line)) { html.push('<hr>'); i++; continue; }
    if ((m = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(line))) {
      const [, alt, src] = m;
      if (src.startsWith('photo:')) {
        ctx.photos.push(alt);
        html.push(`<div class="photo-slot">직접 촬영 사진 자리 — ${esc(alt)}<br><small>${esc(src.slice(6))}</small></div>`);
      } else {
        ctx.images.push(src);
        html.push(`<figure><img src="${esc(`${ctx.slug}-${path.basename(src)}`)}" alt="${esc(alt)}"><figcaption>${esc(alt)}</figcaption></figure>`);
      }
      i++; continue;
    }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      html.push(`<blockquote>${buf.map((b) => inline(b, ctx)).join('<br>')}</blockquote>`);
      continue;
    }
    if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|\s*$/g, '').split('|').map((c) => c.trim());
      const [head, , ...body] = rows;
      ctx.tables.push(cells(head).length);
      html.push(`<table><thead><tr>${cells(head).map((c) => `<th>${inline(c, ctx)}</th>`).join('')}</tr></thead><tbody>${
        body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c, ctx)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }
    if (/^(-|\d+\.)\s/.test(line)) {
      const ordered = /^\d+\.\s/.test(line);
      const items = [];
      while (i < lines.length && /^(-|\d+\.)\s/.test(lines[i])) items.push(lines[i++].replace(/^(-|\d+\.)\s/, ''));
      const tag = ordered ? 'ol' : 'ul';
      html.push(`<${tag}>${items.map((it) => `<li>${inline(it, ctx)}</li>`).join('')}</${tag}>`);
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|---\s*$|!\[|>|\||-\s|\d+\.\s)/.test(lines[i])) para.push(lines[i++]);
    if (!para.length) { para.push(lines[i++]); }
    html.push(`<p>${para.map((p) => inline(p, ctx)).join('<br>')}</p>`);
  }
  return html.join('\n');
}

/** Build the export for one post. Throws with a readable message when the post must not be published. */
/** Numbers on the post's card images that the claims ledger does not cover (image/text drift). */
export function unsourcedCardNumbers(images, cards, claims) {
  const keys = new Set(); const digits = new Set();
  for (const c of claims) for (const n of numbersIn(c.value)) { keys.add(n.key); digits.add(n.digits); }
  const out = [];
  for (const img of images) {
    const card = cards.find((c) => c.id === path.basename(img, path.extname(img)));
    if (!card) continue;
    const text = Object.values(card).flat(2).filter((v) => typeof v === 'string').join(' / ');
    for (const n of numbersIn(text)) if (!keys.has(n.key) && !digits.has(n.digits)) out.push(`${card.id}: "${n.raw}"`);
  }
  return out;
}

export function exportPost(text, { origin, preview = false, today, cards = [] } = {}) {
  if (!origin) throw new Error('SITE_URL이 없습니다. 도메인을 확정한 뒤 SITE_URL=https://... 로 실행하세요 (검토용은 --preview).');
  if (!preview && /\.example(\/|$)/.test(new URL(origin).host + '/')) throw new Error(`임시 도메인(${origin})으로는 발행본을 만들 수 없습니다. --preview로 검토만 하세요.`);
  const check = checkDraft(text, { today });
  // A preview may still have the editor's in-person slots open; everything machine-checkable must pass.
  const HUMAN_ONLY = new Set(['human_slot', 'no_firsthand']);
  if (preview) check.problems = check.problems.filter((p) => !HUMAN_ONLY.has(p.type));
  if (check.problems.length) throw new Error(`신뢰성 점검 실패:\n${check.problems.map((p) => `  - [${p.type}] ${p.detail}`).join('\n')}`);

  const { front, body, claims } = parseDraft(text);
  const f = frontFields(front);
  if (!f.slug || !f.title) throw new Error('front matter에 slug와 title이 필요합니다.');
  const ctx = { origin, slug: f.slug, links: [], images: [], photos: [], tables: [] };
  const content = mdToHtml(body, ctx);
  const drift = unsourcedCardNumbers(ctx.images, cards, claims);
  if (drift.length) throw new Error(`카드 이미지 숫자가 출처 기록에 없습니다:\n${drift.map((d) => `  - ${d}`).join('\n')}`);
  const tags = (f.tags || '').split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
  const sources = claims.map((c) => ({ ...c, url: resolveSite(c.url, { ...ctx, utm: false }) }));

  const warnings = [];
  const ctas = ctx.links.filter((l) => l.cta).length;
  const imageTotal = ctx.images.length + ctx.photos.length;
  if (ctas > LIMITS.maxCta) warnings.push(`제보 CTA ${ctas}개 — 최대 ${LIMITS.maxCta}개`);
  if (imageTotal < LIMITS.minImages || imageTotal > LIMITS.maxImages) warnings.push(`이미지 ${imageTotal}장 — 권장 ${LIMITS.minImages}~${LIMITS.maxImages}장`);
  if (tags.length > LIMITS.maxTags) warnings.push(`태그 ${tags.length}개 — 최대 ${LIMITS.maxTags}개`);
  if ([...f.title].length > LIMITS.maxTitle) warnings.push(`제목 ${[...f.title].length}자 — ${LIMITS.maxTitle}자 이하 권장`);
  for (const n of ctx.tables) if (n > 3) warnings.push(`표 열 ${n}개 — 모바일에서는 3열 이하 권장`);

  return { slug: f.slug, title: f.title, demand: f.demand || '', tags, content, images: ctx.images, photos: ctx.photos, links: ctx.links, ctas, sources, warnings };
}

export function renderPage(post, { preview }) {
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(post.title)}</title>
<style>
  :root { --ink:#1f2937; --muted:#6b7280; --line:#e5e7eb; --accent:#2563eb; --warn:#b45309; --bg:#f9fafb; }
  body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.7 "Noto Sans KR", system-ui, sans-serif; }
  .wrap { max-width:720px; margin:0 auto; padding:16px; }
  .panel { background:#fff; border:1px solid var(--line); border-radius:12px; padding:16px; margin:16px 0; }
  .preview { background:#fef3c7; color:#92400e; padding:8px 12px; border-radius:8px; font-weight:700; }
  #post h2 { font-size:1.3rem; margin:2rem 0 .5rem; } #post h3 { font-size:1.1rem; margin:1.5rem 0 .4rem; }
  #post table { width:100%; border-collapse:collapse; margin:.75rem 0; font-size:.95rem; }
  #post th, #post td { border:1px solid var(--line); padding:6px 8px; text-align:left; vertical-align:top; }
  #post th { background:#f3f4f6; }
  #post blockquote { margin:1rem 0; padding:12px 14px; border-left:4px solid var(--accent); background:#eff6ff; }
  #post figure { margin:1rem 0; } #post img { max-width:100%; border-radius:8px; }
  #post figcaption { color:var(--muted); font-size:.85rem; }
  .human-slot { display:block; background:#fef2f2; border:2px dashed #e11d48; color:#9f1239; padding:10px 12px; border-radius:8px; }
  .photo-slot { border:2px dashed #d1d5db; border-radius:8px; padding:16px; color:var(--muted); margin:1rem 0; }
  a { color:var(--accent); } code { background:#f3f4f6; padding:1px 4px; border-radius:4px; }
  .muted { color:var(--muted); font-size:.9rem; }
</style></head><body><div class="wrap">
${preview ? '<p class="preview">미리보기 — 임시 도메인. 발행본은 SITE_URL을 지정해 다시 만드세요.</p>' : ''}
<div class="panel">
  <p class="muted">이 글의 수요자 (발행 전에 다시 읽고, 본문이 이 사람의 질문에 답하는지 확인)</p>
  <p><strong>${esc(post.demand)}</strong></p>
</div>
<div class="panel">
  <p class="muted">제목 칸에 붙여넣기 (${[...post.title].length}자)</p>
  <p><strong>${esc(post.title)}</strong></p>
  <p class="muted">태그 ${post.tags.length}개: ${post.tags.map((t) => `#${esc(t)}`).join(' ')}</p>
  <p class="muted">이미지 ${post.images.length}장 업로드 + 직접 촬영 ${post.photos.length}장 · 제보 링크 ${post.ctas}개 · 링크 ${post.links.length}개</p>
  ${post.warnings.length ? `<p class="preview">${post.warnings.map(esc).join('<br>')}</p>` : ''}
</div>
<article id="post" class="panel">
${post.content}
</article>
<div class="panel muted">
  <p><strong>에디터 입력 순서</strong> (붙여넣기 서식 유지는 계정·브라우저마다 다를 수 있어 첫 글은 반드시 모바일 미리보기로 확인)</p>
  <ol>
    <li>위 본문을 선택해 복사 → 스마트에디터 본문에 붙여넣기. 깨진 표는 에디터의 표 기능으로 다시 만듭니다.</li>
    <li>파란 박스(인용) 문단은 에디터의 인용구로 바꿉니다. 소제목은 굵게·크게 또는 소제목 스타일로 맞춥니다.</li>
    <li>이미지는 같은 폴더의 PNG(원문 캡처)를 표시된 자리에 업로드합니다. 첫 캡처나 직접 찍은 사진을 대표 이미지로 지정합니다.</li>
    <li>점선 박스는 직접 찍은 사진 자리입니다. 없으면 박스를 지우고 발행합니다(개인정보는 가립니다).</li>
    <li>태그를 입력하고, 발행 설정에서 예약 발행 시간을 지정합니다.</li>
  </ol>
</div>
</div></body></html>
`;
}

// ---- CLI ----
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v = 'true'] = a.slice(2).split('='); return [k, v]; }));
  const files = args.filter((a) => !a.startsWith('--'));
  if (!files.length) { console.error('usage: SITE_URL=https://... node scripts/naver-export.mjs <post.md...> [--out=naver-out] [--preview]'); process.exit(2); }
  const preview = opt.preview === 'true';
  const origin = process.env.SITE_URL || process.env.VITE_SITE_URL || (preview ? PLACEHOLDER : '');
  const outDir = opt.out || 'naver-out';
  let failed = 0;
  for (const file of files) {
    try {
      const cardsFile = path.resolve(path.dirname(file), '../cards/cards.json');
      const cards = fs.existsSync(cardsFile) ? JSON.parse(fs.readFileSync(cardsFile, 'utf8')) : [];
      const post = exportPost(fs.readFileSync(file, 'utf8'), { origin, preview, today: opt.today, cards });
      fs.mkdirSync(outDir, { recursive: true });
      for (const img of post.images) {
        const src = path.resolve(path.dirname(file), img);
        if (!fs.existsSync(src)) throw new Error(`이미지가 없습니다: ${src} (node scripts/render-cards.mjs 로 생성)`);
        fs.copyFileSync(src, path.join(outDir, `${post.slug}-${path.basename(img)}`)); // slug prefix: two posts may capture the same source page
      }
      const out = path.join(outDir, `${post.slug}.html`);
      fs.writeFileSync(out, renderPage(post, { preview }));
      console.log(`OK    ${file} → ${out}`);
      console.log(`      제목 ${[...post.title].length}자 · 이미지 ${post.images.length}+사진 ${post.photos.length} · 제보 링크 ${post.ctas} · 태그 ${post.tags.length} · 출처 ${post.sources.length}`);
      for (const w of post.warnings) console.log(`      ! ${w}`);
    } catch (e) {
      failed++;
      console.log(`FAIL  ${file}\n${String(e.message).replace(/^/gm, '      ')}`);
    }
  }
  process.exit(failed ? 1 : 0);
}
