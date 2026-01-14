# Phase 2 Progress Log

## Phase 2: Narrative & Structure

### 1. Infrastructure & Content Layer
- [x] **Dependencies**
    - [x] Install `gray-matter` (frontmatter), `react-markdown` (renderer), `@tailwindcss/typography` (styling).
- [x] **Content Setup**
    - [x] Create `src/content/research/` directory.
    - [x] Create utility `src/lib/markdown.ts` for file reading/sorting.
    - [x] Create initial markdown: `ctgc.md` (Priority 1).
    - [x] Create initial markdown: `radar-dct.md`.
    - [x] Create initial markdown: `chess-bot.md`.
    - [ ] Create initial markdown: `cesm-sims.md` (optional/placeholder).

### 2. Navigation & Routing
- [x] **Layout Architecture**
    - [x] Create `src/components/NavBar.tsx` (Home, Research, Publications, Contact).
    - [x] Update `src/app/layout.tsx` to include `NavBar`.
    - [x] Create page stubs:
        - [x] `src/app/research/page.tsx`
        - [x] `src/app/publications/page.tsx`
        - [x] `src/app/contact/page.tsx`

### 3. Page Implementation
- [x] **Home Page (`/`)**
    - [x] Update Hero Tagline.
    - [x] Add "Featured Visual" section (Placeholder asset).
    - [x] Remove full publication list (keep only Featured & Stats).
- [x] **Research Page (`/research`)**
    - [x] Implement `ResearchList` component (integrated in page).
    - [x] Implement markdown rendering with `react-markdown`.
    - [x] Style using `prose` (Tailwind Typography).
- [x] **Publications Page (`/publications`)**
    - [x] Migrate `PublicationList` component here (Full list logic).
- [x] **Contact Page (`/contact`)**
    - [x] Create simple contact info layout.

### 4. Visuals & Polish
- [x] **Featured Visual**
    - [x] Source or generate specific placeholder for CTGC.
- [x] **Styling**
    - [x] Verify gradients and mobile responsiveness.

### 5. Refinements (Jan 14)
- [x] **Home Page Redesign**
    - [x] Remove "Stats" box to declutter.
    - [x] Expand "Hero" section to full width.
    - [x] Add welcoming header ("Welcome to Jairo's Webpage").
- [x] **Publications Page**
    - [x] Add "Google Stats" box as a sticky sidebar.
    - [x] Rename "Impact" to "Google Stats".

### 6. Content & Layout Revamp (Jan 14 - Part 2)
- [x] **Home Page Redesign (Standard)**
    - [x] Update Hero with full bio text.
    - [x] Add explicit "Research Focus" section with 4 topic boxes (Cloud Microphysics added).
    - [x] Create "Reading List" section (Nature News style).
    - [x] Implement Markdown backend for reading posts (`src/content/reading/`).
- [x] **Publications Page Update**
    - [x] Move "Most Cited" and "Recommended" highlights to this page.
    - [x] Arrange layout with Highlights + Full List in main column, Stats in sidebar.

---
**Status**: Complete
**Start Date**: Jan 14, 2026
**Completion Date**: Jan 14, 2026
