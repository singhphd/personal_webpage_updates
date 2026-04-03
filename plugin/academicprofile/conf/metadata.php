<?php
/**
 * Metadata for the academicprofile plugin configuration.
 * Describes the type of each config key for the DokuWiki admin panel.
 */
if (!defined('DOKU_INC')) die();

$meta['github_raw_base']  = array('string');
$meta['github_api_repo']  = array('string');
$meta['cache_ttl']        = array('numeric');
$meta['max_publications'] = array('numeric');
