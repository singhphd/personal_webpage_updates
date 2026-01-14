# Phase 2 Progress Log

## Phase 2: Narrative & Structure

### 1. Infrastructure & Content Layer
- [ ] **Dependencies**
    - [ ] Install `gray-matter` (frontmatter), `react-markdown` (renderer), `@tailwindcss/typography` (styling).
- [ ] **Content Setup**
    - [ ] Create `src/content/research/` directory.
    - [ ] Create utility `src/lib/markdown.ts` for file reading/sorting.
    - [ ] Create initial markdown: `ctgc.md` (Priority 1).
    - [ ] Create initial markdown: `radar-dct.md`.
    - [ ] Create initial markdown: `chess-bot.md`.
    - [ ] Create initial markdown: `cesm-sims.md` (optional/placeholder).

### 2. Navigation & Routing
- [ ] **Layout Architecture**
    - [ ] Create `src/components/NavBar.tsx` (Home, Research, Publications, Contact).
    - [ ] Update `src/app/layout.tsx` to include `NavBar`.
    - [ ] Create page stubs:
        - [ ] `src/app/research/page.tsx`
        - [ ] `src/app/publications/page.tsx`
        - [ ] `src/app/contact/page.tsx`

### 3. Page Implementation
- [ ] **Home Page (`/`)**
    - [ ] Update Hero Tagline.
    - [ ] Add "Featured Visual" section (Placeholder asset).
    - [ ] Remove full publication list (keep only Featured & Stats).
- [ ] **Research Page (`/research`)**
    - [ ] Implement `ResearchList` component.
    - [ ] Implement markdown rendering with `react-markdown`.
    - [ ] Style using `prose` (Tailwind Typography).
- [ ] **Publications Page (`/publications`)**
    - [ ] Migrate `PublicationList` component here.
- [ ] **Contact Page (`/contact`)**
    - [ ] Create simple contact info layout.

### 4. Visuals & Polish
- [ ] **Featured Visual**
    - [ ] Source or generate specific placeholder for CTGC.
- [ ] **Styling**
    - [ ] Verify gradients and mobile responsiveness.

---
**Status**: In Progress
**Start Date**: Jan 14, 2026
