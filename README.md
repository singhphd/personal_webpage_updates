# Personal Webpage - Jairo M. Valdivia

A living portfolio and research dashboard for Jairo M. Valdivia, Ph.D. Student in Atmospheric and Oceanic Sciences at CU Boulder.

🔴 **Live Site:** [https://jvaldivia23.github.io/personal_webpage/](https://jvaldivia23.github.io/personal_webpage/)

![Build Status](https://github.com/JValdivia23/personal_webpage/actions/workflows/deploy.yml/badge.svg)

## 🌟 Features

*   **Research Dashboard:** Interactive visualization of active projects (e.g., 3D CTGC Tracking).
*   **Automated Publications:** Syncs daily with Google Scholar and Semantic Scholar.
*   **Reading List:** A "News & Views" style feed for scientific commentary, powered by Markdown.
*   **Active Stats:** Real-time citation counts and h-index display.

## 🚀 Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn
    ```

2.  **Run development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

*   `src/app`: Next.js App Router pages (Home, Research, Publications, Reading).
*   `src/content/reading`: Markdown files for the Reading List.
*   `src/data`: JSON data for publications and stats.
*   `public/projects`: Standalone web projects (e.g., 3D CTGC visualization).
*   `scripts`: Python/Node.js scripts for fetching external data.

## 🛠 Manual Updates

While most data is automated, some content is curated manually. See [MANUAL_UPDATES.md](MANUAL_UPDATES.md) for a complete guide on how to edit:
*   Bio & Contact Info
*   Featured/Active Research
*   Reading List Articles
*   Recommended Papers

## 🤖 Automation

This repo uses **GitHub Actions** to stay "living":
*   **Weekly Sync:** Fetches latest citations and papers.
*   **Auto-Deploy:** Builds and deploys to GitHub Pages on every push.
