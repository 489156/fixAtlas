# Brand-name check: fixAtlas, fixRecord, 수리기록 (observed 2026-11-20)

All observations below were made on 2026-11-20 unless a different date is given. "RDAP 404" means the registry's RDAP server returned "not found" for the name. The .kr control lookups (samsung.co.kr, naver.kr) returned 200 and the .io control lookup (github.io) returned 200, so a 404 can be read as "not registered at the time of the lookup".

Process notes, with access limits:
- I checked robots.txt before accessing each site. Instagram, X, Threads, Facebook and cafe.naver.com disallow all crawling (`Disallow: /` for `*`), so I did not open their profile pages. I used search-engine results for those sites instead. Soomgo returned 403 even for robots.txt, so I did not open Soomgo pages directly and used search-engine results only. I did not run any Naver search or blog access. WIPO Global Brand Database served a bot challenge (altcha), and I did not try to get past it.
- **Disclosure of an access error:** play.google.com/robots.txt contains `Disallow: /store/search`. My first robots check printed only the first 20 lines, and that line was not among them. As a result I sent 3 search requests to play.google.com/store/search (fixatlas, fixrecord, 수리기록) before I saw the rule. I list those results under Gaps, marked as obtained against robots.txt. I do not rely on them; a `site:play.google.com` search-engine query was used as the permitted substitute.
- KIPRIS (www.kipris.or.kr) reset the TLS connection on two tries from this environment ("Connection reset by peer" after the proxy tunnel was established). Korean trademark status is therefore unchecked.

## Who already uses each name (domains, sites, apps, GitHub, companies)

### Takeaway
"FixAtlas" is already the name of a US product in the same category: an early-access troubleshooting platform for HVAC, plumbing, electrical and appliances at usefixatlas.com, started in 2026. fixatlas.com has been registered since 2013 and fixrecord.com since 2026-03-07; both point at parking-style hosting. The .kr, .co.kr and .io domains for both English names are unregistered, as are 수리기록.com and 수리기록.kr. No sizeable company or app named fixRecord or 수리기록 turned up. "수리기록" appears mainly as a generic label inside record-keeping apps.

### Evidence table (observed 2026-11-20)

| Item | fixAtlas | fixRecord | 수리기록 |
|---|---|---|---|
| .com | **Registered** 2013-08-15 at Dynadot. Last changed 2026-08-04, expires 2027-08-15. Nameservers ns1/ns2.dyna-ns.net, A record 188.214.128.77. HTTPS connection reset, so no live site could be read. Content is [unverified]: probably parked or for sale | **Registered** 2026-03-07 at GoDaddy, expires 2027-03-07. Nameservers ns51/52.domaincontrol.com. The page is a JS redirect to `/lander` (GoDaddy-style parking); `/lander` returned 503 to WebFetch | 수리기록.com (xn--ok0b06qx2an4s.com): **not registered** (Verisign RDAP 404) |
| .kr | Not registered (KISA RDAP 404) | Not registered (404) | 수리기록.kr: not registered (404). surirecord.kr and suri-record.kr: not registered |
| .co.kr | Not registered (404) | Not registered (404) | Hangul under .co.kr: RDAP returned 400 Bad Request. [unverified] Hangul names are probably not allowed under .co.kr. surirecord.co.kr: not registered |
| .io | Not registered (Identity Digital RDAP 404) | Not registered (404) | n/a |
| Same-name product | **usefixatlas.com "FixAtlas"**: US early access, free, "© 2026 FixAtlas". Domain registered 2026-04-17 (GoDaddy) | GitHub project "FixRecord": an iPhone app for contractors, indexed by search engines. The repo returned 404 on 2026-11-20 | No product of that name found. Several apps use "수리 기록" as a descriptive title (see below) |
| GitHub | Operator's repo 489156/fixAtlas. Others: Vxn1r/fixatlas-dev (★1), ZakryRustabell/fixatlas (★0, "fixatlas - repairs"). User/org search for "fixatlas" in login: 0 | karthick2526/FixRecord (★0). User/org login search: 0 | n/a |
| App Store (KR/US) | No app named FixAtlas | No app named FixRecord | KR search returns car-maintenance logs and generic "수리 기록" apps |
| YouTube | **@FixAtlas exists**: 8 subscribers, 48 videos, joined 2026-04-18 | @fixrecord: not taken (404) | @수리기록: not taken (404). **@surirecord exists** ("Suri Record", joined 2025-11-18, no public subscriber count) |
| USPTO | No FIXATLAS or "FIX ATLAS" mark (0 hits) | No FIXRECORD or "FIX RECORD" mark (0 hits) | n/a |
| KIPRIS | Not checked (connection reset) | Not checked | Not checked |

### Cited Findings
- fixatlas.com: registered 2013-08-15T18:24:40Z with Dynadot Inc. Last changed 2026-08-04, expires 2027-08-15, status "client transfer prohibited", nameservers NS1/NS2.DYNA-NS.NET — [Verisign RDAP](https://rdap.verisign.com/com/v1/domain/fixatlas.com)
- fixatlas.com and www.fixatlas.com resolve to 188.214.128.77 (Dynadot nameservers) — [Google DNS](https://dns.google/resolve?name=fixatlas.com&type=A)
- fixrecord.com: registered 2026-03-07T02:14:18Z with GoDaddy.com, LLC, expires 2027-03-07, nameservers NS51/NS52.DOMAINCONTROL.COM. A records 3.33.130.190 and 15.197.148.33 — [Verisign RDAP](https://rdap.verisign.com/com/v1/domain/fixrecord.com); [Google DNS](https://dns.google/resolve?name=fixrecord.com&type=A)
- https://fixrecord.com returns only `window.location.href="/lander"`, and /lander returned HTTP 503 — [fixrecord.com](https://fixrecord.com)
- fixatlas.kr, fixatlas.co.kr, fixrecord.kr, fixrecord.co.kr, 수리기록.kr, surirecord.kr/.co.kr and suri-record.kr/.co.kr: all RDAP 404 — [KISA RDAP, e.g. fixatlas.kr](https://rdap.nic.or.kr/domain/fixatlas.kr)
- 수리기록.com (punycode xn--ok0b06qx2an4s.com), surirecord.com and suri-record.com: RDAP 404 — [Verisign RDAP](https://rdap.verisign.com/com/v1/domain/xn--ok0b06qx2an4s.com)
- fixatlas.io and fixrecord.io: RDAP 404 — [Identity Digital RDAP](https://rdap.identitydigital.services/rdap/domain/fixatlas.io)
- usefixatlas.com describes itself as "Structured Troubleshooting for HVAC, Plumbing, Electrical & Appliances", "Built for maintenance teams, property managers, and field technicians". It says "FixAtlas is free during early access" and shows "© 2026 FixAtlas". It lists a library of 58 manuals, 20 troubleshooting guides and 8 categories. The page names no company and no location, and links to no social accounts — [usefixatlas.com](https://www.usefixatlas.com/)
- usefixatlas.com publishes homeowner-facing appliance content such as "FixAtlas Walks a Homeowner Through a Dryer Not Heating" and "FixAtlas vs iFixit" — [FixAtlas blog](https://www.usefixatlas.com/blog/); [dryer post](https://www.usefixatlas.com/blog/fixatlas-walks-dryer-not-heating); [vs iFixit](https://www.usefixatlas.com/blog/fixatlas-vs-ifixit)
- usefixatlas.com: registered 2026-04-17T16:13:51Z, GoDaddy nameservers — [Verisign RDAP](https://rdap.verisign.com/com/v1/domain/usefixatlas.com)
- A search-engine summary of the signup page described paid plans "starting at $15.99 per user per month". I did not fetch the page, so this is [unverified] — [app.usefixatlas.com/signup](https://app.usefixatlas.com/signup)
- GitHub repository search for "fixatlas" in name: 3 results — 489156/fixAtlas (★0, the operator's), Vxn1r/fixatlas-dev (★1, pushed 2026-11-11) and ZakryRustabell/fixatlas (★0, "fixatlas - repairs", pushed 2026-08-26). For "fixrecord": 1 result, karthick2526/FixRecord (★0, pushed 2026-11-04). User/org login search returned 0 for both names — [GitHub search API](https://api.github.com/search/repositories?q=fixatlas+in:name)
- A search engine indexed "andreajanewilliams/FixRecord: Turn job photos, notes and receipts into professional work reports and invoices. An iPhone app built with SwiftUI, on-device receipt scanning and RevenueCat". The repo returned HTTP 404 on 2026-11-20 — [GitHub (404 now)](https://github.com/andreajanewilliams/FixRecord)
- App Store (iTunes Search API): "fixatlas" in KR returned 0 results, and in US only unrelated apps (Fixit Client, Fixup Fixers). "fixrecord" returned 0 in KR, and in US only vinyl and audio recording apps — [iTunes Search API](https://itunes.apple.com/search?term=fixatlas&entity=software&country=kr)
- A `site:play.google.com` search found no app named FixAtlas, FixRecord or 수리기록. The nearest matches were FixFile (equipment service log), Fixo/픽소 (Korean IT field-service log), FixMate and Fixwright — [Fixo](https://play.google.com/store/apps/details?id=io.fixo); [FixFile](https://play.google.com/store/apps/details?id=com.fixfile.app)

### Inferences
- usefixatlas.com is small: it is in early access, has 8 YouTube subscribers if that channel is theirs, names no company and links no social accounts. However, it overlaps in name and category (appliance troubleshooting aimed at homeowners and technicians), and it is in English. For any English-language page, GitHub page or AI-answer citation, "FixAtlas" will be ambiguous. This matters more than its current size.
- The dates line up: usefixatlas.com was registered 2026-04-17 and the @FixAtlas YouTube channel joined 2026-04-18. The channel is probably theirs, but this is [unverified].
- fixrecord.com was registered recently (2026-03-07), it is parked, and a contractor "FixRecord" iPhone project existed in 2026. Someone may be preparing a FixRecord product in the field-service or contractor space, the same space as a handyman's job log. [unverified]
- If the operator wants a .com, neither English .com is free. Under the "fix" prefix, both English names are clean only at .kr, .co.kr and .io.

### Gaps
- What fixatlas.com actually shows (parked, for sale, or dormant) is [unverified]: HTTPS connection reset. Verification path: [AI] open it in a browser session and check the Dynadot marketplace listing.
- Whether andreajanewilliams/FixRecord moved, went private or was deleted, and whether an App Store release followed, is [unverified]. Verification path: [AI] repeat the iTunes Search API query for "FixRecord" and the search-engine query monthly.
- The Play Store search results below were obtained by requests to a robots.txt-disallowed path (`/store/search`), made in error. They are listed only for disclosure and should be re-checked by permitted means. "fixatlas": 0 apps. "fixrecord": 1 unrelated app (MaxFlow HR). "수리기록": 13 apps, mostly car-maintenance logs (우리차 정비기록, 차량관리 차계부, 차계부 차곡차곡, 카닥, My Garage) plus a bowel-movement diary. Verification path: [AI] use `site:play.google.com` search-engine queries.
- I did not check company registries (Korean 사업자/법인 등기 or US state filings) for "FixAtlas", "FixRecord" or "수리기록". Verification path: [AI] check the 대법원 인터넷등기소 법인 상호 search (robots and terms first) and OpenCorporates.

## SNS accounts (Instagram, YouTube, X, Threads, TikTok, Facebook, Naver, Brunch)

### Takeaway
Two YouTube handles are already taken: @FixAtlas (tiny, 8 subscribers) and @surirecord ("Suri Record", no public count). @fixrecord and @수리기록 are free on YouTube, and @fixatlas and @fixrecord are free on Brunch. Robots rules kept me from checking Instagram, X, Threads, Facebook and Naver handles directly, and a search engine surfaced no accounts named fixatlas or fixrecord on those platforms.

### Cited Findings
- YouTube @FixAtlas exists: page title "FixAtlas - YouTube", "8 subscribers", "48 videos", "Joined Apr 18, 2026". Visible video view counts were 2, 4, 21 and 80 — [YouTube @FixAtlas](https://www.youtube.com/@fixatlas)
- YouTube @surirecord exists: title "Suri Record - YouTube", "Joined Nov 18, 2025", and no subscriber or video count in the page data — [YouTube @surirecord](https://www.youtube.com/@surirecord)
- YouTube @fixrecord, @수리기록, @fix_atlas and @fix_record: HTTP 404 (not taken) — [YouTube @fixrecord](https://www.youtube.com/@fixrecord)
- Brunch @fixatlas and @fixrecord: HTTP 404 (not taken) — [Brunch @fixatlas](https://brunch.co.kr/@fixatlas)
- robots.txt is `Disallow: /` for all agents on instagram.com, x.com, threads.com, facebook.com and cafe.naver.com, so I did not fetch these pages — [instagram robots](https://www.instagram.com/robots.txt); [x.com robots](https://x.com/robots.txt); [threads robots](https://www.threads.com/robots.txt); [facebook robots](https://www.facebook.com/robots.txt); [cafe.naver robots](https://cafe.naver.com/robots.txt)
- A search-engine query for fixatlas/fixrecord on Instagram, TikTok, Threads and X returned nothing matching. The only near hits were unrelated: a Bandcamp music page "fixrec" and an influencer listing "sfxatlas" — [fixrec.bandcamp.com](https://fixrec.bandcamp.com/community); [qoruz sfxatlas](https://qoruz.com/sfxatlas)

### Inferences
- On SNS, the main English-name conflict is fixAtlas on YouTube. That handle belongs to an account in the same repair niche, even though it is tiny. "fixrecord" looks free on the platforms that could be checked.
- "수리기록" as a Korean handle is free on YouTube. Hangul handles are not possible on Instagram, X or Threads, so an English or romanized handle (surirecord, suri_record, fixrecord, fixatlas) would be needed there. surirecord is taken on YouTube.

### Gaps
- Handle availability on Instagram, X, Threads, TikTok and Facebook, and Naver blog ID and blog-name collisions: not checked, because robots.txt disallows them or the check needs a logged-in session. Verification path: [현장] the operator tries the handles in each app's signup or profile-edit screen, about 10 minutes. [AI] records the results.
- Naver blogs or cafes named "수리기록": not checked (no automated Naver search). Verification path: [현장] one manual Naver search for "수리기록 블로그"; [AI] transcribes the result. Whether to allow any automated Naver check at all is a [판단].
- Follower counts for any Instagram, TikTok or Threads accounts: none found, so nothing to report.

## Trademarks (KIPRIS, USPTO, WIPO) in classes 35, 37 and 42

### Takeaway
USPTO has no live or dead marks for FIXATLAS, "FIX ATLAS", FIXRECORD or "FIX RECORD" as of 2026-11-20. A control search for IFIXIT returned 8 records, so the search worked. Korean (KIPRIS) and WIPO status could not be checked from this environment. "수리기록" is a descriptive phrase ("repair record"), so registering it as a mark is likely to be hard. That point is [unverified].

### Cited Findings
- USPTO trademark search (the API behind tmsearch.uspto.gov). Phrase queries in the wordmark field: "FIXATLAS" 0, "FIX ATLAS" 0, "FIXRECORD" 0, "FIX RECORD" 0, "REPAIR RECORD" 0. Wildcards `*fixatl*` 0 and `*fixrec*` 0. Control "IFIXIT": 8 records, including a live class-37/42 filing by iFixit — [USPTO Trademark Search](https://tmsearch.uspto.gov/)
- tmsearch.uspto.gov has no robots.txt (S3 "NoSuchKey"), so no crawl restriction is published there — [tmsearch robots](https://tmsearch.uspto.gov/robots.txt)
- WIPO Global Brand Database returned an altcha bot-challenge page instead of content. I did not try to get past it — [WIPO Brand DB](https://branddb.wipo.int/)
- KIPRIS: two connection attempts were reset during the TLS handshake. No data — [KIPRIS](https://www.kipris.or.kr/)

### Inferences
- With no US marks found, the English names face no US registration obstacle today. That only matters if the operator ever operates in English. usefixatlas.com shows no ™ or ® and no filing yet, but it could file later.
- Korean law generally refuses marks that only describe the goods or services. If that rule applies, "수리기록" for repair services or repair information would be weak as a registered mark. A distinctive compound might fare better, for example the byline form "경기도 핸디맨의 수리기록" or a logo. [unverified] Verification path: [AI] read 상표법 제33조 제1항 on law.go.kr and look at KIPRIS examples of "수리"+generic-word marks once KIPRIS is reachable.

### Gaps
- KIPRIS status of 수리기록, 픽스아틀라스/fixatlas and 픽스레코드/fixrecord in classes 35, 37 and 42 is unknown. Verification path: [현장] the operator issues a KIPRIS Plus open-API key (plus.kipris.or.kr); [AI] then runs the class 35, 37 and 42 queries and records the results. Whether to allow access from another network is a [판단].
- WIPO Global Brand Database (Madrid filings designating Korea) was not checked. Verification path: [AI] runs the query in an interactive browser session if the operator approves that access mode. That approval is a [판단].

## How crowded "수리기록" is as a common noun, and what that means for discoverability

### Takeaway
"수리기록" is a generic, already-occupied search term. Google's Korean autocomplete for "수리 기록" is dominated by iPhone and Apple repair-history checks (아이폰 수리 기록 확인, 사설 수리 기록, 배터리 수리 기록, 중고), with car and Samsung records after them. App-store results are record-keeping apps. A blog will not easily own the bare term in search results. Distinctive strings such as the byline "경기도 핸디맨의 수리기록" or a domain are easier to own. In English, "fix record" autocompletes to record-player repair and "fix atlas" to neck-vertebra (C1 atlas) problems and a game crash.

### Cited Findings
- Google autocomplete (hl=ko, gl=kr), "수리기록": ["아이폰 수리기록", "애플 수리기록"] — [Google suggest](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&gl=kr&q=%EC%88%98%EB%A6%AC%EA%B8%B0%EB%A1%9D)
- Google autocomplete, "수리 기록": ["수리기록", "아이폰 수리 기록", "아이폰 수리 기록 확인", "아이폰 사설 수리 기록", "아이폰 배터리 수리 기록", "아이폰 수리 기록 중고", "애플 수리 기록", "애플 수리 기록 확인", "차량 수리 기록", "삼성 수리 기록"] — [Google suggest](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&gl=kr&q=%EC%88%98%EB%A6%AC%20%EA%B8%B0%EB%A1%9D)
- Google autocomplete returned no suggestions for "수리기록 블로그", "수리기록 앱", "집 수리기록" or "수리기록부". There is no existing branded or navigational demand for the term — [Google suggest](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&gl=kr&q=%EC%88%98%EB%A6%AC%EA%B8%B0%EB%A1%9D%20%EB%B8%94%EB%A1%9C%EA%B7%B8)
- App Store KR search "수리기록": 10 results, all generic record-keeping apps. They include "작업지시 대장 수리기록2026" and "설비 유지보수 점검 수리 기록2026" (Nanjing Yunxiaochuang), "FixLog 수리 기록" (Cymatix, Inc.; the US listing is "FixLog: Home Repair Log", released 2026-08-03), "RoomLog - 3D 스캔 방 하자 기록", and car-maintenance apps (차잇, Carlog, MyAutoLog, CarMGT). Rating counts were 0–90 — [iTunes Search API](https://itunes.apple.com/search?term=%EC%88%98%EB%A6%AC%EA%B8%B0%EB%A1%9D&entity=software&country=kr)
- A search engine found no app or brand named "수리기록". It found related repair apps instead: 집수리는 강쌤이다 (technician app with 수리내역서), surigo/수리고, 다수리, 픽스맨 — [집수리는 강쌤이다-기술자용](https://apps.apple.com/kr/app/%EC%A7%91%EC%88%98%EB%A6%AC%EB%8A%94-%EA%B0%95%EC%8C%A4%EC%9D%B4%EB%8B%A4-%EA%B8%B0%EC%88%A0%EC%9E%90%EC%9A%A9/id6497567169); [다수리](https://apps.apple.com/us/app/%EB%8B%A4%EC%88%98%EB%A6%AC-%EC%88%98%EB%A6%AC%ED%95%A0%EB%95%90-%EB%8B%A4%EC%88%98%EB%A6%AC/id1078974391?l=ko); [surigo](https://apps.apple.com/kr/app/vpluszip/id1588250044)
- Google autocomplete, "fix atlas": "fix atlas misalignment", "fix atlas bone", "how to fix atlas in neck", "how to fix atlas c1 misalignment", "how to fix atlas client crash", among others. "fixatlas" only suggests "fix atlas" — [Google suggest](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&gl=kr&q=fix%20atlas)
- Google autocomplete, "fix record": "fix record player near me", "fix record skip", "fix record scratch", "fix record warp", and others. "fixrecord" (no space) returned no suggestions — [Google suggest](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&gl=kr&q=fix%20record)
- Google autocomplete, "가전 수리비": ["가전 수리비 보험", "가전 수리비 특약", "가전 제품 수리비 보험", "가전 제품 수리비", "화재 보험 가전 수리비"] — [Google suggest](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&gl=kr&q=%EA%B0%80%EC%A0%84%20%EC%88%98%EB%A6%AC%EB%B9%84)

### Inferences
- People who search the bare term "수리기록" mostly want to check an iPhone's repair history (for example before buying second-hand) or a car's service record. Neither intent matches the blog. As a brand, the name will be hard to rank for on its own, and people who search it will mostly be looking for something else. It will work as a display name and byline. Blog traffic will still come from topic queries such as "가전 수리비", not from the brand name.
- Combined strings are uncontested: "경기도 핸디맨의 수리기록" and "핸디맨 수리기록" return no autocomplete and no indexed brand. They are easier to own as navigational queries once the blog exists.
- In English, both "fix atlas" and "fix record" collide with unrelated high-volume intents (chiropractic and game crashes; record players). Neither English name will be found by searching its spaced form. The unspaced forms "fixatlas" and "fixrecord" are cleaner, but usefixatlas.com already sits on "fixatlas".

### Gaps
- Naver search-result crowding for "수리기록" (블로그, 카페, 지식iN tabs) and Naver keyword-tool volumes were not checked, because automated Naver search is not allowed. Verification path: [현장] one manual Naver search and a 검색광고 키워드도구 lookup by the operator; [AI] records the counts.
- I have no Google result-count or volume data, only autocomplete. Verification path: [AI] run a Google Trends comparison of "수리기록", "아이폰 수리기록" and "집수리" in a browser session.

## Fit for a small Korean repair blog that may become a handyman business

### Takeaway
On 당근 and 숨고, Korean handyman and home-repair operators mostly use "[modifier]+집수리" or "[name]+핸디맨/닥터" names, or a person's name with a list of services. A diary-like name such as "수리기록" is unusual in that field. Paired with the person-and-region byline "경기도 핸디맨의 수리기록", it follows the same person-name pattern. Using a Korean name with a different English name has a well-known precedent: 당근 operates as "Karrot" abroad. The old pair 고장도감 ↔ fixAtlas matched in meaning (도감 ≈ atlas/compendium). After the rename to 수리기록, "Record" is the literal match and "Atlas" no longer translates the Korean name.

### Cited Findings
- 당근 local business profiles for home repair include 집수리더뷰, IDO핸디맨 ("집수리, 목수, 턴키인테리어"; basic call-out from 50,000원~), 집수리 (업데이트홈, Yongin; "1년 무상 AS"), 만능집수리, 집수리 집고, 집수리 명장 ("기본 출장비 2만원"), 집수리노가다, 달달집수리 and 가화집수리 — [집수리더뷰](https://www.daangn.com/kr/local-profile/%EC%A7%91%EC%88%98%EB%A6%AC%EB%8D%94%EB%B7%B0-hawwrqtzsq6m/); [IDO핸디맨](https://daangn.com/kr/local-profile/ido%ED%95%B8%EB%94%94%EB%A7%A8-bbxko7auzjwr/); [집수리 명장](https://daangn.com/kr/local-profile/%EC%A7%91%EC%88%98%EB%A6%AC-%EB%AA%85%EC%9E%A5-jr7q2k8oarpd/); [만능집수리](https://daangn.com/kr/local-profile/%EB%A7%8C%EB%8A%A5%EC%A7%91%EC%88%98%EB%A6%AC-cn3nwdjd49qt/)
- 당근 profile "핸디맨닥터" (경기도 성남시 분당구 이매동) describes 누수/방수 through 리모델링 work, specialising in old houses and villas. On 2026-11-20 the page showed 단골 1 — [핸디맨닥터](https://www.daangn.com/kr/local-profile/%ED%95%B8%EB%94%94%EB%A7%A8%EB%8B%A5%ED%84%B0-68ajy8gxth1o/)
- 숨고 "집 수리" pro search pages, from search-engine snippets because Soomgo blocks direct access: the title reads "내 주변, 집 수리 고수찾기, 현재 8,038명 활동중". Listed pros include 집수리곰, 수리닥터25시, 초원집수리 and 집수리 더원. The Gimpo list shows a person-name style entry, "이무건 - 싱크대막힘,변기막힘,수전교체,하수구막힘", and pros with 142–866 reviews — [숨고 집 수리](https://soomgo.com/search/pro/%EC%A7%91-%EC%88%98%EB%A6%AC/address/%EC%9D%B8%ED%85%8C%EB%A6%AC%EC%96%B4A--%EC%A2%85%ED%95%A9-%EC%9D%B8%ED%85%8C%EB%A6%AC%EC%96%B4A); [숨고 김포 집 수리](https://soomgo.com/a.%EA%B2%BD%EA%B8%B0-%EA%B9%80%ED%8F%AC%EC%8B%9C/%EC%A7%91-%EC%88%98%EB%A6%AC)
- A YouTube home-repair personality brand: the app "집수리는 강쌤이다" says it works with the home-repair YouTube channel "강쌤철물" (a person's nickname plus 철물). A 2026 article lists self-repair and interior channels such as ggyonghouse, 아야빠 TV, 인테리어룸스TV and 퇴근후살림 — [집수리는 강쌤이다](https://apps.apple.com/kr/app/%EC%A7%91%EC%88%98%EB%A6%AC%EB%8A%94-%EA%B0%95%EC%8C%A4%EC%9D%B4%EB%8B%A4/id6498548005); [ditoday](https://ditoday.com/?p=61692)
- Google autocomplete for "집수리": ["집수리닷컴", "집수리 교육", "집수리 업체", "집수리 아카데미", "집수리통", "집수리 무료 교육", "집수리 창업 현실", "집수리 봉사"]. "집수리" is the category word Koreans search, and existing brands (집수리닷컴, 집수리통) build on it — [Google suggest](https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&gl=kr&q=%EC%A7%91%EC%88%98%EB%A6%AC)
- Korean name vs. different English name: 당근 (Danggeun Market) operates abroad under the brand "Karrot", and it dropped "마켓" from its Korean name — [Korea Daily: Karrot](https://en.koreadaily.com/?p=36720); [Brunch: 당근(Karrot)은 왜 '마켓'을 지웠을까?](https://brunch.co.kr/@parkminchul/13)
- The operator's repository and its search-engine description pair "fixAtlas" with the Korean name 고장도감 — [GitHub 489156/fixAtlas](https://github.com/489156/fixAtlas)

### Inferences
Trade-offs, laid out without a recommendation:

- **fixAtlas, kept**
  - For: the repo, site code and existing materials already use it, so there is no rename cost. Its .kr, .co.kr and .io domains are free. There is no US trademark, and the name is not crowded in Korean search.
  - Against: a same-category US product, FixAtlas at usefixatlas.com, launched in 2026 and holds the YouTube handle. fixatlas.com is held by someone else. "Atlas" was the counterpart of "도감" and no longer matches "수리기록".
  - On grandiosity: I found no Korean reader evidence on whether "Atlas" sounds grandiose (see Gaps). One structural point: a one-person handyman blog calling itself an "atlas" promises a comprehensive reference. That fits a cost-comparison database (the site) better than a personal job log (the blog and byline).
- **fixRecord, switched to**
  - For: a literal match for 수리기록, so the brand is consistent across languages. Its .kr, .co.kr and .io domains are free, the YouTube and Brunch handles are free, and there is no US trademark.
  - Against: fixrecord.com was registered by someone else on 2026-03-07 and is parked. A contractor-report iPhone project called "FixRecord" existed in 2026 (repo now 404). "fix record" means record-player repair in English search. "Record" read as the loanword 레코드 suggests LP/vinyl to Korean readers, and read as 기록 it sounds plain or diary-like. That plainness suits a personal job log, but it says less about a price-comparison service. This reading is my inference, not survey evidence.
  - Renaming the GitHub repo costs little. GitHub redirects renamed repos, though I did not verify that here, so it is [unverified].
- **수리기록 as the Korean name**
  - Its strengths are being free on YouTube and as 수리기록.com and 수리기록.kr, honest and modest in tone, and a natural fit with "경기도 핸디맨의 수리기록".
  - On the other side, it is a generic phrase whose search space belongs to iPhone and car repair-history checks. It is probably weak as a registered trademark ([unverified]), and the YouTube handle surirecord is taken.
  - On 숨고 and 당근 the listing name customers see is usually "…집수리" or "…핸디맨". The marketplace profile name could differ from the blog name (for example "OO핸디맨"), with the blog linked as a portfolio. Whether to use one name everywhere or separate names is a [판단].
- **Korean and English names that differ**
  - Precedent (당근/Karrot) shows it works, but large companies can afford to build two names. For a one-person blog, Korean readers mostly see the Korean name. The English name surfaces mainly in the domain, the GitHub repo and Instagram-type handles.
  - If the domain is the only reader-facing English element, the mismatch costs little. If the site domain becomes fixatlas.kr, readers of a blog called 수리기록 meet a second name at the moment they click through.

### Gaps
- No survey, article or reader data on how Korean readers perceive "아틀라스/Atlas" (grandiose or not) or "레코드/Record" (plain or diary-like). Verification path: [현장] a short poll of a few target readers. Whether such a poll is worth running is a [판단].
- Follower and review counts for the 숨고 pros named above could not be confirmed directly because Soomgo blocks access. The 142–866 review range comes from a search-engine summary and is [unverified]. Verification path: [AI] read the indexed pages in an interactive browser session if access is approved ([판단]).
- Whether the existing sole-proprietor registration's 상호 must match the blog or marketplace name was not researched. It is outside this scope.
