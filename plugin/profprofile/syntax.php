<?php
/**
 * DokuWiki Plugin profprofile — Syntax Component
 *
 * Renders academic profile data stored locally in DokuWiki.
 * All data is managed through the plugin admin page
 * (Admin → Professor Profile) — no GitHub connection required.
 *
 * Supported shortcodes
 * --------------------
 *   ~~PROF_HERO~~       Biography, photo and social links (profile.json)
 *   ~~PUBLICATIONS~~    Publication list  (publications.json)
 *   ~~SCHOLAR_STATS~~   Citation stats    (stats.json)
 *   ~~GITHUB_REPOS~~    GitHub repo cards (github.json)
 *   ~~RESEARCH_LIST~~   Research project cards (research.json)
 *   ~~READING_LIST~~    Reading article cards  (reading.json)
 *
 * Data directory: <dokuwiki_data>/profprofile/
 *
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author  Jairo M. Valdivia <jvaldivia@colorado.edu>
 */

if (!defined('DOKU_INC')) die();

class syntax_plugin_profprofile extends DokuWiki_Syntax_Plugin
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
            '~~(?:PROF_HERO|PUBLICATIONS|SCHOLAR_STATS|GITHUB_REPOS|RESEARCH_LIST|READING_LIST)~~',
            $mode,
            'plugin_profprofile'
        );
    }

    public function handle($match, $state, $pos, Doku_Handler $handler)
    {
        $shortcode = trim($match, '~');
        return ['shortcode' => $shortcode];
    }

    public function render($format, Doku_Renderer $renderer, $data)
    {
        if ($format !== 'xhtml') return false;

        // Disable DokuWiki page render cache so data changes appear instantly.
        $renderer->nocache();

        switch ($data['shortcode']) {
            case 'PROF_HERO':
                $renderer->doc .= $this->renderHero();
                break;
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

    // ── Data access ───────────────────────────────────────────────────────────

    /**
     * Returns the plugin's data directory path, creating it if needed.
     *
     * @return string  Absolute path with trailing separator.
     */
    public function getDataDir()
    {
        $dir = DOKU_DATA . 'profprofile' . DIRECTORY_SEPARATOR;
        if (!is_dir($dir)) {
            io_mkdir_p($dir);
        }
        return $dir;
    }

    /**
     * Read and JSON-decode a file from the plugin data directory.
     *
     * @param  string     $filename  File name (e.g. 'publications.json').
     * @return array|null            Decoded array, or null on failure.
     */
    private function readJson($filename)
    {
        $file = $this->getDataDir() . $filename;
        if (!file_exists($file)) return null;
        $raw = file_get_contents($file);
        if ($raw === false) return null;
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : null;
    }

    // ── Output helpers ────────────────────────────────────────────────────────

    /** HTML-escape a value for safe output. */
    private function h($value)
    {
        return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
    }

    /** Render an admin-page link shown inside error notices. */
    private function adminLink($tab = '')
    {
        $params = ['do' => 'admin', 'page' => 'profprofile'];
        if ($tab !== '') $params['tab'] = $tab;
        return wl('', $params, false, '&');
    }

    /** Render a row of tag badges. */
    private function renderTags(array $tags)
    {
        if (empty($tags)) return '';
        $html = '<div class="pp-tags">';
        foreach ($tags as $tag) {
            $html .= '<span class="pp-tag">' . $this->h($tag) . '</span>';
        }
        $html .= '</div>';
        return $html;
    }

    /** Render a single metric box (big number + label). */
    private function statBox($label, $value, $extraClass = '')
    {
        $cls = 'pp-stat-box' . ($extraClass !== '' ? ' ' . $extraClass : '');
        return '<div class="' . $cls . '">'
             . '<div class="pp-stat-value">' . $this->h($value) . '</div>'
             . '<div class="pp-stat-label">' . $this->h($label) . '</div>'
             . '</div>';
    }

    // ── ~~PROF_HERO~~ ─────────────────────────────────────────────────────────

    private function renderHero()
    {
        $profile = $this->readJson('profile.json');

        if (!$profile) {
            return '<div class="pp-error">No profile data found. '
                 . '<a href="' . $this->adminLink('profile') . '">Configure the professor profile</a>.'
                 . '</div>';
        }

        $name        = $this->h($profile['name']         ?? '');
        $title       = $this->h($profile['title']        ?? '');
        $institution = $this->h($profile['institution']  ?? '');
        $department  = $this->h($profile['department']   ?? '');
        $bio         = $this->h($profile['bio']          ?? '');
        $email       = $this->h($profile['email']        ?? '');
        $photoUrl    = $this->h($profile['photo_url']    ?? '');
        $githubUrl   = $this->h($profile['github_url']   ?? '');
        $linkedinUrl = $this->h($profile['linkedin_url'] ?? '');
        $scholarUrl  = $this->h($profile['scholar_url']  ?? '');
        $cvUrl       = $this->h($profile['cv_url']       ?? '');

        $html = '<div class="pp-hero">';

        if ($photoUrl) {
            $html .= '<div class="pp-hero-photo">'
                   . '<img src="' . $photoUrl . '" alt="' . $name . '" class="pp-hero-img">'
                   . '</div>';
        }

        $html .= '<div class="pp-hero-content">';

        if ($name) {
            $html .= '<h1 class="pp-hero-name">' . $name . '</h1>';
        }
        if ($title) {
            $html .= '<div class="pp-hero-title">' . $title . '</div>';
        }

        $affParts = array_filter([$institution, $department]);
        if ($affParts) {
            $html .= '<div class="pp-hero-institution">'
                   . implode(' &middot; ', array_values($affParts))
                   . '</div>';
        }

        if ($bio) {
            $html .= '<p class="pp-hero-bio">' . $bio . '</p>';
        }

        // Social links
        $links = [];
        if ($email) {
            $links[] = '<a href="mailto:' . $email . '" class="pp-hero-link pp-link-email">Email</a>';
        }
        if ($githubUrl) {
            $links[] = '<a href="' . $githubUrl . '" target="_blank" rel="noopener" class="pp-hero-link pp-link-github">GitHub</a>';
        }
        if ($linkedinUrl) {
            $links[] = '<a href="' . $linkedinUrl . '" target="_blank" rel="noopener" class="pp-hero-link pp-link-linkedin">LinkedIn</a>';
        }
        if ($scholarUrl) {
            $links[] = '<a href="' . $scholarUrl . '" target="_blank" rel="noopener" class="pp-hero-link pp-link-scholar">Google Scholar</a>';
        }
        if ($cvUrl) {
            $links[] = '<a href="' . $cvUrl . '" target="_blank" rel="noopener" class="pp-hero-link pp-link-cv">CV</a>';
        }
        if ($links) {
            $html .= '<div class="pp-hero-links">' . implode('', $links) . '</div>';
        }

        $html .= '</div>'; // .pp-hero-content
        $html .= '</div>'; // .pp-hero
        return $html;
    }

    // ── ~~SCHOLAR_STATS~~ ─────────────────────────────────────────────────────

    private function renderScholarStats()
    {
        $data = $this->readJson('stats.json');

        if (!$data || !isset($data['googleScholar'])) {
            return '<div class="pp-error">No scholar stats found. '
                 . '<a href="' . $this->adminLink('stats') . '">Add stats data</a>.'
                 . '</div>';
        }

        $gs = $data['googleScholar'];

        $html  = '<div class="pp-scholar-stats">';
        $html .= '<div class="pp-stats-grid">';
        $html .= $this->statBox('Total Citations',  $gs['citations']          ?? 0, 'pp-stat-highlight');
        $html .= $this->statBox('Since 2021',       $gs['citationsSince2021'] ?? 0);
        $html .= $this->statBox('h-index',          $gs['hIndex']             ?? 0);
        $html .= $this->statBox('h-index (5y)',     $gs['hIndex5y']           ?? 0);
        $html .= $this->statBox('i10-index',        $gs['i10Index']           ?? 0);
        $html .= $this->statBox('i10-index (5y)',   $gs['i10Index5y']         ?? 0);
        $html .= '</div>';

        $profileUrl  = $this->h($gs['profileUrl']  ?? '#');
        $lastUpdated = $this->h($gs['lastUpdated'] ?? '');

        $html .= '<p class="pp-meta">Source: '
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
        $pubs = $this->readJson('publications.json');

        if (!$pubs) {
            return '<div class="pp-error">No publications found. '
                 . '<a href="' . $this->adminLink('pubs') . '">Add publications data</a>.'
                 . '</div>';
        }

        usort($pubs, function ($a, $b) {
            return ($b['year'] ?? 0) <=> ($a['year'] ?? 0);
        });

        $max = (int) $this->getConf('max_publications');
        if ($max > 0 && count($pubs) > $max) {
            $pubs = array_slice($pubs, 0, $max);
        }

        $showVenue     = (bool) $this->getConf('show_venue');
        $showCitations = (bool) $this->getConf('show_citations');

        $html  = '<div class="pp-publications">';
        $html .= '<table class="pp-pub-table">';
        $html .= '<thead><tr><th>Year</th><th>Title</th>';
        if ($showVenue)     $html .= '<th>Venue</th>';
        if ($showCitations) $html .= '<th class="pp-pub-cites-col">Citations</th>';
        $html .= '</tr></thead><tbody>';

        foreach ($pubs as $pub) {
            $highlighted = !empty($pub['highlighted']) ? ' pp-pub-highlighted' : '';
            $year  = $this->h($pub['year']          ?? '');
            $title = $this->h($pub['title']         ?? '');
            $url   = $this->h($pub['url']           ?? '#');
            $venue = $this->h($pub['venue'] ?: '—');
            $cites = $this->h($pub['citationCount'] ?? 0);

            $html .= '<tr class="pp-pub-row' . $highlighted . '">';
            $html .= '<td class="pp-pub-year">' . $year . '</td>';
            $html .= '<td class="pp-pub-title">'
                   . '<a href="' . $url . '" target="_blank" rel="noopener">' . $title . '</a>'
                   . '</td>';
            if ($showVenue)     $html .= '<td class="pp-pub-venue">'  . $venue . '</td>';
            if ($showCitations) $html .= '<td class="pp-pub-cites">'  . $cites . '</td>';
            $html .= '</tr>';
        }

        $html .= '</tbody></table></div>';
        return $html;
    }

    // ── ~~GITHUB_REPOS~~ ──────────────────────────────────────────────────────

    private function renderGithubRepos()
    {
        $repos = $this->readJson('github.json');

        if (!$repos) {
            return '<div class="pp-error">No GitHub repositories found. '
                 . '<a href="' . $this->adminLink('repos') . '">Add GitHub repos data</a>.'
                 . '</div>';
        }

        $html = '<div class="pp-repo-grid">';

        foreach ($repos as $repo) {
            $name    = $this->h($repo['name']          ?? '');
            $desc    = $this->h($repo['description']   ?? '');
            $repoUrl = $this->h($repo['url']           ?? '#');
            $stars   = (int) ($repo['stars']           ?? 0);
            $lang    = $this->h($repo['language']      ?? '');
            $color   = $this->h($repo['languageColor'] ?? '#cccccc');

            $html .= '<div class="pp-repo-card">';
            $html .= '<div class="pp-repo-header">';
            $html .= '<a class="pp-repo-name" href="' . $repoUrl . '" target="_blank" rel="noopener">'
                   . $name . '</a>';
            if ($stars > 0) {
                $html .= '<span class="pp-repo-stars">&#9733; ' . $stars . '</span>';
            }
            $html .= '</div>';
            if ($desc) {
                $html .= '<p class="pp-repo-desc">' . $desc . '</p>';
            }
            if ($lang) {
                $html .= '<div class="pp-repo-lang">'
                       . '<span class="pp-lang-dot" style="background:' . $color . '"></span>'
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
        $posts = $this->readJson('research.json');

        if (!$posts) {
            return '<div class="pp-error">No research projects found. '
                 . '<a href="' . $this->adminLink('research') . '">Add research projects</a>.'
                 . '</div>';
        }

        usort($posts, function ($a, $b) {
            return ($a['priority'] ?? 99) <=> ($b['priority'] ?? 99);
        });

        $html = '<div class="pp-research-grid">';

        foreach ($posts as $post) {
            $html .= '<div class="pp-research-card">';
            $html .= '<h3 class="pp-research-title">' . $this->h($post['title'] ?? '') . '</h3>';

            if (!empty($post['summary'])) {
                $html .= '<p class="pp-research-summary">' . $this->h($post['summary']) . '</p>';
            }

            $tags = is_array($post['tags'] ?? null) ? $post['tags'] : [];
            $html .= $this->renderTags($tags);

            $links = is_array($post['links'] ?? null) ? $post['links'] : [];
            if (!empty($links['repo']) || !empty($links['paper']) || !empty($links['demo'])) {
                $html .= '<div class="pp-research-links">';
                if (!empty($links['repo'])) {
                    $html .= '<a href="' . $this->h($links['repo'])  . '" target="_blank" rel="noopener" class="pp-link-btn">Code</a>';
                }
                if (!empty($links['paper'])) {
                    $html .= '<a href="' . $this->h($links['paper']) . '" target="_blank" rel="noopener" class="pp-link-btn">Paper</a>';
                }
                if (!empty($links['demo'])) {
                    $html .= '<a href="' . $this->h($links['demo'])  . '" target="_blank" rel="noopener" class="pp-link-btn">Demo</a>';
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
        $posts = $this->readJson('reading.json');

        if (!$posts) {
            return '<div class="pp-error">No reading list found. '
                 . '<a href="' . $this->adminLink('reading') . '">Add reading list items</a>.'
                 . '</div>';
        }

        // Sort newest first (ISO date strings compare lexicographically).
        usort($posts, function ($a, $b) {
            return strcmp($b['date'] ?? '', $a['date'] ?? '');
        });

        $html = '<div class="pp-reading-list">';

        foreach ($posts as $post) {
            $title   = $this->h($post['title']   ?? '');
            $date    = $this->h($post['date']    ?? '');
            $author  = $this->h($post['author']  ?? '');
            $summary = $this->h($post['summary'] ?? '');
            $link    = $this->h($post['link']    ?? '');

            $html .= '<div class="pp-reading-card">';

            $titleHtml = $title;
            if ($link) {
                $titleHtml = '<a href="' . $link . '" target="_blank" rel="noopener">' . $title . '</a>';
            }
            $html .= '<h3 class="pp-reading-title">' . $titleHtml . '</h3>';

            $dateParts = array_filter([$date, $author]);
            if ($dateParts) {
                $html .= '<div class="pp-reading-date">'
                       . implode(' &mdash; ', array_values($dateParts))
                       . '</div>';
            }

            if ($summary) {
                $html .= '<p class="pp-reading-summary">' . $summary . '</p>';
            }

            $tags = is_array($post['tags'] ?? null) ? $post['tags'] : [];
            $html .= $this->renderTags($tags);

            $html .= '</div>';
        }

        $html .= '</div>';
        return $html;
    }
}
