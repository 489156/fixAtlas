# FixAtlas — Global Crawling & Architecture Blueprint

## 1. Executive Summary
- **Positioning**: Crowdsourced appliance repair cost transparency, safe self-check checklists, and Repair vs. Replace economic calculator.
- **Focus Categories**: Robot vacuums (Roborock, Dreame) & Cordless vacuums (Dyson).

## 2. Global Crawling & Storage Architecture
1. **Target Sources**:
   - Open repair platforms: iFixit, eReplacementParts (Step-by-step disassembly, parts catalog).
   - Official portals: Samsung, LG, Dyson, Roborock (Manuals, error codes, FAQ).
   - Regulatory FCC ID & National Radio Research Agency (Schematics, internal board diagrams — public domain).
2. **Zero-CLI Serverless Extraction**:
   - Uses Crawl4AI / Firecrawl API to extract raw web content into Markdown without local browser infrastructure.
   - LLM structured parsing turns markdown into standardized JSON-LD schema (schema.org `HowTo` + `Product`).
3. **Database Schema**:
   - Supabase PostgreSQL: `products`, `symptoms`, `repair_reports`, `manuals`.

## 3. Deployment Flow (Cloudflare Pages)
1. Push this repository to GitHub `main`.
2. Connect to Cloudflare Pages (Build preset: None / Static HTML).
3. Set root directory to `prototype/` (or move `index.html` to root).
