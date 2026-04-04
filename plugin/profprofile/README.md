# DokuWiki Plugin — `profprofile`

A **server-side** academic profile plugin for DokuWiki that is completely
independent of GitHub.  All data (publications, citation stats, research
projects, GitHub repos and a reading list) is managed through a built-in admin
panel and stored locally inside DokuWiki.

---

## Features

| Shortcode | Data source | What it renders |
|---|---|---|
| `~~PROF_HERO~~` | `profile.json` | Professor photo, name, bio and social links |
| `~~SCHOLAR_STATS~~` | `stats.json` | h-index, i10-index, total citations grid |
| `~~PUBLICATIONS~~` | `publications.json` | Sortable publication table (year, title, venue, citations) |
| `~~GITHUB_REPOS~~` | `github.json` | Repository cards with language badge & star count |
| `~~RESEARCH_LIST~~` | `research.json` | Project cards with tags and links |
| `~~READING_LIST~~` | `reading.json` | Article cards with summary and tags |

---

## Installation

1. Copy (or symlink) the `profprofile` folder into your DokuWiki plugin directory:

   ```
   <dokuwiki_root>/lib/plugins/profprofile/
   ```

2. In the DokuWiki admin panel go to **Extension Manager** and enable the plugin,
   or simply ensure the folder is present — DokuWiki will auto-load it.

3. *(Optional)* Adjust display settings in **Admin → Configuration Settings**
   under the *profprofile* section.

---

## Configuration (Admin → Configuration Settings → profprofile)

| Key | Default | Description |
|---|---|---|
| `max_publications` | `50` | Maximum publications shown by `~~PUBLICATIONS~~` (0 = all) |
| `show_venue` | `on` | Show the Venue column in the publications table |
| `show_citations` | `on` | Show the Citations column in the publications table |

---

## Managing Profile Data (Admin → Professor Profile)

All profile content is managed through the dedicated admin page.  Navigate to
**Admin → Professor Profile** and use the seven tabs:

### Profile tab
Structured form with individual fields for:
- **Full Name**, **Academic Title**, **Institution**, **Department**
- **Short Biography** (paragraph of text)
- **Email**, **Profile Photo URL**, **GitHub URL**, **LinkedIn URL**,
  **Google Scholar URL**, **CV URL**

Saved as `<dw_data>/profprofile/profile.json`.

### Publications tab
JSON editor for the publications array.  Each entry:

```json
{
  "paperId": "optional-id",
  "url": "https://scholar.google.com/citations?...",
  "title": "Paper title",
  "venue": "Journal or conference name",
  "year": 2024,
  "citationCount": 10,
  "highlighted": true
}
```

Saved as `<dw_data>/profprofile/publications.json`.

### Scholar Stats tab
JSON editor for citation metrics:

```json
{
  "googleScholar": {
    "citations": 234,
    "citationsSince2021": 216,
    "hIndex": 8,
    "hIndex5y": 8,
    "i10Index": 8,
    "i10Index5y": 8,
    "profileUrl": "https://scholar.google.com/citations?user=...",
    "lastUpdated": "2026-03-29"
  }
}
```

Saved as `<dw_data>/profprofile/stats.json`.

### GitHub Repos tab
JSON editor for repository cards:

```json
[
  {
    "name": "repo-name",
    "description": "One-line description",
    "url": "https://github.com/user/repo",
    "stars": 5,
    "language": "Python",
    "languageColor": "#3572A5"
  }
]
```

Saved as `<dw_data>/profprofile/github.json`.

### Research Projects tab
JSON editor for project cards (sorted by `priority` ascending):

```json
[
  {
    "title": "Project Title",
    "summary": "One-sentence summary",
    "priority": 1,
    "tags": ["Radar", "Cloud Microphysics"],
    "links": {
      "repo": "https://github.com/...",
      "paper": "https://doi.org/...",
      "demo": "https://..."
    }
  }
]
```

Saved as `<dw_data>/profprofile/research.json`.

### Reading List tab
JSON editor for reading articles (sorted by `date` descending):

```json
[
  {
    "title": "Article Title",
    "date": "2025-05-07",
    "author": "Jairo Valdivia",
    "summary": "Brief description",
    "tags": ["Microphysics", "Precipitation"],
    "link": "https://doi.org/..."
  }
]
```

Saved as `<dw_data>/profprofile/reading.json`.

### Sync / Import tab (new)
Fetches live data from external APIs and saves it as local JSON.

| Field | Description |
|---|---|
| **Semantic Scholar Author ID** | Numeric ID from your Semantic Scholar profile URL |
| **GitHub Username** | Your GitHub handle |

**Sync Publications & Stats** — calls the [Semantic Scholar API](https://api.semanticscholar.org/graph/v1)
to download all papers and computes h-index, i10-index and citation counts, then
writes `publications.json` and `stats.json`.

**Sync GitHub Repos** — calls the GitHub API to fetch the top 5 non-forked public
repos sorted by stars, then writes `github.json`.

After syncing you can review and tweak the data on the other JSON-editor tabs.
Sync settings (IDs / usernames) are saved in `sync_config.json` and are independent
of the published data files.

---

## Usage

Place shortcodes in any DokuWiki page:

```
====== Academic Profile ======

~~PROF_HERO~~

===== Citation Stats =====
~~SCHOLAR_STATS~~

===== Publications =====
~~PUBLICATIONS~~

===== GitHub Projects =====
~~GITHUB_REPOS~~

===== Research Projects =====
~~RESEARCH_LIST~~

===== Reading List =====
~~READING_LIST~~
```

---

## Data Location

All JSON data files are stored in:

```
<dokuwiki_root>/data/profprofile/
```

This directory is separate from the plugin code, so plugin updates do not
overwrite your data.

---

## Flushing / Resetting Data

To remove all data files (e.g. to start fresh), log in as a DokuWiki admin or
manager and navigate to:

```
https://wiki.example.com/doku.php?profprofile_flush=1
```

A confirmation message will be shown.  Data entered through the admin panel
is preserved in the database directory and is not affected by plugin updates.

---

## Migrating from `academicprofile` Plugin

The `academicprofile` plugin fetches data from GitHub and uses the same JSON
schemas as this plugin.  To migrate:

1. Copy your `src/data/publications.json`, `stats.json`, and `github.json` files
   into `<dw_data>/profprofile/`.
2. Convert your `src/content/research/*.md` files into the `research.json` array
   format (see schema above).
3. Convert your `src/content/reading/*.md` files into the `reading.json` array
   format.
4. Update shortcode prefixes: `~~PUBLICATIONS~~` → `~~PUBLICATIONS~~` (unchanged),
   add `~~PROF_HERO~~` for the new bio section.

---

## How it Works

```
DokuWiki page render
      │
      ▼
syntax_plugin_profprofile::render()
      │
      ├─ $renderer->nocache()   (ensures latest data on every page view)
      │
      ├─ readJson($filename)    (reads from <dw_data>/profprofile/*.json)
      │
      └─ build and return HTML string
```

- All data is stored as plain JSON files under `<dw_data>/profprofile/`.
- Pages using profprofile shortcodes are never cached by DokuWiki so that
  admin edits appear immediately.
- The admin panel implements POST → Redirect → GET to avoid duplicate
  submissions and CSRF tokens are validated on every save.

---

## Requirements

- DokuWiki 2018-04-22 ("Greebo") or later
- PHP 7.4+
- No external HTTP access required

---

## License

GPL 2 — see <http://www.gnu.org/licenses/gpl.html>
