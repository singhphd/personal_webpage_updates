# Personal Webpage - Jairo M. Valdivia

A living portfolio/personal website built with Next.js, Tailwind CSS, and GitHub Actions.

![Build Status](https://github.com/JValdivia23/personal_webpage/actions/workflows/deploy.yml/badge.svg)

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗 Architecture

This project is designed to be self-updating. It acts as a visualization layer for data fetched from external sources.

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion.
- **Components**: `src/components/ui/BentoGrid.tsx` (Core layout), `src/components/*` (Content cards).
- **Data Source**: JSON files in `src/data/`.

## 🔄 Data Pipeline

The website relies on data fetching scripts to stay up-to-date without manual HTML edits.

### 1. Publications
- **Source**: [Semantic Scholar API](https://www.semanticscholar.org/product/api)
- **Script**: `scripts/sync-publications.js`
- **Output**: `src/data/publications.json`

### 2. GitHub Projects
- **Source**: GitHub GraphQL API
- **Script**: `scripts/sync-github.js`
- **Output**: `src/data/github.json`
- **Note**: Requires `GITHUB_TOKEN` (handled automatically in GitHub Actions).

## 🤖 Automation

There are two main GitHub Actions workflows:

1. **Update Data** (`.github/workflows/update-data.yml`): Runs weekly (Sunday) to fetch new papers and pinned repos. It commits changes back to the repo.
2. **Deploy** (`.github/workflows/deploy.yml`): Runs on every push to `main` (including the automated data update) to rebuild and deploy the site to GitHub Pages.

## 🛠 Maintenance

- **Updating Bio/Links**: Edit `src/components/Hero.tsx`.
- **Updating CV**: Replace `/public/cv.pdf` with a new file.
- **Manual Data Update**: Go to the "Actions" tab in GitHub, select "Update Data", and click "Run workflow".
