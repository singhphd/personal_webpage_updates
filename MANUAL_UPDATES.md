# Manual Updates Guide

This guide outlines where to find and modify text, images, and content to personalize your webpage.

## 1. Personal Information (Home Page)
*   **Bio & Welcome Message**: Edit `src/components/Hero.tsx`.
    *   Look for the `<h1>` and `<p>` tags to change your name, title, and bio text.
*   **Avatar**: Replace `public/avatar.png` with your own image (keep the filename or update it in `Hero.tsx`).
*   **CV**: Replace `public/cv.pdf` with your current CV.

## 2. Research Focus (Home Page Boxes)
*   **Topic Boxes**: Edit `src/app/page.tsx`.
    *   Search for `Research Focus`.
    *   You will see 4 `Link` blocks (Cloud Microphysics, Signal Processing, ML, Climate Modeling).
    *   Update the `h3` (Title), `p` (Description), and `href` (Link) for each box.

## 3. Publications
*   **Recommended Paper**: Edit `src/data/highlights.json`.
    *   Change the `"title"` to match exactly one of your papers in `publications.json`.
    *   Update the `"reason"` text.
*   **Full List**: This is auto-generated.
    *   **Source**: `src/data/publications.json` (Synced via script).
    *   **To run sync**: `python3 scripts/sync-scholar.py` (requires setup) or manually edit the JSON file if needed.

## 4. Reading List (News & Views)
You can write original articles or comments on recent research here. Each article is a separate Markdown file.

*   **Location**: `src/content/reading/`
*   **How to Add**: Create a new `.md` file (e.g., `my-new-article.md`).
*   **Format**:
    ```markdown
    ---
    title: "Title of Your Article"
    date: "YYYY-MM-DD"
    summary: "A short snippet for preview (optional)"
    tags: ["Topic A", "Topic B"]
    link: "https://external-link-to-paper.com" (Optional: if referencing a specific paper)
    ---

    Write your content here using **Markdown**. 
    
    You can use:
    * Bullet points
    * [Links](http://google.com)
    * **Bold text**
    ```

## 5. Active Research (Featured Project)
*   **The Standalone 3D Site**:
    *   **Location**: `public/projects/3D_CTGC_web/`
    *   **Editing**: Modify `index.html` or `styles.css` inside that folder directly. This is a standalone standard HTML/CSS site embedded in the portfolio.
*   **The "Hero Card" (Research Page)**:
    *   **Edit**: `src/app/research/page.tsx`
    *   Search for "Active Research". You can change the title, description, and preview image path there.

## 6. Research Projects (Detail Pages)
*   **Location**: `src/content/research/`
*   **How to Add**: Create a new `.md` file.
*   **Format**: Similar to Reading List but includes `priority` for sorting.

## 7. Contact Info
*   **Edit**: `src/app/contact/page.tsx`
    *   Update email, office location, and social links.

## 8. Icons & styling
*   **Icons**: We use [Lucide React](https://lucide.dev/icons). Import new icons in the relevant component file.
