# Phase 2: Narrative & Structure

## Goals
Transform the site from a "static archive" to a "research narrative" by restructuring navigation, highlighting active research (specifically CTGCs), and enabling rich markdown-based content for projects.

## Architecture
- **Navigation Structure** (App Router):
  - `/` (Home): Narrative summary, featured visual, stats, featured papers.
  - `/research` (Research): Detailed project narratives, ordered by priority (CTGC first).
  - `/publications` (Publications): Complete publication list.
  - `/contact` (Contact): Socials, email, CV.

- **Content Management**:
  - **Research/Projects**: Markdown files in `src/content/research/*.md`.
    - Frontmatter: `title`, `summary`, `priority`, `tags`, `image`.
    - Body: Long-form markdown description.
  - **Highlights**: Continue using `src/data/highlights.json` for home page picks.
  - **Tech Stack**: Add `gray-matter` and `react-markdown`.

## Detailed Page Scope

### 1. Home (`/`)
- **Hero**: Updated tagline ("Atmospheric Scientist...").
- **Featured Visual**: Single impactful visual (CTGC radar loop/infographic) below hero.
- **Intro**: "Research Focus" summary cards (linking to /research).
- **Stats & Papers**: Existing stats card + "Most Cited/Recommended" papers.

### 2. Research (`/research`)
- **Layout**: Vertical list of research topics.
- **Ordering**: 
  1. **Cloud Top Generating Cells (CTGCs)** (Primary Feature).
  2. Radar Data Processing (DCT).
  3. Machine Learning / Side Projects (Chess Bot).
- **Format**: Each item displays Title, Tags, Image, and rendered Markdown content.

### 3. Publications (`/publications`)
- Full grid of publications (moved from current Home).
- Search/Filter (optional future step, simple list for now).

### 4. Contact (`/contact`)
- Simple layout: "Get in touch".
- Reiterate Social Links, Scholar Profile, and CV Download.

## Implementation Steps

1.  **Dependencies**: Install `gray-matter`, `react-markdown`, `@tailwindcss/typography`.
2.  **Content Layer**: 
    - Create `src/content/research/`.
    - Write initial markdown files (scaffolded).
    - Create utility `src/lib/markdown.ts` to read/sort files.
3.  **Navigation**: 
    - Create `NavBar` component.
    - Create route directories: `research/`, `publications/`, `contact/`.
4.  **Components**:
    - Update `Hero`.
    - Build `ResearchItem` (renders markdown).
    - Move `PublicationList` to new page.
5.  **Polishing**:
    - Ensure mobile responsiveness for nav.
    - Verify asset loading for markdown images.

## Progress Tracking
Tracked in `PROGRESS_PHASE_2.md`.
