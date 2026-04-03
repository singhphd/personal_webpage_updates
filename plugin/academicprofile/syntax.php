<?php
/**
 * DokuWiki Plugin academicprofile — Syntax Component
 *
 * Renders academic portfolio data directly inside any DokuWiki page via
 * simple shortcodes.  All data is fetched from a GitHub-hosted Next.js
 * academic portfolio and cached locally.
 *
 * Supported shortcodes
 * --------------------
 *   ~~PUBLICATIONS~~    Publication list  (src/data/publications.json)
 *   ~~SCHOLAR_STATS~~   Citation stats    (src/data/stats.json)
 *   ~~GITHUB_REPOS~~    GitHub repo cards (src/data/github.json)
 *   ~~RESEARCH_LIST~~   Research projects (src/content/research/*.md)
 *   ~~READING_LIST~~    Reading articles  (src/content/reading/*.md)
 *
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author  Jairo M. Valdivia <jvaldivia@colorado.edu>
 */

if (!defined('DOKU_INC')) die();

class syntax_plugin_academicprofile extends DokuWiki_Syntax_Plugin
{
    // ── DokuWiki Syntax API ────────────────────────────────────────────────────

    public function getType()
    {
        return 'substitution';
    }

    public function getPType()
    {
        return 'block';
    }

    public function getSort()
    {
        return 155;
    }

    public function connectTo($mode)
    {
        $this->Lexer->addSpecialPattern(
            '~~(?:PUBLICATIONS|SCHOLAR_STATS|GITHUB_REPOS|RESEARCH_LIST|READING_LIST)~~',
            $mode,
            'plugin_academicprofile'
        );
    }

    public function handle($match, $state, $pos, Doku_Handler $handler)
    {
        // Strip the surrounding ~~ to get the shortcode name.
        $shortcode = trim($match, '~');
        return ['shortcode' => $shortcode];
    }

    public function render($format, Doku_Renderer $renderer, $data)
    {
        if ($format !== 'xhtml') return false;

        switch ($data['shortcode']) {
            case 'PUBLICATIONS':
                $renderer->doc .= $this->renderPublications();
                break;
            case 'SCHOLAR_STATS':
                $renderer->doc .= $this->renderScholarStats();
                break;
            case 'GITHUB_REPOS':
                $renderer->doc .= $this->renderGithubRepos();
                break;
            case 'RESEARCH_LIST':
                $renderer->doc .= $this->renderResearchList();
                break;
            case 'READING_LIST':
                $renderer->doc .= $this->renderReadingList();
                break;
            default:
                return false;
        }

        return true;
    }

    // ── Cache helpers ──────────────────────────────────────────────────────────

    /**
     * Returns (and creates if necessary) the directory used for cached responses.
     */
    public function getCacheDir()
    {
        $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'dokuwiki_academicprofile';
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Fetch a URL, returning a previously cached response when still fresh.
     * Falls back to a stale cache entry if the upstream request fails.
     *
     * @param  string      $url  URL to fetch.
     * @param  string      $key  Logical cache key (used to generate the filename).
     * @return string|false      Raw response body or false on total failure.
     */
    public function fetchCached($url, $key)
    {
        $ttl  = (int) $this->getConf('cache_ttl');
        $file = $this->getCacheDir() . DIRECTORY_SEPARATOR . md5($key) . '.cache';

        if (file_exists($file) && (time() - filemtime($file)) < $ttl) {
            return file_get_contents($file);
        }

        $body = $this->httpGet($url);

        if ($body !== false) {
            file_put_contents($file, $body);
        } elseif (file_exists($file)) {
            // Return stale cache rather than nothing.
            return file_get_contents($file);
        }

        return $body;
    }

    /**
     * Perform a simple HTTP GET request.
     *
     * @param  string      $url
     * @return string|false
     */
    private function httpGet($url)
    {
        $opts = [
            'http' => [
                'method'  => 'GET',
                'timeout' => 10,
                'header'  => "User-Agent: DokuWiki-academicprofile-plugin/1.0\r\n",
            ],
        ];
        return @file_get_contents($url, false, stream_context_create($opts));
    }

    /**
     * Fetch a URL, decode the JSON body and return it as a PHP array.
     *
     * @param  string     $url
     * @param  string     $key  Cache key.
     * @return array|null
     */
    private function fetchJson($url, $key)
    {
        $raw = $this->fetchCached($url, $key);
        if ($raw === false) return null;
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : null;
    }

    // ── Markdown / YAML frontmatter parser ────────────────────────────────────

    /**
     * Parse the YAML frontmatter block from a Markdown file.
     *
     * Handles:
     *   - Simple scalar:      key: value  or  key: "value"
     *   - Inline array:       tags: ["A", "B", "C"]
     *   - Block sequence:     tags:\n  - A\n  - B
     *   - Nested mapping:     links:\n  repo: "url"\n  paper: "url"
     *
     * @param  string $content Raw Markdown file content.
     * @return array  ['meta' => [...], 'body' => '...']
     */
    private function parseFrontmatter($content)
    {
        $meta = [];
        $body = $content;

        if (!preg_match('/^---\s*\n(.*?)\n---\s*\n(.*)/s', $content, $m)) {
            return ['meta' => $meta, 'body' => $body];
        }

        $yamlBlock = $m[1];
        $body      = $m[2];
        $lastKey   = null;

        foreach (explode("\n", $yamlBlock) as $line) {
            // Inline array:  key: ["A", "B"]
            if (preg_match('/^(\w[\w\-]*):\s*\[(.*)\]\s*$/', $line, $kv)) {
                $items            = preg_split('/,\s*/', $kv[2]);
                $key              = trim($kv[1]);
                $meta[$key]       = array_map(fn($s) => trim($s, ' "\''), $items);
                $lastKey          = $key;
                continue;
            }

            // Top-level key with no inline value (block mapping/sequence follows).
            // Must be checked BEFORE the scalar pattern so that bare "key:" lines
            // are correctly recognised as the start of a nested block.
            if (preg_match('/^(\w[\w\-]*):\s*$/', $line, $kv)) {
                $key        = trim($kv[1]);
                $meta[$key] = [];
                $lastKey    = $key;
                continue;
            }

            // Top-level scalar (with optional quotes):  key: "value"  or  key: value
            // Uses \s+ (one or more spaces) so bare "key:" lines (no value) never match here;
            // those are handled by the "no inline value" check above.
            if (preg_match('/^(\w[\w\-]*):\s+"?([^"]*?)"?\s*$/', $line, $kv) && trim($kv[2]) !== '') {
                $key        = trim($kv[1]);
                $value      = trim($kv[2]);
                $meta[$key] = $value;
                $lastKey    = $key;
                continue;
            }

            // Block sequence item under the current key:  - "value"
            if (preg_match('/^\s+-\s+"?(.+?)"?\s*$/', $line, $kv) && $lastKey !== null) {
                if (!is_array($meta[$lastKey])) {
                    $meta[$lastKey] = [];
                }
                $meta[$lastKey][] = trim($kv[1], '"\'');
                continue;
            }

            // Nested mapping value (e.g. under links:):    repo: "url"
            if (preg_match('/^\s+(\w[\w\-]*):\s*"?([^"]*?)"?\s*$/', $line, $kv)
                && $lastKey !== null
                && is_array($meta[$lastKey])
            ) {
                $meta[$lastKey][trim($kv[1])] = trim($kv[2], '"\'');
            }
        }

        return ['meta' => $meta, 'body' => $body];
    }

    // ── Output helpers ────────────────────────────────────────────────────────

    /** Safely escape a value for HTML output. */
    private function h($value)
    {
        return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
    }

    /** Render a row of tag badges. */
    private function renderTags(array $tags)
    {
        if (empty($tags)) return '';
        $html = '<div class="ap-tags">';
        foreach ($tags as $tag) {
            $html .= '<span class="ap-tag">' . $this->h($tag) . '</span>';
        }
        $html .= '</div>';
        return $html;
    }

    /** Render a single stat box (value + label). */
    private function statBox($label, $value, $extraClass = '')
    {
        $cls = 'ap-stat-box' . ($extraClass ? ' ' . $extraClass : '');
        return '<div class="' . $cls . '">'
             . '<div class="ap-stat-value">' . $this->h($value) . '</div>'
             . '<div class="ap-stat-label">' . $this->h($label) . '</div>'
             . '</div>';
    }

    // ── ~~SCHOLAR_STATS~~ ─────────────────────────────────────────────────────

    private function renderScholarStats()
    {
        $base = rtrim($this->getConf('github_raw_base'), '/');
        $data = $this->fetchJson($base . '/src/data/stats.json', 'stats');

        if (!$data || !isset($data['googleScholar'])) {
            return '<div class="ap-error">Could not load scholar stats.</div>';
        }

        $gs = $data['googleScholar'];

        $html  = '<div class="ap-scholar-stats">';
        $html .= '<div class="ap-stats-grid">';
        $html .= $this->statBox('Total Citations',    $gs['citations']           ?? 0, 'ap-stat-highlight');
        $html .= $this->statBox('Since 2021',         $gs['citationsSince2021']  ?? 0);
        $html .= $this->statBox('h-index',            $gs['hIndex']              ?? 0);
        $html .= $this->statBox('h-index (5y)',       $gs['hIndex5y']            ?? 0);
        $html .= $this->statBox('i10-index',          $gs['i10Index']            ?? 0);
        $html .= $this->statBox('i10-index (5y)',     $gs['i10Index5y']          ?? 0);
        $html .= '</div>';

        $profileUrl  = $this->h($gs['profileUrl']  ?? '#');
        $lastUpdated = $this->h($gs['lastUpdated'] ?? '');

        $html .= '<p class="ap-meta">Source: '
               . '<a href="' . $profileUrl . '" target="_blank" rel="noopener">Google Scholar</a>';
        if ($lastUpdated) {
            $html .= ' &mdash; Last updated: ' . $lastUpdated;
        }
        $html .= '</p>';
        $html .= '</div>';

        return $html;
    }

    // ── ~~PUBLICATIONS~~ ──────────────────────────────────────────────────────

    private function renderPublications()
    {
        $base = rtrim($this->getConf('github_raw_base'), '/');
        $pubs = $this->fetchJson($base . '/src/data/publications.json', 'publications');

        if (!$pubs) {
            return '<div class="ap-error">Could not load publications.</div>';
        }

        $max = (int) $this->getConf('max_publications');
        if ($max > 0 && count($pubs) > $max) {
            $pubs = array_slice($pubs, 0, $max);
        }

        usort($pubs, fn($a, $b) => ($b['year'] ?? 0) <=> ($a['year'] ?? 0));

        $html  = '<div class="ap-publications">';
        $html .= '<table class="ap-pub-table">';
        $html .= '<thead><tr>'
               . '<th>Year</th>'
               . '<th>Title</th>'
               . '<th>Venue</th>'
               . '<th class="ap-pub-cites-col">Citations</th>'
               . '</tr></thead>';
        $html .= '<tbody>';

        foreach ($pubs as $pub) {
            $highlighted = !empty($pub['highlighted']) ? ' ap-pub-highlighted' : '';
            $year  = $this->h($pub['year']        ?? '');
            $title = $this->h($pub['title']       ?? '');
            $url   = $this->h($pub['url']         ?? '#');
            $venue = $this->h($pub['venue'] ?: '—');
            $cites = $this->h($pub['citationCount'] ?? 0);

            $html .= '<tr class="ap-pub-row' . $highlighted . '">';
            $html .= '<td class="ap-pub-year">' . $year . '</td>';
            $html .= '<td class="ap-pub-title">'
                   . '<a href="' . $url . '" target="_blank" rel="noopener">' . $title . '</a>'
                   . '</td>';
            $html .= '<td class="ap-pub-venue">' . $venue . '</td>';
            $html .= '<td class="ap-pub-cites">' . $cites . '</td>';
            $html .= '</tr>';
        }

        $html .= '</tbody></table></div>';
        return $html;
    }

    // ── ~~GITHUB_REPOS~~ ──────────────────────────────────────────────────────

    private function renderGithubRepos()
    {
        $base  = rtrim($this->getConf('github_raw_base'), '/');
        $repos = $this->fetchJson($base . '/src/data/github.json', 'github');

        if (!$repos) {
            return '<div class="ap-error">Could not load GitHub repositories.</div>';
        }

        $html = '<div class="ap-repo-grid">';

        foreach ($repos as $repo) {
            $name    = $this->h($repo['name']         ?? '');
            $desc    = $this->h($repo['description']  ?? '');
            $repoUrl = $this->h($repo['url']          ?? '#');
            $stars   = (int) ($repo['stars']           ?? 0);
            $lang    = $this->h($repo['language']     ?? '');
            $color   = $this->h($repo['languageColor'] ?? '#cccccc');

            $html .= '<div class="ap-repo-card">';
            $html .= '<div class="ap-repo-header">';
            $html .= '<a class="ap-repo-name" href="' . $repoUrl . '" target="_blank" rel="noopener">'
                   . $name . '</a>';
            if ($stars > 0) {
                $html .= '<span class="ap-repo-stars">&#9733; ' . $stars . '</span>';
            }
            $html .= '</div>';

            if ($desc) {
                $html .= '<p class="ap-repo-desc">' . $desc . '</p>';
            }

            if ($lang) {
                $html .= '<div class="ap-repo-lang">'
                       . '<span class="ap-lang-dot" style="background:' . $color . '"></span>'
                       . '<span>' . $lang . '</span>'
                       . '</div>';
            }

            $html .= '</div>';
        }

        $html .= '</div>';
        return $html;
    }

    // ── ~~RESEARCH_LIST~~ ─────────────────────────────────────────────────────

    private function renderResearchList()
    {
        $apiRepo = $this->getConf('github_api_repo');
        $rawBase = rtrim($this->getConf('github_raw_base'), '/');

        $listing = $this->fetchJson(
            'https://api.github.com/repos/' . $apiRepo . '/contents/src/content/research',
            'research_listing'
        );

        if (!$listing) {
            return '<div class="ap-error">Could not load research list.</div>';
        }

        $posts = [];
        foreach ($listing as $file) {
            if (($file['type'] ?? '') !== 'file' || !preg_match('/\.md$/i', $file['name'] ?? '')) {
                continue;
            }
            $slug    = preg_replace('/\.md$/i', '', $file['name']);
            $rawUrl  = $rawBase . '/src/content/research/' . $file['name'];
            $content = $this->fetchCached($rawUrl, 'research_' . $slug);

            if ($content === false) continue;

            $parsed  = $this->parseFrontmatter($content);
            $meta    = $parsed['meta'];

            $posts[] = [
                'slug'     => $slug,
                'title'    => $meta['title']    ?? $slug,
                'summary'  => $meta['summary']  ?? '',
                'priority' => (int) ($meta['priority'] ?? 99),
                'tags'     => is_array($meta['tags'] ?? null) ? $meta['tags'] : [],
                'links'    => is_array($meta['links'] ?? null) ? $meta['links'] : [],
            ];
        }

        usort($posts, fn($a, $b) => $a['priority'] <=> $b['priority']);

        $html = '<div class="ap-research-grid">';
        foreach ($posts as $post) {
            $html .= '<div class="ap-research-card">';
            $html .= '<h3 class="ap-research-title">' . $this->h($post['title']) . '</h3>';
            if ($post['summary']) {
                $html .= '<p class="ap-research-summary">' . $this->h($post['summary']) . '</p>';
            }
            $html .= $this->renderTags($post['tags']);

            $links = $post['links'];
            if (!empty($links['repo']) || !empty($links['paper']) || !empty($links['demo'])) {
                $html .= '<div class="ap-research-links">';
                if (!empty($links['repo'])) {
                    $html .= '<a href="' . $this->h($links['repo']) . '" target="_blank" rel="noopener" class="ap-link-btn">Code</a>';
                }
                if (!empty($links['paper'])) {
                    $html .= '<a href="' . $this->h($links['paper']) . '" target="_blank" rel="noopener" class="ap-link-btn">Paper</a>';
                }
                if (!empty($links['demo'])) {
                    $html .= '<a href="' . $this->h($links['demo']) . '" target="_blank" rel="noopener" class="ap-link-btn">Demo</a>';
                }
                $html .= '</div>';
            }

            $html .= '</div>';
        }
        $html .= '</div>';
        return $html;
    }

    // ── ~~READING_LIST~~ ──────────────────────────────────────────────────────

    private function renderReadingList()
    {
        $apiRepo = $this->getConf('github_api_repo');
        $rawBase = rtrim($this->getConf('github_raw_base'), '/');

        $listing = $this->fetchJson(
            'https://api.github.com/repos/' . $apiRepo . '/contents/src/content/reading',
            'reading_listing'
        );

        if (!$listing) {
            return '<div class="ap-error">Could not load reading list.</div>';
        }

        $posts = [];
        foreach ($listing as $file) {
            if (($file['type'] ?? '') !== 'file' || !preg_match('/\.md$/i', $file['name'] ?? '')) {
                continue;
            }
            $slug    = preg_replace('/\.md$/i', '', $file['name']);
            $rawUrl  = $rawBase . '/src/content/reading/' . $file['name'];
            $content = $this->fetchCached($rawUrl, 'reading_' . $slug);

            if ($content === false) continue;

            $parsed  = $this->parseFrontmatter($content);
            $meta    = $parsed['meta'];

            $posts[] = [
                'slug'    => $slug,
                'title'   => $meta['title']   ?? $slug,
                'date'    => $meta['date']    ?? '',
                'summary' => $meta['summary'] ?? '',
                'tags'    => is_array($meta['tags'] ?? null) ? $meta['tags'] : [],
                'link'    => $meta['link']    ?? '',
            ];
        }

        // Newest first (ISO date strings sort lexicographically).
        usort($posts, fn($a, $b) => strcmp($b['date'], $a['date']));

        $html = '<div class="ap-reading-list">';
        foreach ($posts as $post) {
            $html .= '<div class="ap-reading-card">';

            $titleHtml = $this->h($post['title']);
            if ($post['link']) {
                $titleHtml = '<a href="' . $this->h($post['link']) . '" target="_blank" rel="noopener">'
                           . $titleHtml . '</a>';
            }
            $html .= '<h3 class="ap-reading-title">' . $titleHtml . '</h3>';

            if ($post['date']) {
                $html .= '<div class="ap-reading-date">' . $this->h($post['date']) . '</div>';
            }
            if ($post['summary']) {
                $html .= '<p class="ap-reading-summary">' . $this->h($post['summary']) . '</p>';
            }
            $html .= $this->renderTags($post['tags']);
            $html .= '</div>';
        }
        $html .= '</div>';
        return $html;
    }
}
