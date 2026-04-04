<?php
/**
 * English UI strings for the profprofile DokuWiki plugin.
 */
if (!defined('DOKU_INC')) die();

$lang['menu']         = 'Professor Profile';

// Tab labels
$lang['tab_profile']  = 'Profile';
$lang['tab_pubs']     = 'Publications';
$lang['tab_stats']    = 'Scholar Stats';
$lang['tab_repos']    = 'GitHub Repos';
$lang['tab_research'] = 'Research Projects';
$lang['tab_reading']  = 'Reading List';
$lang['tab_sync']     = 'Sync / Import';

// Buttons / status
$lang['btn_save']           = 'Save';
$lang['btn_save_sync']      = 'Save Settings';
$lang['btn_sync_pubs']      = 'Import Publications & Stats from Semantic Scholar';
$lang['btn_sync_repos']     = 'Import Repositories from GitHub';
$lang['saved_ok']           = 'Data saved successfully.';
$lang['save_error']         = 'Error saving data — check file permissions.';
$lang['json_invalid']       = 'Invalid JSON — please fix the syntax and try again.';

// Sync success messages (%d / %s are placeholders)
$lang['sync_ok_pubs']       = 'Imported %d publications (h-index: %d, citations: %d).';
$lang['sync_ok_repos']      = 'Imported %d repositories from @%s.';

// Sync error messages
$lang['sync_err_no_scholar_id'] = 'Semantic Scholar Author ID is required.';
$lang['sync_err_scholar_fetch'] = 'Could not reach the Semantic Scholar API — check your server\'s internet access.';
$lang['sync_err_scholar_author']= 'The Semantic Scholar API returned an unexpected response. Verify the Author ID.';
$lang['sync_err_no_github_user']= 'GitHub username is required.';
$lang['sync_err_github_fetch']  = 'Could not reach the GitHub API — check your server\'s internet access.';
