// Deterministic Korean style checks that used to need a manual run of an external metrics script.
// Rules follow 489156/koreanRewriting quick-rules (C-11 connective-ending comma, E-2 repeated sentence endings).
// Pure functions over Markdown prose; callers decide severity.

// Person slots — only for work that is not computer work (operator rule, 2026-11-18):
//   [[판단: …]]  a decision only the person can make (identity, money, risk, approval)
//   [[현장: …]]  an act that needs the person's own identity or the physical world (a phone call, a photo)
//   [[직접 확인: …]] legacy spelling, treated as 현장
// Everything else — reading sources and captures, comparing, writing up the answer — is done by the AI.
export const SLOT_RE = /\[\[(판단|현장|직접 확인):([^\]]*)\]\]/g;
export const SLOT_LINE = /\[\[(?:판단|현장|직접 확인):/;
export const slotOwner = (kind) => (kind === '판단' ? '판단' : '현장');

/** Prose sentences of a Markdown body: skips tables, headings, images, list items with links, open [[slots]]. */
export function proseLines(body) {
  return body.split('\n')
    .map((l) => l.trim())
    .filter((t) => t && !/^(\||#|!\[|-\s.*\]\()/.test(t) && !SLOT_LINE.test(t))
    .map((t) => t.replace(/^>\s?/, '').replace(/\]\([^)]*\)/g, ']').replace(/\*\*/g, ''));
}

export function sentencesOf(body) {
  return proseLines(body).flatMap((t) => t.split(/(?<=[.!?])\s+/)).map((s) => s.trim()).filter((s) => s.length > 1);
}

// C-11: a comma right after a connective ending ("~이고, ", "~지만, ", "~라서, ") — 4.8x more frequent in AI text.
// Listing commas ("평일 18시 이후, 주말") and commas after nouns are not matched.
const CONNECTIVE_COMMA = /(?:[가-힣](?:고|며|으며|지만|면서|아서|어서|해서|라서|니까|는데|은데|인데|으나))\s?,(?=\s)/g;

export function connectiveCommas(body) {
  const hits = [];
  for (const s of sentencesOf(body)) for (const m of s.matchAll(CONNECTIVE_COMMA)) hits.push({ sentence: s, at: m[0] });
  return hits;
}

/** E-2: runs of 4+ consecutive sentences ending with the same last three characters (e.g. "입니다." ×4).
 *  A heading, table, image or list breaks the run — readers feel the rhythm within a passage, not across sections. */
export function repeatedEndings(body, run = 4) {
  const out = [];
  let ends = [];
  const flush = () => {
    let start = 0;
    for (let i = 1; i <= ends.length; i++) {
      if (i === ends.length || ends[i] !== ends[start]) {
        if (i - start >= run) out.push({ ending: ends[start], count: i - start });
        start = i;
      }
    }
    ends = [];
  };
  for (const raw of body.split('\n')) {
    const t = raw.trim();
    if (!t) continue; // blank lines between paragraphs keep the passage going
    if (/^(\||#|!\[|-\s|\d+\.\s)/.test(t) || SLOT_LINE.test(t)) { flush(); continue; }
    const prose = t.replace(/^>\s?/, '').replace(/\]\([^)]*\)/g, ']').replace(/\*\*/g, '');
    for (const sentence of prose.split(/(?<=[.!?])\s+/)) if (sentence.trim().length > 1) ends.push(sentence.trim().replace(/[.!?]+$/, '').slice(-3));
  }
  flush();
  return out;
}

// ---- Korean anti-slop detectors (adapted from .claude/skills/anti-slop-writing and humanizer) ----
// Each hit is a hypothesis, not a verdict (anti-slop "false-positive restraint"): callers report them as warnings and
// a reviewer keeps the sentence when the same or next sentence supplies the mechanism, number or source that earns it.
export const SLOP_KO = [
  { cat: '부정 병렬(Not just X but Y)', re: /(단순(한|히)|그저|단지)\s*[^.!?]{1,20}?(이|가)?\s*아니라|에\s*그치지\s*않(고|는다)|을\s*넘어(서)?\s|를\s*넘어(서)?\s/ },
  { cat: '부풀린 의미', re: /중요한\s*(역할|의미)|핵심(적인)?\s*역할|중요성을\s*(보여|강조|일깨|시사)|큰\s*의미|의미가\s*(크|깊)|획기적|혁신적|게임\s?체인저|패러다임|새로운\s*지평/ },
  { cat: '권위어·유행어', re: /극대화|시너지|인사이트|솔루션|탁월한|완벽한|압도적|독보적|차별화된/ },
  { cat: '무대 세우기(staging)', re: /(이것이|이게)\s*바로|비밀은\s|핵심은\s|중요한\s*(건|것은)\s|여기서\s*포인트|주목할\s*(점|만한\s*점)은|눈여겨볼\s*점은/ },
  { cat: '얼버무린 대칭', re: /\S+(이)?든\s+\S+(이)?든\s|누구에게나|모든\s*분(들)?(께|에게)/ },
  { cat: '공식형 맺음', re: /결론적으로|요약하자면|종합하(면|자면)|무엇보다(도)?\s*중요|앞으로(도)?\s*.{0,12}(기대|주목)(됩니다|됨|해\s*봅니다)/ },
  { cat: '빈 완충 표현', re: /(?<![달하가오보주])라고\s*할\s*수\s*있(습니다|다)|것으로\s*(보입니다|판단됩니다)|하는\s*것이\s*좋습니다/ },
  { cat: '대화 잔여물', re: /물론입니다|좋은\s*질문|궁금한\s*(점|사항)이\s*있으(시면|면)|더\s*알고\s*싶으시면/ },
];

/** Prose sentences that hit a Korean slop detector: [{ cat, sentence, at }]. */
export function slopPhrases(body) {
  const hits = [];
  for (const sentence of sentencesOf(body)) {
    for (const d of SLOP_KO) {
      const m = d.re.exec(sentence);
      if (m) hits.push({ cat: d.cat, sentence, at: m[0].trim() });
    }
  }
  return hits;
}
