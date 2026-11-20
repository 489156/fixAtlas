# Project skills (.claude/skills)

Claude Code loads every skill in this folder for sessions in this repository: their descriptions are always in context
and the full text loads when a task matches. Selected on 2026-11-20 from the operator's skill bundle for this project's
purpose — verified, demand-first Korean repair-cost content and the FixAtlas service plan. Files are copied unchanged
except that test fixtures (`evals/`) were left out. All are MIT-licensed; sources are in each SKILL.md `metadata`.

| Skill | Source | Used for in FixAtlas |
|---|---|---|
| fixatlas-anti-slop-ko | this repository | Korean anti-slop gate for every post, guide, glossary entry and report (wraps the two below) |
| anti-slop-writing | adewale/anti-slop-writing | Doctrine: concrete detail over inflated significance, relation over rhythm, no invented facts |
| humanizer | blader/humanizer | Pattern list (staging, rhythm by rule, inflation, formatting by rule, chat leftovers) |
| copy-editing | coreyhaines31/marketingskills | Sweep-based editing of titles, thumbnails, site copy |
| verification-before-completion | obra/superpowers | No "done/passes" claim without a fresh command run (matches verify-sources, npm test) |
| content-strategy | coreyhaines31/marketingskills | Topic priority by search demand (with demand-research volumes) |
| ai-seo | coreyhaines31/marketingskills | Being cited in AI answers (GEO) for the site's canonical pages |
| schema | coreyhaines31/marketingskills | JSON-LD for prerendered guide and glossary pages |
| strategy-red-team | phuryn/pm-skills | Attack the plan's load-bearing assumptions (e.g. tool affiliate, posting order) |
| thinking-steel-manning | tjboudreaux/cc-thinking-skills | Strongest opposing case before agreeing or rejecting (anti-sycophancy) |
| thinking-second-order | tjboudreaux/cc-thinking-skills | Downstream effects, e.g. affiliate incentives pushing "do it yourself" verdicts |
| identify-assumptions-new | phuryn/pm-skills | Risky assumptions for new service lines (guides, glossary, tools) |
| market-sizing | phuryn/pm-skills | TAM/SAM/SOM with labelled assumptions |
| value-proposition | phuryn/pm-skills | Positioning: self-repair, labour cost, estimates |

Not adopted: `brainstorming` (forces itself before every creative task), `programmatic-seo` (template page sets conflict
with the no-template-repetition rule), UI design skills (hallmark, impeccable, unslop), `prompt-master`, `security-audit`,
and marketing skills for channels this project does not run (ads, email, SMS, app store, paywalls, sales).
