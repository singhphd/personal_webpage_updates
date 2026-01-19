# Project Context: Personal Webpage

## Project Overview
**Goal:** Create a "Living Portfolio" — a high-performance, automated personal website that updates itself via APIs.
**User:** Jairo Michael Valdivia Prado (Jairo M. Valdivia)
**Role:** Ph.D. Student at University of Colorado Boulder (ATOC) | Radar Scientist.
**Key Research:** Radar Meteorology, Cloud Microphysics, Precipitation Studies in the Andes.
**External IDs:**
*   **Google Scholar ID:** `eCZJkKcAAAAJ` (primary source for publications)
*   **Semantic Scholar Author IDs:** `1411484198`, `1380048475` (backup, publications split across profiles)
*   **ORCID:** `0000-0003-0709-1163`
*   **GitHub:** `JValdivia23`

## Architecture (The "Living" Portfolio)
*   **Framework:** Next.js (App Router) + TypeScript
*   **Styling:** Tailwind CSS + Framer Motion
*   **Hosting:** GitHub Pages (`output: export`)
*   **Data Sources:** 
    *   Publications -> Google Scholar (via `scholarly` Python library)
    *   Fallback -> Semantic Scholar API
    *   Stats -> Google Scholar (citations, h-index, i10-index)
    *   Code -> GitHub GraphQL API
    *   CV -> Linked PDF (`cv.pdf`)

## Directory Structure
*   **AGENTS.md**: Project context and key identifiers (this file).
*   **MANUAL_UPDATES.md**: Guide for the user on how to edit text, images, and content.
*   **GEMINI.md**: Original instructional context.
*   **Plan.md**: Detailed architectural plan.
*   **PROGRESS.md**: Step-by-step execution roadmap and completion status.
*   **src/**: Source code (Next.js app with TypeScript).
*   **src/data/**: JSON data files (publications, stats, github, highlights).
*   **public/**: Static assets (cv.pdf, avatar.png).
*   **scripts/**: Data sync scripts (Python + Node.js).
*   **.github/workflows/**: GitHub Actions for automated data updates and deployment.

## Data Files
*   **publications.json**: All publications with citation counts (auto-synced from Google Scholar)
*   **stats.json**: Google Scholar metrics (citations: 232, h-index: 8, i10-index: 8)
*   **github.json**: Pinned GitHub repositories
*   **highlights.json**: User config for "Recommended" publication (easily editable)

## Sync Scripts
*   **sync-scholar.py**: Primary - Fetches from Google Scholar using `scholarly` library (Generates fallback links if direct URLs missing)
*   **sync-publications-semantic.js**: Backup - Fetches from Semantic Scholar API (Merges with existing data)
*   **sync-github.js**: Fetches pinned repos from GitHub GraphQL API

## Developer & Agent Guide

### Technical Gotchas (Critical!)

#### Base Path Configuration
This project uses `basePath: "/personal_webpage"` for GitHub Pages deployment.

**Image & Asset Paths:**
- All `<Image>` and `<img>` src paths in components MUST include the base path prefix
- ✅ Correct: `<Image src="/personal_webpage/photo.jpeg" />`
- ❌ Wrong: `<Image src="/photo.jpeg" />` (will 404)
- ❌ Wrong: `<Image src="../../public/photo.jpeg" />` (relative paths don't work)

**Link Paths:**
- Internal Next.js `<Link>` components handle basePath automatically
- External `<a>` tags for downloads need the full path: `href="/personal_webpage/cv.pdf"`

**Verification:**
```bash
# Test if an asset is accessible in dev mode:
curl -I http://localhost:3000/personal_webpage/photo.jpeg
# Should return: HTTP/1.1 200 OK
```

#### Next.js Config Reference
Location: `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  output: "export",           // Static export for GitHub Pages
  basePath: "/personal_webpage",
  assetPrefix: "/personal_webpage",
  images: { unoptimized: true },  // Required for static export
};
```

---

### Local Development

**Start Development Server:**
```bash
npm run dev
# Runs at: http://localhost:3000/personal_webpage
```

**Build for Production:**
```bash
npm run build
# Creates static export in /out directory
```

**Test Production Build Locally:**
```bash
npx serve out
```

**Sync Data from External Sources:**
```bash
# Publications from Google Scholar
python scripts/sync-scholar.py

# GitHub pinned repos
node scripts/sync-github.js
```

**Requirements:**
- Node.js 18+ (currently using v25.2.1)
- Python 3.x with `scholarly` library (for sync-scholar.py)

---

### Component Architecture

**Layout Structure:**
```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Home page (uses BentoGrid)
│   ├── research/       # Research page
│   ├── publications/   # Publications page
│   ├── cv/             # CV page
│   └── globals.css     # Global styles + Tailwind
├── components/
│   ├── Hero.tsx        # Main landing section (photo + bio)
│   ├── FeaturedVisual.tsx
│   ├── ReadingList.tsx
│   └── ui/
│       └── BentoGrid.tsx  # Grid layout component
└── data/
    ├── publications.json
    ├── stats.json
    ├── github.json
    └── highlights.json
```

**Key Components:**
| Component | Purpose | Location |
|-----------|---------|----------|
| `Hero` | Homepage intro with photo, bio, social links | `src/components/Hero.tsx` |
| `BentoGrid` | Responsive grid layout system | `src/components/ui/BentoGrid.tsx` |
| `FeaturedVisual` | 3D CTGC project showcase | `src/components/FeaturedVisual.tsx` |
| `ReadingList` | Markdown-powered reading/news section | `src/components/ReadingList.tsx` |

**Styling Patterns:**
- Tailwind CSS for all styling
- Dark mode: Uses `dark:` prefix classes
- Responsive: Mobile-first with `md:` breakpoints
- Colors: Neutral palette with blue/purple accents

---

### Common Tasks Quick Reference

| Task | File(s) to Edit |
|------|-----------------|
| Change profile photo | Replace `public/photo.jpeg`, update `src/components/Hero.tsx` |
| Update bio text | `src/components/Hero.tsx` |
| Change CV | Replace `public/cv.pdf` |
| Add/edit reading posts | Add `.md` files to `public/reading/` |
| Change recommended paper | `src/data/highlights.json` |
| Update social links | `src/components/Hero.tsx` |
| Modify home page layout | `src/app/page.tsx` |
| Update research page | `src/app/research/page.tsx` |

---

### Static Assets in `public/`

| File | Purpose |
|------|---------|
| `photo.jpeg` | Profile photo (1600x1600px) |
| `cv.pdf` | Downloadable CV |
| `avatar.png` | Fallback/OG image |
| `projects/3D_CTGC_web/` | Standalone 3D visualization project |
| `reading/` | Markdown posts for reading list |

---

### Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Image not displaying | Missing basePath prefix | Use `/personal_webpage/filename.ext` |
| 404 on local dev | Wrong URL | Dev server runs at `localhost:3000/personal_webpage` |
| Build fails with image error | Using relative path | Never use `../../public/` - use absolute paths with basePath |
| CSS not updating | Browser cache | Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+F5` (Windows) |
| Publications not updating | Stale data | Run `python scripts/sync-scholar.py` |
| GitHub Actions failing | API rate limit | Check workflow logs, may need to wait or use fallback |

**Quick Diagnostic Commands:**
```bash
# Check if asset is accessible
curl -I http://localhost:3000/personal_webpage/photo.jpeg

# Verify build works
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

---

### Files Not Tracked in Git

The following files are for local development/AI assistance only and are excluded from the repository via `.gitignore`:

| File | Purpose |
|------|---------|
| `AGENTS.md` | AI/Agent context and instructions (this file) |
| `GEMINI.md` | Original AI planning document |
| `Plan.md` | Architectural planning notes |
| `PROGRESS.md` | Development progress tracking |
| `PROGRESS_PHASE_2.md` | Phase 2 progress tracking |
| `MANUAL_UPDATES.md` | User guide for manual content edits |

**Note:** These files exist locally to help AI assistants understand the project context and help you with manual updates, but should not be committed to the public repository.

## Current Status
✅ **Project Complete** - Live at https://jvaldivia23.github.io/personal_webpage/

### Recent Updates (January 14, 2025 - Part 4)
- **Repository Cleanup**: Removed temporary build artifacts and redundant source folders to maintain a clean codebase.
- **Documentation Update**: Streamlined `README.md` to focus on the live site and essential developer info.
- **3D CTGC Project Integration**: Hosted as a standalone featured project at `/projects/3D_CTGC_web/index.html`.
- **Active Research Hero**: Added a prominent "Active Research" section to the Research page featuring the 3D visualization.
- **Home Page Standardisation**: Switched to a traditional academic bio layout.
- **Research Focus Grid**: Explicit 4-box grid (Cloud Microphysics, Signal Processing, ML, Climate Modeling).
- **Reading List**: Added a "Reading" section for news and comments on recent research (Markdown-powered).
- **Publications Page**: Now houses the "Featured" and "Recommended" highlights along with the full list and stats.
- **Improved Stats Display**: Shows 232 citations, h-index 8, with link to Google Scholar profile
- **Layout Redesign**: Publications-focused layout with stacked featured cards
- **Fallback System**: Google Scholar → Semantic Scholar fallback in GitHub Actions
- **Easy Highlight Config**: Edit `highlights.json` to change recommended paper

### How to Change Recommended Paper
Edit `src/data/highlights.json`:
```json
{
  "recommended": {
    "title": "Your Paper Title Here",
    "reason": "My pick"
  }
}
```
