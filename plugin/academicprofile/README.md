# DokuWiki Plugin — `academicprofile`

Displays publications, citation stats, GitHub repositories, research projects,
and a reading list **directly inside any DokuWiki page** — all sourced from a
GitHub-hosted Next.js academic portfolio and cached locally.

---

## Features

| Shortcode | Data source | What it renders |
|---|---|---|
| `~~SCHOLAR_STATS~~` | `src/data/stats.json` | h-index, i10-index, total citations grid |
| `~~PUBLICATIONS~~` | `src/data/publications.json` | Sortable publication table (year, title, venue, citations) |
| `~~GITHUB_REPOS~~` | `src/data/github.json` | Repository cards with language badge & star count |
| `~~RESEARCH_LIST~~` | `src/content/research/*.md` | Project cards with tags and links |
| `~~READING_LIST~~` | `src/content/reading/*.md` | Reading article cards with summary and tags |

---

## Installation

1. Copy (or symlink) this folder into your DokuWiki plugin directory:

   ```
   <dokuwiki_root>/lib/plugins/academicprofile/
   ```

2. In the DokuWiki admin panel go to **Extension Manager** and enable the plugin,
   or make sure the folder is present and DokuWiki will auto-load it.

3. *(Optional)* Adjust configuration values in **Admin → Configuration Settings**
   under the *academicprofile* section.

---

## Configuration

All settings live in `conf/default.php` and are editable via the DokuWiki
admin panel.

| Key | Default | Description |
|---|---|---|
| `github_raw_base` | `https://raw.githubusercontent.com/JValdivia23/personal_webpage/main` | Base URL for raw file access |
| `github_api_repo` | `JValdivia23/personal_webpage` | `owner/repo` string used by the GitHub Contents API |
| `cache_ttl` | `86400` | Cache lifetime in seconds (default: 24 h) |
| `max_publications` | `50` | Maximum publications to show (0 = unlimited) |

---

## Usage

Place any of the shortcodes in a DokuWiki page:

```
====== Research Portfolio ======

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

## Cache management

Fetched data is cached in a temporary directory
(`<sys_tmp>/dokuwiki_academicprofile/`).  Files are refreshed automatically
once they are older than `cache_ttl` seconds.

To flush the cache immediately, log in as a DokuWiki admin or manager and
append `?academicprofile_flush=1` to any page URL, for example:

```
https://wiki.example.com/doku.php?academicprofile_flush=1
```

A confirmation message will be shown after the cache is cleared.

---

## How it works

```
DokuWiki page render
      │
      ▼
syntax_plugin_academicprofile::render()
      │
      ├─ fetchCached()  ─── cache hit? ──▶ return cached file
      │         │
      │         └─ cache miss ──▶ httpGet(GitHub raw / GitHub API)
      │                                │
      │                                └─ store response ──▶ return body
      │
      ├─ parse JSON  or  parseFrontmatter(Markdown)
      │
      └─ build and return HTML string
```

- **Static JSON files** (`publications.json`, `stats.json`, `github.json`) are
  fetched directly from GitHub raw content URLs — no API key required.

- **Markdown listings** (`research/`, `reading/`) first query the GitHub
  Contents API to discover files, then fetch each file individually.  The
  directory listing and every individual file are cached separately.

- The weekly GitHub Actions workflow in the portfolio repo already keeps all
  JSON data up-to-date; the plugin simply reads those files.

---

## Requirements

- DokuWiki 2018-04-22 ("Greebo") or later
- PHP 7.4+ (uses named arguments / arrow functions in PHP 8 syntax — compatible
  down to 7.4 with minor rewrites if needed)
- PHP `allow_url_fopen = On`  *or*  the `curl` extension enabled (for the
  `file_get_contents` HTTP wrapper used by `httpGet()`)

---

## License

GPL 2 — see <http://www.gnu.org/licenses/gpl.html>
