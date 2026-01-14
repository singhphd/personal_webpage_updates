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
*   **sync-scholar.py**: Primary - Fetches from Google Scholar using `scholarly` library
*   **sync-publications-semantic.js**: Backup - Fetches from Semantic Scholar API
*   **sync-github.js**: Fetches pinned repos from GitHub GraphQL API

## Current Status
✅ **Project Complete** - Live at https://jvaldivia23.github.io/personal_webpage/

### Recent Updates (January 14, 2025 - Part 3)
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
