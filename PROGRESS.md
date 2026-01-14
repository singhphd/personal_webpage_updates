# Project Progress & Roadmap

## Phase 1: Infrastructure Setup
- [x] **Initialize Repository**
    - [x] Create new GitHub repo (connected).
    - [x] Initialize git locally.
- [x] **Scaffold Next.js Project**
    - [x] Run `npx create-next-app@latest` with TypeScript, Tailwind CSS, and App Router.
    - [x] Clean up default boilerplate code.
- [x] **Configure GitHub Pages**
    - [x] Update `next.config.ts` with `output: 'export'`.
    - [x] Add `basePath: "/personal_webpage"` for subdirectory deployment.
    - [x] Verify local build with `npm run build`.

## Phase 2: The Data Pipeline (Backend-for-Frontend)
- [x] **Google Scholar Integration** (Primary)
    - [x] Identify Google Scholar ID (`eCZJkKcAAAAJ`).
    - [x] Create `scripts/sync-scholar.py` using `scholarly` library.
    - [x] Fetch author stats (citations, h-index, i10-index).
    - [x] Fetch all publications with citation counts.
    - [x] Create `src/data/stats.json` for Google Scholar metrics.
- [x] **Semantic Scholar Integration** (Backup)
    - [x] Identify Author IDs (`1411484198`, `1380048475`).
    - [x] Create `scripts/sync-publications-semantic.js` as fallback.
    - [x] Implement fetching logic with multi-profile support and deduplication.
- [x] **GitHub Integration**
    - [x] Create utility to fetch repository data via GraphQL API (`scripts/sync-github.js`).
    - [x] Updated with real repositories (parsivel2, MIRA-35c-Peru, etc.).
- [x] **GitHub Actions Automation**
    - [x] Create `.github/workflows/update-data.yml`.
    - [x] Configure Python + Node.js setup.
    - [x] Implement Google Scholar → Semantic Scholar fallback.
    - [x] Configure schedule (weekly).
    - [x] Set up `contents: write` permissions for auto-committing data.

## Phase 3: UI Design & Development
- [x] **Layout Architecture**
    - [x] Implement "Bento Box" grid layout (`src/components/ui/BentoGrid.tsx`).
    - [x] Set up mobile responsive grid.
    - [x] Fix overlay issue with Stats card.
- [x] **Core Components**
    - [x] `Hero` (Bio, photo, social links).
    - [x] `StatsCard` (Google Scholar metrics + profile link).
    - [x] `FeaturedPublication` (Dual cards: Most Cited + Recommended).
    - [x] `ProjectList` (Compact GitHub repos display).
    - [x] `PublicationList` (Grid layout, excludes featured papers).
    - [x] CV Download Button (Link to external PDF).
- [x] **User Configuration**
    - [x] Create `src/data/highlights.json` for easy paper highlight changes.
    - [x] Implement title-based matching for recommended paper.
- [x] **Styling & Theming**
    - [x] Configure Tailwind theme (fonts, colors).
    - [x] Add Framer Motion entry animations.
    - [x] Blue gradient for "Most Cited" card.
    - [x] Green gradient for "Recommended" card.

## Phase 4: Polish & Optimization
- [x] **SEO Configuration**
    - [x] Configure Next.js `Metadata` API in `layout.tsx`.
    - [x] Add OpenGraph images (`public/avatar.png`).
    - [x] Generate `sitemap.xml` and `robots.txt` (Dynamic generation implemented).
- [x] **Analytics**
    - [x] Integrate privacy-focused analytics (Optional - skipped for MVP).
- [x] **Final Review**
    - [x] Audit accessibility (Basic semantic structure verified).
    - [x] Optimize images (Configured `unoptimized: true` for export).

## Phase 5: Deployment & Maintenance
- [x] **Deploy Action**
    - [x] Configure `deploy.yml` for GitHub Pages deployment.
- [x] **Verify Live Site**
    - [x] Push to `main` and check GitHub Pages URL.
    - [x] Live at: https://jvaldivia23.github.io/personal_webpage/
- [x] **Documentation**
    - [x] Update README with maintenance instructions.
    - [x] Update AGENTS.md with Google Scholar integration details.

---

## 🎉 PROJECT COMPLETE
**Live Site:** https://jvaldivia23.github.io/personal_webpage/
**Completion Date:** January 13, 2025

The "Living Portfolio" is now live and will automatically update weekly via GitHub Actions!

---

## Phase 6: Post-Launch Fixes (January 13, 2025)
- [x] **Fix Deployment Issues**
    - [x] Diagnosed README showing instead of portfolio (missing basePath).
    - [x] Added `basePath: "/personal_webpage"` to `next.config.ts`.
    - [x] Fixed CV download link to use relative path.
- [x] **Fix GitHub Repositories**
    - [x] Identified placeholder data (radar-tools, cloud-microphysics - fake repos).
    - [x] Replaced with actual repositories: parsivel2, MIRA-35c-Peru, SOFTX-D-16-00059, radar-dct-smoothing.
    - [x] Fixed sync script typo (`constresponse` → `const response`).
- [x] **Fix Publications Data**
    - [x] Identified wrong author (P. Panciatici - power systems researcher).
    - [x] Corrected Semantic Scholar Author IDs to `1411484198` and `1380048475`.
    - [x] Replaced 100+ incorrect papers with 12 actual papers on radar meteorology and Andes precipitation.
    - [x] Updated sync script to fetch from multiple profiles with deduplication.
    - [x] Added ORCID integration reference (`0000-0003-0709-1163`).

## Phase 7: Google Scholar Integration & UI Redesign (January 13, 2025)
- [x] **Google Scholar Integration**
    - [x] Created `scripts/sync-scholar.py` using `scholarly` Python library.
    - [x] Added `requirements.txt` with `scholarly>=1.7.0`.
    - [x] Created `src/data/stats.json` with live metrics (232 citations, h-index 8).
    - [x] Implemented free proxy support with graceful fallback.
    - [x] Renamed old script to `sync-publications-semantic.js` as backup.
- [x] **Dual Featured Publications**
    - [x] Created `src/data/highlights.json` for user-configurable "Recommended" paper.
    - [x] Updated `FeaturedPublication.tsx` to support "most-cited" and "recommended" types.
    - [x] Added "Future changes of precipitation types in the Peruvian Andes" as recommended.
    - [x] Blue gradient for Most Cited, green gradient for Recommended.
- [x] **UI Improvements**
    - [x] Fixed overlay issue in Stats card (removed title/description from BentoGridItem).
    - [x] Redesigned StatsCard to show Google Scholar metrics + profile link.
    - [x] Made ProjectList more compact (removed descriptions).
    - [x] Updated PublicationList to exclude both featured papers.
    - [x] Stacked layout for featured publications (full width each).
- [x] **GitHub Actions Update**
    - [x] Added Python 3.11 setup step.
    - [x] Added `pip install -r requirements.txt`.
    - [x] Implemented `continue-on-error` with Semantic Scholar fallback.

**All updates deployed and build verified.**

---

## Files Modified/Created in Phase 7

### New Files
| File | Purpose |
|------|---------|
| `scripts/sync-scholar.py` | Google Scholar sync using scholarly library |
| `requirements.txt` | Python dependencies for GitHub Actions |
| `src/data/highlights.json` | User config for "Recommended" paper |
| `src/data/stats.json` | Google Scholar metrics |

### Modified Files
| File | Changes |
|------|---------|
| `scripts/sync-publications.js` → `sync-publications-semantic.js` | Renamed as backup |
| `.github/workflows/update-data.yml` | Added Python setup + fallback logic |
| `src/data/publications.json` | Added "Future changes..." paper with `highlighted: true` |
| `src/app/page.tsx` | Fixed overlay, stacked featured cards |
| `src/components/StatsCard.tsx` | Google Scholar stats + profile link |
| `src/components/FeaturedPublication.tsx` | Dual card support (most-cited/recommended) |
| `src/components/PublicationList.tsx` | Excludes both featured papers |
| `src/components/ProjectList.tsx` | Compact layout without descriptions |
