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
- [x] **Semantic Scholar Integration**
    - [x] Identify correct Author IDs (`1411484198`, `1380048475`).
    - [x] Create `scripts/sync-publications.js`.
    - [x] Implement fetching logic with multi-profile support and deduplication.
    - [x] Fix: Replaced incorrect publications with actual Jairo M. Valdivia papers.
- [x] **GitHub Integration**
    - [x] Create utility to fetch repository data via GraphQL API (`scripts/sync-github.js`).
    - [x] Fix: Updated with real repositories (parsivel2, MIRA-35c-Peru, etc.).
- [x] **GitHub Actions Automation**
    - [x] Create `.github/workflows/update-data.yml`.
    - [x] Configure schedule (weekly).
    - [x] Set up `contents: write` permissions for auto-committing data.

## Phase 3: UI Design & Development
- [x] **Layout Architecture**
    - [x] Implement "Bento Box" grid layout (`src/components/ui/BentoGrid.tsx`).
    - [x] Set up mobile responsive grid.
- [x] **Core Components**
    - [x] `HeroSection` (Bio, photo, social links).
    - [x] `StatsCard` (Live citation count, GitHub stats).
    - [x] `ProjectCard` (Dynamic GitHub data).
    - [x] `PublicationList` (Filterable list from JSON).
    - [x] `CVDownloadButton` (Link to external PDF).
- [x] **Styling & Theming**
    - [x] Configure Tailwind theme (fonts, colors).
    - [x] Add Framer Motion entry animations.

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

---

## 🎉 PROJECT COMPLETE
**Live Site:** https://jvaldivia23.github.io/personal_webpage/
**Completion Date:** January 13, 2025

The "Living Portfolio" is now live and will automatically update weekly via GitHub Actions!

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

**All fixes deployed and verified live.**
