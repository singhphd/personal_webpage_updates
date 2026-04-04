<?php
/**
 * Default configuration for the profprofile DokuWiki plugin.
 *
 * max_publications — Maximum number of publications rendered by ~~PUBLICATIONS~~.
 *                    Set to 0 to show all.
 * show_venue       — Show the Venue column in the publications table.
 * show_citations   — Show the Citations column in the publications table.
 *
 * Profile data (name, bio, links, etc.) is stored as profile.json in the plugin
 * data directory and is managed through Admin → Professor Profile.
 */
if (!defined('DOKU_INC')) die();

$conf['max_publications'] = 50;
$conf['show_venue']       = 1;
$conf['show_citations']   = 1;
