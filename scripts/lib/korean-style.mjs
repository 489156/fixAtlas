// Deterministic Korean style checks that used to need a manual run of an external metrics script.
// Rules follow 489156/koreanRewriting quick-rules (C-11 connective-ending comma, E-2 repeated sentence endings).
// Pure functions over Markdown prose; callers decide severity.

/** Prose sentences of a Markdown body: skips tables, headings, images, list items with links, open [[slots]]. */
export function proseLines(body) {
  return body.split('\n')
    .map((l) => l.trim())
    .filter((t) => t && !/^(\||#|!\[|-\s.*\]\()/.test(t) && !/\[\[직접 확인:/.test(t))
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
    if (/^(\||#|!\[|-\s|\d+\.\s)/.test(t) || /\[\[직접 확인:/.test(t)) { flush(); continue; }
    const prose = t.replace(/^>\s?/, '').replace(/\]\([^)]*\)/g, ']').replace(/\*\*/g, '');
    for (const sentence of prose.split(/(?<=[.!?])\s+/)) if (sentence.trim().length > 1) ends.push(sentence.trim().replace(/[.!?]+$/, '').slice(-3));
  }
  flush();
  return out;
}
