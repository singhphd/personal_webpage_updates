<?php
/**
 * DokuWiki Plugin profprofile — Admin Component
 *
 * Provides a tabbed admin interface for managing all professor profile data
 * stored locally in DokuWiki.  No GitHub connection is required.
 *
 * Tabs
 * ----
 *   profile  — Personal info (profile.json)
 *   pubs     — Publications  (publications.json)
 *   stats    — Scholar stats (stats.json)
 *   repos    — GitHub repos  (github.json)
 *   research — Research projects (research.json)
 *   reading  — Reading list      (reading.json)
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
    private $tabs = ['profile', 'pubs', 'stats', 'repos', 'research', 'reading'];

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
}
