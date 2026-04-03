<?php
/**
 * DokuWiki Plugin academicprofile — Action Component
 *
 * Provides cache management for the academicprofile plugin:
 *   - Wiki admins can flush the local data cache from the admin panel.
 *   - Appends a "Flush Cache" link to DokuWiki's admin menu.
 *   - Honors the DOKUWIKI_STARTED event to process a flush request early.
 *
 * To trigger a flush manually, navigate to:
 *   ?do=admin&page=academicprofile_flush  (admin-only, checked via auth_ismanager())
 *
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author  Jairo M. Valdivia <jvaldivia@colorado.edu>
 */

if (!defined('DOKU_INC')) die();

class action_plugin_academicprofile extends DokuWiki_Action_Plugin
{
    public function register(Doku_Event_Handler $controller)
    {
        $controller->register_hook('DOKUWIKI_STARTED', 'AFTER',  $this, 'handleFlushRequest');
        $controller->register_hook('MENU_ITEMS_ASSEMBLY', 'AFTER', $this, 'addAdminMenuItem');
    }

    /**
     * Process a cache-flush request.
     * Only executed when ?academicprofile_flush=1 is present and the visitor
     * is a DokuWiki manager or admin.
     */
    public function handleFlushRequest(Doku_Event $event)
    {
        global $INPUT;

        if ($INPUT->get->str('academicprofile_flush') !== '1') return;
        if (!auth_ismanager()) return;

        $deleted = $this->flushCache();
        msg(sprintf('Academic Profile: cache cleared (%d file(s) removed).', $deleted), 1);
    }

    /**
     * Append a "Flush Cache" link to the admin tools menu.
     * Only shown to managers / admins.
     */
    public function addAdminMenuItem(Doku_Event $event)
    {
        if ($event->data['view'] !== 'admin') return;
        if (!auth_ismanager()) return;

        $flushUrl = wl('', ['academicprofile_flush' => '1'], false, '&');

        $event->data['items'][] = [
            'type'   => 'action',
            'label'  => $this->getLang('flush_cache') ?: 'Academic Profile: Flush Cache',
            'icon'   => '',
            'href'   => $flushUrl,
            'target' => '_self',
        ];
    }

    /**
     * Remove all cached files written by the academicprofile plugin.
     *
     * @return int Number of files removed.
     */
    private function flushCache()
    {
        /** @var syntax_plugin_academicprofile $syntax */
        $syntax  = plugin_load('syntax', 'academicprofile');
        $cacheDir = $syntax ? $syntax->getCacheDir() : (sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'dokuwiki_academicprofile');

        $deleted = 0;
        if (is_dir($cacheDir)) {
            foreach (glob($cacheDir . DIRECTORY_SEPARATOR . '*.cache') ?: [] as $file) {
                if (@unlink($file)) {
                    $deleted++;
                }
            }
        }
        return $deleted;
    }
}
