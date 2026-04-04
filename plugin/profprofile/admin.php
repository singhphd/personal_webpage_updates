<?php
/**
 * DokuWiki Plugin profprofile — Admin Component
 *
 * Provides a tabbed admin interface for managing all professor profile data
 * stored locally in DokuWiki.  Data can be entered manually or imported from
 * Semantic Scholar (publications + citation stats) and the GitHub API (repos).
 *
 * Tabs
 * ----
 *   profile  — Personal info (profile.json)
 *   pubs     — Publications  (publications.json)
 *   stats    — Scholar stats (stats.json)
 *   repos    — GitHub repos  (github.json)
 *   research — Research projects (research.json)
 *   reading  — Reading list      (reading.json)
 *   sync     — Import data from Semantic Scholar / GitHub API
 *
 * Access: Admin → Professor Profile
 *
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author  Jairo M. Valdivia <jvaldivia@colorado.edu>
 */

if (!defined('DOKU_INC')) die();

class admin_plugin_profprofile extends DokuWiki_Admin_Plugin
{
    /** @var string[] Valid tab identifiers in display order */
    private $tabs = ['profile', 'pubs', 'stats', 'repos', 'research', 'reading', 'sync'];

    /** @var string[] Map tab → data filename */
    private $tabFiles = [
        'pubs'     => 'publications.json',
        'stats'    => 'stats.json',
        'repos'    => 'github.json',
        'research' => 'research.json',
        'reading'  => 'reading.json',
    ];

    // ── DokuWiki Admin API ────────────────────────────────────────────────────

    public function getMenuSort()
    {
        return 200;
    }

    public function forAdminOnly()
    {
        return false; // Accessible to DokuWiki managers as well as admins.
    }

    // ── Data directory helpers ────────────────────────────────────────────────

    private function getDataDir()
    {
        $dir = DOKU_DATA . 'profprofile' . DIRECTORY_SEPARATOR;
        if (!is_dir($dir)) {
            io_mkdir_p($dir);
        }
        return $dir;
    }

    private function readDataFile($filename)
    {
        $file = $this->getDataDir() . $filename;
        if (!file_exists($file)) return null;
        $raw = file_get_contents($file);
        return $raw !== false ? $raw : null;
    }

    private function writeDataFile($filename, $content)
    {
        $file = $this->getDataDir() . $filename;
        return file_put_contents($file, $content) !== false;
    }

    // ── POST handling ─────────────────────────────────────────────────────────

    public function handle()
    {
        global $INPUT;

        if (!$INPUT->post->bool('profprofile_save')) return;
        if (!checkSecurityToken()) return;
        if (!auth_ismanager()) return;

        $tab = $INPUT->post->str('tab', 'profile');
        if (!in_array($tab, $this->tabs, true)) {
            $tab = 'profile';
        }

        if ($tab === 'profile') {
            $this->handleProfileSave($INPUT);
        } elseif ($tab === 'sync') {
            $this->handleSyncAction($INPUT);
        } elseif (isset($this->tabFiles[$tab])) {
            $this->handleJsonSave($INPUT, $tab);
        }
    }

    private function handleProfileSave($INPUT)
    {
        $fields = [
            'name', 'title', 'institution', 'department', 'bio',
            'email', 'photo_url', 'github_url', 'linkedin_url',
            'scholar_url', 'cv_url',
        ];

        $profile = [];
        foreach ($fields as $field) {
            $profile[$field] = trim($INPUT->post->str($field, ''));
        }

        $json = json_encode(
            $profile,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        if ($this->writeDataFile('profile.json', $json)) {
            $this->redirect('profile', 'saved');
        } else {
            $this->redirect('profile', 'error');
        }
    }

    private function handleJsonSave($INPUT, $tab)
    {
        $raw     = $INPUT->post->str('json_data', '');
        $decoded = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->redirect($tab, 'json_error');
            return;
        }

        $json = json_encode(
            $decoded,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        if ($this->writeDataFile($this->tabFiles[$tab], $json)) {
            $this->redirect($tab, 'saved');
        } else {
            $this->redirect($tab, 'error');
        }
    }

    /** Redirect back to the admin page (PRG pattern). */
    private function redirect($tab, $msg)
    {
        $url = wl(
            '',
            ['do' => 'admin', 'page' => 'profprofile', 'tab' => $tab, 'pp_msg' => $msg],
            false,
            '&'
        );
        send_redirect($url);
    }

    // ── HTML rendering ────────────────────────────────────────────────────────

    public function html()
    {
        global $INPUT;

        $tab = $INPUT->str('tab', 'profile');
        if (!in_array($tab, $this->tabs, true)) {
            $tab = 'profile';
        }

        $this->renderFlashMessage($INPUT->str('pp_msg', ''));
        $this->renderTabs($tab);

        echo '<div class="pp-admin-content">';
        switch ($tab) {
            case 'profile':
                $this->renderProfileTab();
                break;
            case 'sync':
                $this->renderSyncTab();
                break;
            default:
                $this->renderJsonTab($tab);
        }
        echo '</div>';
    }

    private function renderFlashMessage($msg)
    {
        if ($msg === '') return;

        $map = [
            'saved'      => ['success', $this->getLang('saved_ok')],
            'error'      => ['error',   $this->getLang('save_error')],
            'json_error' => ['error',   $this->getLang('json_invalid')],
        ];

        if (!isset($map[$msg])) return;

        [$cls, $text] = $map[$msg];
        echo '<div class="' . hsc($cls) . ' pp-admin-msg">' . hsc($text) . '</div>';
    }

    private function renderTabs($activeTab)
    {
        echo '<div class="pp-admin-tabs">';
        foreach ($this->tabs as $t) {
            $active = ($t === $activeTab) ? ' pp-tab-active' : '';
            $url    = wl('', ['do' => 'admin', 'page' => 'profprofile', 'tab' => $t], false, '&');
            echo '<a href="' . hsc($url) . '" class="pp-tab' . $active . '">'
               . hsc($this->getLang('tab_' . $t))
               . '</a>';
        }
        echo '</div>';
    }

    // ── Profile tab ───────────────────────────────────────────────────────────

    private function renderProfileTab()
    {
        $profileJson = $this->readDataFile('profile.json');
        $profile     = [];
        if ($profileJson) {
            $decoded = json_decode($profileJson, true);
            if (is_array($decoded)) {
                $profile = $decoded;
            }
        }

        $v       = function ($key) use ($profile) {
            return hsc($profile[$key] ?? '');
        };
        $formUrl = wl('', ['do' => 'admin', 'page' => 'profprofile'], false, '&');

        echo '<form action="' . hsc($formUrl) . '" method="post" class="pp-profile-form">';
        echo '<input type="hidden" name="tab" value="profile">';
        echo '<input type="hidden" name="profprofile_save" value="1">';
        formSecurityToken();

        $fields = [
            'name'         => ['label' => 'Full Name',                   'type' => 'text'],
            'title'        => ['label' => 'Academic Title / Position',   'type' => 'text'],
            'institution'  => ['label' => 'Institution',                 'type' => 'text'],
            'department'   => ['label' => 'Department',                  'type' => 'text'],
            'bio'          => ['label' => 'Short Biography',             'type' => 'textarea'],
            'email'        => ['label' => 'Email Address',               'type' => 'email'],
            'photo_url'    => ['label' => 'Profile Photo URL',           'type' => 'url'],
            'github_url'   => ['label' => 'GitHub Profile URL',          'type' => 'url'],
            'linkedin_url' => ['label' => 'LinkedIn Profile URL',        'type' => 'url'],
            'scholar_url'  => ['label' => 'Google Scholar Profile URL',  'type' => 'url'],
            'cv_url'       => ['label' => 'CV / Résumé URL',             'type' => 'url'],
        ];

        echo '<table class="pp-form-table">';
        foreach ($fields as $key => $def) {
            $id = 'pp_' . hsc($key);
            echo '<tr>';
            echo '<th><label for="' . $id . '">' . hsc($def['label']) . '</label></th>';
            echo '<td>';
            if ($def['type'] === 'textarea') {
                echo '<textarea id="' . $id . '" name="' . hsc($key) . '" rows="5" class="pp-field-wide">'
                   . $v($key)
                   . '</textarea>';
            } else {
                echo '<input type="' . hsc($def['type']) . '" id="' . $id . '" name="' . hsc($key) . '"'
                   . ' value="' . $v($key) . '" class="pp-field-wide">';
            }
            echo '</td>';
            echo '</tr>';
        }
        echo '</table>';

        echo '<p class="pp-form-actions"><button type="submit" class="button">'
           . hsc($this->getLang('btn_save'))
           . '</button></p>';
        echo '</form>';

        echo '<div class="pp-usage-hint">';
        echo '<strong>Usage:</strong> Place <code>~~PROF_HERO~~</code> in any DokuWiki page ';
        echo 'to display the bio / social-links section using the data above.';
        echo '</div>';
    }

    // ── JSON-editor tabs ──────────────────────────────────────────────────────

    private function renderJsonTab($tab)
    {
        if (!isset($this->tabFiles[$tab])) return;

        $filename = $this->tabFiles[$tab];
        $current  = $this->readDataFile($filename);

        $hints = [
            'pubs' =>
                'Array of publication objects. '
                . 'Required fields: <code>title</code>, <code>url</code>, <code>year</code>. '
                . 'Optional: <code>paperId</code>, <code>venue</code>, <code>citationCount</code>, <code>highlighted</code>.',
            'stats' =>
                'Stats object with a <code>googleScholar</code> key containing: '
                . '<code>citations</code>, <code>citationsSince2021</code>, <code>hIndex</code>, '
                . '<code>hIndex5y</code>, <code>i10Index</code>, <code>i10Index5y</code>, '
                . '<code>profileUrl</code>, <code>lastUpdated</code> (YYYY-MM-DD).',
            'repos' =>
                'Array of repository objects. '
                . 'Fields: <code>name</code>, <code>description</code>, <code>url</code>, '
                . '<code>stars</code>, <code>language</code>, <code>languageColor</code> (#hex).',
            'research' =>
                'Array of research project objects. '
                . 'Fields: <code>title</code>, <code>summary</code>, <code>priority</code> (1 = featured), '
                . '<code>tags</code> (array), <code>links</code> ({<code>repo</code>, <code>paper</code>, <code>demo</code>}).',
            'reading' =>
                'Array of reading-list items. '
                . 'Fields: <code>title</code>, <code>date</code> (YYYY-MM-DD), <code>author</code>, '
                . '<code>summary</code>, <code>tags</code> (array), <code>link</code> (URL).',
        ];

        $placeholders = [
            'pubs'     => '[{"paperId":"","url":"","title":"","venue":"","year":2024,"citationCount":0}]',
            'stats'    => '{"googleScholar":{"citations":0,"citationsSince2021":0,"hIndex":0,"hIndex5y":0,"i10Index":0,"i10Index5y":0,"profileUrl":"","lastUpdated":""}}',
            'repos'    => '[{"name":"","description":"","url":"","stars":0,"language":"","languageColor":"#cccccc"}]',
            'research' => '[{"title":"","summary":"","priority":1,"tags":[],"links":{"repo":"","paper":"","demo":""}}]',
            'reading'  => '[{"title":"","date":"","author":"","summary":"","tags":[],"link":""}]',
        ];

        $shortcodes = [
            'pubs'     => '~~PUBLICATIONS~~',
            'stats'    => '~~SCHOLAR_STATS~~',
            'repos'    => '~~GITHUB_REPOS~~',
            'research' => '~~RESEARCH_LIST~~',
            'reading'  => '~~READING_LIST~~',
        ];

        $formUrl = wl('', ['do' => 'admin', 'page' => 'profprofile'], false, '&');

        if (isset($hints[$tab])) {
            echo '<p class="pp-json-hint">' . $hints[$tab] . '</p>';
        }
        echo '<p class="pp-usage-hint"><strong>Shortcode:</strong> <code>' . hsc($shortcodes[$tab] ?? '') . '</code></p>';

        echo '<form action="' . hsc($formUrl) . '" method="post">';
        echo '<input type="hidden" name="tab" value="' . hsc($tab) . '">';
        echo '<input type="hidden" name="profprofile_save" value="1">';
        formSecurityToken();

        $jsonContent = $current !== null ? $current : ($placeholders[$tab] ?? '[]');
        echo '<textarea name="json_data" class="pp-json-editor" rows="30"'
           . ' spellcheck="false" autocomplete="off">'
           . hsc($jsonContent)
           . '</textarea>';

        echo '<p class="pp-form-actions"><button type="submit" class="button">'
           . hsc($this->getLang('btn_save'))
           . '</button></p>';
        echo '</form>';
    }

    // ── Sync / Import tab ────────────────────────────────────────────────────

    /**
     * Read the sync configuration (semantic_scholar_id, github_username, last sync
     * timestamps) from sync_config.json in the plugin data directory.
     */
    private function readSyncConfig()
    {
        $raw = $this->readDataFile('sync_config.json');
        if ($raw === null) return [];
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function writeSyncConfig(array $data)
    {
        $json = json_encode(
            $data,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        $this->writeDataFile('sync_config.json', $json);
    }

    /**
     * Perform a simple HTTP GET.  Prefers cURL when available,
     * falls back to file_get_contents with a stream context.
     *
     * @param  string   $url
     * @param  string[] $extraHeaders  Additional "Header: value" lines.
     * @return string|false
     */
    private function httpGet($url, array $extraHeaders = [])
    {
        $defaultHeaders = [
            'User-Agent: DokuWiki-profprofile-plugin/1.0',
            'Accept: application/json',
        ];
        $headers = array_merge($defaultHeaders, $extraHeaders);

        if (function_exists('curl_init')) {
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL            => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 20,
                CURLOPT_HTTPHEADER     => $headers,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_SSL_VERIFYPEER => true,
            ]);
            $body   = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            return ($body !== false && $status >= 200 && $status < 300) ? $body : false;
        }

        $opts = [
            'http' => [
                'method'  => 'GET',
                'timeout' => 20,
                'header'  => implode("\r\n", $headers),
            ],
        ];
        return @file_get_contents($url, false, stream_context_create($opts));
    }

    /**
     * Compute the h-index from a flat array of citation counts
     * (does not need to be pre-sorted).
     *
     * @param  int[] $citations
     * @return int
     */
    private function computeHIndex(array $citations)
    {
        rsort($citations);
        $h = 0;
        foreach ($citations as $rank => $c) {
            if ($c >= ($rank + 1)) {
                $h = $rank + 1;
            } else {
                break;
            }
        }
        return $h;
    }

    /** Map programming language names to their canonical GitHub colour. */
    private function getLanguageColors()
    {
        return [
            'Python'           => '#3572A5',
            'JavaScript'       => '#f1e05a',
            'TypeScript'       => '#2b7489',
            'PHP'              => '#4F5D95',
            'Java'             => '#b07219',
            'C++'              => '#f34b7d',
            'C'                => '#555555',
            'C#'               => '#178600',
            'Ruby'             => '#701516',
            'Go'               => '#00ADD8',
            'Rust'             => '#dea584',
            'Swift'            => '#ffac45',
            'Kotlin'           => '#F18E33',
            'R'                => '#198CE7',
            'MATLAB'           => '#e16737',
            'Fortran'          => '#4d41b1',
            'Shell'            => '#89e051',
            'HTML'             => '#e34c26',
            'CSS'              => '#563d7c',
            'Vue'              => '#2c3e50',
            'Jupyter Notebook' => '#DA5B0B',
            'Julia'            => '#a270ba',
            'Scala'            => '#c22d40',
            'Haskell'          => '#5e5086',
            'Lua'              => '#000080',
        ];
    }

    /**
     * Fetch publications and citation stats from the Semantic Scholar API and
     * write publications.json + stats.json to the plugin data directory.
     *
     * @param  string $authorId  Semantic Scholar numeric author ID.
     * @return array  ['success' => bool, 'message' => string]
     */
    private function syncPublications($authorId)
    {
        if (empty($authorId)) {
            return [
                'success' => false,
                'message' => $this->getLang('sync_err_no_scholar_id'),
            ];
        }

        // ── 1. Fetch author details ────────────────────────────────────────
        $authorUrl  = 'https://api.semanticscholar.org/graph/v1/author/'
                    . rawurlencode($authorId)
                    . '?fields=authorId,name,citationCount,hIndex,paperCount';
        $authorBody = $this->httpGet($authorUrl);

        if ($authorBody === false) {
            return [
                'success' => false,
                'message' => $this->getLang('sync_err_scholar_fetch'),
            ];
        }

        $authorData = json_decode($authorBody, true);
        if (!is_array($authorData) || empty($authorData['authorId'])) {
            return [
                'success' => false,
                'message' => $this->getLang('sync_err_scholar_author'),
            ];
        }

        // ── 2. Fetch papers (up to 1 000; follows offset-based pagination) ─
        $papers  = [];
        $offset  = 0;
        $limit   = 100;

        do {
            $papersUrl  = 'https://api.semanticscholar.org/graph/v1/author/'
                        . rawurlencode($authorId)
                        . '/papers?fields=paperId,externalIds,title,year,venue,citationCount'
                        . '&limit=' . $limit
                        . '&offset=' . $offset;
            $papersBody = $this->httpGet($papersUrl);

            if ($papersBody === false) break;

            $papersData = json_decode($papersBody, true);
            if (!is_array($papersData) || !isset($papersData['data'])) break;

            $papers = array_merge($papers, $papersData['data']);

            // If the API returns fewer items than the limit we've reached the end.
            $fetched = count($papersData['data']);
            $offset += $fetched;
        } while ($fetched === $limit && $offset < 1000);

        // ── 3. Build publications array ────────────────────────────────────
        $publications = [];
        foreach ($papers as $paper) {
            $doi = $paper['externalIds']['DOI'] ?? null;
            $url = $doi
                ? 'https://doi.org/' . $doi
                : 'https://www.semanticscholar.org/paper/' . ($paper['paperId'] ?? '');

            $publications[] = [
                'paperId'       => $paper['paperId']                 ?? '',
                'url'           => $url,
                'title'         => $paper['title']                   ?? '',
                'venue'         => $paper['venue']                   ?? '',
                'year'          => (int) ($paper['year']             ?? 0),
                'citationCount' => (int) ($paper['citationCount']    ?? 0),
            ];
        }

        // ── 4. Compute derived stats ───────────────────────────────────────
        $allCitations = array_map(function ($p) { return $p['citationCount']; }, $publications);
        $hIdx         = $this->computeHIndex($allCitations);
        $i10          = count(array_filter($allCitations, function ($c) { return $c >= 10; }));

        // Stats over the most-recent 5 complete calendar years (year >= currentYear - 4).
        // Example: in 2026 this covers 2022–2026 inclusive.
        $cutoff = (int) date('Y') - 4;
        $recentCitations = array_map(
            function ($p) { return $p['citationCount']; },
            array_filter($publications, function ($p) use ($cutoff) { return $p['year'] >= $cutoff; })
        );
        $h5    = $this->computeHIndex(array_values($recentCitations));
        $i10_5 = count(array_filter($recentCitations, function ($c) { return $c >= 10; }));

        // citationsSince2021 — papers published in 2021 or later
        $since2021 = array_sum(
            array_map(
                function ($p) { return $p['citationCount']; },
                array_filter($publications, function ($p) { return $p['year'] >= 2021; })
            )
        );

        // Use the API-level citation count when available; fall back to 0 rather
        // than summing per-paper counts (which counts multi-author papers multiple times).
        $totalCitations = isset($authorData['citationCount'])
            ? (int) $authorData['citationCount']
            : 0;

        // ── 5. Save publications.json ──────────────────────────────────────
        $pubsJson = json_encode(
            $publications,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        $this->writeDataFile('publications.json', $pubsJson);

        // ── 6. Save stats.json ─────────────────────────────────────────────
        $stats = [
            'googleScholar' => [
                'citations'          => $totalCitations,
                'citationsSince2021' => $since2021,
                'hIndex'             => $hIdx,
                'hIndex5y'           => $h5,
                'i10Index'           => $i10,
                'i10Index5y'         => $i10_5,
                'profileUrl'         => 'https://www.semanticscholar.org/author/'
                                      . rawurlencode($authorData['authorId']),
                'lastUpdated'        => date('Y-m-d'),
            ],
        ];
        $statsJson = json_encode(
            $stats,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        $this->writeDataFile('stats.json', $statsJson);

        return [
            'success' => true,
            'message' => sprintf(
                $this->getLang('sync_ok_pubs'),
                count($publications),
                $hIdx,
                $totalCitations
            ),
        ];
    }

    /**
     * Fetch the top public repositories for a GitHub user and write github.json.
     *
     * @param  string $username
     * @return array  ['success' => bool, 'message' => string]
     */
    private function syncGithubRepos($username)
    {
        if (empty($username)) {
            return [
                'success' => false,
                'message' => $this->getLang('sync_err_no_github_user'),
            ];
        }

        $url  = 'https://api.github.com/users/' . rawurlencode($username)
              . '/repos?sort=stars&direction=desc&per_page=20&type=public';
        $body = $this->httpGet($url);

        if ($body === false) {
            return [
                'success' => false,
                'message' => $this->getLang('sync_err_github_fetch'),
            ];
        }

        $raw = json_decode($body, true);
        if (!is_array($raw)) {
            return [
                'success' => false,
                'message' => $this->getLang('sync_err_github_fetch'),
            ];
        }

        // Check for GitHub API error (e.g. rate-limit or not-found)
        if (isset($raw['message'])) {
            return [
                'success' => false,
                'message' => 'GitHub API: ' . hsc($raw['message']),
            ];
        }

        $langColors = $this->getLanguageColors();
        $repos      = [];

        foreach ($raw as $repo) {
            if (!empty($repo['fork'])) continue; // Skip forked repos
            $lang     = $repo['language'] ?? '';
            $repos[] = [
                'name'          => $repo['name']              ?? '',
                'description'   => $repo['description']       ?? '',
                'url'           => $repo['html_url']          ?? '',
                'stars'         => (int) ($repo['stargazers_count'] ?? 0),
                'language'      => $lang,
                'languageColor' => $langColors[$lang] ?? '#cccccc',
            ];

            if (count($repos) >= 5) break;
        }

        $json = json_encode(
            $repos,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        $this->writeDataFile('github.json', $json);

        return [
            'success' => true,
            'message' => sprintf($this->getLang('sync_ok_repos'), count($repos), $username),
        ];
    }

    /**
     * Handle POST submissions from the sync tab.
     * Saves the sync configuration and optionally triggers a live import.
     */
    private function handleSyncAction($INPUT)
    {
        $config             = $this->readSyncConfig();
        $scholarId          = trim($INPUT->post->str('semantic_scholar_id', ''));
        $githubUser         = trim($INPUT->post->str('github_username', ''));
        $config['semantic_scholar_id'] = $scholarId;
        $config['github_username']     = $githubUser;

        $action = $INPUT->post->str('sync_action', 'save');

        if ($action === 'sync_pubs') {
            $result = $this->syncPublications($scholarId);
            $config['last_sync_pubs'] = date('Y-m-d H:i:s');
            $this->writeSyncConfig($config);
            msg($result['message'], $result['success'] ? 1 : -1);
            send_redirect(wl('', ['do' => 'admin', 'page' => 'profprofile', 'tab' => 'sync'], false, '&'));
            return;
        }

        if ($action === 'sync_repos') {
            $result = $this->syncGithubRepos($githubUser);
            $config['last_sync_repos'] = date('Y-m-d H:i:s');
            $this->writeSyncConfig($config);
            msg($result['message'], $result['success'] ? 1 : -1);
            send_redirect(wl('', ['do' => 'admin', 'page' => 'profprofile', 'tab' => 'sync'], false, '&'));
            return;
        }

        // Default: save config only.
        $this->writeSyncConfig($config);
        $this->redirect('sync', 'saved');
    }

    /**
     * Render the Sync / Import tab.
     */
    private function renderSyncTab()
    {
        $config    = $this->readSyncConfig();
        $scholarId = hsc($config['semantic_scholar_id'] ?? '');
        $ghUser    = hsc($config['github_username']     ?? '');
        $lastPubs  = hsc($config['last_sync_pubs']      ?? '—');
        $lastRepos = hsc($config['last_sync_repos']     ?? '—');
        $formUrl   = wl('', ['do' => 'admin', 'page' => 'profprofile'], false, '&');

        echo '<p class="pp-sync-intro">'
           . 'Import data automatically from <strong>Semantic Scholar</strong> '
           . '(publications &amp; citation stats) and the <strong>GitHub API</strong> '
           . '(public repositories).  The imported data is saved as local JSON files '
           . 'and can be further edited on the other tabs.'
           . '</p>';

        echo '<form action="' . hsc($formUrl) . '" method="post" class="pp-profile-form">';
        echo '<input type="hidden" name="tab" value="sync">';
        echo '<input type="hidden" name="profprofile_save" value="1">';
        formSecurityToken();

        // ── Semantic Scholar section ───────────────────────────────────────
        echo '<h3 class="pp-sync-heading">Semantic Scholar — Publications &amp; Stats</h3>';

        echo '<table class="pp-form-table">';

        echo '<tr>';
        echo '<th><label for="pp_semantic_scholar_id">Author ID</label></th>';
        echo '<td>';
        echo '<input type="text" id="pp_semantic_scholar_id" name="semantic_scholar_id"'
           . ' value="' . $scholarId . '" class="pp-field-mid"'
           . ' placeholder="e.g. 2048001">';
        echo '<p class="pp-field-hint">'
           . 'Find your ID on '
           . '<a href="https://www.semanticscholar.org" target="_blank" rel="noopener">semanticscholar.org</a>: '
           . 'search your name, open your profile, and copy the numeric ID from the URL '
           . '(<code>https://www.semanticscholar.org/author/name/<strong>2048001</strong></code>).'
           . '</p>';
        echo '</td>';
        echo '</tr>';

        echo '<tr>';
        echo '<th>Last synced</th>';
        echo '<td><span class="pp-sync-ts">' . $lastPubs . '</span></td>';
        echo '</tr>';

        echo '</table>';

        echo '<p class="pp-form-actions">';
        echo '<button type="submit" name="sync_action" value="sync_pubs" class="button pp-btn-sync">'
           . hsc($this->getLang('btn_sync_pubs'))
           . '</button>';
        echo '</p>';

        echo '<hr class="pp-divider">';

        // ── GitHub section ─────────────────────────────────────────────────
        echo '<h3 class="pp-sync-heading">GitHub — Repositories</h3>';

        echo '<table class="pp-form-table">';

        echo '<tr>';
        echo '<th><label for="pp_github_username">GitHub Username</label></th>';
        echo '<td>';
        echo '<input type="text" id="pp_github_username" name="github_username"'
           . ' value="' . $ghUser . '" class="pp-field-mid"'
           . ' placeholder="e.g. JValdivia23">';
        echo '<p class="pp-field-hint">'
           . 'The top 5 non-forked public repos sorted by stars will be imported. '
           . 'No authentication token is required for public repositories.'
           . '</p>';
        echo '</td>';
        echo '</tr>';

        echo '<tr>';
        echo '<th>Last synced</th>';
        echo '<td><span class="pp-sync-ts">' . $lastRepos . '</span></td>';
        echo '</tr>';

        echo '</table>';

        echo '<p class="pp-form-actions">';
        echo '<button type="submit" name="sync_action" value="sync_repos" class="button pp-btn-sync">'
           . hsc($this->getLang('btn_sync_repos'))
           . '</button>';
        echo '</p>';

        echo '<hr class="pp-divider">';

        // ── Save settings ──────────────────────────────────────────────────
        echo '<p class="pp-form-actions">';
        echo '<button type="submit" name="sync_action" value="save" class="button">'
           . hsc($this->getLang('btn_save_sync'))
           . '</button>';
        echo '</p>';

        echo '</form>';

        echo '<div class="pp-usage-hint">';
        echo '<strong>Note:</strong> After syncing you can review and adjust the imported '
           . 'data on the <em>Publications</em>, <em>Scholar Stats</em> and '
           . '<em>GitHub Repos</em> tabs before it is displayed on your wiki pages.';
        echo '</div>';
    }
}
