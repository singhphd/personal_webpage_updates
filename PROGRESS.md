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
    - [x] Verify local build with `npm run build`.

## Phase 2: The Data Pipeline (Backend-for-Frontend)
- [x] **Semantic Scholar Integration**
    - [x] Identify Author ID (`1741000`).
    - [x] Create `scripts/sync-publications.js`.
    - [x] Implement fetching logic (titles, venues, years, citations).
- [x] **GitHub Integration**
    - [x] Create utility to fetch pinned repository data via GraphQL API (`scripts/sync-github.js`).
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
- [ ] **Verify Live Site**
    - [ ] Push to `main` and check GitHub Pages URL.
- [x] **Documentation**
    - [x] Update README with maintenance instructions.
