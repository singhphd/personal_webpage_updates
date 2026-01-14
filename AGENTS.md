# Project Context: Personal Webpage

## Project Overview
**Goal:** Create a "Living Portfolio" — a high-performance, automated personal website that updates itself via APIs.
**User:** Jairo Michael Valdivia Prado (Jairo M. Valdivia)
**Role:** Ph.D. Student at University of Colorado Boulder (ATOC) | Radar Scientist.
**Key Research:** Radar Meteorology, Cloud Microphysics, Precipitation Studies in the Andes.
**External IDs:**
*   **Semantic Scholar Author IDs:** `1411484198`, `1380048475` (publications split across profiles)
*   **ORCID:** `0000-0003-0709-1163`
*   **GitHub:** `JValdivia23`

## Architecture (The "Living" Portfolio)
*   **Framework:** Next.js (App Router) + TypeScript
*   **Styling:** Tailwind CSS + Framer Motion
*   **Hosting:** GitHub Pages (`output: export`)
*   **Data Source:** 
    *   Publications -> Semantic Scholar API
    *   Code -> GitHub GraphQL API
    *   CV -> Linked PDF (`cv.pdf`)

## Directory Structure
*   **AGENTS.md**: Project context and key identifiers (this file).
*   **GEMINI.md**: Original instructional context.
*   **Plan.md**: Detailed architectural plan.
*   **PROGRESS.md**: Step-by-step execution roadmap and completion status.
*   **src/**: Source code (Next.js app with TypeScript).
*   **public/**: Static assets (cv.pdf, avatar.png).
*   **scripts/**: Data sync scripts for publications and GitHub repos.
*   **.github/workflows/**: GitHub Actions for automated data updates and deployment.

## Current Status
✅ **Project Complete** - Live at https://jvaldivia23.github.io/personal_webpage/

### Recent Fixes (January 13, 2025)
- Fixed `basePath` configuration for GitHub Pages subdirectory deployment
- Corrected GitHub repositories (replaced placeholders with actual repos)
- Fixed publications data (replaced incorrect P. Panciatici papers with correct Jairo M. Valdivia papers)
- Updated sync scripts to use correct Semantic Scholar Author IDs and GitHub username