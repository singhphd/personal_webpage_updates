<?php
/**
 * DokuWiki Plugin profprofile — Action Component
 *
 * Registers event hooks:
 *   DOKUWIKI_STARTED  — Processes an optional ?profprofile_flush=1 request that
 *                       removes any stale data files from the plugin data dir.
 *   MENU_ITEMS_ASSEMBLY — Adds a quick-link to the profprofile admin page inside
 *                         the DokuWiki admin tools menu.
 *
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author  Jairo M. Valdivia <jvaldivia@colorado.edu>
 */

if (!defined('DOKU_INC')) die();

class action_plugin_profprofile extends DokuWiki_Action_Plugin
{
    public function register(Doku_Event_Handler $controller)
    {
        $controller->register_hook('DOKUWIKI_STARTED',    'AFTER', $this, 'handleFlushRequest');
        $controller->register_hook('MENU_ITEMS_ASSEMBLY', 'AFTER', $this, 'addAdminMenuItem');
    }

    /**
     * Process ?profprofile_flush=1 — removes all JSON data files from the plugin
     * data directory so they are re-populated on the next admin save.
     * Only accessible to DokuWiki managers / admins.
     */
    public function handleFlushRequest(Doku_Event $event)
    {
        global $INPUT;

        if ($INPUT->get->str('profprofile_flush') !== '1') return;
        if (!auth_ismanager()) return;

        $deleted = $this->flushData();
        msg(sprintf('Professor Profile: %d data file(s) removed.', $deleted), 1);
    }

    /**
     * Add a "Professor Profile" link to the DokuWiki admin tools menu so that
     * managers can reach the plugin admin page without bookmarking the URL.
     */
    public function addAdminMenuItem(Doku_Event $event)
    {
        if ($event->data['view'] !== 'admin') return;
        if (!auth_ismanager()) return;

        $url = wl('', ['do' => 'admin', 'page' => 'profprofile'], false, '&');

        $event->data['items'][] = [
            'type'   => 'action',
            'label'  => $this->getLang('menu') ?: 'Professor Profile',
            'icon'   => '',
            'href'   => $url,
            'target' => '_self',
        ];
    }

    /**
     * Remove all JSON data files written by the profprofile plugin.
     *
     * @return int  Number of files deleted.
     */
    private function flushData()
    {
        /** @var syntax_plugin_profprofile $syntax */
        $syntax   = plugin_load('syntax', 'profprofile');
        $dataDir  = $syntax
            ? $syntax->getDataDir()
            : DOKU_DATA . 'profprofile' . DIRECTORY_SEPARATOR;

        $deleted = 0;
        if (is_dir($dataDir)) {
            foreach (glob($dataDir . '*.json') ?: [] as $file) {
                if (@unlink($file)) {
                    $deleted++;
                }
            }
        }
        return $deleted;
    }
}
