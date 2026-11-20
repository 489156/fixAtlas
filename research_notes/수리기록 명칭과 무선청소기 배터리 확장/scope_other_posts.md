# Scope audit for posts 02–06: what each post must cover to serve the whole search demand

Researched 2026-11-20. Unless noted, "accessed" means read on 2026-11-20. Values that come from `docs/research/R6_public_prices.md` were read on 2026-11-17 and are labelled that way. Every task line is tagged [AI], [판단] or [현장], following CLAUDE.md.

**Access log (applies to every section).** robots.txt was checked before any direct fetch.
- **Coway.** `www.coway.com/robots.txt` allows named AI and search bots and then sets `User-agent: * / Disallow: /`. I did not fetch coway.com directly. Coway figures below come from search-index snippets of the official pages.
- **Cuckoo.** `cuckoo.co.kr` returns 403 for both robots.txt and the fee page. I did not retry or work around it.
- **Daelim Bath parts mall.** `service.daelimbath.com` serves a page titled "접근 차단 안내" (access blocked) to curl, even for `/robots.txt`. I did not work around it. Drafts 04, 05 and 06 cite this mall, so `verify-sources` may fail on it the same way.
  - [AI] Run `npm run blog:verify` and check whether the 대림바스 claims still resolve.
  - [판단] If they do not, decide how the operator wants those pages verified.
- **American Standard.** `americanstandard.co.kr` returns 403.
- **Dyson.** `dyson.co.kr` returned 403 in R6, and its robots.txt disallows `/*?` and `/customer/`.
- **Daiso.** The 다이소몰 search pages timed out in headless Chromium. robots.txt allows `/pd/pdr/` and `/ds/` with `Crawl-delay: 30`. I used only search-indexed product pages.
- **INUS mall.** The 이누스몰 search returned no products. Draft 06 already records the notice that INUS bathroom sales moved to its Naver brand store. Naver is not automated, per CLAUDE.md.
- **Not touched.** kca.go.kr and Naver were not accessed. KCA data below comes from news copies only.

---

## Q1. Call-out fees (post 02): official visit, labour and parts rules of the major Korean service networks

### Takeaway
Samsung and LG now publish an identical four-tier call-out fee table: 28,000 / 33,000 / 33,000 / 38,000원, split by off-season or peak (Jun–Aug) and by daytime or evening/holiday. A post limited to LG therefore reads as if it covers Samsung too, yet the queries still split by brand. The other networks each publish their own numbers:
- Coway: 28,000/33,000 from 2026-03-01 (search snippet).
- SK매직/SK인텔릭스서비스: 28,000/32,000.
- Cuckoo: 27,000, or 30,000 in peak season (snippet, conflicting).
- 큐에이드 (formerly 위니아에이드): 28,000/33,000, or 30,000/35,000 in peak season.
- Carrier and Dyson publish no amounts.

No official multi-brand comparison exists. The closest are SBS Biz's Samsung-vs-LG articles and non-official blogs.

### Cited Findings
**Samsung Electronics Service**
- **Current fees.** From 2026-01-08 the fees are:
  - Off-season (1–5월, 9–12월): basic 28,000원 (was 25,000), surcharge 33,000원 (was 30,000).
  - Peak season (6–8월): basic 33,000원 (was 30,000), surcharge 38,000원 (was 35,000).
  - Samsung's stated reason: "물가 등 서비스 제반 비용의 지속적인 상승으로 출장비 변동이 불가피했다". — [SBS Biz 2026-01-05](https://biz.sbs.co.kr/amp/article/20000282569)
- **Fee page shows two tables.** The official fee page still shows both sets with no labels or dates: "평절기(1~5, 9~12월) : 기본 출장비 25,000원, 할증 출장비 30,000원" and "평절기(1~5, 9~12월) : 기본 출장비 28,000원, 할증 출장비 33,000원", plus the matching peak lines. — [삼성전자서비스 요금안내](https://www.samsungsvc.co.kr/info/fee), accessed 2026-11-20 (R6 noted the same on 2026-11-17)
- **When the surcharge applies.** "평일 18시 이후, 휴일(토/일/공휴일/대체휴일)은 할증 출장비를 적용합니다". The fee does not depend on distance: "출장비는 거리에 관계 없이 적용됩니다". — [삼성전자서비스 요금안내](https://www.samsungsvc.co.kr/info/fee)
- **Charged even without a repair.** Samsung charges the fee when the customer cancels after hearing the quote, when there is no fault or only a consumable needs replacing, when the product is another brand, and when the cause is external. — [삼성전자서비스 요금안내](https://www.samsungsvc.co.kr/info/fee)
- **Labour charge and total.** "수리비는 유료 수리 시 부품비를 제외한 기술료를 말하며 … 수리비 기준표를 따릅니다". The page does not publish that 기준표. Parts include 10% VAT. Total = 출장비 + 부품비 + 수리비. — [삼성전자서비스 요금안내](https://www.samsungsvc.co.kr/info/fee)
- **Re-failure guarantee.** Repairs without parts are guaranteed for 2 months; repairs with general parts for 12 months. — [삼성전자서비스 요금안내](https://www.samsungsvc.co.kr/info/fee)

**LG전자**
- **Off-season fees.** From 2025-12, LG raised its off-season fees from 25,000 to 28,000원 (basic) and from 30,000 to 33,000원 (surcharge). — [SBS Biz 2026-01-05](https://biz.sbs.co.kr/amp/article/20000282569)
- **Peak-season fees.** For 2026-06–08, peak fees became 33,000원 for weekday daytime and 38,000원 for weekday evenings and weekends/holidays (previously 30,000 and 35,000). The article says LG "올 1월 인상한 삼성전자 수준으로 올렸습니다". — [SBS Biz 2026-05-14](https://biz.sbs.co.kr/amp/article/20000310315)
- **Earlier history.** LG created a peak-season fee in 2024. — [SBS Biz (단독) 성수기용 AS 출장비 신설](https://biz.sbs.co.kr/amp/article/20000235504) (date not captured)
- **Already in draft 02.** The 28,000/33,000/38,000 figures and the rules quoted in the claims are taken from [lge.co.kr rates-warranty-guide](https://www.lge.co.kr/support/rates-warranty-guide), checked 2026-11-19.

**Coway** (search snippets only; not fetched because of robots.txt)
- **Fee change.** A notice says "변경된 내용은 2026년 3월 1일에 적용됩니다". It lists 25,000/30,000 and then 28,000/33,000, which reads as a before/after table. — [코웨이 공지 703](https://www.coway.com/cs/notice/703) (snippet)
- **English fee page.** It shows ₩28,000 on weekdays and ₩33,000 on weekends and public holidays. — [Coway Fees/Warranty](https://www.coway.com/cs/fare_guarantee) (snippet)
- **When the fee applies.** "부품 미 교체 시 수리비는 없으며, 출장비는 제품 수리 여부와 상관없이 부과됩니다". — same snippet

**SK매직 / SK인텔릭스서비스**
- **Official fee page.** The page is now at skintellixservice.com; the old service.skmagic.com URL redirects there.
  - "출장비는 출장을 요구하는 경우 적용되며 28,000원을 청구 합니다".
  - "평일 18시 이후, 휴일(토/일/공휴일/대체휴무일) 방문 시 출장비는 32,000원을 청구합니다".
  - No peak-season tier is shown.
  - Warranty table: 정수기, 세탁기, 전기청소기 and 냉장고 1년; 에어컨 and 히터 2년.
  - "분리/재설치 요금은 '23년 7월 기준 단가". — [SK인텔릭스서비스 이용 요금안내](https://www.skintellixservice.com/web/visit/charge/visitCharge.do)
- **Conflicting older page.** A search snippet of an SK매직몰 page shows a different schedule: 20,000원 basic, 24,000원 evening/holiday, plus "기본점검 비용 10,000원 … 수리하는 경우에는 기본점검 비용은 면제". — [SK매직몰 mainFeeCertify](https://www.skmagic.com/customer/mainFeeCertify) (snippet; this looks like an outdated page)

**쿠쿠** (fee page returns 403; search snippets only)
- **Fee page.** "출장비는 27,000원이 청구됩니다. (출장거리 무관) ※ 단, 성수기(6~8월) 기간에는 출장비 30,000원이 적용됩니다". "비설치제품 및 유상수리제품은 수리내용과 상관없이 출장비가 발생됩니다". Booking online gives a 3,000원 discount on the paid call-out fee. — [쿠쿠 요금·보증기간 안내](https://www.cuckoo.co.kr/customer/serviceGuide) (snippet)
- **Rentals.** During a rental, AS is free unless the customer caused the fault, and rental products cannot be booked online. — same snippet
- **Conflicts.**
  - A rental product page says "멤버십 계약기간중에는 출장비 25,000원". — [쿠쿠 렌탈 상품](https://www.cuckoo.co.kr/rental/productView?idx=260) (snippet)
  - A September 2024 notice raised a fee from 17,000원 to 20,000원; it is probably for installed products (설치품). — [쿠쿠 공지 95](https://www.cuckoo.co.kr/customer/customerNoticeView?noticeNo=95) (snippet)
  - A separate peak-season notice exists. — [쿠쿠 공지 136](https://www.cuckoo.co.kr/customer/customerNoticeView?noticeNo=136&page=1)

**위니아 → 큐에이드 (formerly 위니아에이드)**
- **Fee page.** m.winiaaid.com now redirects to q-aid.co.kr. The 출장 기본 점검비 is:
  - Off-season (1–5월, 9–12월): 28,000원 on weekdays; 33,000원 on weekends, public holidays and weekdays after 18:00.
  - Peak (6–8월): 30,000원 and 35,000원.
  - "제품수리 여부와 상관없이 발생됩니다".
  - The page names no brand and gives no effective date. — [큐에이드 서비스 요금 안내](https://www.q-aid.co.kr/service/charge/1)
- **Company status.** Winia's rehabilitation was confirmed by 광주지법 in 2025-10. On 2025-11-19 Winia disclosed it will transfer its business base to 한미기술산업 for 330억원, including the 딤채 brand. — [CEO스코어데일리 2025-11-19](https://m.ceoscoredaily.com/page/view/2025111915532971685)

**캐리어에어컨**
- **No amounts published.** The official pages say that after the warranty period, or when the user caused the fault, "출장비, 점검비, 수리비" may be charged. No amounts are given. Service line: 1588-8866. — [캐리어 출장서비스](https://www.carrier.co.kr/support/as/call.asp) (snippet)
- **Free check after self-inspection.** A self-inspection page says a customer who has done the checklist can request an expert check with "출장 및 점검비는 무상". — [캐리어 에어컨 자가 점검](https://www.carrier.co.kr/customer_service/airConditioning_self_inspection) (snippet; seasonal scope unknown)

**다이슨**
- No official fee page could be read (403).
- The only figure found is a blog claim of "출장비와 점검비를 합산하여 28,000원에서 58,000원가량". This is [unverified]. — [brunch 다이슨 AS 글](https://brunch.co.kr/@todayfather/275)
- R6 records a 2-year warranty, also from a snippet. — `docs/research/R6_public_prices.md`

**Existing comparisons**
- SBS Biz has run a series comparing Samsung and LG increases, which it says alternate roughly every six months. — [SBS Biz 2026-01-05](https://biz.sbs.co.kr/amp/article/20000282569), [SBS Biz 2026-05-14](https://biz.sbs.co.kr/amp/article/20000310315)
- A separate SBS article notes that Samsung and LG publish expected repair costs abroad but only the call-out fee in Korea. — [SBS Biz 깜깜이](https://biz.sbs.co.kr/amp/article/20000229575)
- The only multi-brand roundup found is a non-official blog. — [yellowit 삼성·LG·위니아·쿠쿠·캐리어](https://yellowit.co.kr/it-review/%EC%82%BC%EC%84%B1-lg-%EC%9C%84%EB%8B%88%EC%95%84-%EC%BF%A0%EC%BF%A0-%EC%BA%90%EB%A6%AC%EC%96%B4-%EA%B0%80%EC%A0%84-%EA%B3%A0%EC%9E%A5%EC%A6%9D%EC%83%81-%EC%98%A4%EB%A5%98%EC%BD%94%EB%93%9C-%ED%95%B4/)

### Inferences
- **Minimum coverage set for post 02.** All amounts in 원.

| Network | Off-season basic | Off-season evening/holiday | Peak basic | Peak evening/holiday | Status |
|---|---|---|---|---|---|
| 삼성전자서비스 | 28,000 | 33,000 | 33,000 | 38,000 | official page plus news; the page still shows the old table too |
| LG전자 | 28,000 | 33,000 | 33,000 | 38,000 | official, in draft |
| 코웨이 | 28,000 | 33,000 | – | – | snippet only (robots) |
| SK인텔릭스서비스 (SK매직) | 28,000 | 32,000 | – | – | official page; the old mall page conflicts |
| 쿠쿠 | 27,000 | ? | 30,000 | ? | snippet only (403); conflicting figures |
| 큐에이드 (위니아에이드) | 28,000 | 33,000 | 30,000 | 35,000 | official page, no date or brand |
| 캐리어 | not published | | | | gap |
| 다이슨 | not published / 403 | | | | gap |

- **Why the post must change.** Samsung and LG now charge identical amounts, so the "삼성전자서비스가 빠진 이유" section in draft 02 is no longer a coverage choice. Leaving Samsung out drops the larger query family (see Q6). A cross-brand table of nine rows is the defensible scope, and the closest public comparison covers only two brands.
- **What actually differs between brands.** The useful content is the rules, not the base amount:
  - whether there is a peak tier (Coway and SK have none);
  - whether a separate inspection fee exists (old SK매직 page: 10,000원);
  - online-booking discounts (Cuckoo 3,000원);
  - whether rentals are covered (Coway, SK and Cuckoo rentals are free AS during the contract unless the customer caused the fault).
- **Retitle.** The post needs a multi-brand title. LG stays as one row, not as the frame.

### Gaps
- **Coway exact figures** [unverified]. Taken from snippets because robots.txt blocks generic agents.
  - [판단] Decide whether a one-time manual browser read of coway.com/cs/notice/703 by the operator is acceptable.
  - [AI] Otherwise, look for a news copy of the 2026-03-01 change.
- **Cuckoo amounts and evening/holiday surcharge** [unverified]: the site returns 403.
  - [AI] Search for a news or 소비자원 copy.
  - [현장] Ask 쿠쿠 고객센터 1588-8899.
- **Carrier and Dyson** publish no amounts.
  - [현장] Phone inquiry to Carrier (1588-8866) and Dyson (1588-4253).
  - [판단] Decide whether a "not published" row is acceptable.
- **SK매직 conflict** between 28,000/32,000 and 20,000/24,000+10,000.
  - [AI] Re-read both pages with a browser and capture which one is linked from the current skmagic.com 고객지원.
- **Brands served by 큐에이드** (딤채, 위니아 aircon, or others) and its effective date are unknown.
  - [AI] Read the q-aid.co.kr main page and its about/notice pages.
- **위니아전자 (old 대우전자 / 위니아대우)** status and service network were not researched.
  - [AI] Search news for "위니아전자 파산 AS".
- **Naver monthly volumes** exist only for LG seeds.
  - [AI] Run `npm run blog:demand` with the brand seeds in Q6.
- **Rule 3 ranking basis (CLAUDE.md, 2026-11-20).** The rule asks for a dated source for "상위 브랜드". I did not research a dated market-share figure for the appliances behind these networks: aircon (삼성, LG, 캐리어, 위니아), washers and fridges, and rental water purifiers (코웨이, SK매직, 쿠쿠).
  - [AI] Search news for 2025–2026 share figures, e.g. aircon, and 정수기 렌탈 계정 수.

---

## Q2. Robot vacuums (post 03): top brands in Korea, their AS network and warranty, and per-brand defect data

### Takeaway
Roborock is reported at 50% or more of Korean robot-vacuum sales by value in 2025, but every source is either "알려졌다" or a company claim. An unnamed industry dataset for 2025 H1 puts the others as follows:
- Samsung in the high teens, and LG at about 7%.
- Dreame growing in the high-end band, from 5% to 12%.
- Everybot (에브리봇, Korean) leading the under-60만원 band with 30–40%.

AS networks differ sharply. Samsung uses its own 169 centers, Roborock uses a distributor plus Hi-Mart drop-off, and Dreame relies on partners only. The KCA's own damage-relief statistics have no brand split. The only official per-brand finding is the 2025-09 KISA·KCA security test, which named Narwal, Dreame and Ecovacs.

### Cited Findings
**Market share**
- **Roborock.** "로보락이 국내 로봇청소기 시장에서 차지하는 점유율은 지난해 연간 판매액 기준 50% 이상을 차지한 것으로 알려졌다". No source is named. — [한국경제 2026-07-09](https://www.hankyung.com/article/202607095894g)
- **Roborock's own claim.** "50% 넘는 점유율을 갖고 있고 한국 '넘버원'". — [머니투데이 2026-02-26](https://www.mt.co.kr/industry/2026/02/26/2026022614561735027) (search snippet); [디지털데일리 2026-02-26](https://www.ddaily.co.kr/page/view/2026022613253664765) ("시장 1위(점유율 50% 이상)")
- **Domestic brands combined.** "업계 추산으로 삼성전자와 LG전자 등 국내산 제품의 점유율은 30% 미만이다". — [더팩트 2026-02-11](https://news.tf.co.kr/read/economy/2292112.htm)
- **Brand split, 2025 H1** (unnamed "가전업계 점유율 자료"):
  - Roborock: "고가형(130만원 이상) 제품군 판매 점유율은 50%대 중반으로 내려앉았다".
  - Dreame: high-end share rose from 5% to 12%.
  - Samsung and LG: "삼성전자는 전년과 비슷한 10% 후반대 점유율을 유지했으며 LG전자는 7% 수준".
  - Everybot: "에브리봇은 판매 점유율이 30~40%" in the under-60만원 band.
  - Source: [아시아경제 2025-10-16](https://view.asiae.co.kr/article/2025101523251094606)
- **Global context.** IDC data for H1 2025 shows Roborock at 16% of units and 22.3% of revenue. iRobot had 13.7%, Ecovacs 13.5%, Xiaomi 9.7% and Dreame 8.0% of units. — [파이낸셜뉴스 2026-01-15](https://www.fnnews.com/news/202601131544109611)
- **Reader poll, not sales** (한경 맞짱대결, 2026-06-30 to 07-08, n=3,194): Samsung's 2026 model 63%, LG 27%, Roborock S10 MaxV Ultra 10%. — [한국경제 2026-07-09](https://www.hankyung.com/article/202607095894g)

**AS network and warranty**
- **Samsung.** "전국 169개 서비스센터 가운데 117개 센터에 로봇청소기 전담 서비스 인력을 확충". — [더팩트 2026-02-11](https://news.tf.co.kr/read/economy/2292112.htm). Samsung follows the same 출장비 schedule as in Q1. I found no official robot-vacuum warranty page; R6 also found none.
- **LG.** 청소기 is listed as a general product with a 1-year warranty, and core parts of the inverter motor have separate terms. — [LG 출장비 안내 seq=184](https://www.lge.co.kr/support/visit-center-reservation?seq=184), via R6 (2026-11-17)
- **Roborock network and terms.**
  - 15 official centers run by distributor 팅크웨어모바일, open 8:00–18:00.
  - 315 Lotte Hi-Mart stores accept repairs.
  - 출장 AS for major models from 2026-03.
  - Standard warranty 2 years. A launch promotion (2026-02-27 to 03-08) added 3 years, for 5 years in total.
  - Source: [디지털데일리 2026-02-26](https://www.ddaily.co.kr/page/view/2026022613253664765)
- **Roborock warranty conflict.**
  - The official kr.roborock.com warranty page said 1 year, with batteries and consumables excluded. — [로보락 서비스 및 보증](https://kr.roborock.com/pages/roborock-service-warranty), via R6 (2026-11-17)
  - A 2025-02 report said 11 official centers plus 11 Hi-Mart repair centers, 22 in total. — [뉴데일리 2025-02-19](https://biz.newdaily.co.kr/site/data/html/2025/02/19/2025021900110.html) (search snippet)
- **Dreame network.**
  - About 29 partner centers through 코오롱글로벌 and about 30 through SK네트웍스서비스.
  - About 310 Lotte Hi-Mart stores accept drop-offs.
  - "현재로서는 저희가 직접 하고 있지 않은 것이 사실" (no direct AS).
  - Flagship X60 gets 5 years of AS.
  - Source: [디지털데일리 2026-08-21](https://www.ddaily.co.kr/page/view/2026082115171226719)
- **Dreame warranty table.** Robot body 2 years, battery 1 year, main brush and tanks 6 months, consumables none. — [드리미 A/S 정책](https://store.kr.dreametech.com/pages/a-s-policy), via R6 (2026-11-17)
- **Ecovacs.** 1-year warranty; consumables and batteries excluded; "배송 및 취급 비용이 청구될 수 있음". — [ECOVACS 한국 보증서](https://help.ecovacs.com/kr/support/warranty), via R6 (2026-11-17). No Korean AS-center count was found.
- **Xiaomi.** Robot Vacuum 6/6MAX premium service: 3-year free warranty when bought through official Korean channels, and replacement with a new unit for a quality fault within 1 year. — [Xiaomi 로봇청소기 6/6MAX 프리미엄](https://www.mi.com/kr/support/terms/xiaomi-robot-vacuum-6-series-premium-service) (search snippet)

**Defect, complaint and security data by brand**
- **KCA damage relief, no brand split in the coverage found.** 274 cases from 2022 to 2025-06; 74.5% (204) were product defects; sensor defects were most common at 24.9% (42). The news coverage gives no per-brand counts. — [SBS Biz](https://biz.sbs.co.kr/amp/article/20000252700); draft 03's own claims
- **KISA·KCA security test, 2025-09-02.** Six products were tested.
  - Narwal, Dreame and Ecovacs had weak user authentication.
  - Narwal and Ecovacs let third parties view stored photos or videos without authentication.
  - Dreame allowed access to live camera view and the photo album, and one Dreame product risked leaking name and contact details.
  - All six had insufficient firmware security settings.
  - Samsung and LG rated "상대적으로 우수".
  - Sources: [경향신문 2025-09-02](https://www.khan.co.kr/article/202509021447001), [MTN 2025-09-02](https://news.mtn.co.kr/news-detail/2025090211280251781), [KISA](https://www.kisa.or.kr/402/form?postSeq=2529)
- **Models named and Roborock's result.**
  - Some reports name the tested models as 나르왈 프레오 Z 울트라, 드리미 X50 울트라 and 에코백스 디봇 X8 프로 옴니 (search summary).
  - SBS says Roborock's product was also relatively well secured. — [SBS Biz](https://biz.sbs.co.kr/amp/article/20000256895)

### Inferences
- **Minimum coverage set for post 03.** One row per brand:
  - Roborock, Samsung, LG, Dreame, Ecovacs, Narwal, Xiaomi and 에브리봇 (Everybot).
  - Everybot belongs because it leads the low-price band and that segment is unrepresented.
  - Columns: warranty (body and battery), AS route (own centers, partner centers, Hi-Mart drop-off, courier, 출장), 출장비 where published, and the 2025-09 security result.
- **What the current draft covers.** It is framed by dispute rules (the 소비자분쟁해결기준), which are brand-neutral. That part is fine. What it lacks is the brand-specific answer behind the "로보락 as / 드리미 as / 에코백스 as" queries (Q6): where to send it, how long the warranty is, and who pays shipping.
- **Warranty length is the clearest differentiator.** It ranges from 1 year (Ecovacs; Roborock's official page) to 2 years (Dreame body; Roborock per news) and 3 years (Xiaomi 6 series), with promotional 5-year terms (Roborock and Dreame flagships). This drives the "3회 수리" eligibility window the post explains.
- **Leave out Dyson and iRobot rows.** Dyson's robot share is unknown. iRobot Korea was unreachable in R6.

### Gaps
- **No named-source Korean share data** [unverified]. All figures are "알려졌다", a company claim, or an unnamed dataset.
  - [AI] Search for GfK or 컨슈머인사이트 data via news copies.
  - [판단] Decide whether to print shares at all, or only "업계 추산".
- **Roborock warranty conflict** (1 year on the official page vs 2 years in news).
  - [AI] Re-read kr.roborock.com/pages/roborock-service-warranty and capture it.
  - [현장] If the conflict remains, ask 로보락 고객센터.
- **Narwal Korea**: warranty and AS network not found.
  - [AI] Read Narwal's Korean official site and the 쿠팡 official-store notice pages.
- **Ecovacs Korea**: number of AS centers not found.
  - [AI] Read help.ecovacs.com/kr/support/contact-us.
- **Everybot**: warranty and AS not researched. [AI]
- **Per-brand recalls.** I did not search the 제품안전정보센터 (safetykorea.kr) recall database.
  - [AI] Check its robots.txt, then run single manual queries per brand.
- **Per-brand KCA damage-relief counts** do not appear in any permitted copy.
  - [판단] Decide whether to request them from KCA (정보공개청구), which also requires a [현장] filing.
- **Per-brand user AS experience**, which rule 3 now requires, was not collected.
  - [AI] Gather dated news reports and KCA case write-ups that name a brand, from permitted copies only.
  - [AI] Gather 자사 제보 from the site database.
  - Naver cafés and blogs are not scraped.
- **Best ranking basis available.** The 2025 H1 brand split in 아시아경제 (2025-10-16) is the only dated source. It has no named data provider. It does satisfy rule 3's "근거와 날짜" only weakly.

---

## Q3. Kitchen faucets (post 04): main brands, prices, cartridge compatibility, AS policy, generic parts

### Takeaway
I found no faucet market-share data anywhere. The share data that exists is for sanitary ware (도기):
- 대림바스 61.8%.
- 계림요업 (the INUS brand) 25.3%, in 2025, by domestic makers' shipments.
- This excludes imports such as American Standard and Kohler.

Search demand shows people looking up faucet parts by brand: 대림바스, 한샘, 아메리칸스탠다드, 로얄 and 이누스 all autocomplete to "카트리지 (교체)". The post should therefore be organised as "find your brand's cartridge" rather than a single-brand price list.

### Cited Findings
**Market share**
- **Sanitary ware, 2025.** "대림바스는 2025년 기준 국내 위생도기 시장에서 점유율 61.8%를 기록했다" and "2위 계림요업은 25.3%의 점유율에 그쳤다". The source is the 대한도자기·타일공업협동조합's annual shipment data for domestic makers. — [이코노미스트 2026-05-11](https://economist.co.kr/article/view/ecn202605040011)
- **No faucet share found.** The same article's only faucet datum: Black Collection monthly sales at the 논현 showroom rose 69% year on year. — same source
- **History.** 계림 led 대림 in 2002 (33% vs 29%), and the order reversed by 2007 (31% vs 28%). — [이데일리 via 네이트 2025-05-18](https://news.nate.com/view/20250518n05206) (page text garbled; figures read with low confidence)
- **Imported brands.** Imported brands cost about 5–40% more than comparable domestic faucets and sanitary ware. — [네이트 2022-12-19](https://news.nate.com/view/20221219n04411) (search snippet; older than 24 months)

**Prices and AS already verified in draft 04** (2026-11-19)
- 대림바스 kitchen cartridge 18,000원; compatible models DL-K1015, DL-K1615, YK7A15 and BC639. — [대림바스 AS부품몰 152](https://service.daelimbath.com/product/152)
- 대림바스 metal hose P4209 19,000원. — [대림바스 AS부품몰 206](https://service.daelimbath.com/product/206)
- 한샘 ML101 faucet 54,900원 (list price 129,900원). — [한샘몰](https://store.hanssem.com/goods/1079319)
- 한샘 방문점검비 50,000원 (weekday daytime) and 60,000원 (holiday or night), with labour charged separately. — [한샘 AS 기준](https://as.hanssem.com/reserve/ServiceChargeInfomation/view.as)
- 대림바스 free AS for 1 year after installation; a 출장비 applies if the customer caused the fault (amount not published). — [대림바스 AS 안내](https://www.daelimbath.com/download/as_guide)
- 이누스 출장비 varies by region (amount not published). — [이누스 서비스요금](https://cs.inusbath.com/ISDS/view/view.do?pageCd=resGuid)

**Other brands**
- **American Standard.** Cartridge M1BK18/651852 listed at 15,000원 by third-party seller 경일shop1 (not official). AS line 1588-5903, as shown on marketplace listings. — [G마켓](https://item.gmarket.co.kr/Item?goodsCode=1759756280), [SSG](https://www.ssg.com/item/itemView.ssg?itemId=1000035466710) (search snippets)
- **Royal & Company, Kohler, Kaiser.** No official price or AS-fee page found. Note that royal.co.kr is Royal Hotel Seoul, not 로얄앤컴퍼니.
- **Cartridge sizes.** Cartridges come in diameter series (25, 35 and 40 mm; e.g. 신한세라믹 35GR/35SR vs 40SR/40SF). Retail listings also specify the stem spline count ("20 point broach") and length. Diameter alone does not guarantee a fit. — [코머신 신한세라믹 35mm](https://www.komachine.com/ko/companies/shinhan-ceramic/products/131130-cartridge-35mm-cartridge-35gr), [코머신 40mm](https://www.komachine.com/ko/companies/shinhan-ceramic/products/131122-cartridge-40mm-cartridge-40sr), [Noel's 35mm Kerox](https://noelsplumbingsupply.com/product/35mm-kerox-ceramic-cartridge-kdz-35-with-20-point-broach-rotary-turn)
- **Daelim's own warning.** "모델별 카트리지 규격 및 체결 방식이 다를 수 있습니다". — [대림바스 AS부품몰 152](https://service.daelimbath.com/product/152), quoted in draft 04

### Inferences
- **Minimum coverage set for post 04:** 대림바스, 이누스, 아메리칸스탠다드, 한샘, 로얄앤컴퍼니 and 콜러, plus a "generic 35/40 mm cartridge" row.
  - The first five have "<brand> 수전 카트리지 (교체)" autocomplete (Q6).
  - 콜러's suggestions are purchase-oriented ("가격", "주방 수전"), so a short price row is enough.
  - 카이저 has no autocomplete and no official source. Drop it.
- **Where to spend effort.** The draft already has verified 대림바스 and 한샘 prices. The cheapest high-value addition is a "how to identify your cartridge" table (brand, model-number location, diameter, spline) plus each brand's AS phone and visit fee. Price rows for brands without an official parts shop (INUS, American Standard, Royal) would come from marketplaces, which the R6 rules exclude. They need a [판단].

### Gaps
- **No faucet market-share figure exists in the sources searched.**
  - [AI] Search 조달청 or KOSIS data, or 한국수전금구공업협동조합 statistics.
  - [판단] Decide whether "위생도기 점유율" may stand in as a proxy (it excludes imports).
  - This blocks rule 3's "판매 순위의 근거와 날짜" for posts 04, 05 and 06.
  - The fallback ranking basis is Google autocomplete breadth (Q6) plus the 2025 위생도기 shipment shares. It must be labelled as such.
- **INUS official part prices.** INUS sells through its Naver brand store, which is off-limits to automation.
  - [판단] Decide whether the operator reads that store manually.
  - [현장] Alternatively, ask the 이누스 고객센터.
- **American Standard Korea and Royal & Company** official AS fees and warranty.
  - [AI] Find the correct official domains (americanstandard.co.kr returns 403).
  - [현장] Phone inquiry to 1588-5903 and the Royal 고객센터.
- **Cross-brand cartridge compatibility** (e.g. a 대림 cartridge in an INUS body) is [unverified].
  - [AI] Collect each brand's published cartridge diameter and spline from spec PDFs (대림 `upload/product/*_do.pdf` pattern).
  - [현장] A physical fit test is optional.

---

## Q4. Toilet fill valves (post 05): brands, prices, cross-compatibility, AS, generic and Daiso parts

### Takeaway
Fill valves are a parts-maker market. 와토스코리아 holds about half of Korea's sanitary-ware parts market of about 300억원 a year, and Chinese parts have taken an estimated 20–30%. Toilets themselves are dominated by 대림바스 (61.8%) and 계림요업/INUS (25.3%). The minimum set is therefore:
- 대림바스, for both two-piece and one-piece toilets;
- 이누스;
- 아메리칸스탠다드;
- 와토스, as the universal aftermarket valve.

Daiso search demand exists ("필밸브 다이소"), but I found no fill valve on 다이소몰.

### Cited Findings
- **Parts market.** "양변기 부속품 시장은 연간 300억원 규모로 추산된다". 와토스코리아 has "국내 위생도기 부품 시장의 50% 정도"; Chinese makers have "국내 시장의 약 20~30%를 잠식". "중국산 부품은 … 가격은 30% 이상 저렴". The article names 대림바스 and 계림요업 as makers that had used domestic parts. — [한국경제 2025-08-29](https://www.hankyung.com/article/2025082908871)
- **Toilet market.** Toilet sanitary-ware share in 2025: 대림바스 61.8%, 계림요업 25.3%. — [이코노미스트 2026-05-11](https://economist.co.kr/article/view/ecn202605040011)
- **Already verified in draft 05** (2026-11-19):
  - 대림바스 two-piece fill valve 14,500원 (CT-761S and others). — [대림바스 AS부품몰 160](https://service.daelimbath.com/product/160)
  - One-piece fill valve 25,700원 (CC-207/208/213/815; "구형 분사펌프 적용 사용불가"). — [대림바스 AS부품몰 141](https://service.daelimbath.com/product/141)
  - Free parts AS within 6 months. — [대림바스 AS부품몰 160](https://service.daelimbath.com/product/160)
  - "필밸브의 규격, 높이, 급수 연결 방식이 다를 수 있습니다". — [대림바스 AS부품몰 160](https://service.daelimbath.com/product/160)
- **와토스 WP20 silent fill valve.** Lowest price on 다나와 2,300원; a 쿠팡 seller lists 5,100원. No compatibility list was found. — [다나와](https://prod.danawa.com/info/?pcode=2276464) (search snippet; [unverified])
- **Possible 와토스 in INUS toilets.** A 쿠팡 seller lists an "이누스 계림 와토스 변기 부속품 높이조절 필밸브 + 전용 조립공구" set for 13,000원. This hints that 와토스 parts sit in INUS toilets but does not prove OEM supply. — [쿠팡](https://www.coupang.com/vp/products/6242758028) (search snippet; [unverified])
- **대림 model list.** A seller lists the 대림 two-piece fill valve for CC-720/723/724/728/730/761–776. — [쿠팡](https://www.coupang.com/vp/products/8796065982) (search snippet; seller claim)
- **Contacts.** 와토스코리아 고객센터 032-563-3686 (from an SSG listing). — [SSG 와토스 WTG258](https://m.ssg.com/item/itemView.ssg?itemId=1000062465724)
- **Daiso.** 다이소몰 search-indexed items include 세면대 자동 팝업, traps and filters, but no fill valve. — [다이소몰 검색 색인](https://www.daisomall.co.kr/pd/pdr/SCR_PDR_0001?pdNo=1012144). A 다이소몰 mobile list showed 양변기 고압호스 60cm at 1,300원 (listing date unknown). — [다이소몰 모바일 목록](https://m.daisomall.co.kr/shop/search.php?nset=1&page=2&max=30&search_text=욕실용품&orderby=&cid=020012010000000&depth=3) (search snippet; [unverified])

### Inferences
- **Minimum coverage set for post 05:**
  - 대림바스 two-piece and one-piece valves (already in the draft);
  - 이누스 one-piece and two-piece valves;
  - 아메리칸스탠다드;
  - 와토스 universal or height-adjustable valves, a sold-separately aftermarket part named in autocomplete (Q6);
  - an explicit "다이소에는 필밸브가 없고 고압호스만 있다" line, if [AI] confirms it.
- **Make compatibility the frame.** The demand ("필밸브 호환", "원피스 필밸브") and Daelim's own warning both point to compatibility as the deciding question, not price. The post should explain two-piece vs one-piece, height adjustment and inlet thread, and why one-piece valves are brand-specific (Daelim's "구형 분사펌프 사용불가" note).
- **와토스 is the real alternative to brand parts.** Given its ~50% share of domestic parts, its universal valve is probably what a hardware store hands over. Its price advantage is large (2,300–5,100원 vs 14,500원), but those prices are [unverified].

### Gaps
- **INUS and American Standard official fill-valve prices.** [AI] Check whether any official, non-Naver price exists; otherwise [판단] (Naver brand store or marketplace).
- **와토스 compatibility list and official price.** watos.co.kr did not resolve.
  - [AI] Find the official 와토스 site or catalog PDF.
  - [현장] Phone inquiry to 032-563-3686.
- **Daiso fill valve.** None was found online, though stores may stock one.
  - [AI] Re-try a single 다이소몰 product search with the 30s crawl delay.
  - [현장] Optional store check.
- **Which 와토스 valves are OEM inside which toilets** is unverified. [AI] Look for teardown or catalog evidence.

---

## Q5. Basin faucets and pop-up drains (post 06): brands, prices, compatibility, AS, generic and Daiso parts

### Takeaway
The draft covers INUS, plus Hanssem's 6,000원 pop-up and its visit fee. Demand covers at least four brands:
- "대림바스 세면대 팝업 교체";
- "아메리칸스탠다드 세면대 팝업 (교체)";
- "이누스 세면대 팝업 교체";
- "이누스 세면대 수전 교체".

There is also a generic "세면대 폽업 사이즈/종류" cluster. Daiso sells a 5,000원 "세면대 자동 팝업" (out of stock when indexed) and traps, so a generic route exists.

### Cited Findings
- **Already in draft 06** (2026-11-19):
  - 이누스 GF-0110 one-hole basin faucet 65,000원. — [이누스몰](https://m.inusmall.com/product/detail.html?product_no=97)
  - I-트랩 wall drain 16,000원 and floor drain 18,000원. — [이누스몰 482](https://inusmall.com/product/detail.html?product_no=482), [483](https://inusmall.com/product/detail.html?product_no=483)
  - Basin faucet range 65,000–140,000원. — [이누스몰 세면수전 목록](https://inusmall.com/product/list.html?cate_no=34)
  - 한샘 자동폽업 물마개 6,000원. — [한샘몰](https://store.hanssem.com/goods/683422)
  - Free-AS periods of 1 year for 한샘, 이누스 and 대림바스. — [한샘](https://as.hanssem.com/reserve/ServiceChargeInfomation/view.as), [이누스](https://cs.inusbath.com/ISDS/view/view.do?pageCd=resGuid), [대림바스](https://www.daelimbath.com/download/as_guide)
- **Daiso.** "세면대 자동 팝업" 5,000원, shown as sold out when indexed. Daiso also lists "세면대 벽면 트랩 P형" and "세면대 일자 트랩". — [다이소몰 1012144](https://www.daisomall.co.kr/pd/pdr/SCR_PDR_0001?pdNo=1012144), [1043458](https://www.daisomall.co.kr/pd/pdr/SCR_PDR_0001?pdNo=1043458), [1012143](https://www.daisomall.co.kr/pd/pdr/SCR_PDR_0001?pdNo=1012143) (search snippets; [unverified] until a page capture)
- **Daelim basin pop-up price.** None found. A search of the Daelim parts mall surfaced only an unrelated 비데 remote page. The mall lists "세면기부품" as a category. — [대림바스 AS부품몰](https://service.daelimbath.com/) (snippet; direct fetch blocked)
- **American Standard and Royal basin parts.** Only marketplace listings exist, e.g. "로얄토토세면기수전 RLSU10 원홀수전". — [쿠팡](https://www.coupang.com/vp/products/5421819192) (search snippet)

### Inferences
- **Minimum coverage set for post 06:**
  - pop-ups from 대림바스, 이누스, 아메리칸스탠다드 and 한샘;
  - one-hole basin faucets from 대림바스, 이누스, 아메리칸스탠다드 and 로얄;
  - generic or Daiso pop-ups and traps.
- **Lead with the brand-neutral split.** Pop-up mechanisms split into push-type (자동, the Daiso and Hanssem type) and lever/rod type (the Moen pivot-rod explanation already in the draft). That split matters more than brand, so lead with it and use brand rows for prices and AS.
- **Narrow framing.** The draft's "반다리 세면대" framing is narrow. The autocomplete demand is for "세면대 팝업" and "세면대 수전" in general (Q6). 반다리 can be one subsection rather than the title.

### Gaps
- **대림바스 basin pop-up and one-hole faucet prices.** [AI] Retry a single browser read of service.daelimbath.com; if it is still blocked, [판단] on access.
- **American Standard basin pop-up official price.** [AI] Find the official domain; [현장] phone 1588-5903.
- **Pop-up thread and size standardisation** (whether 32 mm basin waste is universal) is unverified. [AI] Read manufacturers' construction drawings (대림 `_do.pdf`, INUS detail images).
- **Daiso pop-up compatibility and stock.** [AI] Capture the product page; [현장] optional store check.

---

## Q6. Demand: which brands and models are searched most

### Takeaway
Google autocomplete (ko/kr) on 2026-11-20 shows strong brand-level query families on four fronts:
- 출장비: Samsung matches LG, and aircon is the multi-brand product.
- Robot-vacuum AS: Roborock, Dreame and Ecovacs return 10 suggestions each, Narwal 7, Samsung 5, Xiaomi 3, LG 1.
- Faucet parts: 대림바스, 한샘, 아메리칸스탠다드 and 로얄 return 10 each, 이누스 7.
- Fill valves: 대림바스, 와토스 and 이누스 return 5 each, 아메리칸스탠다드 3, 로얄 0.

The Naver volumes already recorded in each draft are small for LG-only 출장비 seeds (<10 to 40 a month) and large for generic repair seeds. The generic plus multi-brand framing therefore covers far more of the demand.

### Cited Findings
Google autocomplete, endpoint `suggestqueries.google.com/complete/search?client=firefox&hl=ko&gl=kr`, collected 2026-11-20 with a 1 s delay between queries. Google returns at most 10 suggestions, so the count is a breadth signal, not volume.
- **출장비 (02).**
  - "삼성 출장비" (10): 출장비용, 서비스 센터 출장비, 전자 서비스 출장비, 에어컨/세탁기/냉장고 출장비, and others.
  - "에어컨 출장비" (10): includes 캐리어, lg, 삼성 and 위니아 에어컨 출장비.
  - "세탁기 출장비" (4): lg and 삼성.
  - "쿠쿠 출장비" (3): 밥솥 출장비, 서비스 출장비.
  - "위니아 출장비" (2) and "캐리어 출장비" (2): both add 에어컨 출장비.
  - "코웨이 출장비" and "sk매직 출장비": only the seed itself.
  - "다이슨 수리비" (6): 청소기, 드라이기 and 에어랩 수리비용.
- **Robot-vacuum AS (03).**
  - "로봇청소기 as" (6): includes "비교", "순위" and "비용".
  - "로보락 as" (10): 센터, 기간, 하이마트, 접수.
  - "드리미 as" (10): 기간, 하이마트, 택배.
  - "에코백스 as" (10): 센터, 기간, 신청.
  - "나르왈 as" (7): 센터, 박스.
  - "삼성 로봇청소기 as" (5).
  - "샤오미 로봇청소기 as" (3).
  - "lg 로봇청소기 as" (1).
- **Faucets (04).**
  - "대림바스 수전" (10): 카트리지 교체, 부품, 분해.
  - "한샘 수전" (10): 교체 비용, 카트리지 (교체), 부품.
  - "아메리칸스탠다드 수전" (10): 부품, 카트리지 교체, 부속.
  - "로얄 수전" (10): 카트리지 (교체), 로얄 앤 컴퍼니 수전.
  - "이누스 수전" (7): 카트리지, 세면대 수전 교체.
  - "콜러 수전" (10): purchase-oriented.
  - "카이저 수전" (0).
  - "수전 카트리지" (10): 규격, 종류, 철물점, 35mm, 교체 비용.
- **Fill valves (05).**
  - "필밸브" (10): includes 다이소.
  - "대림바스 필밸브" (5): 원피스, 투피스.
  - "와토스 필밸브" (5): 높이조절, 원피스.
  - "이누스 필밸브" (5): 원피스.
  - "아메리칸스탠다드 필밸브" (3).
  - "로얄 필밸브" (0).
  - "필밸브 호환" (2): 변기 필밸브 호환.
- **Basins (06).**
  - "세면대 팝업" (10) and "세면대 폽업" (10): 사이즈, 종류, 구조, 교체 비용.
  - "대림바스 팝업" (3).
  - "아메리칸스탠다드 팝업" (3).
  - "이누스 팝업" (1).
- **Naver volumes already in the drafts** (2026-11-19, PC/mobile per month):
  - LG 출장비 seeds: <10/<10 up to 10/40 (lg서비스센터출장비).
  - 싱크대수전교체비용 250/1460.
  - 변기필밸브교체 270/1780.
  - 세면대팝업교체 300/1330.
  - 로봇청소기고장 30/60.
  - Source: `scale:` lines of `docs/blog/naver/02-…06-*.md`.

### Inferences
- **Post 02.** The LG-only scope captures the smallest query family. Samsung has at least as many autocomplete variants. Aircon queries are where users name several brands (캐리어, 위니아, 삼성, lg). A "가전 출장비 비교 (삼성·LG·코웨이·SK·쿠쿠·위니아·캐리어)" scope, with aircon peak-season emphasis, matches the demand.
- **Post 03.** The demand is brand-specific AS logistics (센터 위치, 기간, 하이마트, 택배), and "로봇청소기 as 비교/순위" exists as a query. The dispute-rule content should stay, and a per-brand AS table answers the larger query set.
- **Posts 04–06.** Brand plus "카트리지 / 필밸브 / 팝업 교체" is the dominant pattern. A brand-identification table (where the model number is, which part fits, official price, AS phone) serves the most queries per post.

### Gaps
- **Naver volumes for the new brand seeds** have not been collected.
  - [AI] Run `npm run blog:demand` (Naver 검색광고 키워드도구) with seeds such as 삼성출장비, 코웨이출장비, 쿠쿠출장비, 위니아에어컨출장비, 캐리어에어컨출장비, 로보락as, 드리미as, 에코백스as, 나르왈as, 대림바스수전카트리지, 한샘수전카트리지, 아메리칸스탠다드수전카트리지, 로얄수전카트리지, 와토스필밸브, 이누스필밸브, 대림바스팝업.
- **Raw autocomplete output** is not saved to `docs/research/data/suggest/`.
  - [AI] Re-run through `scripts/demand-research.mjs` so the JSON is stored with the other suggest files. The output above came from the same endpoint and parameters.
