---
name: fixatlas-anti-slop-ko
description: Use for every FixAtlas (수리기록) Korean text before it is shown to the operator or published — Naver blog
  drafts, repair guides, glossary entries, SNS cards, site copy, reports. Applies the anti-slop-writing doctrine and the
  humanizer pattern list to Korean, together with this repository's rules (demand sentence, formal register, no work-report
  sentences, verified numbers, verifiable case). Runs the deterministic checks first, then one judged review pass.
license: MIT
metadata:
  based_on: anti-slop-writing (github.com/adewale/anti-slop-writing), humanizer (github.com/blader/humanizer)
  project: FixAtlas — see CLAUDE.md, docs/blog/EDITORIAL_STANDARDS.md, docs/blog/LESSONS.md
---

# FixAtlas Korean anti-slop

Readers reject posts that look AI-written, unverified or easily made (operator, 2026-11-18). This skill is the last gate
before the operator sees a text. It does not replace the facts gate (`verify-sources`) or the demand gate (`demand:`).

## 1. Deterministic pass (always, AI work)

```bash
node scripts/check-claims.mjs docs/blog/naver/0*.md
```

- `slop_phrase` warnings come from the Korean detectors in `scripts/lib/korean-style.mjs` (`SLOP_KO`): 부정 병렬,
  부풀린 의미, 권위어·유행어, 무대 세우기, 얼버무린 대칭, 공식형 맺음, 빈 완충 표현, 대화 잔여물.
- A hit is a hypothesis. Keep the sentence when the same or next sentence supplies the number, source or mechanism that
  earns it (anti-slop "false-positive restraint"). Otherwise rewrite it with a concrete carrier.
- `work_report`, `connective_comma` (C-11), `repeated_ending` (E-2), `cliche`, `title_answer`, `dense_paragraph` are the
  older style rules; fix all of them before the judged pass.
- Optional metric: `python3 /home/user/koreanrewriting/scripts/prepare_monolith_input.py --run-dir <dir>` (koreanRewriting
  harness). It rated even pre-fix drafts low-risk (LESSONS §1), so treat it as a weak signal only.

## 2. Judged pass (one bounded pass per text)

Read `.claude/skills/anti-slop-writing/SKILL.md` (doctrine) and use these Korean equivalents of its detectors:

| Doctrine | Korean tells to look for | Fix |
|---|---|---|
| Sharp detail beats inflated significance | "중요한 역할", "큰 의미", "핵심은", "획기적" | Replace with the number, price, article or step that proves it |
| Negative parallelism / staccato contrast | "단순한 X가 아니라 Y", "X에 그치지 않고", short "A입니다. B입니다." pairs | Name the relation with 때문에·지만·면·므로 (hypotaxis) |
| Hedged symmetry | "누구에게나", "X든 Y든" addressing every reader | Commit to the reader in `demand:` and the named trade-off |
| Formulaic ending | "결론적으로", "앞으로 주목됩니다", generic last sentence | End on the concrete carrier: the cost table, the stop condition, the next action |
| Chat/draft leftovers (humanizer E) | "열어 대조했고", "이번 조사에서는 찾지 못했습니다", "물론입니다" | State the fact for the reader ("공개된 기준이 없습니다") or ask for reports |
| Formatting by rule (humanizer D) | Bold-label bullets, a table where two sentences would do | Use a table only for real comparisons (cost, symptoms, tiers) |
| Invention | A name, number or mechanism added to make a sentence sound concrete | Never invent. Add a `claims:` row with a source, or cut the sentence |

Output per text, in Korean:

```txt
판정: 유지 / 고침 / 작성자 확인 / 삭제
AI 티:
구체성 부족:
부풀린 주장:
흐름 끊김:
고친 문장:
고친 문장 점검: (위 탐지기를 고친 문장에도 적용했는가, 지어낸 사실은 없는가)
남길 한 줄:
```

## 3. Rules that override the generic skills

- Formal register (합니다체), 1–2 sentences per line, question-form headings that answer real queries (CLAUDE.md).
- Every number stays traceable to `claims:`; a rewrite must not change a number or a quoted phrase.
- Do not "fix" legal or quoted wording; quotes stay verbatim.
- Person slots (`[[판단]]`, `[[현장]]`) are untouched; everything else is AI work.
- After rewriting, run `check-claims` again and `verify-sources` if any ledger row changed.
