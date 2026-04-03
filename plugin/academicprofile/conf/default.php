<?php
/**
 * Default configuration for the academicprofile DokuWiki plugin.
 *
 * github_raw_base  - Base URL for raw GitHub content; must point to the branch
 *                    root of the academic portfolio repository.
 * github_api_repo  - GitHub "owner/repo" used when listing directory contents
 *                    via the GitHub API (required for RESEARCH_LIST / READING_LIST).
 * cache_ttl        - How long (in seconds) fetched data is kept locally before a
 *                    fresh request is made.  Default: 86400 (24 hours).
 * max_publications - Maximum number of publications rendered by ~~PUBLICATIONS~~.
 *                    Set to 0 to show all.
 */
if (!defined('DOKU_INC')) die();

$conf['github_raw_base']  = 'https://raw.githubusercontent.com/JValdivia23/personal_webpage/main';
$conf['github_api_repo']  = 'JValdivia23/personal_webpage';
$conf['cache_ttl']        = 86400;
$conf['max_publications'] = 50;
