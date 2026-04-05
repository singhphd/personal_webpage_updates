<?php
/**
 * Configuration metadata for the profprofile plugin.
 * Tells the DokuWiki admin Configuration Settings panel what type each
 * config key is so it can render the appropriate form widget.
 */
if (!defined('DOKU_INC')) die();

$meta['max_publications'] = array('numeric');
$meta['show_venue']       = array('onoff');
$meta['show_citations']   = array('onoff');
