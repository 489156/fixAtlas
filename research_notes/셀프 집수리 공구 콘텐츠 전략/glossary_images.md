# Glossary design for appliance, furniture and tool terms (공구·가전·가구 용어사전): entry template, naming, seed list, image licensing, SEO/GEO

Research date: 2026-11-19 (KST). Access notes:
- namu.wiki robots.txt allows `/w/` for all user agents. Live pages still returned HTTP 403 with `cf-mitigated: challenge`, a Cloudflare bot challenge. I did not try to get past it.
- I read namu.wiki content through the third-party mirror namu.moe, whose robots.txt is `Allow: /`. That copy may differ from the live revision.
- stdict.korean.go.kr disallows `/search/` in robots.txt, so I fetched no dictionary entries. Lowe's and the hankyung.com column returned 403.
- Google autocomplete came from the public `suggestqueries.google.com` endpoint (client=firefox, hl=ko) on 2026-11-19. It shows which phrasings exist and what people ask. It does not show search volume.

## Q1. The two namu.wiki references: structure, coverage, tone, beginner usefulness, licence

### Takeaway
The namu.wiki impact driver page explains how the tool works and how it differs from related tools. It has no step-by-step usage, no images in the mirrored text, no repair context and no sources for its numbers. namu.wiki text is under CC BY-NC-SA 2.0 KR, which forbids commercial (영리) use and requires derivatives to carry the same licence. FixAtlas has affiliate revenue, so it should copy neither namu text nor namu images. Use namu only as a map of topics.

### Cited Findings
- **Access.** namu.wiki robots.txt (`User-agent: *`) has `Disallow: /` with `Allow: /w/`, so article pages may be crawled. A plain request to the impact driver page still returned `HTTP/2 403`, `cf-mitigated: challenge`, `server: cloudflare` on 2026-11-19. — [namu.wiki robots.txt](https://namu.wiki/robots.txt)
- **Impact driver page structure (mirror, last edited 2026-10-03 10:22:11).** The table of contents has four sections only: 1. 개요, 2. 사용법, 3. 작동 원리, 4. 렌치 vs 드라이버 vs 드릴. — [namu.moe mirror of 임팩트 드라이버](https://namu.moe/w/%EC%9E%84%ED%8C%A9%ED%8A%B8%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B2%84)
  - The operator described sections such as 종류, 주의 and 브랜드. They do not appear as headings in this mirrored revision. Either the live page differs or those topics sit inside other sections. This is unresolved; see Gaps.
- **개요.** The page calls the tool an electric screwdriver that stores rotational energy and releases it in short bursts, so it delivers more torque than the motor alone would. — same mirror
- **사용법.** This section is not a procedure. It says:
  - The chuck takes a 1/4-inch (6.35 mm) hex bit.
  - Bolt work needs socket adapters, which can break under high torque.
  - Impact wrenches deliver about 100–200 Nm. No source is given for this figure.
  - A drill driver can outperform an impact driver for ordinary work, because the impact driver's rated torque is a momentary impact figure.
  - Drivers and wrenches have about four speed/torque settings, while drill driver clutches have up to about 20.
  — same mirror
- **작동 원리.** When resistance passes a threshold, an internal mechanism strikes in the direction of rotation. Running past peak torque wastes energy and causes overheating and wear. — same mirror
- **Comparison section.** It compares five tools: impact driver, impact wrench, "impact drill" (which the page calls a misnomer), hammer drill and drill driver. It says the drill driver uses a clutch instead of an impact mechanism. Its conclusion is that the choice depends on preference and owning all of them is ideal. — same mirror
- **Safety content.** The warnings are scattered rather than gathered in one section:
  - Use impact-rated bits; ordinary bits can deform or snap.
  - Socket adapters can fail.
  - Overrunning past peak torque causes overheating.
  - Finish impact-wrench work with a torque wrench.
  - A footnote warns that keyless chucks can loosen.
  — same mirror
- **Brands, tone, images.**
  - The only brand mentioned is Bosch, in a footnote about Bosch selling a hammer drill labelled "임팩트 드릴".
  - The tone is mostly neutral and encyclopedic, with occasional casual words such as "막작업".
  - The mirrored text has no content images or captions.
  — same mirror
- **Category page 분류:공구 (mirror, last edited 2026-06-29 08:49:47).**
  - 10 subcategories: 건설 기계, 건설기계, 공구 제조사, 기계 요소, 도끼, 망치, 자귀, 톱, 파일/공구, 항공정비사 작업형.
  - About 123 member pages, counted by the fetch tool (the page states no total).
  - Pages are grouped by Korean initial (ㄱ, ㄴ …). There is no intro beyond a template line.
  — [namu.moe mirror of 분류:공구](https://namu.moe/w/%EB%B6%84%EB%A5%98:%EA%B3%B5%EA%B5%AC)
- **Category page titles.**
  - Standard or descriptive titles: 쇠지렛대 (not 빠루), 플라이어 (not 펜치/뺀치), 스크루드라이버, 드라이버, 육각렌치, 래칫 렌치, 토크 렌치.
  - Colloquial or loan-word titles also appear: 몽키스패너, 니퍼, 깔깔이, 칼브럭, 타카, 헤라(도구), 시노(공구).
  - The category also mixes in non-tool items such as 딱풀, 물풀, 쿠나이 and 스위스 아미 나이프.
  — same mirror
- **Licence wording.** The mirrored footer reads: "이 저작물은 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 2.0 대한민국 라이선스에 따라 이용할 수 있습니다." — [namu.moe mirror](https://namu.moe/w/%EC%9E%84%ED%8C%A9%ED%8A%B8%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B2%84)
- **Images on namu.wiki.** namu.wiki policy, as quoted in search snippets, says text is CC BY-NC-SA 2.0 KR by default but inserted images may carry separate licences. — [namu.moe 나무위키:기본방침](https://namu.moe/w/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%3A%EA%B8%B0%EB%B3%B8%EB%B0%A9%EC%B9%A8) (search snippet; the page itself was not fetched)
- **What NC means in the KR licence.** The CC BY-NC-SA 2.0 KR deed says "이 저작물은 영리 목적으로 이용할 수 없습니다." CC also notes that 2.0 KR is an old version and recommends 4.0 for new licensing. — [CC BY-NC-SA 2.0 KR deed (ko)](https://creativecommons.org/licenses/by-nc-sa/2.0/kr/deed.ko) (seen via search snippet)
- **Getting commercial rights.** Under CC licences, the rights holder can separately permit commercial use despite NC. The search found no namu.wiki procedure for granting commercial permission. — [CC BY-NC-SA 2.0 KR](https://creativecommons.org/licenses/by-nc-sa/2.0/kr/) (search summary)

### Inferences
- **What the page does well for a beginner:**
  - It explains the mechanism (impact versus clutch).
  - It warns about bit type (1/4-inch hex, impact-rated bits).
  - It separates five tools that people confuse.
  - These match real search intent. Google autocomplete for "임팩트 드라이버" offers "드릴 차이", "사용법", "렌치 차이", "해머 드릴 차이" and "비트" (see Q3).
- **What it does poorly for someone doing a specific repair:**
  - No ordered steps (fit bit → choose mode/speed → grip and pressure → start slow → stop at seating).
  - No photos showing the collet, mode switch or forward/reverse switch.
  - No "which repairs need it" mapping, such as furniture assembly, wall anchors or loosening a seized screw.
  - No price band and no sources for its numbers (for example "100–200 Nm").
  - Mixed register, and it ends on "owning all of them is ideal", which does not help a buying decision.
- **Licence consequences for FixAtlas.** The site and Naver blog carry affiliate links, so reuse would be commercial.
  - Copying namu text or its images (whose licences vary) would breach NC.
  - ShareAlike would force any adapted glossary text under BY-NC-SA.
  - Treat namu as a topic and term-variant map only. Write original text and cite primary sources (manufacturer manuals and spec sheets, standards, 국립국어원). This is also required by the existing rule that every number is checked against an original.
- **The category page as a checklist, not a seed list.** It shows which tool names Korean readers already treat as headwords (쇠지렛대, 플라이어, 몽키스패너, 칼브럭, 깔깔이, 헤라). It is noisy, with knives, glue and construction machinery, and has no repair framing.

### Gaps
- The live namu.wiki revision could not be read (Cloudflare challenge), so I could not confirm the 종류/주의/브랜드 sections the operator described. Verification [판단]: decide whether a person may open the page in a normal browser. If allowed, [AI] compares the headings against this note using a screenshot.
- I found no published namu.wiki procedure for commercial licensing. Verification [AI]: read 나무위키:기본방침 and the 라이선스 page on the live site if access is allowed. Whether to ask permission is [판단], though not recommended.

## Q2. Benchmarks: iFixit, Home Depot / Lowe's, manufacturers, Wikipedia — which entry structure helps people use a tool

### Takeaway
The structures that best help people use a tool are task-first. iFixit puts difficulty, time, tools and parts before the steps, then gives one photo per step with typed callouts (Note, Reminder, Caution). Retail buying guides centre on "X vs Y", when to use each, bit and accessory compatibility, the specs to compare, and basic safety. Manufacturer pages provide the spec vocabulary, but their own sources disagree on numbers, which supports per-claim source checks.

### Cited Findings
- **iFixit guide details.** Each guide has a Details section listing tools, parts, prerequisites and time required, "important information that they need before starting a procedure". — [iFixit Help: Guide Details](https://www.ifixit.com/Help/Guide_Details); [iFixit: Parts of a Guide Page](https://about.ifixit.com/Wiki/Parts_of_a_Guide_Page) (search snippets)
- **iFixit difficulty.** Authors pick a level. "Easy" means minimal disassembly and common tools; "Difficult" means specialty tools or skills such as soldering. — [iFixit edu: Add Guide Details](https://edu.ifixit.com/add-guide-details) (search snippet)
- **iFixit tools versus parts.** Tools are items you keep after the job; parts are consumed or replaced. — same source
- **iFixit steps.** Steps should be clear, complete sentences, each with a photo or photos showing the step, and watermarks are not allowed. Review checklists ask whether color-coded and special bullets (Note, Reminder, Caution) are used properly. — [iFixit edu: milestone 3 checklist](https://edu.ifixit.com/milestone-3-checklist); [iFixit Repair Guide FAQ](https://www.ifixit.com/Info/Repair_Guide_FAQ) (search snippets)
- **iFixit licence.**
  - All iFixit content is CC BY-NC-SA 3.0. Use inside a paid product needs a licence (legal@ifixit.com).
  - The licensing page says using iFixit data to train an ML/AI model violates its terms.
  - Journalists may use up to three attributed photos per story.
  — [iFixit Content Licensing](https://www.ifixit.com/Info/Licensing) (search snippet)
- **Retail guide content (Home Depot "Impact Drivers vs. Drills", Lowe's guides, Do it Best).**
  - Impact drivers add hammer-like pulses and have no clutch.
  - They take hex-shank bits in a quick-change collet, so standard round drill bits do not fit, and non-impact-rated bits can snap.
  - They can bore holes, but the holes come out irregular; use a drill for clean holes.
  - Guides suggest owning both, often as a combo kit on one battery platform.
  - Safety tips: follow the manufacturer's instructions, wear eye protection, and keep fingers clear of the chuck or collet.
  — [Home Depot: Impact Drivers vs. Drills](https://www.homedepot.com/c/ab/impact-drivers-vs.-drills/9ba683603be9fa5395fab9009f66e37); [Lowe's: Impact Driver vs Drill](https://lowes.com/n/buying-guide/impact-driver-vs-drill); [Do it Best: Impact Driver vs Drill](https://www.doitbest.com/global/ideas/buying-guides/impact-driver-vs-drill/)
  - These points come from search-tool summaries. The Home Depot page returned mostly navigation text, and Lowe's returned 403 to the fetch tool, so section order was not verified.
- **Bosch spec vocabulary and inconsistent numbers.** For the Bosch GDR 18V-215:
  - The official datasheet gives 215 Nm maximum torque and 0–2,100 rpm no-load speed.
  - A product page gives 3,300 rpm and 0–3,800 bpm.
  - The GDR 18V-200 is listed at 3,400 rpm and 200 N·m.
  — [Bosch Professional GDR 18V-215](https://www.bosch-professional.com/qa/en/products/gdr-18v-215-06019N2020); [Farnell datasheet](https://www.farnell.com/datasheets/3270303.pdf) (search summary; numbers [unverified], see Gaps)

### Inferences
- **A glossary entry that helps people use the tool combines three patterns:**
  - iFixit's pre-flight block: difficulty, time, tools, consumables, prerequisites, safety.
  - The retail "vs" and "when to use" block.
  - A spec-decoding block that explains manufacturer terms in plain Korean and says which matter for home repair: 최대 체결 토크 (Nm), 무부하 회전수 (rpm), 타격수 (bpm/ipm), 전압 (V), 브러시리스, 속도 단수, 1/4인치 육각 생크.
- **iFixit's typed callouts map onto the FixAtlas house style.** 참고 = Note, 확인 = Reminder, 주의 = Caution.
- **The Bosch rpm mismatch** (datasheet versus product page) is a concrete case for the existing rule. Any spec number in a glossary entry should cite one named document and its check date, never "about".
- **iFixit is a structural model only.** It is NC-licensed and bans AI training on its data, so FixAtlas must not reuse its photos or text.

### Gaps
- Wikipedia's "Impact driver" and Korean Wikipedia tool pages were not fetched. [AI] can fetch en.wikipedia.org/wiki/Impact_driver (robots allow `/wiki/`) to compare section structure.
- Makita Korea and Bosch Korea (bosch-professional.com/kr) Korean spec labels were not fetched, so the Korean spec terms above are [unverified]. Path: [AI] fetches one Korean product page per brand and records the exact Korean labels.
- GDR 18V-215 rpm and bpm values are [unverified]. Path: [AI] reads the current datasheet PDF and product page and records both with dates.
- The exact iFixit bullet colors were not confirmed. This does not matter for FixAtlas.

## Q3. Korean naming: Japanese-derived workshop slang vs standard forms, 국립국어원 and KS, and what people actually search

### Takeaway
People search in three registers:
- Slang plus a request for the "proper name": 빠루 정식 명칭, 빠루 우리말, 깔깔이 렌치 정식 명칭.
- Common loan forms: 펜치, 몽키스패너, 임팩드라이버.
- Slang inside compound queries: 칼블럭 기리, 콘크리트 기리 사이즈, 함마드릴 기리.

The dictionary-correct form is sometimes nearly invisible in search (배척) or swamped by other meanings (멍키스패너 → a novel; 니퍼 → a baseball player). So each entry should pair a headword with an alias list, choosing the headword per term from both the dictionary and search evidence. The 표준국어대사전 forms and KS tool-standard numbers could not be confirmed this session.

### Cited Findings
- **Origin of 빠루.** A 1995 국립국어연구원 article on Japanese influence lists 빠루(bar) among workshop terms that entered Korean through Japanese. — [국립국어원 새국어생활 1995-2 특집](https://www.korean.go.kr/nkview/nklife/1995_2/5_7.html) (search snippet)
- **빠루 in the dictionary.** A 한국경제 생글생글 column (2019) says the Japanese clipped "bar" to バール, which became 빠루 in Korean, and that 빠루, the nail-pulling lever, is not in the dictionary. The page returned 403 to the fetch tool. — [한국경제 생글생글 2019-05](https://sgsg.hankyung.com/article/2019051010441) (search snippet)
- **Wiki claims on standard forms.** A wiki page (thewiki.kr) says the precise standard word for 쇠지렛대 is 배척 or 쇠지레, but workers mostly say 빠루. It also describes 플라이어 as "흔히 펜치 또는 쁘라야". This is not an authoritative source. — [thewiki.kr 공구](https://thewiki.kr/w/공구) (search snippet)
- **Scale of 국립국어원 respellings.** 국립국어원's 일본어 투 용어 순화 자료집 contains 1,171 Japanese-style terms. Search found no 국립국어원 page that sets an official replacement for 빠루 or 펜치. — [프레시안](https://pressian.com/pages/articles/48642) (search snippet)
- **KS standards.** Searches of standard.go.kr and kssn.net results found no KS standard number for 펜치, 플라이어 or 몽키(멍키) 렌치. Results showed unrelated KS B standards (for example KS B 0845). — [e-나라표준인증 KS 검색](https://www.standard.go.kr/KSCI/standardIntro/getStandardSearchView.do?ksNo=KSB1543); [KSSN KS 목록](https://www.kssn.net/ks/kslist.do)
- **Google autocomplete, 2026-11-19.** All from the [Google suggest endpoint](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&q=%EB%B9%A0%EB%A3%A8):
  - **빠루:** "빠루 영어로", "빠루 뜻", "빠루망치", "빠루 가격", "빠루 정식 명칭", "빠루 우리말".
  - **배척:** only the social sense ("배척하다 영어로", "배척 뜻"). "배척 공구" returns no suggestions.
  - **쇠지렛대:** "쇠지렛대 용도", "쇠지렛대 빠루", "쇠지렛대 원리", "쇠지렛대 사용법".
  - **뺀치:** "뺀치 니퍼", "뺀치 뜻". "뻰치" returns 펜치 suggestions.
  - **펜치:** "펜치 니퍼 차이", "펜치 종류", "펜치 플라이어".
  - **몽키스패너:** "사용법", "규격", "사이즈", "없을때", "다이소", "추천", "유래".
  - **멍키스패너:** dominated by the novel 멍키스패너 by 진형민 ("소설", "줄거리", "기출문제").
  - **니빠:** no tool sense (suggestions turn to 이빨). "니빠 공구" returns nothing.
  - **니퍼:** dominated by the baseball player 니퍼트; "니퍼 영어로" appears.
  - **기리:** alone it has no tool sense. Compounds do: "기리 사이즈" → "콘크리트 기리 사이즈", "칼블럭 기리 사이즈", "탭 기리 사이즈"; "칼블럭 기리"; "함마드릴 기리".
  - **드릴비트:** "종류", "규격", "빼는법", "사이즈", "다이소".
  - **구루프 / 구르프:** a hair curler ("구르프 마는법"), not a tool.
  - **도라이바:** dominated by a TV show.
  - **깔깔이 렌치:** "사용법", "명칭", "정식 명칭".
  - **라쳇렌치:** "사용법", "깔깔이", "방향", "규격".
  - **임팩트 드라이버:** "드릴 차이", "추천", "사용법", "렌치 차이", "해머 드릴 차이", "비트", "용도".
  - **임팩드라이버** (colloquial): "전동드라이버 차이", "비트", "임팩렌치 차이", "복스알", "사용법".
  - **함마드릴:** "기리", "비트", "노미", "척".
  - **해머드릴:** "임팩드릴 차이", "사용법", "대여".
  - **오함마:** "뜻", "무게".
  - **앙카:** "앙카볼트", "앙카드릴".
  - **앵커볼트:** construction-engineering suggestions ("매입공법", "연단거리").
  - **칼블럭:** "박는법", "기리", "빼는법", "피스", "앙카 차이".
  - **석고보드 앙카:** "사용법", "하중", "박는 법", "종류".
  - **헤라 공구:** "헤라 공구 영어", "플라스틱 헤라 공구". "스크래퍼" offers "스크래퍼 헤라".
  - **No suggestions:** 토크스 드라이버, 몰리 앵커, 토글 앵커, 노루발 망치.

### Inferences
- **Choose the headword per term with three rules:**
  - (a) Use the 표준국어대사전 form or established loan spelling where it is also searched: 펜치, 니퍼, 드릴 비트, 쇠지렛대, 라쳇 렌치, 칼블럭.
  - (b) If the standard form is barely searched or ambiguous, use the most-searched form and put the standard form in the first sentence. Examples: "몽키 스패너(표준 표기 멍키 스패너)" if the dictionary confirms 멍키; "쇠지렛대(빠루, 배척)".
  - (c) Never use slang alone as the headword (빠루, 뺀치, 니빠, 기리, 도라이바, 깔깔이). Put slang in "다른 이름" labelled by type: 일본어에서 온 현장 말 / 영어 외래어 / 상품명·통칭.
- **"정식 명칭/우리말/뜻" queries are an opening.** They appear for 빠루 and 깔깔이. An entry whose first sentence is "빠루의 정식 이름은 쇠지렛대(배척)입니다." directly answers the query. This sentence still needs checking against the dictionary (see Gaps).
- **Slang mostly appears in compound queries** (칼블럭 기리 사이즈, 함마드릴 기리). Aliases should therefore appear in body text and image alt text near the sizing and usage content, not only in a metadata field.
- **Drop 구루프** from the tool glossary. It is a hair curler; at most it belongs in a "일본어에서 온 생활 용어" aside.
- **Low-autocomplete terms** (토글 앵커, 몰리 앵커, 노루발 망치) should not get standalone pages at first. Fold them into parent entries (석고보드 앵커, 장도리) until the Naver keyword tool shows demand.

### Gaps
- **표준국어대사전 forms, all [unverified].** Robots blocks automated `/search/` access, and no entries were fetched. Recalled forms to check:
  - 펜치 is standard and 뺀찌/뻰치 are non-standard.
  - 멍키 스패너 is the standard loan spelling and 몽키 is non-standard.
  - 배척 is a nail-pulling tool.
  - 쇠지레 and 장도리 have entries.
  - Path: [현장] issue a 표준국어대사전 Open API key (stdict.korean.go.kr/openapi). Then [AI] queries 펜치, 멍키 스패너, 몽키 스패너, 배척, 쇠지레, 장도리, 니퍼, 드라이버, 라쳇 렌치/래칫 렌치 and records the definition text and check date. Alternative: [판단] whether a person may look them up manually in a browser.
- **KS tool standard numbers were not found.** Path: [AI] browses standard.go.kr (no robots restriction found) for 플라이어, 펜치, 멍키 렌치, 스패너, 드라이버 and records the KS B numbers and Korean titles. I recall JIS B 4623 (ペンチ) and JIS B 4604 (モンキレンチ) as possible counterparts; both [unverified].
- **Search volume is unknown.** Autocomplete shows that a phrasing exists, not how often it is searched. Path: [현장] issue a Naver 검색광고 API key. Then [AI] pulls monthly PC and mobile volume for each headword and alias (`npm run blog:demand` can store it).
- **Naver autocomplete was not collected** (Google only). Path: [AI] adds a Naver suggest pass to `scripts/demand-research.mjs`, after checking Naver's robots and terms.

## Q4. Images: what can legally be used on a commercial site and a Naver blog, and which image types teach usage

### Takeaway
On a site with affiliate revenue and on its Naver blog, the safe sources in order are:
1. Your own photos and clips.
2. Your own SVG diagrams.
3. Wikimedia Commons files under CC0, public domain, CC BY or CC BY-SA, with full TASL attribution and any modifications noted.

Exclude NC-licensed sources: namu.wiki, iFixit, and CC BY-NC Commons files. Manufacturer press images are licensed for press use. Bosch's site terms forbid commercial copying, so affiliate use needs explicit permission. AI-generated images must never serve as evidence or for identifying parts. They may illustrate concepts only if labelled. Korea's AI Basic Act places the labelling duty on AI providers, not users. Commons is thin for tool-usage photos (nine files for impact drivers), so original step photos and SVG diagrams will be the main assets.

### Cited Findings
- **Commons attribution rules** (page last edited 2026-11-02):
  - Credit the original creator.
  - "If the copyright holder has specified how, be sure to follow this."
  - Specify licence details and link to or provide the licence where required.
  - If you modify the work, "your modifications must also be similarly freely licensed" where the licence requires it.
  - Other restrictions may apply (trademarks, personality rights, privacy), and "commercial use of images of people may require the explicit agreement of the subject".
  — [Commons: Reusing content outside Wikimedia](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- **CC recommended attribution (TASL)** (page last edited 2024-12-04):
  - Give Title, Author, Source and License.
  - Link to the original URL and to the licence deed.
  - Note slight changes such as cropping; say an adaptation is adapted.
  - For offline, video or audio use, consider a web page with credits.
  - Example given: "Creative Commons 10th Birthday Celebration San Francisco" by Timothy Vollmer is licensed under CC BY 4.0.
  — [CC Wiki: Recommended practices for attribution](http://wiki.creativecommons.org/Recommended_practices_for_attribution)
- **Commons coverage is thin.** Category:Impact drivers holds 9 files and no subcategories: one audio clip and eight raster images (for example "Impact driver bits.JPG", "Schlagschrauber mechanisch.jpg"). There are no SVG diagrams. — [Commons: Category:Impact drivers](https://commons.wikimedia.org/wiki/Category:Impact_drivers) (fetched 2026-11-19)
- **iFixit is unsuitable.** Content is CC BY-NC-SA 3.0, commercial use needs a licence, and using its data for AI training violates its terms. — [iFixit Content Licensing](https://www.ifixit.com/Info/Licensing) (search snippet)
- **namu.wiki is unsuitable.** Text is CC BY-NC-SA 2.0 KR ("영리 목적으로 이용할 수 없습니다"), and images can carry separate licences. — [CC BY-NC-SA 2.0 KR](https://creativecommons.org/licenses/by-nc-sa/2.0/kr/deed.ko); [namu.moe 기본방침](https://namu.moe/w/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%3A%EA%B8%B0%EB%B3%B8%EB%B0%A9%EC%B9%A8) (search snippets)
- **Manufacturer press images (Bosch).**
  - Bosch press-portal image listings permit reproduction "for press purposes free of charge" with the credit "Picture: Bosch". — [Bosch press portal image page](https://www.bosch-presse.de/pressportal/de/en/easy-to-hold-and-intuitive-to-use-high-quality-hand-tools-from-bosch-for-diyers-255234.html) (search snippet)
  - The Bosch Power Tools imprint says website content "may not be copied, disseminated, altered or made accessible to third parties for commercial purposes", and some Bosch images carry third-party copyrights. — [Bosch PT imprint](https://www.bosch-pt.com/imprint/de/ptde/en/facebook/imprint.html) (search snippet)
- **Korea AI Basic Act (인공지능 기본법).**
  - The Act and its enforcement decree took effect on 2026-01-22.
  - Generative-AI outputs must be labelled (watermark or notice) so users can recognise them.
  - The duty falls on AI business operators, not end users.
  - Fines are suspended during a grace period of at least one year.
  — [뉴시스 2026-01-21](https://mobile.newsis.com/view/NISX20260121_0003484769); [이투데이](https://www.etoday.co.kr/news/view/2547948)
  - Follow-up coverage notes that revisions to the decree were under discussion in the second half of 2026. — [ZDNet Korea 2026-10-20](https://zdnet.co.kr/view?no=20261020095628)
- **Existing FixAtlas rules on images** (from `docs/blog/EDITORIAL_STANDARDS.md` in this repo):
  - Evidence images are only source screenshots or the editor's own photos; generated images are banned as evidence (line 163).
  - AI-made fault or repair images are not to be used as if real (line 100).
  - Tables go in as text, not images (line 43).
  - A Naver post carries 3–6 images (line 145).
- **iFixit as the image-type model.** Every step needs an accompanying photo, and watermarks are not permitted. — [iFixit edu checklist](https://edu.ifixit.com/milestone-3-checklist) (search snippet)
- **Google on images and video.** Google's AI-features guidance recommends supporting text with high-quality images and videos, while keeping important content in text. — [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- **Image licence metadata.** Google's structured-data gallery includes "Image metadata" (licence/creator markup) as a supported feature. — [Google Search Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)

### Inferences
- **Image source rules for the glossary (proposed):**

| Source | Site (affiliate) | Naver blog | Conditions |
|---|---|---|---|
| Own photos and clips | Yes (preferred) | Yes | Embed IPTC creator and copyright. Add `ImageObject` license/creator/creditText on the site. Blur faces, plates and addresses. Brand logos are fine for identification but must not imply endorsement. |
| Own SVG diagrams (exploded, cutaway, labelled parts) | Yes | Yes (PNG export) | Caption "설명용 그림 (직접 제작)". Draw from the editor's own photos or the manufacturer manual's facts, not by tracing a copyrighted drawing. |
| Commons CC0 / PD | Yes | Yes | Attribution still recommended for provenance. |
| Commons CC BY / CC BY-SA | Yes | Yes | TASL credit under the image; note crops and edits. A modified BY-SA image (for example with added callouts) must be released under BY-SA. Keep such edits as separate image files, not merged into own diagrams. |
| Commons or any CC BY-NC(-SA/-ND) | No | No | Affiliate and ad revenue is commercial use. |
| namu.wiki text or images | No | No | NC plus unknown per-image licences. |
| iFixit photos and text | No | No | NC; also bans AI training. |
| Manufacturer press or product images | Only with written permission ([판단]) | Same | Press-purpose licence; Bosch imprint forbids commercial copying. |
| Shopping-mall product photos (쿠팡, 11번가 etc.) | No | No | Seller or manufacturer copyright; no licence. |
| AI-generated illustrations | Concept art only, labelled "AI로 만든 개념 그림" | Same | Never as evidence, part identification, damage examples or step photos (existing rules lines 100 and 163). The legal labelling duty sits with providers, but FixAtlas's transparency rule applies anyway. |

- **Image types that teach usage best, ranked:**
  1. Step photos shot from the user's point of view, one action per photo, with callouts (iFixit model).
  2. Annotated photos naming switches and parts (collet, forward/reverse switch, mode selector, torque clutch ring).
  3. Own SVG cutaway or exploded diagrams for mechanisms (impact hammer and anvil, damper hinge, ball-rail release lever, faucet cartridge).
  4. Short silent clips or GIFs (≤10 s) for motions that photos cannot show (pressing a ball-rail release tab, setting hinge depth).
  5. Size and spec comparison as a text table, not an image (existing rule).
- **Naver blog specifics.** The same copyright rules apply. Naver posts cannot hold structured licence metadata, so put the TASL credit as caption text under each third-party image. The site version should carry the machine-readable `ImageObject` markup.

### Gaps
- No Naver policy on AI-generated images or third-party image use was collected. [AI] path: read Naver blog 운영정책 and 저작권 안내 pages (check robots first). Whether to add 애드포스트 is [판단] and affects the NC analysis on the blog too.
- No Korean-language press-kit terms were collected for Makita Korea, Bosch Korea or LG/Samsung newsrooms. [AI] path: read each newsroom's image-use terms. Asking permission for affiliate use is [판단].
- The Commons claim that "placing an unmodified BY-SA image in an article does not make the article BY-SA" is not stated on the fetched page. It is the usual collective-work reading [unverified]. Path: [AI] reads the CC BY-SA 4.0 legal code §1 (Adapted Material) and the CC FAQ on "collections".
- EU AI Act Article 50 dates (2026-08-02) appeared only in a search summary [unverified]. They are not material for a Korea-focused site.

## Q5. Glossary SEO/GEO: term pages vs one page, DefinedTerm status, internal linking, AI-engine citation

### Takeaway
Use one prerendered URL per term, a hub index page, and dedicated "A vs B" pages where autocomplete shows "차이" queries. DefinedTerm and DefinedTermSet are valid schema.org types but produce no Google rich result. Google says AI Overviews and AI Mode need no special schema, only indexable text with snippets and structured data that matches visible content. HowTo rich results have been retired since 2023-09-13. Citation by AI engines therefore depends on clear, sourced, text-first answers.

### Cited Findings
- **schema.org status.** DefinedTerm and DefinedTermSet exist, and `hasDefinedTerm` is listed as a core property. The current release is v30.1, dated 2026-09-16 (fetched 2026-11-19). — [schema.org/DefinedTerm](https://schema.org/DefinedTerm); [schema.org/DefinedTermSet](https://schema.org/DefinedTermSet); [schema.org releases](https://schema.org/docs/releases.html)
- **Google rich results.** Google's Search Gallery lists 25 supported structured-data features, including Article, Breadcrumb, Image metadata, Q&A, Product, Review snippet and Video. DefinedTerm, DefinedTermSet, HowTo and FAQ are not among them. — [Google Search Central: Search Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- **HowTo and FAQ changes.**
  - On 2023-08-08 Google limited FAQ rich results to "well-known, authoritative government and health websites".
  - As of 2023-09-13, HowTo rich results stopped showing on desktop too, so they are deprecated.
  - Google says "there's no need to proactively remove" the markup.
  — [Google Search Central Blog: Changes to HowTo and FAQ rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- **AI Overviews and AI Mode.**
  - "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."
  - "There's also no special schema.org structured data that you need to add."
  - Pages must be indexed and eligible for a snippet.
  - Structured data should match visible text.
  - Important content should be in text, supported by images and video.
  - Preview controls (`nosnippet`, `max-snippet`, `data-nosnippet`) and Google-Extended govern usage.
  — [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- **Existing FixAtlas GEO rules.** Put prices, dates, sample sizes and sources in body text, because search and AI may not read text inside images. Do not repeat keywords; it had no effect or hurt in generative engines. — `docs/blog/EDITORIAL_STANDARDS.md` lines 43–45 (this repo)
- **Autocomplete shows comparison and how-to intents.** Examples: "임팩트 드라이버 드릴 차이", "펜치 니퍼 차이", "칼블럭 앙카 차이", "해머드릴 임팩드릴 차이", "댐퍼경첩 일반경첩 차이", "볼레일 2단 3단 차이", "몽키스패너 사용법", "실리콘건 사용법". — [Google suggest endpoint](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&q=%ED%8E%9C%EC%B9%98) (2026-11-19)

### Inferences
- **Page model:**
  - `/용어/<slug>`, one per term, prerendered so the definition, aliases, steps and source lines are in the initial HTML.
  - `/용어` hub, grouped 공구 / 가전 부품·고장 / 가구·집 하드웨어, with a 가나다 index. It is a DefinedTermSet, linking every term.
  - `/용어/비교/<a>-vs-<b>` only where a "차이" query exists.
  - One long page would dilute distinct intents such as "몽키스패너 사용법" and "펜치 니퍼 차이", and could not carry per-term images and sources cleanly.
  - Merge low-demand terms into parents to avoid thin pages.
- **Markup per term page** (rich-result-neutral, harmless):
  - `DefinedTerm`: `name` = headword, `alternateName` = aliases including slang, `description` = the one-sentence definition exactly as shown, `inDefinedTermSet` = hub URL, `url`, `image`.
  - `BreadcrumbList`, which is supported.
  - `ImageObject` with `license`, `acquireLicensePage`, `creator` and `creditText` for own photos (supported "Image metadata").
  - Optionally `Article` with `dateModified` tied to the source check date.
  - Skip HowTo and FAQ markup (no rich result). Write the steps and Q&A as visible HTML instead.
- **Answer-first writing for AI citation:**
  - First sentence: a self-contained definition with the alias ("빠루의 정식 이름은 …입니다").
  - Second: what it is for in home repair.
  - Then numbered steps, each with one verb.
  - Each number followed by a source line ("출처: ○○ 사용설명서(2026-11-19 확인)").
  - This follows Google's "text first, matches visible content" rule and the project's own GEO rules. Whether this specific pattern raises citation rates is not shown by any source here.
- **Internal linking:**
  - Every repair guide links the first mention of each tool or part to its term page.
  - Every term page has "관련 수리 가이드", listing the guides that use the term with their FixAtlas cost data, and "관련 용어", 3–6 siblings including its "vs" page.
  - Affiliate links sit only in a "고를 때 볼 것" block, after the usage content, with the existing one-line disclosure quote.
- **Naver blog.** The "one item, one reader" rule means term pages should not be mirrored one by one as blog posts. Use a short "용어 한 줄" box inside posts, linking to the site term page with UTM tagging (the existing UTM scheme). Naver's structured-data support is unknown (see Gaps).

### Gaps
- Naver Search Advisor's supported structured-data types were not found. [AI] path: read searchadvisor.naver.com 가이드 (check robots first).
- I found no source measuring how often glossary-style pages are cited in Google AI Overviews, Naver AI briefing or ChatGPT search. Recommendations here rest on Google's official guidance. [AI] can track citations after launch with the existing measurement scheme.
- Google's own documentation was the only source on DefinedTerm consumption. Bing and Naver use of DefinedTerm is unknown [unverified].

## Q6. Proposed entry template and prioritised seed list (~60 terms)

### Takeaway
The template below is task-first, following the iFixit and retail patterns. It treats naming carefully, gives every number a source line, separates image provenance, and places affiliate content after usage. The seed list puts first the terms with autocomplete evidence of how-to or comparison intent, or a direct role in repairs FixAtlas already prices (appliances, plumbing parts, cabinet hardware). Search volume still needs the Naver keyword tool.

### Cited Findings
- iFixit's pre-flight fields (difficulty, time required, tools, parts, prerequisites), step-with-photo format and typed callouts. — [iFixit Help: Guide Details](https://www.ifixit.com/Help/Guide_Details); [iFixit edu checklist](https://edu.ifixit.com/milestone-3-checklist)
- Retail guides' core blocks: vs comparison, when to use, bit compatibility, specs to compare, safety. — [Home Depot](https://www.homedepot.com/c/ab/impact-drivers-vs.-drills/9ba683603be9fa5395fab9009f66e37); [Lowe's](https://lowes.com/n/buying-guide/impact-driver-vs-drill)
- The autocomplete evidence used for "reason" below. — [Google suggest endpoint](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&q=%EC%9E%84%ED%8C%A9%ED%8A%B8%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B2%84), queried 2026-11-19 for every term marked "AC" below
- Existing house rules: formal 합니다체, source lines with check dates, one-line ad/affiliate quote, no AI images as evidence. — `CLAUDE.md` and `docs/blog/EDITORIAL_STANDARDS.md` (this repo)

### Inferences

#### Naming conventions (proposed)
- **Headword.** Use the 표준국어대사전 form or established loan spelling, once checked via the Open API. When the standard form is unsearched or ambiguous, put the most-searched form first and the standard form in parentheses in the first sentence.
  - Proposed: 쇠지렛대(빠루), 펜치, 니퍼, 멍키/몽키 스패너 (decide after the dictionary check), 라쳇 렌치(깔깔이), 칼블럭, 드릴 비트(기리).
- **다른 이름 field**, each alias tagged with one label:
  - `현장 말(일본어 유래)`: 빠루, 뺀치, 니빠, 기리, 도라이바, 오함마, 함마.
  - `외래어 변이`: 몽키/멍키, 라쳇/래칫, 앙카/앵커.
  - `통칭·상품명`: 깔깔이, 칼블럭, 헤라.
  - `영어`: impact driver, pliers.
- **Slug.** Use a readable Korean slug plus an ASCII fallback (for example `/용어/임팩트-드라이버`, canonical `/glossary/impact-driver`). This is a technical choice for the dev team; keep one canonical.
- **Spacing.** Follow the dictionary for spacing (임팩트 드라이버, not 임팩트드라이버), but include the unspaced form as an alias.
- **No slang-only headwords.** Never make slang the sole H1. Do answer "정식 명칭" queries in the first sentence.

#### Entry template (proposed; front matter mirrors the blog `claims:` pattern)

```yaml
term: 임팩트 드라이버            # headword
aliases: [{form: 임팩 드라이버, type: 통칭}, {form: 임팩드라이버, type: 붙여쓰기}, {form: impact driver, type: 영어}]
category: 공구/전동공구          # 공구 | 가전 부품·고장 | 가구·집 하드웨어
demand: "[누가] [어떤 상황에서] [무엇을 판단하려고] '[실제 검색어]'를 검색할 때 이 항목을 읽습니다."
queries: [임팩트 드라이버 드릴 차이, 임팩트 드라이버 사용법, 임팩트 드라이버 비트]
difficulty: 쉬움|보통|어려움     # iFixit-style
related_terms: [드릴 드라이버, 드라이버 비트, 해머드릴]
related_guides: [/수리/가구-조립-나사-헛돔, ...]
claims: [{값, 출처, 확인일, 원문 인용}]   # every number (Nm, mm, 가격대)
images: [{file, type: 직접촬영|직접제작SVG|Commons, license, credit_TASL, ai_generated: false}]
checked: 2026-11-19
```

Body sections, in order, all in formal 합니다체 with one or two sentences per line:
1. **정의.** One self-contained sentence including the main alias, for example "빠루의 정식 이름은 쇠지렛대입니다". Add a second sentence on what it does in home repair.
2. **다른 이름.** A table: 형태 | 종류(현장 말·외래어·통칭) | 비고(표준 여부, source).
3. **어디에 쓰나.** Three to five concrete home repairs, each linking to a FixAtlas repair guide and its cost data. Include "이럴 땐 쓰지 마세요" (wrong-tool cases).
4. **사용법.** Pre-flight line (난이도 · 걸리는 시간 · 함께 필요한 것 · 소모품), then numbered steps, one action and one photo per step, with 참고/확인/주의 callouts.
5. **헷갈리는 도구와 차이.** A text table of 2–3 tools by what to compare (mechanism, bit, use, noise, price band), linking to the vs page if one exists.
6. **고를 때 볼 것.** Spec terms decoded: what each number means, which range suits home use, and the manufacturer document it came from. Affiliate links appear only here, with the one-line disclosure quote.
7. **안전.** Manual-sourced warnings (eye protection, keep fingers clear of the collet, bit rating, power off and unplug for appliances), each with a source line.
8. **가격대.** A range, the date, where it was observed, and the method (for example the median of N listings on date D). No unsourced "about".
9. **관련 용어 / 관련 수리 가이드.** 3–6 links each.
10. **출처.** Source lines with check dates, then the "만든 방법" line as in blog posts, and image credits (TASL).

#### Prioritised seed list (62 terms)
Priority tiers:
- **P1 (launch, ~20):** autocomplete shows how-to or "차이" intent and the term is used in FixAtlas repair or cost topics.
- **P2 (~25):** autocomplete intent exists, or the term is central to a repair category.
- **P3 (~17):** supporting terms; merge into parents if demand stays low.

"AC" means Google autocomplete on 2026-11-19 included the quoted suggestions. "No AC" means none was collected or none appeared, so the term is included for its role in repairs.

**공구 (28)**

| # | Headword (aliases) | Tier | Reason |
|---|---|---|---|
| 1 | 임팩트 드라이버 (임팩 드라이버, 임팩드라이버) | P1 | AC: 드릴 차이, 사용법, 비트, 용도, 렌치 차이. Operator reference. Affiliate anchor. |
| 2 | 드릴 드라이버 (전동드릴, 충전 드릴) | P1 | AC (전동드릴): 사용법, plus brand variants (보쉬, 디월트, 이케아). Pairs with #1. |
| 3 | 드릴 비트 (기리) | P1 | AC: 종류, 규격, 빼는법, 사이즈. 기리 appears in compounds (콘크리트 기리 사이즈, 칼블럭 기리). |
| 4 | 드라이버 비트 (PH2 등) | P1 | AC: 규격, 종류, 교체, 길이. AC (십자드라이버 규격): ph. |
| 5 | 육각 렌치 (L렌치, 알렌 렌치) | P1 | AC: 규격, 없을때, 헛돌때. Furniture assembly. |
| 6 | 펜치 (뺀치, 뻰찌, 플라이어) | P1 | AC: 펜치 니퍼 차이, 종류, 플라이어. AC (뺀치): 니퍼, 뜻. |
| 7 | 멍키 스패너 / 몽키 스패너 (몽키) | P1 | AC (몽키스패너): 사용법, 규격, 사이즈, 없을때. The standard spelling query is polluted by a novel. Faucets and hoses. |
| 8 | 쇠지렛대 (빠루, 배척) | P1 | AC (빠루): 정식 명칭, 우리말, 뜻. AC (쇠지렛대): 빠루, 용도, 사용법. |
| 9 | 실리콘건 (코킹건) | P1 | AC: 사용법, 노즐, 빼는법, 없을때. Bathroom re-sealing. |
| 10 | 해머드릴 (함마드릴) | P1 | AC: 임팩드릴 차이, 사용법, 대여. AC (함마드릴): 기리, 비트. Concrete wall anchors. |
| 11 | 니퍼 (니빠) | P2 | AC (펜치): 니퍼 차이. The 니퍼 query alone is polluted (니퍼트). Wiring and cable ties. |
| 12 | 라쳇 렌치 (깔깔이, 래칫 렌치) | P2 | AC (깔깔이 렌치): 정식 명칭, 사용법. AC (라쳇렌치): 방향, 규격. |
| 13 | 스패너 | P2 | AC: 스패너 렌치 차이, 규격, 종류. |
| 14 | 바이스 플라이어 | P2 | AC: 사용법, 용도, 규격. Stripped-screw removal. |
| 15 | 롱노즈 플라이어 (롱노즈 펜치) | P2 | AC: 롱노즈 플라이어, 롱노즈 펜치 (query polluted by a cat breed). |
| 16 | 별 드라이버 (토크스, T20) | P2 | AC (별드라이버): t20, t5, 규격, 없을때. Appliance and electronics screws. |
| 17 | 십자·일자 드라이버 (도라이바) | P2 | AC (십자드라이버 규격): ph. 도라이바 query polluted. Basic. |
| 18 | 검전 드라이버 | P2 | AC: 원리, 추천. Electrical safety before outlet or light work. |
| 19 | 멀티미터 (테스터기) | P2 | AC: 사용법 (several variants). Appliance fault diagnosis (fuses, heaters). |
| 20 | 헤라 (스크래퍼, 플라스틱 헤라) | P2 | AC: 헤라 공구 영어, 플라스틱 헤라. AC (스크래퍼): 헤라. Silicone removal, prying appliance clips. |
| 21 | 스터드 파인더 | P2 | AC: 사용법, 원리, 대여. Wall mounting. |
| 22 | 수평계 | P2 | AC: 보는법, 사용법, 어플. Washer levelling (see #34). |
| 23 | 장도리 (빠루 망치, 노루발 망치) | P3 | AC (빠루 망치): 추천, 가격. 노루발 망치 has no AC, so merge it here. |
| 24 | 줄자 | P3 | AC: 보는법. Basic measuring for parts (cartridge diameter, rail length). |
| 25 | 그라인더 | P3 | AC: 날 종류, 날 교체, 사용법. High-risk tool, so the entry is safety-heavy. Low DIY-repair fit. |
| 26 | 오함마 (해머) | P3 | AC: 뜻, 무게. Slang headword lookup; merge into 망치 family. |
| 27 | 타카 (태커) | P3 | Listed in namu 분류:공구. AC polluted by names. Upholstery and back panels. |
| 28 | 토크 렌치 | P3 | Listed in namu 분류:공구. No AC collected. Mainly vehicle and bike use; low priority. |

**고정 철물 (anchors and screws, listed with tools) (4)**

| # | Headword (aliases) | Tier | Reason |
|---|---|---|---|
| 29 | 칼블럭 (칼브럭, 플라스틱 앵커) | P1 | AC: 박는법, 기리, 빼는법, 피스, 앙카 차이. |
| 30 | 석고보드 앵커 (석고보드 앙카) | P1 | AC: 사용법, 하중, 박는 법, 종류. 토글 and 몰리 앵커 have no AC, so merge them here. |
| 31 | 나사못 (피스) | P2 | AC: 헛돌때, 종류, 규격, 안빠질때, 안풀릴때. |
| 32 | 앵커 볼트 (앙카 볼트) | P3 | AC is pro or construction-skewed (매입공법, 연단거리). Keep a short entry for disambiguation. |

**가전 부품·고장 용어 (15)**

| # | Headword (aliases) | Tier | Reason |
|---|---|---|---|
| 33 | 세탁기 배수 필터 (잔수 필터) | P1 | AC: 청소, 안빠짐, 물샘, 위치, 막힘. |
| 34 | 세탁기 수평 조절 (수평 다리) | P2 | AC (세탁기 수평): 맞추기, 안맞으면, 받침대, as. |
| 35 | 냉장고 도어 가스켓 (고무패킹) | P1 | AC: 교체, 교체 비용, 곰팡이 제거, 파는 곳. A cost-comparison term. |
| 36 | 냉장고 성에 (성에 제거, 제상) | P2 | AC: 제거 방법, 끼는 이유, 성에제거 모드. |
| 37 | 에어컨 배수 펌프 | P1 | AC: 고장, 소음, 교체, 교체 비용. A cost-comparison term. |
| 38 | 에어컨 드레인 호스 | P2 | AC: 막힘, 교체, 청소, 연장. |
| 39 | 식기세척기 필터 | P2 | AC: 청소, 교체, 내장형 차이. |
| 40 | 보일러 분배기 | P2 | AC: 교체비용, 교체 주기, 셀프 교체, 밸브 조절. |
| 41 | 무선청소기 배터리 | P1 | Existing FixAtlas post (naver/01). A cost-comparison anchor. |
| 42 | 출장비 (AS 출장비) | P1 | Existing FixAtlas post (naver/02). A core cost term. |
| 43 | 부품 보유 기간 | P2 | No AC collected. Decides whether a repair is possible (소비자분쟁해결기준). Cite the official text. |
| 44 | 메인보드 (PCB, 기판) | P2 | No AC collected. A frequent high-cost fault in quotes. |
| 45 | 컴프레서 (압축기) | P2 | No AC collected. A high-cost fridge and aircon fault. |
| 46 | 에러 코드 (세탁기·식기세척기 오류 표시) | P3 | No AC collected. Hub linking to per-model codes from manufacturer manuals. |
| 47 | 냉매 (가스 충전) | P3 | No AC collected. A common aircon quote line. Needs official sourcing. |

**설비 (plumbing parts; often repaired alongside appliances) (5)**

| # | Headword (aliases) | Tier | Reason |
|---|---|---|---|
| 48 | 수전 카트리지 | P1 | AC: 교체, 규격, 종류, 교체 비용, 35mm, 철물점. |
| 49 | 필밸브 | P1 | AC: 교체, 교체 비용, 고장 증상, 구조, 다이소. |
| 50 | 변기 부속품 | P2 | AC: 명칭, 교체, 교체 비용. A hub for 필밸브 and 플러시밸브. |
| 51 | 싱크대 트랩 (P트랩, S트랩) | P2 | AC: 교체, 구조, 청소. AC (P트랩): s트랩, 원리, 패킹. |
| 52 | 세면대 팝업 | P2 | AC: 교체, 빼기, 안올라옴, 교체 비용. |

**가구·도어 하드웨어 (10)**

| # | Headword (aliases) | Tier | Reason |
|---|---|---|---|
| 53 | 싱크대 경첩 (컵 경첩) | P1 | AC: 댐퍼 조절, 속도 조절, 보강판, 교체, 빠짐. |
| 54 | 댐퍼 경첩 | P1 | AC: 조절, 속도 조절, 고장, 일반경첩 차이. |
| 55 | 볼레일 (서랍 레일) | P1 | AC: 서랍 빼는 법, 2단 3단 차이, 언더레일, 교체. AC (레일 서랍): 빼는 법, 안 열림. |
| 56 | 언더레일 | P3 | AC (볼레일): 언더레일. Merge into #55 at first. |
| 57 | 의자 가스 실린더 | P1 | AC: 교체, 고장, 폭발, 분해. Includes a safety angle. |
| 58 | 캐스터 (바퀴) | P2 | AC: 규격, 종류, 하중, 재질. |
| 59 | 도어 클로저 | P2 | AC: 조절, 속도조절, 설치, 종류. |
| 60 | 문고리 (도어 레버) | P2 | AC (문고리 교체): 방법, 비용, 집주인. |
| 61 | 도어락 | P2 | AC (도어락 건전지): 없을때, 교체, 방전. |
| 62 | 캠 볼트·캠 너트 (가구 조립 철물) | P3 | No AC collected. Key to flat-pack furniture repair. Check Korean naming (캠록 etc.) before publishing. |

- **Image plan per tier.**
  - P1 entries need at least 3 own step photos and 1 own SVG or annotated photo before publishing ([현장] photos of real tools and parts, then [AI] annotation, captions and alt text).
  - P2 and P3 can launch with one own photo plus a Commons CC BY or BY-SA image where one exists. Commons coverage is thin, as the impact-driver category shows.
- **Merging rule.** Re-run demand with the Naver keyword tool. Any P3 term with negligible volume becomes a section of its parent entry rather than its own URL.

### Gaps
- No term has volume numbers. Tiering uses autocomplete presence plus repair role only. [현장] Naver 검색광고 API key, then [AI] volumes per headword and alias, then re-tier.
- Korean standard names for 캠 볼트/캠 너트, 잔수 필터, 수평 다리, 플러시밸브 and 냉매 are [unverified]. [AI] checks manufacturer manuals (LG and Samsung manuals, furniture assembly sheets) and the Open API dictionary.
- 부품 보유 기간 and 출장비 figures must be quoted from the official 소비자분쟁해결기준 and manufacturer pages. Not fetched here. [AI] uses `npm run blog:verify` once the entries are drafted.
- Whether to adopt "몽키" or "멍키" as the headword depends on the dictionary check above. Choosing the house spelling after the evidence comes in is [판단].
